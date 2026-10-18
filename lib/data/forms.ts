/**
 * Public form submissions (prayer, counseling, volunteering, pledges, merch orders).
 * Shapes match supabase/setup.sql and the mobile app (mobile/src/lib/api.ts) so both
 * clients write identical rows. Inserts never call .select(): several tables only let
 * the requester or leaders read rows back, which would make a valid insert look failed.
 */
import { supabase } from '@/lib/supabase'

export const FRIENDLY_ERROR = "We couldn't send that — please try again later."

export type PrayerCategory = 'personal' | 'family' | 'health' | 'academic' | 'ministry'
export type CounselingService = 'personal' | 'relationship' | 'academic' | 'crisis'
export type DonationType = 'monthly' | 'one_time' | 'event_sponsorship' | 'student_support'

export interface OrderItem {
  product_slug: string
  name: string
  size?: string | null
  color?: string | null
  quantity: number
  unit_price_zmw: number
}

function client() {
  if (!supabase) throw new Error(FRIENDLY_ERROR)
  return supabase
}

async function insert(table: string, row: Record<string, unknown>) {
  const { error } = await client().from(table).insert(row)
  if (error) {
    console.error(`[forms] ${table} insert failed:`, error.message)
    throw new Error(FRIENDLY_ERROR)
  }
}

/** Turns any thrown value into a message safe to show visitors */
export function friendlyError(err: unknown): string {
  return err instanceof Error && err.message ? err.message : FRIENDLY_ERROR
}

/** Same format as the mobile app's generateOrderId (mobile/src/data/merch.ts) */
export function generateOrderReference(): string {
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, '')
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase()
  return `HVN-${date}-${rand}`
}

/** RLS: status must be 'active' and user_id null or the signed-in user */
export async function submitPrayerRequest(input: {
  request: string
  category: PrayerCategory
  is_anonymous: boolean
  requester_name?: string | null
  requester_email?: string | null
  user_id?: string | null
}) {
  const row = input.is_anonymous
    ? { ...input, requester_name: null, requester_email: null, user_id: null }
    : {
        ...input,
        requester_name: input.requester_name || null,
        requester_email: input.requester_email || null,
        user_id: input.user_id || null,
      }
  await insert('prayer_requests', { ...row, status: 'active' })
}

/** RLS: status must be 'pending' and user_id null or the signed-in user */
export async function submitCounselingRequest(input: {
  name: string
  email: string
  phone?: string | null
  service_type: CounselingService
  preferred_counselor?: string | null
  message: string
  user_id?: string | null
}) {
  await insert('counseling_requests', {
    ...input,
    phone: input.phone || null,
    preferred_counselor: input.preferred_counselor || null,
    user_id: input.user_id || null,
    status: 'pending',
  })
}

/** RLS: user_id must equal auth.uid() — the visitor has to be signed in */
export async function applyToVolunteer(input: {
  user_id: string
  committee_id?: string | null
  role: string
  skills: string[]
  availability: string
  commitment_hours: number
}) {
  await insert('volunteers', { committee_id: null, ...input, status: 'pending' })
}

/** RLS: anyone may insert a pledge; only admins (and the donor, by user_id) can read it */
export async function submitPledge(input: {
  amount: number
  type: DonationType
  purpose: string
  donor_name?: string | null
  donor_email?: string | null
  is_anonymous: boolean
  user_id?: string | null
}) {
  const row = input.is_anonymous
    ? { ...input, donor_name: null, donor_email: null }
    : input
  await insert('donations', { ...row, user_id: input.user_id || null, status: 'pending' })
}

/** RLS: user_id must equal auth.uid() and status 'pending' — sign-in required */
export async function placeMerchOrder(input: {
  user_id: string
  customer_name: string
  customer_email: string
  customer_phone: string
  pickup_note?: string | null
  items: OrderItem[]
  total_zmw: number
}): Promise<{ reference: string }> {
  const reference = generateOrderReference()
  await insert('orders', { ...input, reference, status: 'pending' })
  return { reference }
}
