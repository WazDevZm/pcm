"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { resetPassword, signIn, signUp } from '@/lib/auth'
import { supabase } from '@/lib/supabase'
import { FRONTEND_ONLY } from '@/lib/config'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Mail, Lock, User, Eye, EyeOff, Users, Crown } from 'lucide-react'

interface LoginFormProps {
  /** Where to go after signing in (e.g. the page that sent the user to /login) */
  next?: string
}

export function LoginForm({ next }: LoginFormProps) {
  const router = useRouter()
  const [isLogin, setIsLogin] = useState(true)
  const [loginType, setLoginType] = useState<'member' | 'leader'>('member')
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
    role: 'student' as 'student' | 'leader'
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
        router.push(safeNext ?? (loginType === 'leader' ? '/band-admin' : '/member-dashboard'))
      } else {
        const role = loginType === 'leader' ? 'leader' : 'student'
        await signUp(formData.email, formData.password, formData.name, role)
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
      setError('Enter your email address above, then tap "Forgot your password?" again.')
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
      <div className="w-full max-w-md mx-auto text-center rounded-2xl bg-white/5 ring-1 ring-white/10 p-8">
        <h2 className="text-2xl font-bold text-white mb-3">Login unavailable</h2>
        <p className="text-white/70 text-sm mb-6 leading-relaxed">
          The site is running in frontend-only mode. Member login and admin auth are
          turned off until Supabase is connected.
        </p>
        <Button asChild className="rounded-full bg-white text-black">
          <Link href="/">Back to home</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">
          {isLogin ? 'Welcome Back' : 'Join Our Ministry'}
        </h2>
        <p className="text-white/70">
          {isLogin ? 'Sign in to your account' : 'Create your account to get started'}
        </p>
      </div>

      {/* Login Type Toggle */}
      {isLogin && (
        <div className="flex gap-2 mb-6 p-1 bg-white/5 rounded-lg">
          <button
            type="button"
            onClick={() => setLoginType('member')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-md text-sm font-medium transition-all ${
              loginType === 'member'
                ? 'bg-white text-black'
                : 'text-white/70 hover:text-white hover:bg-white/10'
            }`}
          >
            <Users className="w-4 h-4" />
            Member Login
          </button>
          <button
            type="button"
            onClick={() => setLoginType('leader')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-md text-sm font-medium transition-all ${
              loginType === 'leader'
                ? 'bg-white text-black'
                : 'text-white/70 hover:text-white hover:bg-white/10'
            }`}
          >
            <Crown className="w-4 h-4" />
            Leader Login
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {!isLogin && (
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-white/90 mb-2">
              Full Name
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/50" />
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required={!isLogin}
                className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-transparent"
                placeholder="Enter your full name"
              />
            </div>
          </div>
        )}

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-white/90 mb-2">
            Email Address
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/50" />
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-transparent"
              placeholder="Enter your email"
            />
          </div>
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-white/90 mb-2">
            Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/50" />
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              required
              className="w-full pl-10 pr-12 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-transparent"
              placeholder="Enter your password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/50 hover:text-white/70"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {error && (
          <div className="p-3 bg-red-500/20 border border-red-500/30 rounded-lg text-red-200 text-sm">
            {error}
          </div>
        )}

        {success && (
          <div className="p-3 bg-green-500/20 border border-green-500/30 rounded-lg text-green-200 text-sm">
            {success}
          </div>
        )}

        <Button
          type="submit"
          disabled={loading}
          className="w-full bg-white text-black hover:bg-white/90 rounded-lg py-3 font-semibold"
        >
          {loading ? 'Please wait...' : (isLogin ? `${loginType === 'leader' ? 'Leader' : 'Member'} Sign In` : 'Create Account')}
        </Button>
      </form>

      <div className="flex items-center gap-3 my-6">
        <div className="h-px flex-1 bg-white/15" />
        <span className="text-xs uppercase tracking-wider text-white/50">or</span>
        <div className="h-px flex-1 bg-white/15" />
      </div>

      <button
        type="button"
        onClick={handleGoogleSignIn}
        disabled={googleLoading}
        className="w-full flex items-center justify-center gap-3 py-3 rounded-lg bg-white/10 border border-white/20 text-white font-medium hover:bg-white/15 transition-colors disabled:opacity-60"
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24" aria-hidden="true">
          <path fill="#EA4335" d="M12 10.2v3.9h5.5c-.24 1.4-1.66 4.1-5.5 4.1-3.31 0-6-2.74-6-6.2s2.69-6.2 6-6.2c1.88 0 3.15.8 3.87 1.49l2.64-2.54C16.84 3.2 14.65 2.2 12 2.2 6.48 2.2 2 6.68 2 12s4.48 9.8 10 9.8c5.77 0 9.6-4.06 9.6-9.77 0-.66-.07-1.16-.16-1.66H12z" />
        </svg>
        {googleLoading ? 'Redirecting…' : 'Continue with Google'}
      </button>

      <div className="mt-6 text-center">
        <button
          onClick={() => setIsLogin(!isLogin)}
          className="text-white/70 hover:text-white text-sm"
        >
          {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
        </button>
      </div>

      {isLogin && (
        <div className="mt-4 text-center">
          <button
            type="button"
            onClick={handleForgotPassword}
            disabled={resetting}
            className="text-white/70 hover:text-white text-sm disabled:opacity-60"
          >
            {resetting ? 'Sending reset link…' : 'Forgot your password?'}
          </button>
        </div>
      )}
    </div>
  )
}