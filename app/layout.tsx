import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'CredFlow',
  description: 'Gérez vos cartes de crédit et suivez vos dépenses',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className="min-h-screen bg-[#F4F5F7]">
        {children}
      </body>
    </html>
  )
}
