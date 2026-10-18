/**
 * Read helpers for public content pages (events, news, gallery, resources, committees).
 *
 * Every reader returns `null` when Supabase is unavailable, the table is missing,
 * the query errors, or no rows come back — callers then render their static FALLBACK.
 */
import type { SupabaseClient } from '@supabase/supabase-js'
import { supabase as browserClient } from '@/lib/supabase'
import type { Committee, Event, GalleryItem, Post, Resource } from '@/lib/supabase'

type Client = SupabaseClient | null

function isConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  return Boolean(url && key && !url.includes('placeholder'))
}

async function readRows<T>(
  client: Client,
  run: (c: SupabaseClient) => PromiseLike<{ data: unknown; error: unknown }>
): Promise<T[] | null> {
  if (!client || !isConfigured()) return null
  try {
    const { data, error } = await run(client)
    if (error || !Array.isArray(data) || data.length === 0) return null
    return data as T[]
  } catch {
    return null
  }
}

export function getUpcomingEvents(client: Client = browserClient) {
  return readRows<Event>(client, (c) =>
    c
      .from('events')
      .select('*')
      .gte('date', new Date().toISOString())
      .order('date', { ascending: true })
  )
}

export async function getEventById(id: string, client: Client = browserClient): Promise<Event | null> {
  const rows = await readRows<Event>(client, (c) => c.from('events').select('*').eq('id', id).limit(1))
  return rows?.[0] ?? null
}

export function getPosts(client: Client = browserClient) {
  return readRows<Post>(client, (c) =>
    c.from('posts').select('*').order('published_at', { ascending: false })
  )
}

export function getGalleryItems(client: Client = browserClient) {
  return readRows<GalleryItem>(client, (c) =>
    c.from('gallery_items').select('*').order('event_date', { ascending: false })
  )
}

export function getResources(client: Client = browserClient) {
  return readRows<Resource>(client, (c) =>
    c.from('resources').select('*').order('created_at', { ascending: false })
  )
}

/** Non-band committees (is_band false or null). */
export function getCommittees(client: Client = browserClient) {
  return readRows<Committee>(client, (c) =>
    c
      .from('committees')
      .select('*')
      .or('is_band.is.null,is_band.eq.false')
      .order('sort_order', { ascending: true })
      .order('name', { ascending: true })
  )
}

/* ───────────── Event RSVP (current_attendees is maintained by a DB trigger) ───────────── */

/** Event ids the user has RSVP'd to. Empty set on any failure. */
export async function getMyEventIds(userId: string, client: Client = browserClient): Promise<Set<string>> {
  const rows = await readRows<{ event_id: string }>(client, (c) =>
    c.from('event_attendees').select('event_id').eq('user_id', userId)
  )
  return new Set((rows ?? []).map((r) => r.event_id))
}

export async function rsvpToEvent(eventId: string, userId: string, client: Client = browserClient) {
  if (!client) return { error: 'Sign-in is unavailable right now.' }
  const { error } = await client.from('event_attendees').insert({ event_id: eventId, user_id: userId })
  // 23505 = already registered (unique violation) — treat as success
  if (error && error.code !== '23505') return { error: 'Could not save your RSVP. Please try again.' }
  return { error: null }
}

export async function cancelRsvp(eventId: string, userId: string, client: Client = browserClient) {
  if (!client) return { error: 'Sign-in is unavailable right now.' }
  const { error } = await client
    .from('event_attendees')
    .delete()
    .eq('event_id', eventId)
    .eq('user_id', userId)
  if (error) return { error: 'Could not cancel your RSVP. Please try again.' }
  return { error: null }
}

/* ───────────── Formatting ───────────── */

/** Use next/image optimisation only for local paths; remote DB URLs render unoptimised. */
export function isLocalImage(src: string): boolean {
  return src.startsWith('/')
}

export function formatDate(iso: string): string {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ''
  return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
}

export function formatTime(iso: string): string {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ''
  return d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
}
