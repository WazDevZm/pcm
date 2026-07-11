import { supabase } from './supabase'
import type { Band, BandAnnouncement, Event } from './supabase'
import { isSupabaseConfigured } from './supabase-server'
import { FRONTEND_ONLY } from './config'
import {
  DEFAULT_BANDS,
  DEFAULT_BAND_ANNOUNCEMENTS,
  getDefaultBandBySlug,
} from './bands-data'

export async function getBands(): Promise<Band[]> {
  if (!isSupabaseConfigured()) return DEFAULT_BANDS

  try {
    if (!supabase) return DEFAULT_BANDS
    const { data, error } = await supabase
      .from('committees')
      .select('*')
      .eq('is_band', true)
      .order('sort_order', { ascending: true })

    if (error) throw error
    if (!data?.length) return DEFAULT_BANDS
    return data as Band[]
  } catch {
    return DEFAULT_BANDS
  }
}

export async function getBandBySlug(slug: string): Promise<Band | null> {
  if (!isSupabaseConfigured()) {
    return getDefaultBandBySlug(slug) ?? null
  }

  try {
    if (!supabase) return getDefaultBandBySlug(slug) ?? null
    const { data, error } = await supabase
      .from('committees')
      .select('*')
      .eq('slug', slug)
      .single()

    if (error) throw error
    return data as Band
  } catch {
    return getDefaultBandBySlug(slug) ?? null
  }
}

export async function getBandAnnouncements(
  committeeId: string,
  slug?: string
): Promise<BandAnnouncement[]> {
  if (!isSupabaseConfigured()) {
    if (slug && DEFAULT_BAND_ANNOUNCEMENTS[slug]) {
      return DEFAULT_BAND_ANNOUNCEMENTS[slug]
    }
    return []
  }

  try {
    if (!supabase) {
      if (slug && DEFAULT_BAND_ANNOUNCEMENTS[slug]) return DEFAULT_BAND_ANNOUNCEMENTS[slug]
      return []
    }
    const { data, error } = await supabase
      .from('band_announcements')
      .select('*')
      .eq('committee_id', committeeId)
      .order('published_at', { ascending: false })
      .limit(20)

    if (error) throw error
    return (data as BandAnnouncement[]) ?? []
  } catch {
    if (slug && DEFAULT_BAND_ANNOUNCEMENTS[slug]) {
      return DEFAULT_BAND_ANNOUNCEMENTS[slug]
    }
    return []
  }
}

export async function getBandEvents(committeeId: string): Promise<Event[]> {
  if (!isSupabaseConfigured()) return []

  try {
    if (!supabase) return []
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .eq('committee_id', committeeId)
      .gte('date', new Date().toISOString())
      .order('date', { ascending: true })
      .limit(10)

    if (error) throw error
    return (data as Event[]) ?? []
  } catch {
    return []
  }
}

export async function createBandAnnouncement(
  announcement: Omit<BandAnnouncement, 'id' | 'created_at' | 'updated_at'>
) {
  if (!supabase) {
    const now = new Date().toISOString()
    return {
      ...announcement,
      id: `local-${Date.now()}`,
      created_at: now,
      updated_at: now,
    } as BandAnnouncement
  }
  const { data, error } = await supabase
    .from('band_announcements')
    .insert(announcement)
    .select()
    .single()

  if (error) throw error
  return data as BandAnnouncement
}

export async function updateBandAnnouncement(
  id: string,
  updates: Partial<BandAnnouncement>
) {
  if (!supabase) {
    return { id, ...updates } as BandAnnouncement
  }
  const { data, error } = await supabase
    .from('band_announcements')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data as BandAnnouncement
}

export async function deleteBandAnnouncement(id: string) {
  if (!supabase) return
  const { error } = await supabase.from('band_announcements').delete().eq('id', id)
  if (error) throw error
}

export async function updateBand(id: string, updates: Partial<Band>) {
  if (!supabase) {
    const base = DEFAULT_BANDS.find((b) => b.id === id) ?? DEFAULT_BANDS[0]
    return { ...base, ...updates } as Band
  }
  const { data, error } = await supabase
    .from('committees')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data as Band
}

export async function createBandEvent(
  event: Omit<Event, 'id' | 'created_at' | 'updated_at' | 'current_attendees'>
) {
  if (!supabase) {
    const now = new Date().toISOString()
    return {
      ...event,
      id: `local-event-${Date.now()}`,
      current_attendees: 0,
      created_at: now,
      updated_at: now,
    } as Event
  }
  const { data, error } = await supabase
    .from('events')
    .insert({ ...event, current_attendees: 0 })
    .select()
    .single()

  if (error) throw error
  return data as Event
}

export async function updateBandEvent(id: string, updates: Partial<Event>) {
  if (!supabase) return { id, ...updates } as Event
  const { data, error } = await supabase
    .from('events')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data as Event
}

export async function deleteBandEvent(id: string) {
  if (!supabase) return
  const { error } = await supabase.from('events').delete().eq('id', id)
  if (error) throw error
}

export async function getUserBandAdminSlugs(userId: string): Promise<string[]> {
  if (!isSupabaseConfigured()) {
    return DEFAULT_BANDS.map((b) => b.slug!).filter(Boolean)
  }

  try {
    if (!supabase) return DEFAULT_BANDS.map((b) => b.slug!).filter(Boolean)
    const { data: adminRows } = await supabase
      .from('band_admins')
      .select('committee_id')
      .eq('user_id', userId)

    const { data: leaderRows } = await supabase
      .from('committees')
      .select('slug')
      .eq('leader_id', userId)
      .not('slug', 'is', null)

    const committeeIds = (adminRows ?? []).map((r) => r.committee_id)
    let adminSlugs: string[] = []

    if (committeeIds.length) {
      const { data: committees } = await supabase
        .from('committees')
        .select('slug')
        .in('id', committeeIds)
      adminSlugs = (committees ?? []).map((c) => c.slug).filter(Boolean)
    }

    const leaderSlugs = (leaderRows ?? []).map((c) => c.slug).filter(Boolean)
    return [...new Set([...adminSlugs, ...leaderSlugs])]
  } catch {
    return []
  }
}

export async function canManageBand(
  userId: string,
  bandId: string,
  role?: string
): Promise<boolean> {
  if (FRONTEND_ONLY || !isSupabaseConfigured()) return true
  if (role === 'admin') return true
  if (!supabase) return true

  const { data: band } = await supabase
    .from('committees')
    .select('leader_id')
    .eq('id', bandId)
    .single()

  if (band?.leader_id === userId) return true

  const { data: admin } = await supabase
    .from('band_admins')
    .select('id')
    .eq('committee_id', bandId)
    .eq('user_id', userId)
    .maybeSingle()

  return Boolean(admin)
}
