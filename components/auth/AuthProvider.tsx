'use client'

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { FRONTEND_ONLY } from '@/lib/config'
import { supabase } from '@/lib/supabase'

export type AuthUser = { id: string; email?: string } | null

export type UserProfile = {
  id: string
  email: string
  name: string
  role: 'student' | 'leader' | 'admin'
  /** Named leadership office (admins only) — set by an admin or scripts/admin/provision.mjs */
  office?: 'developer' | 'chairperson' | 'vice_chairperson' | null
  phone?: string
  created_at: string
  updated_at: string
} | null

interface AuthContextType {
  user: AuthUser
  profile: UserProfile
  loading: boolean
  isLeader: boolean
  isAdmin: boolean
  isDeveloper: boolean
  /** Slugs of the bands/committees this user runs (band_admins or band leader) */
  managedBands: string[]
  /** Can manage site content: leaders/admins and Publicity Committee admins */
  isPublicity: boolean
  refreshProfile: () => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

/** Supabase session + profile row (public.users), shared with the mobile app */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser>(null)
  const [profile, setProfile] = useState<UserProfile>(null)
  const [loading, setLoading] = useState(!FRONTEND_ONLY && Boolean(supabase))
  const [managedBands, setManagedBands] = useState<string[]>([])

  const loadProfile = useCallback(async (userId: string | undefined) => {
    if (!supabase || !userId) {
      setProfile(null)
      setManagedBands([])
      return
    }
    const client = supabase
    const loadBands = async () => {
      const [admins, led] = await Promise.all([
        client.from('band_admins').select('committee:committees(slug)').eq('user_id', userId),
        client.from('committees').select('slug').eq('leader_id', userId),
      ])
      const slugs = [
        ...((admins.data ?? []) as { committee: { slug: string | null } | { slug: string | null }[] | null }[]).flatMap((r) =>
          (Array.isArray(r.committee) ? r.committee : [r.committee]).map((c) => c?.slug)
        ),
        ...((led.data ?? []) as { slug: string | null }[]).map((c) => c.slug),
      ]
      setManagedBands([...new Set(slugs.filter((s): s is string => Boolean(s)))])
    }
    loadBands()
    // The profile row is created by a database trigger; retry briefly right after sign-up
    for (let attempt = 0; attempt < 3; attempt++) {
      const { data } = await supabase.from('users').select('*').eq('id', userId).maybeSingle()
      if (data) {
        setProfile(data as UserProfile)
        return
      }
      await new Promise((r) => setTimeout(r, 600))
    }
    setProfile(null)
  }, [])

  useEffect(() => {
    if (FRONTEND_ONLY || !supabase) return
    const client = supabase

    client.auth.getSession().then(async ({ data }) => {
      const u = data.session?.user
      setUser(u ? { id: u.id, email: u.email } : null)
      await loadProfile(u?.id)
      setLoading(false)
    })

    const { data: sub } = client.auth.onAuthStateChange((_event, session) => {
      const u = session?.user
      setUser(u ? { id: u.id, email: u.email } : null)
      // Defer Supabase calls out of the auth callback to avoid a client deadlock
      setTimeout(() => loadProfile(u?.id), 0)
    })
    return () => sub.subscription.unsubscribe()
  }, [loadProfile])

  const value = useMemo<AuthContextType>(
    () => ({
      user,
      profile,
      loading,
      isLeader: profile?.role === 'leader' || profile?.role === 'admin',
      isAdmin: profile?.role === 'admin',
      isDeveloper: profile?.role === 'admin' && profile?.office === 'developer',
      managedBands,
      isPublicity:
        profile?.role === 'leader' || profile?.role === 'admin' || managedBands.includes('publicity-committee'),
      refreshProfile: () => loadProfile(user?.id),
      signOut: async () => {
        await supabase?.auth.signOut()
        setUser(null)
        setProfile(null)
        setManagedBands([])
      },
    }),
    [user, profile, loading, loadProfile, managedBands]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
