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

/* ── Network logos ─────────────────────────────────────────── */
function VisaLogo() {
  return (
    <svg width="52" height="18" viewBox="0 0 52 18" fill="none">
      <text
        x="0" y="16"
        fontFamily="Times New Roman, serif"
        fontWeight="700"
        fontStyle="italic"
        fontSize="20"
        fill="white"
        opacity="0.92"
        letterSpacing="-1"
      >
        VISA
      </text>
    </svg>
  )
}

function MastercardLogo() {
  return (
    <svg width="38" height="24" viewBox="0 0 38 24" fill="none">
      <circle cx="14" cy="12" r="12" fill="#EB001B" opacity="0.92" />
      <circle cx="24" cy="12" r="12" fill="#F79E1B" opacity="0.92" />
      <path
        d="M19 4.8a12 12 0 0 1 0 14.4A12 12 0 0 1 19 4.8z"
        fill="#FF5F00"
        opacity="0.9"
      />
    </svg>
  )
}

function AmexLogo() {
  return (
    <svg width="44" height="18" viewBox="0 0 44 18" fill="none">
      {/* Blue background pill */}
      <rect width="44" height="18" rx="4" fill="rgba(0,100,220,0.55)" />
      <text
        x="22" y="13"
        textAnchor="middle"
        fontFamily="system-ui, -apple-system, sans-serif"
        fontWeight="800"
        fontSize="9.5"
        letterSpacing="0.12em"
        fill="white"
        opacity="0.95"
      >
        AMEX
      </text>
    </svg>
  )
}

function NetworkLogo({ network }: { network: 'visa' | 'mastercard' | 'amex' | null }) {
  if (network === 'visa') return <VisaLogo />
  if (network === 'mastercard') return <MastercardLogo />
  if (network === 'amex') return <AmexLogo />
  return null
}

/* ── EMV Chip ──────────────────────────────────────────────── */
function Chip({ small = false }: { small?: boolean }) {
  const w = small ? 28 : 36
  const h = small ? 22 : 28

  return (
    <div
      style={{
        width: w,
        height: h,
        borderRadius: 4,
        background: 'linear-gradient(145deg, #C8960C 0%, #F5D060 30%, #D4AF37 60%, #E8C84A 100%)',
        boxShadow: 'inset 0 0 0 0.5px rgba(255,255,255,0.4), 0 1px 3px rgba(0,0,0,0.3)',
        position: 'relative',
        overflow: 'hidden',
        flexShrink: 0,
      }}
    >
      {/* Horizontal groove */}
      <div style={{
        position: 'absolute', top: '50%', left: 0, right: 0,
        height: 1, background: 'rgba(0,0,0,0.18)', transform: 'translateY(-50%)',
      }} />
      {/* Vertical groove */}
      <div style={{
        position: 'absolute', left: '50%', top: 0, bottom: 0,
        width: 1, background: 'rgba(0,0,0,0.18)', transform: 'translateX(-50%)',
      }} />
      {/* Contact zones */}
      {[
        { top: 2, left: 2, right: '52%', bottom: '52%' },
        { top: 2, left: '52%', right: 2, bottom: '52%' },
        { top: '52%', left: 2, right: '52%', bottom: 2 },
        { top: '52%', left: '52%', right: 2, bottom: 2 },
      ].map((s, i) => (
        <div key={i} style={{ position: 'absolute', ...s, background: 'rgba(0,0,0,0.07)', borderRadius: 2 }} />
      ))}
    </div>
  )
}

/* ── Contactless symbol ────────────────────────────────────── */
function ContactlessIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none">
      <circle cx="4" cy="10" r="2" fill="white" opacity="0.65" />
      <path d="M8 5.5 C10.5 7 12 8.5 12 10 C12 11.5 10.5 13 8 14.5"
        stroke="white" strokeWidth="1.6" strokeLinecap="round" fill="none" opacity="0.55" />
      <path d="M11.5 3 C15.5 5.5 17.5 7.5 17.5 10 C17.5 12.5 15.5 14.5 11.5 17"
        stroke="white" strokeWidth="1.6" strokeLinecap="round" fill="none" opacity="0.35" />
    </svg>
  )
}

/* ── Main widget ───────────────────────────────────────────── */
export default function CardWidget({ card, currentSpend = 0, compact = false }: CardWidgetProps) {
  const info = getProviderInfo(card.provider)
  // card.network wins (user-set), fallback to auto-detected from provider name
  const network = card.network ?? info.network
  const utilization = getUtilizationPercent(card.balance, card.limit_amount)

  const utilizationColor =
    utilization >= 90 ? 'rgba(255,100,100,0.85)' :
    utilization >= 70 ? 'rgba(255,180,50,0.85)' :
    'rgba(255,255,255,0.75)'

  return (
    <div
      className={cn('relative overflow-hidden select-none text-white', compact ? 'rounded-2xl p-4' : 'rounded-[24px] p-6')}
      style={{
        aspectRatio: '1.586 / 1',
        background: info.gradient,
        boxShadow: compact
          ? 'none'
          : '0 8px 32px rgba(0,0,0,0.28), 0 2px 8px rgba(0,0,0,0.18), inset 0 0 0 1px rgba(255,255,255,0.10)',
      }}
    >

      {/* ── Decorative orb — bottom-right ── */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          width: '65%', height: '65%',
          right: '-12%', bottom: '-15%',
          background: info.accentGradient,
          filter: 'blur(48px)',
          pointerEvents: 'none',
        }}
      />

      {/* ── Top gloss highlight ── */}
      <div
        aria-hidden
        className="absolute top-0 left-0 right-0"
        style={{
          height: '45%',
          background: 'linear-gradient(to bottom, rgba(255,255,255,0.10) 0%, transparent 100%)',
          borderRadius: compact ? '16px 16px 0 0' : '24px 24px 0 0',
          pointerEvents: 'none',
        }}
      />

      {/* ── Diagonal shimmer band ── */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(105deg, transparent 35%, rgba(255,255,255,0.04) 50%, transparent 65%)',
          pointerEvents: 'none',
        }}
      />

      {/* ── Grain texture ── */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundSize: '128px 128px',
          opacity: 0.04,
          pointerEvents: 'none',
        }}
      />

      {/* ── Content ── */}
      <div className="relative h-full flex flex-col justify-between">

        {/* Row 1 — Provider + Network */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2.5">
            {card.image_url && (
              <div
                className="flex items-center justify-center overflow-hidden flex-shrink-0"
                style={{
                  width: compact ? 28 : 34,
                  height: compact ? 28 : 34,
                  borderRadius: 10,
                  background: 'rgba(255,255,255,0.18)',
                  backdropFilter: 'blur(8px)',
                  border: '1px solid rgba(255,255,255,0.22)',
                }}
              >
                <Image
                  src={card.image_url}
                  alt={card.provider}
                  width={compact ? 22 : 26}
                  height={compact ? 22 : 26}
                  className="object-contain"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
                />
              </div>
            )}
            <div>
              <p
                className="font-semibold leading-tight"
                style={{
                  fontSize: compact ? 11 : 13,
                  letterSpacing: '0.02em',
                  color: 'rgba(255,255,255,0.92)',
                }}
              >
                {card.provider}
              </p>
              {card.name && card.name !== card.provider && (
                <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.45)', marginTop: 2 }}>
                  {card.name}
                </p>
              )}
            </div>
          </div>

          <div className="flex-shrink-0 mt-0.5">
            <NetworkLogo network={network} />
          </div>
        </div>

        {/* Row 2 — Chip + Contactless + Card number */}
        {!compact && (
          <div>
            <div className="flex items-center gap-3 mb-3">
              <Chip />
              <ContactlessIcon size={18} />
            </div>
            <p
              className="font-mono"
              style={{
                fontSize: 13,
                letterSpacing: '0.22em',
                color: 'rgba(255,255,255,0.72)',
              }}
            >
              •••• •••• •••• {card.last_four ?? '••••'}
            </p>
          </div>
        )}

        {compact && (
          <p
            className="font-mono"
            style={{ fontSize: 10, letterSpacing: '0.18em', color: 'rgba(255,255,255,0.55)' }}
          >
            •••• {card.last_four ?? '••••'}
          </p>
        )}

        {/* Row 3 — Balance info + bar */}
        <div>
          <div className="flex items-end justify-between mb-2">
            {/* Balance */}
            <div>
              <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.45)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 3 }}>
                Solde
              </p>
              <p
                className="font-semibold leading-none"
                style={{ fontSize: compact ? 14 : 17, letterSpacing: '-0.02em' }}
              >
                {formatCurrency(card.balance)}
              </p>
              {!compact && (
                <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.38)', marginTop: 3 }}>
                  / {formatCurrency(card.limit_amount)}
                </p>
              )}
            </div>

            {/* Utilization */}
            <div className="text-right">
              <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.45)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 3 }}>
                Util.
              </p>
              <p
                className="font-semibold leading-none"
                style={{ fontSize: compact ? 13 : 16, color: utilizationColor }}
              >
                {utilization}%
              </p>
            </div>
          </div>

          {/* Utilization bar */}
          <div
            style={{
              width: '100%',
              height: compact ? 2 : 3,
              background: 'rgba(255,255,255,0.12)',
              borderRadius: 99,
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                height: '100%',
                width: `${utilization}%`,
                background: utilizationColor,
                borderRadius: 99,
                transition: 'width 0.6s cubic-bezier(0.25,0.46,0.45,0.94)',
              }}
            />
          </div>

          {currentSpend > 0 && !compact && (
            <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)', marginTop: 5, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
              {formatCurrency(currentSpend)} dépensé ce mois
            </p>
          )}
        </div>

      </div>
    </div>
  )
}
