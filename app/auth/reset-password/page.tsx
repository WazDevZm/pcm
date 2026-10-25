'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { AuthLayout } from '@/components/auth/AuthLayout'
import { Notice, fieldClass, labelClass } from '@/components/ui/haven'
import { updatePassword } from '@/lib/auth'
import { supabase } from '@/lib/supabase'

const inputClass = `${fieldClass} pr-12`

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
    <AuthLayout subtitle="Choose a new password for your account.">
      {session === 'checking' && <p className="text-center text-muted-foreground text-sm">Verifying your reset link…</p>}

      {session === 'missing' && (
        <div className="space-y-4 text-center">
          <Notice tone="error">
            This reset link is invalid or has expired. Request a new one from the sign-in page using &ldquo;Forgot password?&rdquo;.
          </Notice>
          <Button asChild size="lg" className="w-full">
            <Link href="/login">Back to sign in</Link>
          </Button>
        </div>
      )}

      {session === 'ready' && done && <Notice tone="success">Your password has been updated. Taking you to your dashboard…</Notice>}

      {session === 'ready' && !done && (
        <form onSubmit={handleSubmit} className="space-y-4">
          {[
            { id: 'password', label: 'New password', value: password, set: setPassword },
            { id: 'confirm', label: 'Confirm new password', value: confirm, set: setConfirm },
          ].map((field) => (
            <div key={field.id}>
              <label htmlFor={field.id} className={labelClass}>
                {field.label}
              </label>
              <div className="relative">
                <input
                  id={field.id}
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  minLength={6}
                  value={field.value}
                  onChange={(e) => field.set(e.target.value)}
                  className={inputClass}
                  placeholder="At least 6 characters"
                />
                {field.id === 'password' && (
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-ink"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                )}
              </div>
            </div>
          ))}

          {error && <Notice tone="error">{error}</Notice>}

          <Button type="submit" size="lg" disabled={saving} className="w-full">
            {saving ? 'Saving…' : 'Update password'}
          </Button>
        </form>
      )}
    </AuthLayout>
  )
}
