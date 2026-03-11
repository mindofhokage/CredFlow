'use client'

import { useState } from 'react'
import { X, Loader2 } from 'lucide-react'
import { createExpense } from '@/lib/supabase'
import { Card, Expense, ExpenseCategory, CATEGORY_LABELS, CATEGORY_ICONS } from '@/lib/types'
import { cn } from '@/lib/utils'

interface AddExpenseModalProps {
  cardId: string
  onClose: () => void
  onCreated: (expense: Expense, card: Card) => void
}

const CATEGORIES = Object.keys(CATEGORY_LABELS) as ExpenseCategory[]

const inputClass = (error?: string) => cn(
  'w-full px-3.5 py-2.5 text-[14px] text-[var(--c-text)] rounded-xl border bg-[var(--c-input-bg)] focus:bg-[var(--c-input-focus)] outline-none transition-all duration-200 placeholder:text-[var(--c-text-3)]',
  error
    ? 'border-red-400 focus:border-red-400 focus:ring-2 focus:ring-red-100'
    : 'border-[var(--c-border-md)] focus:border-[var(--c-focus-border)] focus:ring-2 focus:ring-[var(--c-focus-ring)]',
)

export default function AddExpenseModal({ cardId, onClose, onCreated }: AddExpenseModalProps) {
  const today = new Date().toISOString().split('T')[0]
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    title: '', amount: '', date: today,
    note: '', category: 'autre' as ExpenseCategory,
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  function validate() {
    const errs: Record<string, string> = {}
    if (!form.title.trim()) errs.title = 'Requis'
    if (!form.amount || isNaN(+form.amount) || +form.amount <= 0) errs.amount = 'Invalide'
    if (!form.date) errs.date = 'Requis'
    setErrors(errs)
    return !Object.keys(errs).length
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    try {
      const { expense, card } = await createExpense({
        card_id: cardId,
        title: form.title.trim(),
        amount: +form.amount,
        date: form.date,
        note: form.note.trim() || null,
        category: form.category,
      })
      onCreated(expense, card)
    } catch (err) { console.error(err) } finally { setLoading(false) }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 sm:p-0">
      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full sm:max-w-md bg-[var(--c-surface)] rounded-t-3xl sm:rounded-3xl overflow-hidden"
        style={{ boxShadow: '0 24px 64px rgba(0,0,0,0.12), 0 8px 24px rgba(0,0,0,0.08)' }}>

        <div className="flex justify-center pt-3 pb-1 sm:hidden">
          <div className="w-9 h-1 bg-[var(--c-gray-3)] rounded-full" />
        </div>

        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--c-border)]">
          <h2 className="text-[17px] font-semibold tracking-tight text-[var(--c-text)]">Nouvelle dépense</h2>
          <button onClick={onClose} className="w-7 h-7 bg-[var(--c-hover)] hover:bg-[var(--c-hover-sm)] rounded-full flex items-center justify-center transition-colors">
            <X className="w-3.5 h-3.5 text-[var(--c-text-2)]" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">

          {/* Title */}
          <div>
            <label className="block text-[11px] font-semibold text-[var(--c-text-2)] uppercase tracking-wider mb-2">Titre</label>
            <input
              type="text" autoFocus
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              placeholder="ex: Épicerie IGA"
              className={inputClass(errors.title)}
            />
          </div>

          {/* Amount + Date */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-[var(--c-text-2)] uppercase tracking-wider mb-2">Montant</label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--c-text-3)] text-[13px]">$</span>
                <input
                  type="number" min="0.01" step="0.01"
                  value={form.amount}
                  onChange={(e) => setForm((f) => ({ ...f, amount: e.target.value }))}
                  placeholder="0.00"
                  className={cn(inputClass(errors.amount), 'pl-7')}
                />
              </div>
              {errors.amount && <p className="text-[11px] text-red-500 mt-1">{errors.amount}</p>}
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-[var(--c-text-2)] uppercase tracking-wider mb-2">Date</label>
              <input
                type="date"
                value={form.date}
                onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
                className={inputClass(errors.date)}
              />
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="block text-[11px] font-semibold text-[var(--c-text-2)] uppercase tracking-wider mb-2">Catégorie</label>
            <div className="grid grid-cols-2 gap-1.5">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat} type="button"
                  onClick={() => setForm((f) => ({ ...f, category: cat }))}
                  className={cn(
                    'flex items-center gap-2 px-3 py-2 text-[13px] rounded-xl border transition-all duration-150 text-left',
                    form.category === cat
                      ? 'border-[var(--c-btn)] bg-[var(--c-btn)] text-[var(--c-btn-text)]'
                      : 'border-[var(--c-border-md)] bg-[var(--c-input-bg)] text-[var(--c-text)] hover:bg-[var(--c-hover-sm)]',
                  )}
                >
                  <span className="text-base leading-none">{CATEGORY_ICONS[cat]}</span>
                  <span>{CATEGORY_LABELS[cat]}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Note */}
          <div>
            <label className="block text-[11px] font-semibold text-[var(--c-text-2)] uppercase tracking-wider mb-2">
              Note <span className="normal-case font-normal text-[var(--c-text-3)]">(optionnel)</span>
            </label>
            <textarea
              value={form.note}
              onChange={(e) => setForm((f) => ({ ...f, note: e.target.value }))}
              placeholder="Détails supplémentaires..."
              rows={2}
              className={cn(inputClass(), 'resize-none')}
            />
          </div>

          <div className="pt-2">
            <button type="submit" disabled={loading}
              className="w-full py-3 bg-[var(--c-btn)] hover:bg-[var(--c-btn-hover)] text-[var(--c-btn-text)] text-[15px] font-medium rounded-2xl transition-colors duration-200 disabled:opacity-50 flex items-center justify-center gap-2">
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              Ajouter
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
