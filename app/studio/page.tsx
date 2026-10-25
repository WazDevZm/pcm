'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { LayoutDashboard, LogOut, Palette } from 'lucide-react'
import { useAuth } from '@/components/auth/AuthProvider'
import { HavenMonogram } from '@/components/brand/HavenLogo'
import { Button } from '@/components/ui/button'
import { Studio } from '@/components/studio/Studio'
import { FRONTEND_ONLY } from '@/lib/config'

/** The Studio: ready-made poster templates for the Publicity Committee */
export default function StudioPage() {
  const { user, profile, loading, isPublicity, isLeader, signOut } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (FRONTEND_ONLY || loading) return
    if (!user) router.replace(`/login?next=${encodeURIComponent(pathname)}`)
    else if (profile && !isPublicity) router.replace('/member-dashboard')
  }, [user, profile, loading, isPublicity, pathname, router])

  if (!FRONTEND_ONLY && (loading || !user || !profile || !isPublicity)) {
    return (
      <div className="min-h-screen bg-canvas flex items-center justify-center">
        <HavenMonogram className="animate-pulse" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-canvas text-ink">
      <header className="relative overflow-hidden bg-navy-deep text-white">
        <div className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-gold/20 blur-3xl" aria-hidden />
        <div className="relative mx-auto max-w-7xl px-5 sm:px-6 pt-6 pb-10">
          <div className="flex items-center justify-between gap-3">
            <Link href="/admin" className="inline-flex items-center gap-1.5 text-sm font-semibold text-white/75 hover:text-white">
              <LayoutDashboard className="h-4 w-4" /> {isLeader ? 'Admin' : 'Website content'}
            </Link>
            <Button
              variant="light"
              size="sm"
              onClick={async () => {
                await signOut()
                router.push('/')
              }}
            >
              <LogOut /> Sign out
            </Button>
          </div>
          <div className="mt-8 flex items-center gap-4">
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 text-gold">
              <Palette className="h-7 w-7" />
            </span>
            <div>
              <p className="eyebrow text-gold">Publicity Committee</p>
              <h1 className="text-4xl md:text-5xl">The Studio</h1>
            </div>
          </div>
          <p className="mt-4 max-w-2xl text-white/75">
            Pick a template, type your details, add a photo and download a finished poster. The design, colours and
            the CBU SDA PCM logo are built in, so every poster looks right.
          </p>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-5 sm:px-6 py-10">
        <Studio />
      </main>
    </div>
  )
}
