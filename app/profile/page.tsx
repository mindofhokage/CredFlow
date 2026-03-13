'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Loader2, Check } from 'lucide-react'
import Link from 'next/link'
import Logo from '@/components/Logo'
import ThemeToggle from '@/components/ThemeToggle'
import GlowBg from '@/components/GlowBg'
import { getUser, signOut, updateEmail, updatePassword } from '@/lib/auth'
import { cn } from '@/lib/utils'

const inputBase =
  'w-full px-3.5 py-2.5 text-[14px] text-[var(--c-text)] rounded-xl border bg-[var(--c-input-bg)] focus:bg-[var(--c-input-focus)] outline-none transition-all duration-200 placeholder:text-[var(--c-text-3)] border-[var(--c-border-md)] focus:border-[var(--c-focus-border)] focus:ring-2 focus:ring-[var(--c-focus-ring)]'

type Status = { type: 'success' | 'error'; message: string } | null

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div
      className="bg-[var(--c-surface)] rounded-2xl border border-[var(--c-border)] p-6"
      style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}
    >
      <h2 className="text-[11px] font-semibold text-[var(--c-text-3)] uppercase tracking-wider mb-5">
        {title}
      </h2>
      {children}
    </div>
  )
}

function StatusMsg({ status }: { status: Status }) {
  if (!status) return null
  return (
    <p
      className={cn(
        'text-[13px] px-3 py-2 rounded-xl',
        status.type === 'success'
          ? 'text-green-600 bg-green-50 dark:bg-green-950/20'
          : 'text-red-500 bg-red-50 dark:bg-red-950/20'
      )}
    >
      {status.message}
    </p>
  )
}

export default function ProfilePage() {
  const router = useRouter()
  const [userEmail, setUserEmail] = useState('')

  // Email form
  const [newEmail, setNewEmail] = useState('')
  const [emailStatus, setEmailStatus] = useState<Status>(null)
  const [emailLoading, setEmailLoading] = useState(false)

  // Password form
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passwordStatus, setPasswordStatus] = useState<Status>(null)
  const [passwordLoading, setPasswordLoading] = useState(false)

  useEffect(() => {
    getUser().then((user) => {
      if (user?.email) setUserEmail(user.email)
    })
  }, [])

  async function handleUpdateEmail(e: React.FormEvent) {
    e.preventDefault()
    setEmailStatus(null)
    setEmailLoading(true)
    try {
      await updateEmail(newEmail)
      setEmailStatus({
        type: 'success',
        message: 'Un lien de confirmation a été envoyé à votre nouvelle adresse.',
      })
      setNewEmail('')
    } catch (err) {
      setEmailStatus({
        type: 'error',
        message: err instanceof Error ? err.message : 'Erreur',
      })
    } finally {
      setEmailLoading(false)
    }
  }

  async function handleUpdatePassword(e: React.FormEvent) {
    e.preventDefault()
    setPasswordStatus(null)
    if (newPassword !== confirmPassword) {
      setPasswordStatus({ type: 'error', message: 'Les mots de passe ne correspondent pas.' })
      return
    }
    if (newPassword.length < 6) {
      setPasswordStatus({ type: 'error', message: 'Le mot de passe doit contenir au moins 6 caractères.' })
      return
    }
    setPasswordLoading(true)
    try {
      await updatePassword(newPassword)
      setPasswordStatus({ type: 'success', message: 'Mot de passe mis à jour avec succès.' })
      setNewPassword('')
      setConfirmPassword('')
    } catch (err) {
      setPasswordStatus({
        type: 'error',
        message: err instanceof Error ? err.message : 'Erreur',
      })
    } finally {
      setPasswordLoading(false)
    }
  }

  async function handleSignOut() {
    await signOut()
    router.push('/auth')
    router.refresh()
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      <GlowBg />

      {/* Header */}
      <header className="relative z-20 sticky top-0 bg-[var(--c-header-bg)] backdrop-blur-2xl">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <Logo size="lg" />
          <ThemeToggle />
        </div>
        <div className="border-b border-[var(--c-border)]" />
      </header>

      <main className="relative z-10 max-w-xl mx-auto px-6 py-10">
        {/* Back + Title */}
        <div className="flex items-center gap-3 mb-8">
          <Link
            href="/"
            className="w-8 h-8 flex items-center justify-center rounded-xl bg-[var(--c-surface)] border border-[var(--c-border)] text-[var(--c-text-2)] hover:text-[var(--c-text)] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-[var(--c-text)]">Mon profil</h1>
            {userEmail && (
              <p className="text-[12px] text-[var(--c-text-3)] mt-0.5">{userEmail}</p>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-4">
          {/* Change email */}
          <Section title="Adresse courriel">
            <form onSubmit={handleUpdateEmail} className="flex flex-col gap-3">
              <div>
                <label className="block text-[12px] font-medium text-[var(--c-text-2)] mb-1.5">
                  Nouvelle adresse courriel
                </label>
                <input
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder={userEmail || 'nouveau@exemple.com'}
                  required
                  autoComplete="email"
                  className={inputBase}
                />
              </div>
              <StatusMsg status={emailStatus} />
              <button
                type="submit"
                disabled={emailLoading}
                className="flex items-center justify-center gap-2 px-4 py-2.5 text-[13px] font-semibold rounded-xl transition-all disabled:opacity-50 text-white"
                style={{ background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)', boxShadow: '0 2px 10px rgba(99,102,241,0.28)' }}
              >
                {emailLoading
                  ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  : <Check className="w-3.5 h-3.5" />
                }
                Mettre à jour le courriel
              </button>
            </form>
          </Section>

          {/* Change password */}
          <Section title="Mot de passe">
            <form onSubmit={handleUpdatePassword} className="flex flex-col gap-3">
              <div>
                <label className="block text-[12px] font-medium text-[var(--c-text-2)] mb-1.5">
                  Nouveau mot de passe
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  autoComplete="new-password"
                  className={inputBase}
                />
              </div>
              <div>
                <label className="block text-[12px] font-medium text-[var(--c-text-2)] mb-1.5">
                  Confirmer le mot de passe
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  autoComplete="new-password"
                  className={inputBase}
                />
              </div>
              <StatusMsg status={passwordStatus} />
              <button
                type="submit"
                disabled={passwordLoading}
                className="flex items-center justify-center gap-2 px-4 py-2.5 text-[13px] font-semibold rounded-xl transition-all disabled:opacity-50 text-white"
                style={{ background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)', boxShadow: '0 2px 10px rgba(99,102,241,0.28)' }}
              >
                {passwordLoading
                  ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  : <Check className="w-3.5 h-3.5" />
                }
                Changer le mot de passe
              </button>
            </form>
          </Section>

          {/* Sign out */}
          <Section title="Session">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[13px] text-[var(--c-text)]">Connecté en tant que</p>
                <p className="text-[13px] font-medium text-[var(--c-text-2)] mt-0.5">{userEmail}</p>
              </div>
              <button
                onClick={handleSignOut}
                className="px-4 py-2 text-[13px] font-medium text-red-500 bg-red-50 hover:bg-red-100 dark:bg-red-950/20 dark:hover:bg-red-950/30 rounded-xl transition-colors"
              >
                Se déconnecter
              </button>
            </div>
          </Section>
        </div>
      </main>
    </div>
  )
}
