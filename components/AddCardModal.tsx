'use client'

import { useState } from 'react'
import { X, Loader2 } from 'lucide-react'
import { createCard } from '@/lib/supabase'
import { Card } from '@/lib/types'
import { cn } from '@/lib/utils'

interface AddCardModalProps {
  onClose: () => void
  onCreated: (card: Card) => void
}

const POPULAR_PROVIDERS = [
  'Amex Cobalt', 'Amex Platinum', 'Amex SimplyCash',
  'BNC World Elite Mastercard', 'BNC Mastercard',
  'BMO CashBack World Elite', 'BMO Rewards Mastercard',
  'TD Cash Back Visa Infinite', 'TD First Class Travel Visa',
  'RBC Avion Visa Infinite', 'RBC Cash Back Mastercard',
  'Scotiabank Gold Amex', 'Scotiabank Scene+ Visa',
  'CIBC Dividend Visa Infinite', 'CIBC Aventura Visa Infinite',
  'Desjardins Odyssey World Elite',
  'Capital One Aspire Travel', 'PC Mastercard', 'Rogers World Elite',
]

const inputClass = (error?: string) => cn(
  'w-full px-3.5 py-2.5 text-[14px] text-[#1D1D1F] rounded-xl border bg-[#F5F5F7] focus:bg-white outline-none transition-all duration-200 placeholder:text-[#AEAEB2]',
  error
    ? 'border-red-400 focus:border-red-400 focus:ring-2 focus:ring-red-100'
    : 'border-black/[0.08] focus:border-black/20 focus:ring-2 focus:ring-black/[0.04]',
)

export default function AddCardModal({ onClose, onCreated }: AddCardModalProps) {
  const [loading, setLoading] = useState(false)
  const [fetchingImage, setFetchingImage] = useState(false)
  const [form, setForm] = useState({
    provider: '', name: '', limit_amount: '', balance: '',
    billing_start_day: '1', last_four: '', image_url: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [showSuggestions, setShowSuggestions] = useState(false)

  const suggestions = POPULAR_PROVIDERS.filter(
    (p) => form.provider.length > 0 && p.toLowerCase().includes(form.provider.toLowerCase())
  )

  async function fetchCardImage(provider: string) {
    if (!provider.trim()) return
    setFetchingImage(true)
    try {
      const res = await fetch(`/api/card-image?provider=${encodeURIComponent(provider)}`)
      const data = await res.json()
      if (data.logoUrl) setForm((f) => ({ ...f, image_url: data.logoUrl }))
    } catch { /* silent */ } finally { setFetchingImage(false) }
  }

  function validate() {
    const errs: Record<string, string> = {}
    if (!form.provider.trim()) errs.provider = 'Requis'
    if (!form.limit_amount || isNaN(+form.limit_amount) || +form.limit_amount <= 0) errs.limit_amount = 'Invalide'
    const day = +form.billing_start_day
    if (isNaN(day) || day < 1 || day > 28) errs.billing_start_day = 'Entre 1 et 28'
    if (form.last_four && form.last_four.length !== 4) errs.last_four = '4 chiffres'
    setErrors(errs)
    return !Object.keys(errs).length
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    try {
      const card = await createCard({
        provider: form.provider.trim(),
        name: form.name.trim() || form.provider.trim(),
        limit_amount: +form.limit_amount,
        balance: +form.balance || 0,
        billing_start_day: +form.billing_start_day,
        image_url: form.image_url || null,
        last_four: form.last_four || null,
        color: null,
      })
      onCreated(card)
    } catch (err) { console.error(err) } finally { setLoading(false) }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 sm:p-0">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full sm:max-w-md bg-white rounded-t-3xl sm:rounded-3xl overflow-hidden"
        style={{ boxShadow: '0 24px 64px rgba(0,0,0,0.12), 0 8px 24px rgba(0,0,0,0.08)' }}>

        {/* Drag handle (mobile) */}
        <div className="flex justify-center pt-3 pb-1 sm:hidden">
          <div className="w-9 h-1 bg-[#E5E5EA] rounded-full" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-black/[0.06]">
          <h2 className="text-[17px] font-semibold tracking-tight text-[#1D1D1F]">Nouvelle carte</h2>
          <button onClick={onClose} className="w-7 h-7 bg-[#F5F5F7] hover:bg-[#E5E5EA] rounded-full flex items-center justify-center transition-colors">
            <X className="w-3.5 h-3.5 text-[#6E6E73]" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4 max-h-[75vh] overflow-y-auto">

          {/* Provider */}
          <div className="relative">
            <label className="block text-[11px] font-semibold text-[#6E6E73] uppercase tracking-wider mb-2">
              Fournisseur
            </label>
            <input
              type="text"
              value={form.provider}
              onChange={(e) => { setForm((f) => ({ ...f, provider: e.target.value })); setShowSuggestions(true) }}
              onBlur={() => { setTimeout(() => setShowSuggestions(false), 150); if (form.provider.trim()) fetchCardImage(form.provider) }}
              placeholder="ex: BNC World Elite Mastercard"
              className={inputClass(errors.provider)}
            />
            {errors.provider && <p className="text-[11px] text-red-500 mt-1">{errors.provider}</p>}

            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute z-10 w-full mt-1.5 bg-white border border-black/[0.08] rounded-2xl overflow-hidden"
                style={{ boxShadow: '0 8px 24px rgba(0,0,0,0.08)' }}>
                {suggestions.slice(0, 5).map((s) => (
                  <button key={s} type="button"
                    className="w-full text-left px-4 py-2.5 text-[13px] text-[#1D1D1F] hover:bg-[#F5F5F7] transition-colors border-b border-black/[0.04] last:border-0"
                    onClick={() => { setForm((f) => ({ ...f, provider: s })); setShowSuggestions(false); fetchCardImage(s) }}>
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Image preview */}
          <div>
            <label className="block text-[11px] font-semibold text-[#6E6E73] uppercase tracking-wider mb-2">
              Logo {fetchingImage && <Loader2 className="inline w-3 h-3 ml-1 animate-spin text-[#AEAEB2]" />}
            </label>
            <input
              type="url"
              value={form.image_url}
              onChange={(e) => setForm((f) => ({ ...f, image_url: e.target.value }))}
              placeholder="Auto-détecté ou URL manuelle"
              className={inputClass()}
            />
            {form.image_url && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={form.image_url} alt="logo" className="mt-2 h-7 object-contain rounded opacity-80"
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }} />
            )}
          </div>

          {/* Limit + Balance */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { key: 'limit_amount', label: 'Limite', placeholder: '10 000' },
              { key: 'balance', label: 'Solde actuel', placeholder: '0' },
            ].map(({ key, label, placeholder }) => (
              <div key={key}>
                <label className="block text-[11px] font-semibold text-[#6E6E73] uppercase tracking-wider mb-2">{label}</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#AEAEB2] text-[13px]">$</span>
                  <input
                    type="number" min="0" step="0.01"
                    value={form[key as keyof typeof form]}
                    onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                    placeholder={placeholder}
                    className={cn(inputClass(errors[key]), 'pl-7')}
                  />
                </div>
                {errors[key] && <p className="text-[11px] text-red-500 mt-1">{errors[key]}</p>}
              </div>
            ))}
          </div>

          {/* Billing start day */}
          <div>
            <label className="block text-[11px] font-semibold text-[#6E6E73] uppercase tracking-wider mb-2">
              Début de facturation
            </label>
            <div className="flex items-center gap-3">
              <span className="text-[14px] text-[#6E6E73]">Le</span>
              <input
                type="number" min="1" max="28"
                value={form.billing_start_day}
                onChange={(e) => setForm((f) => ({ ...f, billing_start_day: e.target.value }))}
                className={cn(inputClass(errors.billing_start_day), 'w-20 text-center')}
              />
              <span className="text-[14px] text-[#6E6E73]">de chaque mois</span>
            </div>
            {errors.billing_start_day && <p className="text-[11px] text-red-500 mt-1">{errors.billing_start_day}</p>}
          </div>

          {/* Last 4 */}
          <div>
            <label className="block text-[11px] font-semibold text-[#6E6E73] uppercase tracking-wider mb-2">
              4 derniers chiffres
            </label>
            <input
              type="text" maxLength={4}
              value={form.last_four}
              onChange={(e) => setForm((f) => ({ ...f, last_four: e.target.value.replace(/\D/g, '') }))}
              placeholder="4521"
              className={cn(inputClass(errors.last_four), 'w-28 text-center font-mono tracking-widest')}
            />
          </div>

          {/* Submit */}
          <div className="pt-2">
            <button type="submit" disabled={loading}
              className="w-full py-3 bg-[#1D1D1F] hover:bg-[#3A3A3C] text-white text-[15px] font-medium rounded-2xl transition-colors duration-200 disabled:opacity-50 flex items-center justify-center gap-2">
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              Ajouter la carte
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
