'use client'

import { useState } from 'react'
import { Trash2, ChevronDown, ChevronUp } from 'lucide-react'
import { Card, Expense, ExpenseCategory, CATEGORY_LABELS, CATEGORY_ICONS } from '@/lib/types'
import { deleteExpense, toggleExpensePaid } from '@/lib/supabase'
import { formatCurrency, formatDateShort } from '@/lib/utils'
import { cn } from '@/lib/utils'

interface ExpenseListProps {
  expenses: Expense[]
  onDeleted: (id: string) => void
  onCardUpdated: (card: Card) => void
  filterCategory?: ExpenseCategory | 'all'
}

export default function ExpenseList({ expenses, onDeleted, onCardUpdated, filterCategory = 'all' }: ExpenseListProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [paidIds, setPaidIds] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(expenses.map((e) => [e.id, e.is_paid]))
  )

  const filtered = filterCategory === 'all'
    ? expenses
    : expenses.filter((e) => e.category === filterCategory)

  const grouped = filtered.reduce<Record<string, Expense[]>>((acc, e) => {
    if (!acc[e.date]) acc[e.date] = []
    acc[e.date].push(e)
    return acc
  }, {})

  const sortedDates = Object.keys(grouped).sort((a, b) => b.localeCompare(a))

  async function handleTogglePaid(id: string) {
    const newValue = !paidIds[id]
    setPaidIds((prev) => ({ ...prev, [id]: newValue }))
    try {
      const { card } = await toggleExpensePaid(id, newValue)
      onCardUpdated(card)
    } catch (err) {
      console.error(err)
      setPaidIds((prev) => ({ ...prev, [id]: !newValue }))
    }
  }

  async function handleDelete(id: string) {
    setDeletingId(id)
    try {
      const card = await deleteExpense(id)
      onCardUpdated(card)
      onDeleted(id)
    } catch (err) { console.error(err) } finally { setDeletingId(null) }
  }

  if (filtered.length === 0) {
    return (
      <div className="text-center py-14">
        <p className="text-4xl mb-3">🧾</p>
        <p className="text-[14px] text-[var(--c-text-3)]">Aucune dépense</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {sortedDates.map((date) => {
        const dayExpenses = grouped[date]
        const dayTotal = dayExpenses.reduce((s, e) => s + e.amount, 0)

        return (
          <div key={date}>
            {/* Date header */}
            <div className="flex items-center justify-between mb-2 px-0.5">
              <span className="text-[11px] font-semibold text-[var(--c-text-3)] uppercase tracking-wider">
                {formatDateShort(date)}
              </span>
              <span className="text-[11px] text-[var(--c-text-3)]">{formatCurrency(dayTotal)}</span>
            </div>

            {/* Expense items — grouped card */}
            <div className="bg-[var(--c-surface)] rounded-2xl border border-[var(--c-border)] overflow-hidden divide-themed"
              style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
              {dayExpenses.map((expense) => (
                <div key={expense.id}>
                  <div className={cn('flex items-center gap-3 px-4 py-3.5', paidIds[expense.id] && 'opacity-50')}>
                    {/* Paid checkbox */}
                    <button
                      onClick={() => handleTogglePaid(expense.id)}
                      className="flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-150"
                      style={paidIds[expense.id]
                        ? { backgroundColor: '#34C759', borderColor: '#34C759' }
                        : { backgroundColor: 'transparent', borderColor: '#C7C7CC' }
                      }
                    >
                      {paidIds[expense.id] && (
                        <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 10 8" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M1 4l3 3 5-5" />
                        </svg>
                      )}
                    </button>

                    {/* Category icon pill */}
                    <div className="w-8 h-8 rounded-xl bg-[var(--c-hover)] flex items-center justify-center flex-shrink-0 text-base leading-none">
                      {CATEGORY_ICONS[expense.category as ExpenseCategory]}
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className={cn('text-[14px] font-medium text-[var(--c-text)] truncate leading-snug', paidIds[expense.id] && 'line-through')}>
                        {expense.title}
                      </p>
                      <p className="text-[11px] text-[var(--c-text-3)] mt-0.5">
                        {CATEGORY_LABELS[expense.category as ExpenseCategory]}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[14px] font-semibold text-[var(--c-text)]">
                        {formatCurrency(expense.amount)}
                      </span>

                      {expense.note && (
                        <button
                          onClick={() => setExpandedId(expandedId === expense.id ? null : expense.id)}
                          className="p-1 text-[var(--c-text-3)] hover:text-[var(--c-text-2)] transition-colors"
                        >
                          {expandedId === expense.id
                            ? <ChevronUp className="w-3.5 h-3.5" />
                            : <ChevronDown className="w-3.5 h-3.5" />
                          }
                        </button>
                      )}

                      <button
                        onClick={() => handleDelete(expense.id)}
                        disabled={deletingId === expense.id}
                        className={cn(
                          'p-1 rounded-lg transition-colors',
                          deletingId === expense.id ? 'opacity-30' : 'text-[var(--c-text-3)] hover:text-red-400',
                        )}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {expandedId === expense.id && expense.note && (
                    <div className="px-4 pb-3.5 ml-11">
                      <p className="text-[12px] text-[var(--c-text-2)] leading-relaxed bg-[var(--c-hover)] rounded-xl px-3 py-2">
                        {expense.note}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}

interface CategoryFilterProps {
  expenses: Expense[]
  selected: ExpenseCategory | 'all'
  onChange: (cat: ExpenseCategory | 'all') => void
}

export function CategoryFilter({ expenses, selected, onChange }: CategoryFilterProps) {
  const counts = expenses.reduce<Record<string, number>>((acc, e) => {
    acc[e.category] = (acc[e.category] || 0) + 1
    return acc
  }, {})

  const usedCategories = Object.keys(counts) as ExpenseCategory[]
  if (usedCategories.length <= 1) return null

  return (
    <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
      <button
        onClick={() => onChange('all')}
        className={cn(
          'flex-shrink-0 px-3.5 py-1.5 text-[12px] font-medium rounded-full transition-all duration-200',
          selected === 'all'
            ? 'bg-[var(--c-btn)] text-[var(--c-btn-text)]'
            : 'bg-[var(--c-surface)] border border-[var(--c-border-md)] text-[var(--c-text-2)] hover:text-[var(--c-text)]',
        )}
      >
        Tout
      </button>
      {usedCategories.map((cat) => (
        <button
          key={cat}
          onClick={() => onChange(cat)}
          className={cn(
            'flex-shrink-0 px-3.5 py-1.5 text-[12px] font-medium rounded-full transition-all duration-200 flex items-center gap-1.5',
            selected === cat
              ? 'bg-[var(--c-btn)] text-[var(--c-btn-text)]'
              : 'bg-[var(--c-surface)] border border-[var(--c-border-md)] text-[var(--c-text-2)] hover:text-[var(--c-text)]',
          )}
        >
          <span>{CATEGORY_ICONS[cat]}</span>
          {CATEGORY_LABELS[cat]}
        </button>
      ))}
    </div>
  )
}
