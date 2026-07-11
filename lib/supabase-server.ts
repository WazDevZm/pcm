import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import { FRONTEND_ONLY } from './config'

export function createServerSupabase(): SupabaseClient | null {
  if (FRONTEND_ONLY) return null

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || !key || url.includes('placeholder')) {
    return null
  }

  return createClient(url, key)
}

export function isSupabaseConfigured(): boolean {
  if (FRONTEND_ONLY) return false
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  return Boolean(url && key && !url.includes('placeholder'))
}
