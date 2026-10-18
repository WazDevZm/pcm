'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, Lock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { SiteNav } from '@/components/layout/SiteNav'
import { updatePassword } from '@/lib/auth'
import { supabase } from '@/lib/supabase'

const inputClass =
  'w-full pl-10 pr-12 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-transparent'

export default function ResetPasswordPage() {
  const router = useRouter()
  // 'checking' until supabase-js has read the recovery token from the URL
  const [session, setSession] = useState<'checking' | 'ready' | 'missing'>('checking')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)

  useEffect(() => {
    if (!supabase) {
      setSession('missing')
      return
    }
    let active = true
    const { data: sub } = supabase.auth.onAuthStateChange((event, s) => {
      if (!active) return
      if (s && (event === 'PASSWORD_RECOVERY' || event === 'SIGNED_IN' || event === 'INITIAL_SESSION')) {
        setSession('ready')
      }
    })
    supabase.auth.getSession().then(({ data }) => {
      if (!active) return
      setSession((prev) => (data.session ? 'ready' : prev === 'ready' ? prev : 'missing'))
    })
    return () => {
      active = false
      sub.subscription.unsubscribe()
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (password.length < 6) {
      setError('Your new password must be at least 6 characters.')
      return
    }
    if (password !== confirm) {
      setError('The passwords do not match.')
      return
    }
    setSaving(true)
    try {
      await updatePassword(password)
      setDone(true)
      setTimeout(() => router.push('/member-dashboard'), 2000)
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : ''
      setError(message || "We couldn't update your password — please try again later.")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0B0F12] text-white">
      <SiteNav variant="minimal" />
      <div className="max-w-md mx-auto px-6 py-16">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Set a new password</h1>
          <p className="text-white/70">Choose a new password for your account.</p>
        </div>

        {session === 'checking' && (
          <p className="text-center text-white/60 text-sm">Verifying your reset link…</p>
        )}

        {session === 'missing' && (
          <div className="rounded-2xl bg-white/5 ring-1 ring-white/10 p-6 text-center space-y-4">
            <p className="text-white/80 text-sm leading-relaxed">
              This reset link is invalid or has expired. Request a new one from the sign-in page using
              &ldquo;Forgot your password?&rdquo;.
            </p>
            <Button asChild className="rounded-full bg-white text-black hover:bg-white/90">
              <Link href="/login">Back to sign in</Link>
            </Button>
          </div>
        )}

        {session === 'ready' && done && (
          <div className="p-4 bg-green-500/20 border border-green-500/30 rounded-lg text-green-200 text-sm text-center">
            Your password has been updated. Taking you to your dashboard…
          </div>
        )}

        {session === 'ready' && !done && (
          <form onSubmit={handleSubmit} className="space-y-6">
            {[
              { id: 'password', label: 'New password', value: password, set: setPassword },
              { id: 'confirm', label: 'Confirm new password', value: confirm, set: setConfirm },
            ].map((field) => (
              <div key={field.id}>
                <label htmlFor={field.id} className="block text-sm font-medium text-white/90 mb-2">
                  {field.label}
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
                  <input
                    id={field.id}
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    required
                    minLength={6}
                    value={field.value}
                    onChange={(e) => field.set(e.target.value)}
                    className={inputClass}
                    placeholder={field.label}
                  />
                  {field.id === 'password' && (
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white/70"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  )}
                </div>
              </div>
            ))}

            {error && (
              <div role="alert" className="p-3 bg-red-500/20 border border-red-500/30 rounded-lg text-red-200 text-sm">
                {error}
              </div>
            )}

            <Button
              type="submit"
              disabled={saving}
              className="w-full bg-white text-black hover:bg-white/90 rounded-lg py-3 font-semibold"
            >
              {saving ? 'Saving…' : 'Update password'}
            </Button>
          </form>
        )}

        <p className="text-center text-white/50 text-sm mt-8">
          <Link href="/login" className="hover:text-white">
            ← Back to sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
