import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import { FRONTEND_ONLY } from './config'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key'

/** Null when FRONTEND_ONLY — avoids loading Supabase on the server */
export const supabase: SupabaseClient | null = FRONTEND_ONLY
  ? null
  : createClient(supabaseUrl, supabaseKey)

// Database Types
export interface User {
  id: string
  email: string
  name: string
  role: 'student' | 'leader' | 'admin'
  office?: 'developer' | 'chairperson' | 'vice_chairperson' | null
  phone?: string
  created_at: string
  updated_at: string
}

export interface Post {
  id: string
  title: string
  content: string
  excerpt: string
  author_id: string
  author?: User
  category: 'testimony' | 'news' | 'announcement' | 'ministry'
  published_at: string
  image_url?: string
  created_at: string
  updated_at: string
}

export interface Event {
  id: string
  title: string
  description: string
  date: string
  end_date?: string
  location: string
  max_attendees?: number
  current_attendees: number
  category: 'worship' | 'outreach' | 'study' | 'fellowship' | 'special'
  image_url?: string
  committee_id?: string | null
  created_by: string
  created_at: string
  updated_at: string
}

export interface Committee {
  id: string
  name: string
  slug?: string
  description: string
  focus_area: string
  meeting_time: string
  meeting_location: string
  leader_id: string | null
  leader?: User
  activities: string[]
  mission?: string
  responsibilities?: string
  how_to_join?: string
  important_info?: string
  hero_image_url?: string
  leader_name?: string
  leader_position?: string
  leader_tenure?: string
  leader_image_url?: string
  leader_email?: string
  leader_phone?: string
  is_band?: boolean
  sort_order?: number
  created_at: string
  updated_at: string
}

export type Band = Committee

export interface BandAnnouncement {
  id: string
  committee_id: string
  title: string
  content: string
  type: 'announcement' | 'meeting' | 'update'
  image_url?: string | null
  author_id?: string | null
  published_at: string
  created_at: string
  updated_at: string
}

export interface BandAdmin {
  id: string
  committee_id: string
  user_id: string
  created_at: string
}

export interface PrayerRequest {
  id: string
  request: string
  requester_name?: string
  requester_email?: string
  is_anonymous: boolean
  status: 'active' | 'answered' | 'archived'
  category: 'personal' | 'family' | 'health' | 'academic' | 'ministry'
  created_at: string
  updated_at: string
}

export interface GalleryItem {
  id: string
  title: string
  description: string
  image_url: string
  category: 'worship' | 'events' | 'outreach' | 'fellowship' | 'baptisms'
  event_date: string
  location: string
  attendees?: number
  uploaded_by: string
  created_at: string
}

export interface Resource {
  id: string
  title: string
  description: string
  type: 'bible_study' | 'sermon' | 'devotional' | 'manual'
  category: string
  file_url?: string
  download_url?: string
  duration?: string
  lessons?: number
  level: 'beginner' | 'intermediate' | 'advanced'
  author: string
  created_at: string
  updated_at: string
}

export interface Volunteer {
  id: string
  user_id: string
  user?: User
  committee_id: string
  committee?: Committee
  role: string
  skills: string[]
  availability: string
  commitment_hours: number
  status: 'active' | 'inactive' | 'pending'
  created_at: string
  updated_at: string
}

export interface Counseling {
  id: string
  user_id?: string
  name: string
  email: string
  phone?: string
  service_type: 'personal' | 'relationship' | 'academic' | 'crisis'
  preferred_counselor?: string
  message: string
  status: 'pending' | 'scheduled' | 'completed'
  appointment_date?: string
  created_at: string
  updated_at: string
}

export interface Donation {
  id: string
  donor_name?: string
  donor_email?: string
  amount: number
  type: 'monthly' | 'one_time' | 'event_sponsorship' | 'student_support'
  purpose: string
  is_anonymous: boolean
  status: 'pending' | 'completed' | 'failed'
  created_at: string
}