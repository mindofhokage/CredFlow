export interface ProviderInfo {
  domain: string
  gradient: string
  network: 'visa' | 'mastercard' | 'amex' | null
}

const PROVIDER_MAP: Record<string, ProviderInfo> = {
  amex: { domain: 'americanexpress.com', gradient: 'from-emerald-800 via-teal-700 to-emerald-600', network: 'amex' },
  'american express': { domain: 'americanexpress.com', gradient: 'from-emerald-800 via-teal-700 to-emerald-600', network: 'amex' },
  bmo: { domain: 'bmo.com', gradient: 'from-blue-700 via-blue-600 to-sky-500', network: null },
  td: { domain: 'td.com', gradient: 'from-green-700 via-green-600 to-emerald-500', network: null },
  rbc: { domain: 'rbc.com', gradient: 'from-slate-800 via-blue-900 to-slate-700', network: null },
  scotiabank: { domain: 'scotiabank.com', gradient: 'from-red-700 via-red-600 to-rose-500', network: null },
  cibc: { domain: 'cibc.com', gradient: 'from-red-800 via-red-700 to-red-600', network: null },
  bnc: { domain: 'bnc.ca', gradient: 'from-indigo-900 via-blue-800 to-blue-700', network: null },
  'banque nationale': { domain: 'bnc.ca', gradient: 'from-indigo-900 via-blue-800 to-blue-700', network: null },
  'national bank': { domain: 'bnc.ca', gradient: 'from-indigo-900 via-blue-800 to-blue-700', network: null },
  desjardins: { domain: 'desjardins.com', gradient: 'from-green-800 via-green-700 to-teal-600', network: null },
  'capital one': { domain: 'capitalone.com', gradient: 'from-red-700 via-orange-600 to-amber-500', network: null },
  'pc financial': { domain: 'pcfinancial.ca', gradient: 'from-red-800 via-red-700 to-red-600', network: null },
  rogers: { domain: 'rogersbank.com', gradient: 'from-red-700 via-red-600 to-rose-500', network: null },
  tangerine: { domain: 'tangerine.ca', gradient: 'from-orange-600 via-orange-500 to-amber-400', network: null },
  simplii: { domain: 'simplii.com', gradient: 'from-red-700 via-rose-600 to-pink-500', network: null },
  visa: { domain: 'visa.com', gradient: 'from-blue-900 via-blue-800 to-blue-700', network: 'visa' },
  mastercard: { domain: 'mastercard.com', gradient: 'from-red-600 via-orange-500 to-yellow-500', network: 'mastercard' },
}

export function getProviderInfo(providerName: string): ProviderInfo {
  const lower = providerName.toLowerCase()

  for (const [key, info] of Object.entries(PROVIDER_MAP)) {
    if (lower.includes(key)) return info
  }

  return {
    domain: '',
    gradient: 'from-slate-700 via-slate-600 to-slate-500',
    network: null,
  }
}

export function getLogoUrl(providerName: string): string | null {
  const info = getProviderInfo(providerName)
  if (!info.domain) return null
  return `https://logo.clearbit.com/${info.domain}`
}
