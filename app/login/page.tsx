import { LoginForm } from '@/components/auth/LoginForm'
import { AuthLayout } from '@/components/auth/AuthLayout'

export const metadata = { title: 'Sign in | The Haven' }

export default function LoginPage({ searchParams }: { searchParams: { next?: string; mode?: string } }) {
  const signup = searchParams.mode === 'signup'
  return (
    <AuthLayout subtitle={signup ? 'Create your account to RSVP, join bands and track your requests.' : 'Sign in to RSVP, join bands and track your requests.'}>
      <LoginForm next={searchParams.next} signup={signup} />
    </AuthLayout>
  )
}
