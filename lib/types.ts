export type ExpenseCategory =
  | 'alimentation'
  | 'restaurant'
  | 'transport'
  | 'divertissement'
  | 'sante'
  | 'maison'
  | 'voyages'
  | 'shopping'
  | 'services'
  | 'autre'

export interface Card {
  id: string
  provider: string
  name: string
  limit_amount: number
  balance: number
  billing_start_day: number
  image_url: string | null
  last_four: string | null
  color: string | null
  created_at: string
}

export interface Expense {
  id: string
  card_id: string
  title: string
  amount: number
  date: string
  note: string | null
  category: ExpenseCategory
  is_paid: boolean
  created_at: string
}

export const CATEGORY_LABELS: Record<ExpenseCategory, string> = {
  alimentation: 'Alimentation',
  restaurant: 'Restaurant',
  transport: 'Transport',
  divertissement: 'Divertissement',
  sante: 'Santé',
  maison: 'Maison',
  voyages: 'Voyages',
  shopping: 'Shopping',
  services: 'Services',
  autre: 'Autre',
}

export const CATEGORY_ICONS: Record<ExpenseCategory, string> = {
  alimentation: '🛒',
  restaurant: '🍽️',
  transport: '🚗',
  divertissement: '🎬',
  sante: '💊',
  maison: '🏠',
  voyages: '✈️',
  shopping: '🛍️',
  services: '📱',
  autre: '📦',
}

export const CATEGORY_COLORS: Record<ExpenseCategory, string> = {
  alimentation: 'bg-green-100 text-green-800',
  restaurant: 'bg-orange-100 text-orange-800',
  transport: 'bg-blue-100 text-blue-800',
  divertissement: 'bg-purple-100 text-purple-800',
  sante: 'bg-pink-100 text-pink-800',
  maison: 'bg-yellow-100 text-yellow-800',
  voyages: 'bg-sky-100 text-sky-800',
  shopping: 'bg-rose-100 text-rose-800',
  services: 'bg-indigo-100 text-indigo-800',
  autre: 'bg-gray-100 text-gray-800',
}
