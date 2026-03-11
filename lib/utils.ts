import { type ClassValue, clsx } from 'clsx'
import { format, startOfDay, isWithinInterval } from 'date-fns'
import { fr } from 'date-fns/locale'

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs)
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('fr-CA', {
    style: 'currency',
    currency: 'CAD',
    minimumFractionDigits: 2,
  }).format(amount)
}

export function formatDate(dateString: string): string {
  return format(new Date(dateString + 'T12:00:00'), 'd MMM yyyy', { locale: fr })
}

export function formatDateShort(dateString: string): string {
  return format(new Date(dateString + 'T12:00:00'), 'd MMM', { locale: fr })
}

export function getCurrentBillingPeriod(startDay: number): { start: Date; end: Date; label: string } {
  const today = new Date()
  const currentDay = today.getDate()
  const currentMonth = today.getMonth()
  const currentYear = today.getFullYear()

  let periodStart: Date
  let periodEnd: Date

  if (currentDay >= startDay) {
    periodStart = new Date(currentYear, currentMonth, startDay)
    periodEnd = new Date(currentYear, currentMonth + 1, startDay - 1)
  } else {
    periodStart = new Date(currentYear, currentMonth - 1, startDay)
    periodEnd = new Date(currentYear, currentMonth, startDay - 1)
  }

  const label = `${format(periodStart, 'd MMM', { locale: fr })} → ${format(periodEnd, 'd MMM yyyy', { locale: fr })}`

  return { start: periodStart, end: periodEnd, label }
}

export function isInCurrentBillingPeriod(dateString: string, startDay: number): boolean {
  const { start, end } = getCurrentBillingPeriod(startDay)
  const date = startOfDay(new Date(dateString + 'T12:00:00'))
  return isWithinInterval(date, { start: startOfDay(start), end: startOfDay(end) })
}

export function getUtilizationPercent(balance: number, limit: number): number {
  if (limit === 0) return 0
  return Math.min(Math.round((balance / limit) * 100), 100)
}

export function getUtilizationColor(percent: number): string {
  if (percent < 30) return 'bg-emerald-500'
  if (percent < 60) return 'bg-amber-400'
  return 'bg-red-500'
}
