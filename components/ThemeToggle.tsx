'use client'

import { useTheme } from 'next-themes'
import { Sun, Moon } from 'lucide-react'
import { useEffect, useState } from 'react'

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  if (!mounted) return <div className="w-8 h-8" />

  return (
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[var(--c-hover-icon)] transition-colors"
      aria-label="Changer le thème"
    >
      {theme === 'dark'
        ? <Sun className="w-4 h-4 text-[var(--c-text-2)]" />
        : <Moon className="w-4 h-4 text-[var(--c-text-2)]" />
      }
    </button>
  )
}
