import Link from 'next/link'
import { LoginForm } from '@/components/auth/LoginForm'
import { SiteNav } from '@/components/layout/SiteNav'

export default function LoginPage({ searchParams }: { searchParams: { next?: string } }) {
  return (
    <div className="min-h-screen bg-[#0B0F12] text-white">
      <SiteNav variant="minimal" />
      <div className="max-w-md mx-auto px-6 py-16">
        <LoginForm next={searchParams.next} />
        <p className="text-center text-white/50 text-sm mt-8">
          <Link href="/" className="hover:text-white">
            ← Back to home
          </Link>
        </p>
      </div>
    </div>
  )
}
