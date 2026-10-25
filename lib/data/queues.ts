/**
 * Admin work queues — the same reads and status changes the app makes (mobile/src/lib/api.ts),
 * so a request handled on the website shows as handled in the app and vice versa.
 */
import { supabase } from '@/lib/supabase'

function db() {
  if (!supabase) throw new Error('The database is not connected.')
  return supabase
}

async function run<T>(query: PromiseLike<{ data: unknown; error: { message: string } | null }>): Promise<T> {
  const { data, error } = await query
  if (error) throw new Error(error.message)
  return data as T
}

// ───────────────────────── Prayer ─────────────────────────

export type PrayerStatus = 'active' | 'answered' | 'archived'
export interface PrayerRow {
  id: string
  request: string
  requester_name: string | null
  requester_email: string | null
  is_anonymous: boolean
  status: PrayerStatus
  category: string
  created_at: string
}

export const getPrayers = (status: PrayerStatus) =>
  run<PrayerRow[]>(db().from('prayer_requests').select('*').eq('status', status).order('created_at', { ascending: false }))

export const setPrayerStatus = (id: string, status: PrayerStatus) =>
  run(db().from('prayer_requests').update({ status }).eq('id', id))

// ───────────────────────── Counseling ─────────────────────────

export type CounselingStatus = 'pending' | 'scheduled' | 'completed'
export interface CounselingRow {
  id: string
  name: string
  email: string
  phone: string | null
  service_type: string
  preferred_counselor: string | null
  message: string
  status: CounselingStatus
  appointment_date: string | null
  created_at: string
}

export const getCounseling = (status: CounselingStatus) =>
  run<CounselingRow[]>(
    db().from('counseling_requests').select('*').eq('status', status).order('created_at', { ascending: false })
  )

export const updateCounseling = (id: string, updates: { status?: CounselingStatus; appointment_date?: string | null }) =>
  run(db().from('counseling_requests').update(updates).eq('id', id))

// ───────────────────────── Volunteers ─────────────────────────

export type VolunteerStatus = 'pending' | 'active' | 'inactive'
export interface VolunteerRow {
  id: string
  role: string
  skills: string[] | null
  availability: string
  commitment_hours: number
  status: VolunteerStatus
  created_at: string
  user: { name: string; email: string } | null
  committee: { name: string } | null
}

export const getVolunteerQueue = (status: VolunteerStatus) =>
  run<VolunteerRow[]>(
    db()
      .from('volunteers')
      .select('*, user:users(name, email), committee:committees(name)')
      .eq('status', status)
      .order('created_at', { ascending: false })
  )

export const setVolunteerStatus = (id: string, status: VolunteerStatus) =>
  run(db().from('volunteers').update({ status }).eq('id', id))

// ───────────────────────── Merch orders ─────────────────────────

export type OrderStatus = 'pending' | 'confirmed' | 'ready' | 'collected' | 'cancelled'
export interface OrderRow {
  id: string
  reference: string
  customer_name: string
  customer_email: string
  customer_phone: string
  pickup_note: string | null
  items: { name: string; quantity: number; unit_price_zmw?: number; size?: string | null; color?: string | null }[]
  total_zmw: number
  status: OrderStatus
  created_at: string
}

export const getOrders = (status: OrderStatus) =>
  run<OrderRow[]>(db().from('orders').select('*').eq('status', status).order('created_at', { ascending: false }))

export const setOrderStatus = (id: string, status: OrderStatus) =>
  run(db().from('orders').update({ status }).eq('id', id))

// ───────────────────────── Contact messages ─────────────────────────

export interface MessageRow {
  id: string
  name: string
  email: string
  subject: string | null
  message: string
  created_at: string
}

export const getMessages = () =>
  run<MessageRow[]>(db().from('contact_submissions').select('*').order('created_at', { ascending: false }))

export const deleteMessage = (id: string) => run(db().from('contact_submissions').delete().eq('id', id))

// ───────────────────────── Band heads & members ─────────────────────────

export interface PersonRow {
  id: string
  name: string
  email: string
}

export async function getBandAdmins(bandId: string): Promise<PersonRow[]> {
  const rows = await run<{ user: PersonRow | PersonRow[] | null }[]>(
    db().from('band_admins').select('user:users(id, name, email)').eq('committee_id', bandId)
  )
  return rows.flatMap((r) => (Array.isArray(r.user) ? r.user : r.user ? [r.user] : []))
}

export const addBandAdmin = (bandId: string, userId: string) =>
  run(db().from('band_admins').insert({ committee_id: bandId, user_id: userId }))

export const removeBandAdmin = (bandId: string, userId: string) =>
  run(db().from('band_admins').delete().eq('committee_id', bandId).eq('user_id', userId))

export async function findUserByEmail(email: string): Promise<PersonRow | null> {
  const rows = await run<PersonRow[]>(
    db().from('users').select('id, name, email').ilike('email', email.trim()).limit(1)
  )
  return rows[0] ?? null
}

export interface MemberRow {
  id: string
  role: string
  joined_at: string
  user: PersonRow | null
}

export async function getBandMembers(bandId: string): Promise<MemberRow[]> {
  const rows = await run<(Omit<MemberRow, 'user'> & { user: PersonRow | PersonRow[] | null })[]>(
    db()
      .from('committee_members')
      .select('id, role, joined_at, user:users(id, name, email)')
      .eq('committee_id', bandId)
      .order('joined_at', { ascending: false })
  )
  return rows.map((r) => ({ ...r, user: Array.isArray(r.user) ? r.user[0] ?? null : r.user }))
}

export const removeBandMember = (bandId: string, userId: string) =>
  run(db().from('committee_members').delete().eq('committee_id', bandId).eq('user_id', userId))

/** Member counts per band, readable by leaders (RLS) */
export async function getMemberCounts(): Promise<Record<string, number>> {
  const rows = await run<{ committee_id: string }[]>(db().from('committee_members').select('committee_id'))
  const out: Record<string, number> = {}
  for (const r of rows) out[r.committee_id] = (out[r.committee_id] ?? 0) + 1
  return out
}

/** committee_id → heads, for the leadership overview */
export async function getAllBandAdmins(): Promise<Record<string, PersonRow[]>> {
  const rows = await run<{ committee_id: string; user: PersonRow | PersonRow[] | null }[]>(
    db().from('band_admins').select('committee_id, user:users(id, name, email)')
  )
  const out: Record<string, PersonRow[]> = {}
  for (const r of rows) {
    const users = Array.isArray(r.user) ? r.user : r.user ? [r.user] : []
    ;(out[r.committee_id] ??= []).push(...users)
  }
  return out
}
