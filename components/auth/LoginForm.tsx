"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronDown, Eye, EyeOff, ShieldCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Notice, fieldClass, labelClass } from '@/components/ui/haven'
import { resetPassword, signIn } from '@/lib/auth'
import { supabase } from '@/lib/supabase'
import { FRONTEND_ONLY } from '@/lib/config'
import { cn } from '@/lib/utils'

interface LoginFormProps {
  /** Where to go after signing in (e.g. the page that sent the user to /login) */
  next?: string
  /** Open the leadership (email and password) sign-in straight away */
  leadership?: boolean
}

const safePath = (next?: string) => (next && next.startsWith('/') && !next.startsWith('//') ? next : null)

/**
 * Members sign in with Google (their account is created on first sign-in).
 * Leaders, the PCM executive and committee heads use the email and password issued to them.
 */
export function LoginForm({ next, leadership = false }: LoginFormProps) {
  const router = useRouter()
  const [showLeadership, setShowLeadership] = useState(leadership)
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [resetting, setResetting] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleGoogleSignIn = async () => {
    setError('')
    setSuccess('')
    if (!supabase) {
      setError('Sign-in is not available right now — please try again later.')
      return
    }
    setGoogleLoading(true)
    const callback = new URL('/auth/callback', window.location.origin)
    const target = safePath(next)
    if (target) callback.searchParams.set('next', target)
    const { error: oauthError } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: callback.toString(), queryParams: { prompt: 'select_account' } },
    })
    // On success the browser navigates to Google, so only errors land here
    if (oauthError) {
      setError("We couldn't start Google sign-in — please try again later.")
      setGoogleLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')
    try {
      // Pasted logins often carry a stray space or line break; issued passwords never contain spaces
      await signIn(email.trim().toLowerCase(), password.replace(/\s+/g, ''))
      router.push(safePath(next) ?? '/member-dashboard')
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : ''
      setError(
        /invalid login/i.test(message)
          ? 'That email and password don’t match. Check them (passwords are case-sensitive) and try again.'
          : /fetch|network|load failed/i.test(message)
            ? 'We couldn’t reach the sign-in service. Check your internet connection — some Wi-Fi networks block it; try mobile data.'
            : /email not confirmed/i.test(message)
              ? 'This account hasn’t been confirmed yet. Ask the developer to activate it.'
              : message || 'Could not sign in'
      )
    } finally {
      setLoading(false)
    }
  }

  const handleForgotPassword = async () => {
    setError('')
    setSuccess('')
    if (!email.trim()) {
      setError('Enter your email address above, then choose “Forgot password?” again.')
      return
    }
    setResetting(true)
    try {
      await resetPassword(email.trim())
      setSuccess(`If an account exists for ${email.trim()}, we’ve sent a link to reset your password.`)
    } catch {
      setError('We couldn’t send the reset email — please try again later.')
    } finally {
      setResetting(false)
    }
  }

  if (FRONTEND_ONLY) {
    return <Notice>Sign-in is turned off while the site runs without Supabase.</Notice>
  }

  return (
    <div className="space-y-5">
      <button
        type="button"
        onClick={handleGoogleSignIn}
        disabled={googleLoading}
        className="w-full min-h-14 flex items-center justify-center gap-3 rounded-full border border-border bg-white text-base font-semibold text-ink shadow-sm hover:bg-canvas transition-colors disabled:opacity-60"
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24" aria-hidden="true">
          <path fill="#4285F4" d="M21.6 12.23c0-.68-.06-1.36-.18-2.02H12v3.83h5.39a4.6 4.6 0 0 1-2 3.02v2.5h3.23c1.9-1.75 2.98-4.32 2.98-7.33Z" />
          <path fill="#34A853" d="M12 22c2.7 0 4.96-.9 6.62-2.43l-3.23-2.5c-.9.6-2.04.95-3.39.95-2.6 0-4.81-1.76-5.6-4.12H3.07v2.58A10 10 0 0 0 12 22Z" />
          <path fill="#FBBC05" d="M6.4 13.9a6 6 0 0 1 0-3.8V7.52H3.07a10 10 0 0 0 0 8.96L6.4 13.9Z" />
          <path fill="#EA4335" d="M12 5.98c1.47 0 2.79.5 3.83 1.5l2.86-2.86A9.6 9.6 0 0 0 12 2a10 10 0 0 0-8.93 5.52L6.4 10.1C7.19 7.74 9.4 5.98 12 5.98Z" />
        </svg>
        {googleLoading ? 'Opening Google…' : 'Continue with Google'}
      </button>
      <p className="text-center text-sm text-muted-foreground">
        New here? Continue with Google and your account is created for you. It works in The Haven app too.
      </p>

      {error && !showLeadership && <Notice tone="error">{error}</Notice>}

      <div className="rounded-2xl border border-border bg-white">
        <button
          type="button"
          onClick={() => setShowLeadership((v) => !v)}
          aria-expanded={showLeadership}
          className="flex w-full items-center gap-3 px-4 py-3.5 text-left"
        >
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-navy-soft text-navy">
            <ShieldCheck className="h-[18px] w-[18px]" />
          </span>
          <span className="flex-1">
            <span className="block text-sm font-bold text-ink">Leadership sign-in</span>
            <span className="block text-xs text-muted-foreground">PCM executive, committee and band heads</span>
          </span>
          <ChevronDown className={cn('h-4 w-4 text-navy transition-transform', showLeadership && 'rotate-180')} />
        </button>

        {showLeadership && (
          <form onSubmit={handleSubmit} className="space-y-4 border-t border-border px-4 pt-4 pb-5">
            <div>
              <label htmlFor="email" className={labelClass}>Email</label>
              <input
                type="email"
                id="email"
                autoComplete="username"
                autoCapitalize="none"
                autoCorrect="off"
                spellCheck={false}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className={fieldClass}
                placeholder="you@thehaven.test"
              />
            </div>
            <div>
              <label htmlFor="password" className={labelClass}>Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className={`${fieldClass} pr-12`}
                  placeholder="Your issued password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-ink"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {error && <Notice tone="error">{error}</Notice>}
            {success && <Notice tone="success">{success}</Notice>}

            <Button type="submit" size="lg" disabled={loading} className="w-full">
              {loading ? 'Signing in…' : 'Sign in'}
            </Button>
            <button
              type="button"
              onClick={handleForgotPassword}
              disabled={resetting}
              className="block w-full text-center text-sm font-semibold text-navy hover:text-navy-deep disabled:opacity-60"
            >
              {resetting ? 'Sending reset link…' : 'Forgot password?'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
