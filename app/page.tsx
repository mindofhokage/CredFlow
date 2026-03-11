'use client'

export const dynamic = 'force-dynamic'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Plus } from 'lucide-react'
import { getCards } from '@/lib/supabase'
import { Card } from '@/lib/types'
import { formatCurrency, getUtilizationPercent } from '@/lib/utils'
import CardWidget from '@/components/CardWidget'
import AddCardModal from '@/components/AddCardModal'

export default function DashboardPage() {
  const [cards, setCards] = useState<Card[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddCard, setShowAddCard] = useState(false)

  useEffect(() => {
    getCards()
      .then(setCards)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const totalLimit = cards.reduce((sum, c) => sum + c.limit_amount, 0)
  const totalBalance = cards.reduce((sum, c) => sum + c.balance, 0)
  const totalUtilization = getUtilizationPercent(totalBalance, totalLimit)

  return (
    <div className="min-h-screen bg-[#F5F5F7]">
      {/* Header */}
      <header className="sticky top-0 z-20 bg-[#F5F5F7]/75 backdrop-blur-2xl">
        <div className="max-w-5xl mx-auto px-6 h-12 flex items-center justify-between">
          <span className="text-[15px] font-semibold tracking-tight text-[#1D1D1F]">CredFlow</span>
          <button
            onClick={() => setShowAddCard(true)}
            className="flex items-center gap-1.5 px-4 py-1.5 bg-[#1D1D1F] hover:bg-[#3A3A3C] text-white text-[13px] font-medium rounded-full transition-colors duration-200"
          >
            <Plus className="w-3.5 h-3.5" strokeWidth={2.5} />
            Ajouter
          </button>
        </div>
        <div className="border-b border-black/[0.06]" />
      </header>

      <main className="max-w-5xl mx-auto px-6 py-10">

        {/* Summary stats */}
        {cards.length > 0 && (
          <div className="grid grid-cols-3 gap-3 mb-10">
            {[
              { label: 'Cartes', value: String(cards.length), sub: null },
              { label: 'Solde utilisé', value: formatCurrency(totalBalance), sub: `sur ${formatCurrency(totalLimit)}` },
              { label: 'Utilisation globale', value: `${totalUtilization}%`, sub: null, bar: true },
            ].map((stat) => (
              <div
                key={stat.label}
                className="bg-white rounded-2xl px-5 py-4 border border-black/[0.06]"
                style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.03)' }}
              >
                <p className="text-[11px] font-medium text-[#6E6E73] uppercase tracking-wider mb-1.5">{stat.label}</p>
                <p className="text-2xl font-bold tracking-tight text-[#1D1D1F]">{stat.value}</p>
                {stat.sub && <p className="text-[11px] text-[#AEAEB2] mt-0.5">{stat.sub}</p>}
                {stat.bar && (
                  <div className="mt-2.5 w-full h-[3px] bg-[#E5E5EA] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#1D1D1F] rounded-full"
                      style={{ width: `${totalUtilization}%` }}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Loading skeletons */}
        {loading && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="rounded-[22px] animate-pulse"
                style={{ aspectRatio: '1.586 / 1', background: 'linear-gradient(135deg, #E5E5EA, #D1D1D6)' }}
              />
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading && cards.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div
              className="w-20 h-20 rounded-3xl bg-white flex items-center justify-center mb-6 border border-black/[0.06]"
              style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}
            >
              <svg className="w-9 h-9 text-[#AEAEB2]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <rect x="2" y="5" width="20" height="14" rx="3" />
                <path d="M2 10h20" strokeLinecap="round" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold tracking-tight text-[#1D1D1F] mb-2">Aucune carte</h2>
            <p className="text-[#6E6E73] text-[15px] mb-8 max-w-xs leading-relaxed">
              Ajoutez votre première carte de crédit pour commencer à suivre vos dépenses.
            </p>
            <button
              onClick={() => setShowAddCard(true)}
              className="flex items-center gap-2 px-6 py-3 bg-[#1D1D1F] hover:bg-[#3A3A3C] text-white text-[15px] font-medium rounded-full transition-colors duration-200"
            >
              <Plus className="w-4 h-4" strokeWidth={2.5} />
              Ajouter une carte
            </button>
          </div>
        )}

        {/* Cards grid */}
        {!loading && cards.length > 0 && (
          <div>
            <p className="text-[11px] font-semibold text-[#AEAEB2] uppercase tracking-widest mb-4">
              Mes cartes
            </p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {cards.map((card) => (
                <Link key={card.id} href={`/cards/${card.id}`} className="block group outline-none">
                  <div className="transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-xl rounded-[22px]">
                    <CardWidget card={card} />
                  </div>
                  <div className="mt-3 px-1 flex items-center justify-between">
                    <p className="text-[13px] font-medium text-[#1D1D1F] truncate">{card.provider}</p>
                    <p className="text-[11px] text-[#AEAEB2] flex-shrink-0 ml-2">
                      Facture le {card.billing_start_day}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </main>

      {showAddCard && (
        <AddCardModal
          onClose={() => setShowAddCard(false)}
          onCreated={(card) => {
            setCards((prev) => [...prev, card])
            setShowAddCard(false)
          }}
        />
      )}
    </div>
  )
}
