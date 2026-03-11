'use client'

import { useState } from 'react'
import { X, Loader2, Trash2 } from 'lucide-react'
import { updateCard, deleteCard } from '@/lib/supabase'
import { Card } from '@/lib/types'
import { cn } from '@/lib/utils'

interface EditCardModalProps {
  card: Card
  onClose: () => void
  onUpdated: (card: Card) => void
  onDeleted: (id: string) => void
}

const inputClass = cn(
  'w-full px-3.5 py-2.5 text-[14px] text-[var(--c-text)] rounded-xl border border-[var(--c-border-md)] bg-[var(--c-input-bg)] focus:bg-[var(--c-input-focus)] focus:border-[var(--c-focus-border)] focus:ring-2 focus:ring-[var(--c-focus-ring)] outline-none transition-all duration-200 placeholder:text-[var(--c-text-3)]',
)

export default function EditCardModal({ card, onClose, onUpdated, onDeleted }: EditCardModalProps) {
  const [loading, setLoading] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [form, setForm] = useState({
    provider: card.provider,
    name: card.name,
    limit_amount: String(card.limit_amount),
    balance: String(card.balance),
    billing_start_day: String(card.billing_start_day),
    last_four: card.last_four ?? '',
    image_url: card.image_url ?? '',
  })

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      const updated = await updateCard(card.id, {
        provider: form.provider.trim(),
        name: form.name.trim() || form.provider.trim(),
        limit_amount: +form.limit_amount,
        balance: +form.balance || 0,
        billing_start_day: +form.billing_start_day,
        image_url: form.image_url || null,
        last_four: form.last_four || null,
      })
      onUpdated(updated)
    } catch (err) { console.error(err) } finally { setLoading(false) }
  }

  async function handleDelete() {
    setLoading(true)
    try {
      await deleteCard(card.id)
      onDeleted(card.id)
    } catch (err) { console.error(err); setLoading(false) }
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
          <h2 className="text-[17px] font-semibold tracking-tight text-[var(--c-text)]">Modifier la carte</h2>
          <button onClick={onClose} className="w-7 h-7 bg-[var(--c-hover)] hover:bg-[var(--c-hover-sm)] rounded-full flex items-center justify-center transition-colors">
            <X className="w-3.5 h-3.5 text-[var(--c-text-2)]" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4 max-h-[75vh] overflow-y-auto">

          <div>
            <label className="block text-[11px] font-semibold text-[var(--c-text-2)] uppercase tracking-wider mb-2">Fournisseur</label>
            <input type="text" value={form.provider}
              onChange={(e) => setForm((f) => ({ ...f, provider: e.target.value }))}
              className={inputClass} />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-[var(--c-text-2)] uppercase tracking-wider mb-2">URL du logo</label>
            <input type="url" value={form.image_url}
              onChange={(e) => setForm((f) => ({ ...f, image_url: e.target.value }))}
              className={inputClass} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            {[
              { key: 'limit_amount', label: 'Limite' },
              { key: 'balance', label: 'Solde actuel' },
            ].map(({ key, label }) => (
              <div key={key}>
                <label className="block text-[11px] font-semibold text-[var(--c-text-2)] uppercase tracking-wider mb-2">{label}</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--c-text-3)] text-[13px]">$</span>
                  <input type="number" min="0" step="0.01"
                    value={form[key as keyof typeof form]}
                    onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                    className={cn(inputClass, 'pl-7')} />
                </div>
              </div>
            ))}
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-[var(--c-text-2)] uppercase tracking-wider mb-2">Début de facturation</label>
            <div className="flex items-center gap-3">
              <span className="text-[14px] text-[var(--c-text-2)]">Le</span>
              <input type="number" min="1" max="28"
                value={form.billing_start_day}
                onChange={(e) => setForm((f) => ({ ...f, billing_start_day: e.target.value }))}
                className={cn(inputClass, 'w-20 text-center')} />
              <span className="text-[14px] text-[var(--c-text-2)]">de chaque mois</span>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-[var(--c-text-2)] uppercase tracking-wider mb-2">4 derniers chiffres</label>
            <input type="text" maxLength={4}
              value={form.last_four}
              onChange={(e) => setForm((f) => ({ ...f, last_four: e.target.value.replace(/\D/g, '') }))}
              className={cn(inputClass, 'w-28 text-center font-mono tracking-widest')} />
          </div>

          <div className="pt-2 space-y-2">
            <button type="submit" disabled={loading}
              className="w-full py-3 bg-[var(--c-btn)] hover:bg-[var(--c-btn-hover)] text-[var(--c-btn-text)] text-[15px] font-medium rounded-2xl transition-colors duration-200 disabled:opacity-50 flex items-center justify-center gap-2">
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              Enregistrer
            </button>

            <div className="border-t border-[var(--c-border)] pt-3 mt-1">
              {!confirmDelete ? (
                <button type="button" onClick={() => setConfirmDelete(true)}
                  className="w-full py-2.5 text-[14px] text-red-500 hover:bg-red-500/10 rounded-2xl transition-colors flex items-center justify-center gap-2">
                  <Trash2 className="w-4 h-4" />
                  Supprimer cette carte
                </button>
              ) : (
                <div className="space-y-2.5">
                  <p className="text-center text-[13px] text-[var(--c-text-2)]">
                    Supprimer la carte et toutes ses dépenses ?
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    <button type="button" onClick={() => setConfirmDelete(false)}
                      className="py-2.5 bg-[var(--c-hover)] hover:bg-[var(--c-hover-sm)] text-[var(--c-text)] text-[14px] font-medium rounded-2xl transition-colors">
                      Annuler
                    </button>
                    <button type="button" onClick={handleDelete} disabled={loading}
                      className="py-2.5 bg-red-500 hover:bg-red-600 text-white text-[14px] font-medium rounded-2xl transition-colors disabled:opacity-50">
                      Supprimer
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
