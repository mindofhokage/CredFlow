import type { Card, Expense } from './types'

// localStorage-based storage (mode démo)

function uid(): string {
  return crypto.randomUUID()
}

function load<T>(key: string): T[] {
  if (typeof window === 'undefined') return []
  try {
    return JSON.parse(localStorage.getItem(key) ?? '[]')
  } catch {
    return []
  }
}

function save<T>(key: string, data: T[]): void {
  localStorage.setItem(key, JSON.stringify(data))
}

function adjustCardBalance(cardId: string, delta: number): Card {
  const cards = load<Card>('credflow_cards')
  const idx = cards.findIndex((c) => c.id === cardId)
  if (idx === -1) throw new Error('Card not found')
  cards[idx] = { ...cards[idx], balance: Math.max(0, cards[idx].balance + delta) }
  save('credflow_cards', cards)
  return cards[idx]
}

// Cards
export async function getCards(): Promise<Card[]> {
  return load<Card>('credflow_cards')
}

export async function getCard(id: string): Promise<Card | null> {
  const cards = load<Card>('credflow_cards')
  return cards.find((c) => c.id === id) ?? null
}

export async function createCard(card: Omit<Card, 'id' | 'created_at'>): Promise<Card> {
  const cards = load<Card>('credflow_cards')
  const newCard: Card = { ...card, id: uid(), created_at: new Date().toISOString() }
  save('credflow_cards', [...cards, newCard])
  return newCard
}

export async function updateCard(id: string, updates: Partial<Omit<Card, 'id' | 'created_at'>>): Promise<Card> {
  const cards = load<Card>('credflow_cards')
  const idx = cards.findIndex((c) => c.id === id)
  if (idx === -1) throw new Error('Card not found')
  cards[idx] = { ...cards[idx], ...updates }
  save('credflow_cards', cards)
  return cards[idx]
}

export async function deleteCard(id: string): Promise<void> {
  save('credflow_cards', load<Card>('credflow_cards').filter((c) => c.id !== id))
  save('credflow_expenses', load<Expense>('credflow_expenses').filter((e) => e.card_id !== id))
}

// Expenses
export async function getExpenses(cardId: string): Promise<Expense[]> {
  return load<Expense>('credflow_expenses')
    .filter((e) => e.card_id === cardId)
    .sort((a, b) => b.date.localeCompare(a.date))
}

export async function createExpense(expense: Omit<Expense, 'id' | 'created_at' | 'is_paid'>): Promise<{ expense: Expense; card: Card }> {
  const expenses = load<Expense>('credflow_expenses')
  const newExpense: Expense = { is_paid: false, ...expense, id: uid(), created_at: new Date().toISOString() }
  save('credflow_expenses', [...expenses, newExpense])
  const card = adjustCardBalance(expense.card_id, expense.amount)
  return { expense: newExpense, card }
}

export async function toggleExpensePaid(id: string, isPaid: boolean): Promise<{ expense: Expense; card: Card }> {
  const expenses = load<Expense>('credflow_expenses')
  const idx = expenses.findIndex((e) => e.id === id)
  if (idx === -1) throw new Error('Expense not found')
  expenses[idx] = { ...expenses[idx], is_paid: isPaid }
  save('credflow_expenses', expenses)
  // Paid → reduce balance; unpaid → increase balance
  const card = adjustCardBalance(expenses[idx].card_id, isPaid ? -expenses[idx].amount : expenses[idx].amount)
  return { expense: expenses[idx], card }
}

export async function updateExpense(id: string, updates: Partial<Omit<Expense, 'id' | 'created_at'>>): Promise<Expense> {
  const expenses = load<Expense>('credflow_expenses')
  const idx = expenses.findIndex((e) => e.id === id)
  if (idx === -1) throw new Error('Expense not found')
  expenses[idx] = { ...expenses[idx], ...updates }
  save('credflow_expenses', expenses)
  return expenses[idx]
}

export async function deleteExpense(id: string): Promise<Card> {
  const expenses = load<Expense>('credflow_expenses')
  const expense = expenses.find((e) => e.id === id)
  if (!expense) throw new Error('Expense not found')
  save('credflow_expenses', expenses.filter((e) => e.id !== id))
  // Only adjust balance if not yet paid (paid expenses already reduced the balance)
  return expense.is_paid
    ? (load<Card>('credflow_cards').find((c) => c.id === expense.card_id) as Card)
    : adjustCardBalance(expense.card_id, -expense.amount)
}
