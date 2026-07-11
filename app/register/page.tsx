'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { RegisterForm } from '@/components/auth/RegisterForm'
import { SiteNav } from '@/components/layout/SiteNav'

export default function RegisterPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-[#0B0F12] text-white">
      <SiteNav variant="minimal" />
      <div className="max-w-md mx-auto px-6 py-16">
        <RegisterForm onClose={() => router.push('/')} />
        <p className="text-center text-white/50 text-sm mt-8">
          Already have an account?{' '}
          <Link href="/login" className="hover:text-white">
            Sign in
          </Link>
        </p>
        <p className="text-center text-white/50 text-sm mt-2">
          <Link href="/" className="hover:text-white">
            ← Back to home
          </Link>
        </p>
      </div>
    </div>
  )
}
