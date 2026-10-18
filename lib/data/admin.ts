/**
 * Supabase queries for the admin area and member dashboard.
 * Every function throws a readable Error when the database is unavailable,
 * so pages can show an honest error/empty state instead of fake numbers.
 */
import { supabase } from '@/lib/supabase'
import type { Event, Post, User } from '@/lib/supabase'

export type Role = User['role']

function db() {
  if (!supabase) throw new Error('The database is not connected.')
  return supabase
}

function fail(error: { message: string } | null): asserts error is null {
  if (error) throw new Error(error.message)
}

// ───────────────────────── Dashboard counts ─────────────────────────

export type AdminCountKey =
  | 'users'
  | 'posts'
  | 'upcomingEvents'
  | 'pendingPrayers'
  | 'pendingCounseling'
  | 'pendingVolunteers'
  | 'resources'
  | 'pendingOrders'

/** Each count is null when that table could not be read (missing table, RLS, offline). */
export type AdminCounts = Record<AdminCountKey, number | null>

export async function getAdminCounts(): Promise<AdminCounts> {
  const client = db()
  const now = new Date().toISOString()

  const count = async (
    table: string,
    filter?: (q: any) => any
  ): Promise<number | null> => {
    let q: any = client.from(table).select('*', { count: 'exact', head: true })
    if (filter) q = filter(q)
    const { count: n, error } = await q
    return error ? null : n ?? 0
  }

  const [users, posts, upcomingEvents, pendingPrayers, pendingCounseling, pendingVolunteers, resources, pendingOrders] =
    await Promise.all([
      count('users'),
      count('posts'),
      count('events', (q) => q.gte('date', now)),
      count('prayer_requests', (q) => q.eq('status', 'active')),
      count('counseling_requests', (q) => q.eq('status', 'pending')),
      count('volunteers', (q) => q.eq('status', 'pending')),
      count('resources'),
      count('orders', (q) => q.eq('status', 'pending')),
    ])

  return { users, posts, upcomingEvents, pendingPrayers, pendingCounseling, pendingVolunteers, resources, pendingOrders }
}

// ───────────────────────── Users & roles ─────────────────────────

export async function listUsers(search?: string): Promise<User[]> {
  let q = db().from('users').select('*').order('created_at', { ascending: false }).limit(500)
  const term = search?.trim().replace(/[%,()]/g, ' ')
  if (term) q = q.or(`name.ilike.%${term}%,email.ilike.%${term}%`)
  const { data, error } = await q
  fail(error)
  return (data ?? []) as User[]
}

export async function setUserRole(userId: string, role: Role): Promise<User> {
  const { data, error } = await db().from('users').update({ role }).eq('id', userId).select().single()
  fail(error)
  return data as User
}

/** user_id → names of the bands/committees they administer */
export async function getBandAdminAssignments(): Promise<Record<string, string[]>> {
  const { data, error } = await db().from('band_admins').select('user_id, committee:committees(name)')
  fail(error)
  const map: Record<string, string[]> = {}
  for (const row of (data ?? []) as any[]) {
    const committee = Array.isArray(row.committee) ? row.committee[0] : row.committee
    if (!committee?.name) continue
    ;(map[row.user_id] ??= []).push(committee.name)
  }
  return map
}

// ───────────────────────── Posts & events ─────────────────────────

export type AdminPost = Post & { author?: { name: string } | null }

export async function listPosts(): Promise<AdminPost[]> {
  const { data, error } = await db()
    .from('posts')
    .select('*, author:users(name)')
    .order('published_at', { ascending: false })
  fail(error)
  return (data ?? []) as AdminPost[]
}

export async function deletePost(id: string) {
  const { error } = await db().from('posts').delete().eq('id', id)
  fail(error)
}

export async function listEvents(): Promise<Event[]> {
  const { data, error } = await db().from('events').select('*').order('date', { ascending: false })
  fail(error)
  return (data ?? []) as Event[]
}

export async function deleteEvent(id: string) {
  const { error } = await db().from('events').delete().eq('id', id)
  fail(error)
}

// ───────────────────────── Media uploads ─────────────────────────

function randomId() {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) return crypto.randomUUID()
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`
}

/** Uploads to the public `media` bucket (leaders only) and returns the public URL. */
export async function uploadMedia(file: File, folder: string): Promise<string> {
  const client = db()
  const ext = (file.name.split('.').pop() || 'bin').toLowerCase().replace(/[^a-z0-9]/g, '') || 'bin'
  const path = `${folder}/${randomId()}.${ext}`
  const { error } = await client.storage.from('media').upload(path, file, {
    cacheControl: '3600',
    upsert: false,
    contentType: file.type || undefined,
  })
  fail(error)
  return client.storage.from('media').getPublicUrl(path).data.publicUrl
}

// ───────────────────────── Member dashboard ─────────────────────────

export interface MemberOrderItem {
  name: string
  size?: string | null
  color?: string | null
  quantity: number
  unit_price_zmw: number
}

export interface MemberData {
  rsvps: Pick<Event, 'id' | 'title' | 'date' | 'location'>[]
  bands: { id: string; name: string; slug?: string | null; role: string }[]
  prayers: { id: string; request: string; status: string; category: string; created_at: string }[]
  counseling: { id: string; service_type: string; status: string; appointment_date?: string | null; created_at: string }[]
  volunteering: { id: string; role: string; status: string; committee_name: string | null; created_at: string }[]
  orders: { id: string; reference: string; status: string; total_zmw: number; items: MemberOrderItem[]; created_at: string }[]
  /** Sections that failed to load (e.g. table not created yet) */
  errors: string[]
}

const one = (v: any) => (Array.isArray(v) ? v[0] : v)

export async function getMemberData(userId: string): Promise<MemberData> {
  const client = db()
  const errors: string[] = []
  const settle = async <T,>(label: string, run: () => Promise<T>, fallback: T): Promise<T> => {
    try {
      return await run()
    } catch {
      errors.push(label)
      return fallback
    }
  }
  const rows = async (q: any) => {
    const { data, error } = await q
    fail(error)
    return (data ?? []) as any[]
  }

  const [rsvps, bands, prayers, counseling, volunteering, orders] = await Promise.all([
    settle(
      'event RSVPs',
      async () =>
        (await rows(client.from('event_attendees').select('event:events(id, title, date, location)').eq('user_id', userId)))
          .map((r) => one(r.event))
          .filter(Boolean)
          .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()),
      [] as MemberData['rsvps']
    ),
    settle(
      'bands',
      async () =>
        (await rows(client.from('committee_members').select('role, committee:committees(id, name, slug)').eq('user_id', userId)))
          .map((r) => {
            const c = one(r.committee)
            return c ? { id: c.id, name: c.name, slug: c.slug, role: r.role ?? 'member' } : null
          })
          .filter(Boolean) as MemberData['bands'],
      [] as MemberData['bands']
    ),
    settle(
      'prayer requests',
      () =>
        rows(
          client
            .from('prayer_requests')
            .select('id, request, status, category, created_at')
            .eq('user_id', userId)
            .order('created_at', { ascending: false })
        ),
      [] as MemberData['prayers']
    ),
    settle(
      'counseling requests',
      () =>
        rows(
          client
            .from('counseling_requests')
            .select('id, service_type, status, appointment_date, created_at')
            .eq('user_id', userId)
            .order('created_at', { ascending: false })
        ),
      [] as MemberData['counseling']
    ),
    settle(
      'volunteer applications',
      async () =>
        (
          await rows(
            client
              .from('volunteers')
              .select('id, role, status, created_at, committee:committees(name)')
              .eq('user_id', userId)
              .order('created_at', { ascending: false })
          )
        ).map((r) => ({ id: r.id, role: r.role, status: r.status, created_at: r.created_at, committee_name: one(r.committee)?.name ?? null })),
      [] as MemberData['volunteering']
    ),
    settle(
      'orders',
      () =>
        rows(
          client
            .from('orders')
            .select('id, reference, status, total_zmw, items, created_at')
            .eq('user_id', userId)
            .order('created_at', { ascending: false })
        ),
      [] as MemberData['orders']
    ),
  ])

  return { rsvps, bands, prayers, counseling, volunteering, orders, errors }
}

export async function updateMyProfile(userId: string, updates: { name: string; phone: string | null }) {
  const { error } = await db().from('users').update(updates).eq('id', userId)
  fail(error)
}

// ───────────────────────── Band admin ─────────────────────────

/** Real member/volunteer counts for one band; null when not readable (RLS or missing table). */
export async function getBandCounts(bandId: string): Promise<{ members: number | null; activeVolunteers: number | null }> {
  if (!supabase) return { members: null, activeVolunteers: null }
  const [members, volunteers] = await Promise.all([
    supabase.rpc('band_member_count', { band: bandId }),
    supabase
      .from('volunteers')
      .select('*', { count: 'exact', head: true })
      .eq('committee_id', bandId)
      .eq('status', 'active'),
  ])
  return {
    members: members.error || typeof members.data !== 'number' ? null : members.data,
    activeVolunteers: volunteers.error ? null : volunteers.count ?? 0,
  }
}
