'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, Eye, EyeOff } from 'lucide-react'
import ThemeToggle from '@/components/ThemeToggle'
import GlowBg from '@/components/GlowBg'
import { signIn, signUp } from '@/lib/auth'
import { cn } from '@/lib/utils'

type Tab = 'login' | 'signup'

const inputBase =
  'w-full px-4 py-3 text-[14px] text-[var(--c-text)] rounded-xl border bg-[var(--c-input-bg)] focus:bg-[var(--c-input-focus)] outline-none transition-all duration-200 placeholder:text-[var(--c-text-3)] border-[var(--c-border-md)] focus:border-[var(--c-focus-border)] focus:ring-2 focus:ring-[var(--c-focus-ring)]'

export default function AuthPage() {
  const router = useRouter()
  const [tab, setTab] = useState<Tab>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  function switchTab(t: Tab) {
    setTab(t)
    setError(null)
    setSuccess(null)
    setPassword('')
    setConfirmPassword('')
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setSuccess(null)

    if (tab === 'signup' && password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas.')
      return
    }

    setLoading(true)
    try {
      if (tab === 'login') {
        await signIn(email, password)
        router.push('/')
        router.refresh()
      } else {
        await signUp(email, password)
        setSuccess('Compte créé ! Vérifiez votre courriel pour confirmer votre compte.')
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Une erreur est survenue.'
      if (msg.includes('Invalid login credentials')) setError('Courriel ou mot de passe incorrect.')
      else if (msg.includes('already registered')) setError('Ce courriel est déjà utilisé.')
      else if (msg.includes('Password should be')) setError('Le mot de passe doit contenir au moins 6 caractères.')
      else if (msg.includes('Unable to validate')) setError('Courriel ou mot de passe incorrect.')
      else setError(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[var(--c-bg)] flex flex-col relative overflow-hidden">

      <GlowBg />

      {/* Theme toggle — top right */}
      <div className="absolute top-4 right-5 z-20">
        <ThemeToggle />
      </div>

      {/* Centered content */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 py-16">

        {/* Wordmark */}
        <div className="mb-10 text-center">
          <h1
            className="text-[42px] tracking-[-1.5px] leading-none select-none"
            style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
          >
            <span className="font-light text-[var(--c-text)]">Cred</span>
            <span
              className="font-bold"
              style={{
                background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Flow
            </span>
          </h1>
          <p className="mt-2 text-[13px] text-[var(--c-text-3)] tracking-wide">
            Gérez vos cartes. Maîtrisez vos dépenses.
          </p>
        </div>

        {/* Card */}
        <div
          className="w-full max-w-[400px] bg-[var(--c-surface)] rounded-3xl border border-[var(--c-border)] p-8"
          style={{
            boxShadow: '0 8px 40px rgba(0,0,0,0.08), 0 1px 4px rgba(0,0,0,0.04), inset 0 1px 0 rgba(255,255,255,0.06)',
          }}
        >
          {/* Tabs */}
          <div className="flex bg-[var(--c-input-bg)] rounded-xl p-1 mb-7">
            {(['login', 'signup'] as const).map((t) => (
              <button
                key={t}
                onClick={() => switchTab(t)}
                className={cn(
                  'flex-1 py-2 text-[13px] font-medium rounded-lg transition-all duration-200',
                  tab === t
                    ? 'bg-[var(--c-surface)] text-[var(--c-text)] shadow-sm border border-[var(--c-border)]'
                    : 'text-[var(--c-text-3)] hover:text-[var(--c-text-2)]'
                )}
              >
                {t === 'login' ? 'Connexion' : 'Créer un compte'}
              </button>
            ))}
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="block text-[12px] font-semibold text-[var(--c-text-2)] uppercase tracking-wider mb-2">
                Courriel
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="vous@exemple.com"
                required
                autoComplete="email"
                className={inputBase}
              />
            </div>

            <div>
              <label className="block text-[12px] font-semibold text-[var(--c-text-2)] uppercase tracking-wider mb-2">
                Mot de passe
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  autoComplete={tab === 'login' ? 'current-password' : 'new-password'}
                  className={cn(inputBase, 'pr-11')}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[var(--c-text-3)] hover:text-[var(--c-text-2)] transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {tab === 'signup' && (
              <div>
                <label className="block text-[12px] font-semibold text-[var(--c-text-2)] uppercase tracking-wider mb-2">
                  Confirmer le mot de passe
                </label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  autoComplete="new-password"
                  className={inputBase}
                />
              </div>
            )}

            {error && (
              <p className="text-[13px] text-red-500 bg-red-50 dark:bg-red-950/20 px-3.5 py-2.5 rounded-xl border border-red-100 dark:border-red-900/30">
                {error}
              </p>
            )}
            {success && (
              <p className="text-[13px] text-green-600 bg-green-50 dark:bg-green-950/20 px-3.5 py-2.5 rounded-xl border border-green-100 dark:border-green-900/30">
                {success}
              </p>
            )}

            {/* Gradient submit button */}
            <button
              type="submit"
              disabled={loading}
              className="mt-1 w-full py-3 text-[14px] font-semibold rounded-xl transition-all duration-200 disabled:opacity-50 flex items-center justify-center gap-2 text-white"
              style={{
                background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
                boxShadow: loading ? 'none' : '0 4px 14px rgba(99,102,241,0.35)',
              }}
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {tab === 'login' ? 'Se connecter' : 'Créer mon compte'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
