'use client'

export const dynamic = 'force-dynamic'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ChevronLeft, Plus, SlidersHorizontal } from 'lucide-react'
import { getCard, getExpenses } from '@/lib/supabase'
import { Card, Expense, ExpenseCategory, CATEGORY_LABELS, CATEGORY_ICONS } from '@/lib/types'
import {
  formatCurrency,
  getCurrentBillingPeriod,
  isInCurrentBillingPeriod,
  getUtilizationPercent,
} from '@/lib/utils'
import CardWidget from '@/components/CardWidget'
import AddExpenseModal from '@/components/AddExpenseModal'
import EditCardModal from '@/components/EditCardModal'
import ExpenseList, { CategoryFilter } from '@/components/ExpenseList'
import Logo from '@/components/Logo'
import GlowBg from '@/components/GlowBg'

export default function CardDetailPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string

  const [card, setCard] = useState<Card | null>(null)
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddExpense, setShowAddExpense] = useState(false)
  const [showEditCard, setShowEditCard] = useState(false)
  const [filterCategory, setFilterCategory] = useState<ExpenseCategory | 'all'>('all')
  const [tab, setTab] = useState<'current' | 'all'>('current')

  useEffect(() => {
    Promise.all([getCard(id), getExpenses(id)])
      .then(([c, e]) => { setCard(c); setExpenses(e) })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [id])

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--c-bg)] flex items-center justify-center">
        <div className="w-6 h-6 border-[1.5px] border-[var(--c-text)] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!card) {
    return (
      <div className="min-h-screen bg-[var(--c-bg)] flex items-center justify-center">
        <div className="text-center">
          <p className="text-[var(--c-text-2)] text-[15px]">Carte introuvable</p>
          <button onClick={() => router.push('/')} className="mt-3 text-[var(--c-text)] text-[13px] font-medium hover:opacity-60 transition-opacity">
            ← Retour
          </button>
        </div>
      </div>
    )
  }

  const { start, end, label: periodLabel } = getCurrentBillingPeriod(card.billing_start_day)
  const currentPeriodExpenses = expenses.filter((e) => isInCurrentBillingPeriod(e.date, card.billing_start_day))
  const displayedExpenses = tab === 'current' ? currentPeriodExpenses : expenses
  const currentSpend = currentPeriodExpenses.reduce((sum, e) => sum + e.amount, 0)
  const utilization = getUtilizationPercent(card.balance, card.limit_amount)

  const periodPct = Math.round(
    (Math.min(Date.now() - start.getTime(), end.getTime() - start.getTime()) /
      (end.getTime() - start.getTime())) * 100
  )

  const categoryTotals = currentPeriodExpenses.reduce<Record<string, number>>((acc, e) => {
    acc[e.category] = (acc[e.category] || 0) + e.amount
    return acc
  }, {})

  const topCategories = Object.entries(categoryTotals).sort(([, a], [, b]) => b - a).slice(0, 4)

  const cardStyle = { boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.03)' }

  return (
    <div className="relative min-h-screen overflow-hidden">
      <GlowBg />

      {/* Header */}
      <header className="relative z-20 sticky top-0 bg-[var(--c-header-bg)] backdrop-blur-2xl">
        <div className="max-w-2xl mx-auto px-6 h-14 flex items-center justify-between">
          <button
            onClick={() => router.push('/')}
            className="flex items-center gap-1 text-[var(--c-text)] hover:opacity-60 transition-opacity"
          >
            <ChevronLeft className="w-4 h-4" strokeWidth={2.5} />
            <Logo size="lg" />
          </button>
          <button
            onClick={() => setShowEditCard(true)}
            className="p-2 hover:bg-[var(--c-hover-icon)] rounded-full transition-colors"
          >
            <SlidersHorizontal className="w-4 h-4 text-[var(--c-text-2)]" />
          </button>
        </div>
        <div className="border-b border-[var(--c-border)]" />
      </header>

      <main className="relative z-10 max-w-2xl mx-auto px-6 py-8 space-y-4">

        {/* Card */}
        <CardWidget card={card} currentSpend={currentSpend} />

        {/* Stats row */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-[var(--c-surface)] rounded-2xl px-5 py-4 border border-[var(--c-border)]" style={cardStyle}>
            <p className="text-[11px] font-semibold text-[var(--c-text-3)] uppercase tracking-widest mb-1.5">Ce mois</p>
            <p className="text-xl font-black tracking-tight text-[var(--c-text)]">{formatCurrency(currentSpend)}</p>
            <p className="text-[11px] text-[var(--c-text-3)] mt-0.5">
              {currentPeriodExpenses.length} transaction{currentPeriodExpenses.length !== 1 ? 's' : ''}
            </p>
          </div>

          <div className="bg-[var(--c-surface)] rounded-2xl px-5 py-4 border border-[var(--c-border)]" style={cardStyle}>
            <p className="text-[11px] font-semibold text-[var(--c-text-3)] uppercase tracking-widest mb-1.5">Utilisation</p>
            <p className="text-xl font-black tracking-tight text-[var(--c-text)]">{utilization}%</p>
            <div className="mt-2.5 w-full h-[3px] bg-[var(--c-gray-3)] rounded-full overflow-hidden">
              <div className="h-full bg-[var(--c-progress)] rounded-full" style={{ width: `${utilization}%` }} />
            </div>
          </div>
        </div>

        {/* Billing period */}
        <div className="bg-[var(--c-surface)] rounded-2xl px-5 py-4 border border-[var(--c-border)]" style={cardStyle}>
          <div className="flex items-center justify-between mb-3">
            <p className="text-[11px] font-medium text-[var(--c-text-2)] uppercase tracking-wider">Période de facturation</p>
            <p className="text-[11px] text-[var(--c-text-3)]">{periodPct}% écoulé</p>
          </div>
          <p className="text-[15px] font-semibold tracking-tight text-[var(--c-text)]">{periodLabel}</p>
          <div className="mt-3 w-full h-[3px] bg-[var(--c-gray-3)] rounded-full overflow-hidden">
            <div className="h-full bg-[var(--c-progress)] rounded-full transition-all" style={{ width: `${periodPct}%` }} />
          </div>
        </div>

        {/* Category breakdown */}
        {topCategories.length > 0 && (
          <div className="bg-[var(--c-surface)] rounded-2xl px-5 py-4 border border-[var(--c-border)]" style={cardStyle}>
            <p className="text-[11px] font-medium text-[var(--c-text-2)] uppercase tracking-wider mb-4">Par catégorie</p>
            <div className="space-y-3.5">
              {topCategories.map(([cat, amount]) => {
                const pct = Math.round((amount / currentSpend) * 100)
                return (
                  <div key={cat}>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[13px] text-[var(--c-text)]">
                        {CATEGORY_ICONS[cat as ExpenseCategory]}{' '}
                        {CATEGORY_LABELS[cat as ExpenseCategory]}
                      </span>
                      <span className="text-[13px] text-[var(--c-text)] font-medium">
                        {formatCurrency(amount)}
                        <span className="text-[var(--c-text-3)] font-normal ml-1.5">{pct}%</span>
                      </span>
                    </div>
                    <div className="w-full h-[3px] bg-[var(--c-gray-3)] rounded-full overflow-hidden">
                      <div className="h-full bg-[var(--c-progress)] rounded-full" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Expenses */}
        <div>
          {/* Tab bar + add button */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex gap-0.5 bg-[var(--c-surface)] border border-[var(--c-border)] rounded-full p-1" style={cardStyle}>
              {(['current', 'all'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={`px-3.5 py-1 text-[12px] font-medium rounded-full transition-all duration-200 ${
                    tab === t
                      ? 'bg-[var(--c-btn)] text-[var(--c-btn-text)] shadow-sm'
                      : 'text-[var(--c-text-2)] hover:text-[var(--c-text)]'
                  }`}
                >
                  {t === 'current' ? `Ce mois` : 'Tout'}
                  <span className="ml-1 opacity-50 text-[11px]">
                    {t === 'current' ? currentPeriodExpenses.length : expenses.length}
                  </span>
                </button>
              ))}
            </div>

            <button
              onClick={() => setShowAddExpense(true)}
              className="flex items-center gap-1.5 px-4 py-1.5 text-[12px] font-bold rounded-full transition-all duration-200 bg-[var(--c-btn)] hover:bg-[var(--c-btn-hover)] text-[var(--c-btn-text)]"
            >
              <Plus className="w-3.5 h-3.5" strokeWidth={2.5} />
              Ajouter
            </button>
          </div>

          {/* Category filter */}
          <div className="mb-4">
            <CategoryFilter expenses={displayedExpenses} selected={filterCategory} onChange={setFilterCategory} />
          </div>

          <ExpenseList
            expenses={displayedExpenses}
            onDeleted={(id) => setExpenses((prev) => prev.filter((e) => e.id !== id))}
            onCardUpdated={(updated) => setCard(updated)}
            filterCategory={filterCategory}
          />
        </div>
      </main>

      {showAddExpense && (
        <AddExpenseModal
          cardId={card.id}
          onClose={() => setShowAddExpense(false)}
          onCreated={(expense, card) => {
            setExpenses((prev) => [expense, ...prev])
            setCard(card)
            setShowAddExpense(false)
          }}
        />
      )}
      {showEditCard && (
        <EditCardModal
          card={card}
          onClose={() => setShowEditCard(false)}
          onUpdated={(updated) => { setCard(updated); setShowEditCard(false) }}
          onDeleted={() => router.push('/')}
        />
      )}
    </div>
  )
}
