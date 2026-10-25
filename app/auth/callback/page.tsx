'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { AuthLayout } from '@/components/auth/AuthLayout'
import { Button } from '@/components/ui/button'
import { Notice } from '@/components/ui/haven'
import { supabase } from '@/lib/supabase'

/**
 * Where Google sign-in and email links return to. supabase-js reads the session from the URL;
 * this page waits for it, reports any error, then continues to `next`.
 */
export default function AuthCallbackPage() {
  const router = useRouter()
  const [error, setError] = useState('')

  useEffect(() => {
    const url = new URL(window.location.href)
    const hash = new URLSearchParams(url.hash.slice(1))
    const next = url.searchParams.get('next')
    const target = next && next.startsWith('/') && !next.startsWith('//') ? next : '/member-dashboard'
    const problem = hash.get('error_description') || url.searchParams.get('error_description')
    if (problem) {
      setError(problem.replace(/\+/g, ' '))
      return
    }
    if (!supabase) {
      setError('Sign-in is not available right now.')
      return
    }
    const client = supabase
    let done = false
    const finish = (welcome: boolean) => {
      if (done) return
      done = true
      if (welcome) toast.success('Welcome to The Haven — your email is confirmed')
      router.replace(target)
    }
    const isSignup = hash.get('type') === 'signup'
    const { data: sub } = client.auth.onAuthStateChange((_e, session) => session && finish(isSignup))
    client.auth.getSession().then(({ data }) => data.session && finish(isSignup))
    const timer = setTimeout(() => {
      if (!done) setError('We couldn’t finish signing you in. The link may have expired — please try again.')
    }, 10000)
    return () => {
      clearTimeout(timer)
      sub.subscription.unsubscribe()
    }
  }, [router])

  return (
    <AuthLayout subtitle={error ? undefined : 'Signing you in…'}>
      {error ? (
        <div className="space-y-4">
          <Notice tone="error">{error}</Notice>
          <Button asChild size="lg" className="w-full">
            <Link href="/login">Back to sign in</Link>
          </Button>
        </div>
      ) : (
        <div className="flex justify-center py-6">
          <span className="h-8 w-8 animate-spin rounded-full border-4 border-navy-soft border-t-navy" />
        </div>
      )}
    </AuthLayout>
  )
}
