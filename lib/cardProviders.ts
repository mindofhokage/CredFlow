export interface ProviderInfo {
  domain: string
  gradient: string        // CSS gradient string
  accentGradient: string  // lighter gradient for decorative orb
  network: 'visa' | 'mastercard' | 'amex' | null
}

const PROVIDER_MAP: Record<string, ProviderInfo> = {
  amex: {
    domain: 'americanexpress.com',
    gradient: 'linear-gradient(145deg, #064E3B 0%, #0D9488 45%, #059669 100%)',
    accentGradient: 'radial-gradient(circle, rgba(16,185,129,0.35) 0%, transparent 70%)',
    network: 'amex',
  },
  'american express': {
    domain: 'americanexpress.com',
    gradient: 'linear-gradient(145deg, #064E3B 0%, #0D9488 45%, #059669 100%)',
    accentGradient: 'radial-gradient(circle, rgba(16,185,129,0.35) 0%, transparent 70%)',
    network: 'amex',
  },
  bmo: {
    domain: 'bmo.com',
    gradient: 'linear-gradient(145deg, #1E3A8A 0%, #2563EB 50%, #38BDF8 100%)',
    accentGradient: 'radial-gradient(circle, rgba(56,189,248,0.35) 0%, transparent 70%)',
    network: null,
  },
  td: {
    domain: 'td.com',
    gradient: 'linear-gradient(145deg, #14532D 0%, #16A34A 55%, #4ADE80 100%)',
    accentGradient: 'radial-gradient(circle, rgba(74,222,128,0.3) 0%, transparent 70%)',
    network: null,
  },
  rbc: {
    domain: 'rbc.com',
    gradient: 'linear-gradient(145deg, #0F172A 0%, #1E3A8A 45%, #312E81 100%)',
    accentGradient: 'radial-gradient(circle, rgba(99,102,241,0.3) 0%, transparent 70%)',
    network: null,
  },
  scotiabank: {
    domain: 'scotiabank.com',
    gradient: 'linear-gradient(145deg, #7F1D1D 0%, #DC2626 55%, #FB7185 100%)',
    accentGradient: 'radial-gradient(circle, rgba(251,113,133,0.3) 0%, transparent 70%)',
    network: null,
  },
  cibc: {
    domain: 'cibc.com',
    gradient: 'linear-gradient(145deg, #7F1D1D 0%, #B91C1C 50%, #EF4444 100%)',
    accentGradient: 'radial-gradient(circle, rgba(239,68,68,0.3) 0%, transparent 70%)',
    network: null,
  },
  bnc: {
    domain: 'bnc.ca',
    gradient: 'linear-gradient(145deg, #1E1B4B 0%, #4338CA 50%, #6366F1 100%)',
    accentGradient: 'radial-gradient(circle, rgba(99,102,241,0.35) 0%, transparent 70%)',
    network: null,
  },
  'banque nationale': {
    domain: 'bnc.ca',
    gradient: 'linear-gradient(145deg, #1E1B4B 0%, #4338CA 50%, #6366F1 100%)',
    accentGradient: 'radial-gradient(circle, rgba(99,102,241,0.35) 0%, transparent 70%)',
    network: null,
  },
  'national bank': {
    domain: 'bnc.ca',
    gradient: 'linear-gradient(145deg, #1E1B4B 0%, #4338CA 50%, #6366F1 100%)',
    accentGradient: 'radial-gradient(circle, rgba(99,102,241,0.35) 0%, transparent 70%)',
    network: null,
  },
  desjardins: {
    domain: 'desjardins.com',
    gradient: 'linear-gradient(145deg, #14532D 0%, #166534 50%, #15803D 100%)',
    accentGradient: 'radial-gradient(circle, rgba(21,128,61,0.35) 0%, transparent 70%)',
    network: null,
  },
  'capital one': {
    domain: 'capitalone.com',
    gradient: 'linear-gradient(145deg, #78350F 0%, #D97706 55%, #FCD34D 100%)',
    accentGradient: 'radial-gradient(circle, rgba(252,211,77,0.3) 0%, transparent 70%)',
    network: null,
  },
  'pc financial': {
    domain: 'pcfinancial.ca',
    gradient: 'linear-gradient(145deg, #7F1D1D 0%, #B91C1C 50%, #DC2626 100%)',
    accentGradient: 'radial-gradient(circle, rgba(220,38,38,0.3) 0%, transparent 70%)',
    network: null,
  },
  rogers: {
    domain: 'rogersbank.com',
    gradient: 'linear-gradient(145deg, #7F1D1D 0%, #DC2626 55%, #F87171 100%)',
    accentGradient: 'radial-gradient(circle, rgba(248,113,113,0.3) 0%, transparent 70%)',
    network: null,
  },
  tangerine: {
    domain: 'tangerine.ca',
    gradient: 'linear-gradient(145deg, #7C2D12 0%, #EA580C 55%, #FB923C 100%)',
    accentGradient: 'radial-gradient(circle, rgba(251,146,60,0.35) 0%, transparent 70%)',
    network: null,
  },
  simplii: {
    domain: 'simplii.com',
    gradient: 'linear-gradient(145deg, #881337 0%, #E11D48 55%, #FB7185 100%)',
    accentGradient: 'radial-gradient(circle, rgba(251,113,133,0.3) 0%, transparent 70%)',
    network: null,
  },
  visa: {
    domain: 'visa.com',
    gradient: 'linear-gradient(145deg, #1E1B4B 0%, #1D4ED8 50%, #3B82F6 100%)',
    accentGradient: 'radial-gradient(circle, rgba(59,130,246,0.35) 0%, transparent 70%)',
    network: 'visa',
  },
  mastercard: {
    domain: 'mastercard.com',
    gradient: 'linear-gradient(145deg, #1C1917 0%, #292524 50%, #44403C 100%)',
    accentGradient: 'radial-gradient(circle, rgba(249,115,22,0.3) 0%, transparent 70%)',
    network: 'mastercard',
  },
}

const DEFAULT_INFO: ProviderInfo = {
  domain: '',
  gradient: 'linear-gradient(145deg, #0F172A 0%, #1E293B 50%, #334155 100%)',
  accentGradient: 'radial-gradient(circle, rgba(148,163,184,0.2) 0%, transparent 70%)',
  network: null,
}

export function getProviderInfo(providerName: string): ProviderInfo {
  const lower = providerName.toLowerCase()
  for (const [key, info] of Object.entries(PROVIDER_MAP)) {
    if (lower.includes(key)) return info
  }
  return DEFAULT_INFO
}

export function getLogoUrl(providerName: string): string | null {
  const info = getProviderInfo(providerName)
  if (!info.domain) return null
  return `https://logo.clearbit.com/${info.domain}`
}
