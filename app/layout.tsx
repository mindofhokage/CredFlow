import type { Metadata } from 'next'
import './globals.css'
import ThemeProvider from '@/components/ThemeProvider'

export const metadata: Metadata = {
  title: 'CredFlow',
  description: 'Gérez vos cartes de crédit et suivez vos dépenses',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className="min-h-screen bg-[var(--c-bg)]">
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
