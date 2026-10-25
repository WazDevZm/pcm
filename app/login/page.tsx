import { LoginForm } from '@/components/auth/LoginForm'
import { AuthLayout } from '@/components/auth/AuthLayout'

export const metadata = { title: 'Sign in | The Haven' }

export default function LoginPage({ searchParams }: { searchParams: { next?: string; as?: string } }) {
  return (
    <AuthLayout subtitle="Sign in to RSVP, join bands and track your requests.">
      <LoginForm next={searchParams.next} leadership={searchParams.as === 'leader'} />
    </AuthLayout>
  )
}
