import { createBrowserClient } from '@supabase/ssr'
import type { Card, Expense } from './types'

function getClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

// Cards
export async function getCards(): Promise<Card[]> {
  const { data, error } = await getClient()
    .from('cards')
    .select('*')
    .order('created_at', { ascending: true })
  if (error) throw error
  return data as Card[]
}

export async function getCard(id: string): Promise<Card | null> {
  const { data, error } = await getClient()
    .from('cards')
    .select('*')
    .eq('id', id)
    .single()
  if (error) return null
  return data as Card
}

export async function createCard(card: Omit<Card, 'id' | 'created_at'>): Promise<Card> {
  const client = getClient()
  const { data: { user } } = await client.auth.getUser()
  if (!user) throw new Error('Non authentifié')

  const { data, error } = await client
    .from('cards')
    .insert([{ ...card, user_id: user.id }])
    .select()
    .single()
  if (error) throw error
  return data as Card
}

export async function updateCard(id: string, updates: Partial<Omit<Card, 'id' | 'created_at'>>): Promise<Card> {
  const { data, error } = await getClient()
    .from('cards')
    .update(updates)
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return data as Card
}

export async function deleteCard(id: string): Promise<void> {
  const { error } = await getClient().from('cards').delete().eq('id', id)
  if (error) throw error
}

// Expenses
export async function getExpenses(cardId: string): Promise<Expense[]> {
  const { data, error } = await getClient()
    .from('expenses')
    .select('*')
    .eq('card_id', cardId)
    .order('date', { ascending: false })
  if (error) throw error
  return data as Expense[]
}

export async function createExpense(
  expense: Omit<Expense, 'id' | 'created_at' | 'is_paid'>
): Promise<{ expense: Expense; card: Card }> {
  const { data: expData, error: expError } = await getClient()
    .from('expenses')
    .insert([{ ...expense, is_paid: false }])
    .select()
    .single()
  if (expError) throw expError

  const card = await getCard(expense.card_id)
  if (!card) throw new Error('Card not found')
  const updatedCard = await updateCard(expense.card_id, {
    balance: Math.max(0, card.balance + expense.amount),
  })

  return { expense: expData as Expense, card: updatedCard }
}

export async function toggleExpensePaid(
  id: string,
  isPaid: boolean
): Promise<{ expense: Expense; card: Card }> {
  const { data: expData, error: expError } = await getClient()
    .from('expenses')
    .update({ is_paid: isPaid })
    .eq('id', id)
    .select()
    .single()
  if (expError) throw expError

  const expense = expData as Expense
  const card = await getCard(expense.card_id)
  if (!card) throw new Error('Card not found')

  const delta = isPaid ? -expense.amount : expense.amount
  const updatedCard = await updateCard(expense.card_id, {
    balance: Math.max(0, card.balance + delta),
  })

  return { expense, card: updatedCard }
}

export async function updateExpense(
  id: string,
  updates: Partial<Omit<Expense, 'id' | 'created_at'>>
): Promise<Expense> {
  const { data, error } = await getClient()
    .from('expenses')
    .update(updates)
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return data as Expense
}

export async function deleteExpense(id: string): Promise<Card> {
  const { data: expData, error: fetchError } = await getClient()
    .from('expenses')
    .select('*')
    .eq('id', id)
    .single()
  if (fetchError) throw fetchError
  const expense = expData as Expense

  const { error: delError } = await getClient().from('expenses').delete().eq('id', id)
  if (delError) throw delError

  const card = await getCard(expense.card_id)
  if (!card) throw new Error('Card not found')

  if (expense.is_paid) return card
  return updateCard(expense.card_id, {
    balance: Math.max(0, card.balance - expense.amount),
  })
}
