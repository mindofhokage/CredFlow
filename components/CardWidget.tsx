'use client'

import Image from 'next/image'
import { Card } from '@/lib/types'
import { formatCurrency, getUtilizationPercent } from '@/lib/utils'
import { getProviderInfo } from '@/lib/cardProviders'
import { cn } from '@/lib/utils'

interface CardWidgetProps {
  card: Card
  currentSpend?: number
  compact?: boolean
}

function NetworkLogo({ network }: { network: 'visa' | 'mastercard' | 'amex' | null }) {
  if (network === 'visa') {
    return <span className="font-black text-white/90 text-sm italic tracking-tight">VISA</span>
  }
  if (network === 'amex') {
    return <span className="font-bold text-white/90 text-[10px] tracking-[0.2em] uppercase">Amex</span>
  }
  if (network === 'mastercard') {
    return (
      <div className="flex items-center -space-x-2">
        <div className="w-5 h-5 rounded-full bg-red-500/90" />
        <div className="w-5 h-5 rounded-full bg-amber-400/90" />
      </div>
    )
  }
  return null
}

export default function CardWidget({ card, currentSpend = 0, compact = false }: CardWidgetProps) {
  const info = getProviderInfo(card.provider)
  const utilization = getUtilizationPercent(card.balance, card.limit_amount)

  return (
    <div
      className={cn(
        'relative rounded-[22px] overflow-hidden text-white select-none',
        `bg-gradient-to-br ${info.gradient}`,
        compact ? 'p-4' : 'p-6',
      )}
      style={{ aspectRatio: '1.586 / 1' }}
    >
      {/* Subtle noise texture overlay */}
      <div className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundSize: '128px 128px',
        }}
      />

      {/* Glossy highlight */}
      <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/10 to-transparent rounded-t-[22px]" />

      {/* Top row */}
      <div className="relative flex items-start justify-between">
        <div className="flex items-center gap-2.5">
          {card.image_url && (
            <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center overflow-hidden border border-white/20">
              <Image
                src={card.image_url}
                alt={card.provider}
                width={30}
                height={30}
                className="object-contain p-0.5"
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
              />
            </div>
          )}
          <div>
            <p className={cn('font-semibold leading-tight tracking-tight', compact ? 'text-xs' : 'text-sm')}>
              {card.provider}
            </p>
            {card.name && card.name !== card.provider && (
              <p className="text-white/50 text-xs leading-tight mt-0.5">{card.name}</p>
            )}
          </div>
        </div>
        <NetworkLogo network={info.network} />
      </div>

      {/* Chip */}
      {!compact && (
        <div className="relative mt-5">
          <div className="w-9 h-[26px] rounded-md bg-gradient-to-br from-yellow-200/80 to-yellow-400/60 border border-yellow-200/40 flex items-center justify-center overflow-hidden">
            <div className="grid grid-cols-2 gap-px w-full h-full p-0.5">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="rounded-[2px] bg-yellow-300/40" />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Card number */}
      <div className={cn('relative', compact ? 'mt-3' : 'mt-5')}>
        <p className={cn('font-mono tracking-[0.2em] text-white/80', compact ? 'text-[10px]' : 'text-xs')}>
          •••• •••• •••• {card.last_four ?? '••••'}
        </p>
      </div>

      {/* Bottom info */}
      <div className={cn('relative', compact ? 'mt-2' : 'mt-4')}>
        <div className="flex items-end justify-between mb-2">
          <div>
            <p className="text-white/50 text-[10px] uppercase tracking-wider mb-0.5">Solde</p>
            <p className={cn('font-semibold tracking-tight', compact ? 'text-sm' : 'text-base')}>
              {formatCurrency(card.balance)}
              <span className="text-white/40 font-normal text-[11px] ml-1.5">
                / {formatCurrency(card.limit_amount)}
              </span>
            </p>
          </div>
          <div className="text-right">
            <p className="text-white/50 text-[10px] uppercase tracking-wider mb-0.5">Util.</p>
            <p className="text-white/80 text-sm font-medium">{utilization}%</p>
          </div>
        </div>

        {/* Utilization bar */}
        <div className="w-full h-[3px] bg-white/15 rounded-full overflow-hidden">
          <div
            className="h-full bg-white/70 rounded-full"
            style={{ width: `${utilization}%` }}
          />
        </div>

        {currentSpend > 0 && !compact && (
          <p className="text-white/40 text-[10px] mt-1.5 uppercase tracking-wider">
            {formatCurrency(currentSpend)} dépensé ce mois
          </p>
        )}
      </div>
    </div>
  )
}
