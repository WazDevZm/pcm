'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/components/auth/AuthProvider'
import { getBands, getUserBandAdminSlugs } from '@/lib/bands'
import type { Band } from '@/lib/supabase'
import { DEFAULT_BANDS } from '@/lib/bands-data'
import { FRONTEND_ONLY } from '@/lib/config'
import { LayoutDashboard, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function BandAdminIndexPage() {
  const { user, profile, loading, signOut } = useAuth()
  const router = useRouter()
  const [bands, setBands] = useState<Band[]>([])
  const [allowedSlugs, setAllowedSlugs] = useState<string[]>([])
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (loading) return
    if (!FRONTEND_ONLY && !user) {
      router.push('/login?next=/band-admin')
      return
    }

    async function load() {
      const allBands = await getBands()
      setBands(allBands)

      if (FRONTEND_ONLY || profile?.role === 'admin') {
        setAllowedSlugs(allBands.map((b) => b.slug!).filter(Boolean))
      } else if (user) {
        const slugs = await getUserBandAdminSlugs(user.id)
        setAllowedSlugs(slugs.length ? slugs : [])
      }
      setReady(true)
    }

    load()
  }, [user, profile, loading, router])

  if (loading || !ready) {
    return (
      <div className="min-h-screen bg-canvas flex items-center justify-center text-ink">
        <div className="animate-pulse">Loading...</div>
      </div>
    )
  }

  const manageable = bands.filter((b) => b.slug && allowedSlugs.includes(b.slug))

  return (
    <div className="min-h-screen bg-canvas text-ink p-6 md:p-10">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <LayoutDashboard className="w-8 h-8" />
              Band Admin
            </h1>
            <p className="text-muted-foreground mt-1">Manage your band or committee page</p>
          </div>
          <div className="flex gap-2">
            <Button asChild variant="outline" className="border-border bg-transparent">
              <Link href="/">Site</Link>
            </Button>
            <Button onClick={signOut} variant="outline" className="border-red-200 text-red-700">
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {profile?.role === 'admin' && (
          <p className="mb-6 text-sm text-amber-700 rounded-lg bg-amber-50 p-3 ring-1 ring-amber-200">
            You have site admin access and can manage all bands.
          </p>
        )}

        {manageable.length === 0 ? (
          <div className="rounded-2xl bg-white ring-1 ring-border p-8 text-center">
            <p className="text-muted-foreground mb-4">
              You are not assigned as a band leader yet. Contact the ministry admin to get access.
            </p>
            <p className="text-sm text-muted-foreground">
              Available bands: {DEFAULT_BANDS.map((b) => b.name).join(', ')}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {manageable.map((band) => (
              <Link
                key={band.id}
                href={`/band-admin/${band.slug}`}
                className="block rounded-2xl bg-white ring-1 ring-border p-6 hover:bg-muted transition-colors"
              >
                <h2 className="text-xl font-semibold">{band.name}</h2>
                <p className="text-muted-foreground text-sm mt-1">Edit announcements, events, and leadership info</p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
