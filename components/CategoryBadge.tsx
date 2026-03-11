import { ExpenseCategory, CATEGORY_LABELS, CATEGORY_ICONS, CATEGORY_COLORS } from '@/lib/types'
import { cn } from '@/lib/utils'

interface CategoryBadgeProps {
  category: ExpenseCategory
  className?: string
}

export default function CategoryBadge({ category, className }: CategoryBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium',
        CATEGORY_COLORS[category],
        className,
      )}
    >
      <span>{CATEGORY_ICONS[category]}</span>
      {CATEGORY_LABELS[category]}
    </span>
  )
}
