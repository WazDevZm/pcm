"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { resetPassword, signIn, signUp } from '@/lib/auth'
import { supabase } from '@/lib/supabase'
import { FRONTEND_ONLY } from '@/lib/config'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff } from 'lucide-react'
import { Notice, fieldClass, labelClass } from '@/components/ui/haven'

interface LoginFormProps {
  /** Start on the create-account form */
  signup?: boolean
  /** Where to go after signing in (e.g. the page that sent the user to /login) */
  next?: string
}

export function LoginForm({ next, signup = false }: LoginFormProps) {
  const router = useRouter()
  const [isLogin, setIsLogin] = useState(!signup)
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [resetting, setResetting] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      if (isLogin) {
        await signIn(formData.email, formData.password)
        setSuccess('Successfully signed in!')
        
        // Back to where the user came from, otherwise their dashboard
        const safeNext = next && next.startsWith('/') && !next.startsWith('//') ? next : null
        router.push(safeNext ?? '/member-dashboard')
      } else {
        // Everyone starts as a student; admins grant leader access
        await signUp(formData.email, formData.password, formData.name)
        setSuccess('Account created! Please check your email to verify your account.')
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleForgotPassword = async () => {
    setError('')
    setSuccess('')
    const email = formData.email.trim()
    if (!email) {
      setError('Enter your email address above, then choose "Forgot password?" again.')
      return
    }
    setResetting(true)
    try {
      await resetPassword(email)
      setSuccess(`If an account exists for ${email}, we've sent a link to reset your password. Check your inbox.`)
    } catch {
      setError("We couldn't send the reset email — please try again later.")
    } finally {
      setResetting(false)
    }
  }

  const handleGoogleSignIn = async () => {
    setError('')
    setSuccess('')
    if (!supabase) {
      setError('Sign-in is not available right now — please try again later.')
      return
    }
    setGoogleLoading(true)
    const { error: oauthError } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin },
    })
    // On success the browser navigates to Google, so only errors land here
    if (oauthError) {
      setError("We couldn't start Google sign-in — please try again later.")
      setGoogleLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  if (FRONTEND_ONLY) {
    return (
      <Notice>Sign-in is turned off while the site runs without Supabase.</Notice>
    )
  }

  return (
    <div className="space-y-5">
      <button
        type="button"
        onClick={handleGoogleSignIn}
        disabled={googleLoading}
        className="w-full min-h-12 flex items-center justify-center gap-3 rounded-full border border-border bg-white font-semibold text-ink hover:bg-canvas transition-colors disabled:opacity-60"
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24" aria-hidden="true">
          <path fill="#4285F4" d="M21.6 12.23c0-.68-.06-1.36-.18-2.02H12v3.83h5.39a4.6 4.6 0 0 1-2 3.02v2.5h3.23c1.9-1.75 2.98-4.32 2.98-7.33Z" />
          <path fill="#34A853" d="M12 22c2.7 0 4.96-.9 6.62-2.43l-3.23-2.5c-.9.6-2.04.95-3.39.95-2.6 0-4.81-1.76-5.6-4.12H3.07v2.58A10 10 0 0 0 12 22Z" />
          <path fill="#FBBC05" d="M6.4 13.9a6 6 0 0 1 0-3.8V7.52H3.07a10 10 0 0 0 0 8.96L6.4 13.9Z" />
          <path fill="#EA4335" d="M12 5.98c1.47 0 2.79.5 3.83 1.5l2.86-2.86A9.6 9.6 0 0 0 12 2a10 10 0 0 0-8.93 5.52L6.4 10.1C7.19 7.74 9.4 5.98 12 5.98Z" />
        </svg>
        {googleLoading ? 'Redirecting…' : 'Continue with Google'}
      </button>

      <div className="flex items-center gap-3">
        <div className="h-px flex-1 bg-border" />
        <span className="text-sm text-muted-foreground">or use email</span>
        <div className="h-px flex-1 bg-border" />
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {!isLogin && (
          <div>
            <label htmlFor="name" className={labelClass}>Full name</label>
            <input
              type="text"
              id="name"
              name="name"
              autoComplete="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              className={fieldClass}
              placeholder="Your name"
            />
          </div>
        )}

        <div>
          <label htmlFor="email" className={labelClass}>Email</label>
          <input
            type="email"
            id="email"
            name="email"
            autoComplete="email"
            value={formData.email}
            onChange={handleInputChange}
            required
            className={fieldClass}
            placeholder="you@example.com"
          />
        </div>

        <div>
          <label htmlFor="password" className={labelClass}>Password</label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              name="password"
              autoComplete={isLogin ? 'current-password' : 'new-password'}
              minLength={6}
              value={formData.password}
              onChange={handleInputChange}
              required
              className={`${fieldClass} pr-12`}
              placeholder="At least 6 characters"
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
          {loading ? 'Please wait…' : isLogin ? 'Sign in' : 'Create account'}
        </Button>
      </form>

      <div className="flex flex-col items-center gap-3 pt-1 text-sm font-semibold">
        <button
          type="button"
          onClick={() => {
            setIsLogin(!isLogin)
            setError('')
            setSuccess('')
          }}
          className="text-navy hover:text-navy-deep"
        >
          {isLogin ? 'New here? Create an account' : 'Already have an account? Sign in'}
        </button>
        {isLogin && (
          <button
            type="button"
            onClick={handleForgotPassword}
            disabled={resetting}
            className="text-navy hover:text-navy-deep disabled:opacity-60"
          >
            {resetting ? 'Sending reset link…' : 'Forgot password?'}
          </button>
        )}
      </div>
    </div>
  )
}
