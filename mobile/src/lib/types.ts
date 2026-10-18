export type Role = 'student' | 'leader' | 'admin';

export interface Profile {
  id: string;
  email: string;
  name: string;
  role: Role;
  phone?: string | null;
  avatar_url?: string | null;
  created_at: string;
  updated_at: string;
}

export type PostCategory = 'testimony' | 'news' | 'announcement' | 'ministry';

export interface Post {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  author_id: string | null;
  author?: { name: string } | null;
  category: PostCategory;
  published_at: string;
  image_url?: string | null;
  created_at: string;
  updated_at: string;
}

export type EventCategory = 'worship' | 'outreach' | 'study' | 'fellowship' | 'special';

export interface HavenEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  end_date?: string | null;
  location: string;
  max_attendees?: number | null;
  current_attendees: number;
  category: EventCategory;
  image_url?: string | null;
  committee_id?: string | null;
  created_by?: string | null;
  created_at: string;
  updated_at: string;
}

export interface Band {
  id: string;
  name: string;
  slug: string;
  description: string;
  focus_area: string;
  meeting_time: string;
  meeting_location: string;
  leader_id: string | null;
  activities: string[];
  mission?: string | null;
  responsibilities?: string | null;
  how_to_join?: string | null;
  important_info?: string | null;
  hero_image_url?: string | null;
  leader_name?: string | null;
  leader_position?: string | null;
  leader_tenure?: string | null;
  leader_image_url?: string | null;
  leader_email?: string | null;
  leader_phone?: string | null;
  is_band?: boolean;
  sort_order?: number;
  created_at: string;
  updated_at: string;
}

export interface BandAnnouncement {
  id: string;
  committee_id: string;
  title: string;
  content: string;
  type: 'announcement' | 'meeting' | 'update';
  image_url?: string | null;
  author_id?: string | null;
  published_at: string;
  created_at: string;
  updated_at: string;
}

export type PrayerCategory = 'personal' | 'family' | 'health' | 'academic' | 'ministry';
export type PrayerStatus = 'active' | 'answered' | 'archived';

export interface PrayerRequest {
  id: string;
  request: string;
  requester_name?: string | null;
  requester_email?: string | null;
  is_anonymous: boolean;
  status: PrayerStatus;
  category: PrayerCategory;
  user_id?: string | null;
  created_at: string;
  updated_at: string;
}

export type GalleryCategory = 'worship' | 'events' | 'outreach' | 'fellowship' | 'baptisms';

export interface GalleryItem {
  id: string;
  title: string;
  description?: string | null;
  image_url: string;
  category: GalleryCategory;
  event_date: string;
  location: string;
  attendees?: number | null;
  uploaded_by?: string | null;
  created_at: string;
}

export type ResourceType = 'bible_study' | 'sermon' | 'devotional' | 'manual';

export interface Resource {
  id: string;
  title: string;
  description: string;
  type: ResourceType;
  category: string;
  file_url?: string | null;
  download_url?: string | null;
  duration?: string | null;
  lessons?: number | null;
  level: 'beginner' | 'intermediate' | 'advanced';
  author: string;
  created_at: string;
  updated_at: string;
}

export type ApplicationStatus = 'active' | 'inactive' | 'pending';

export interface Volunteer {
  id: string;
  user_id: string;
  committee_id: string | null;
  role: string;
  skills: string[];
  availability: string;
  commitment_hours: number;
  status: ApplicationStatus;
  user?: { name: string; email: string } | null;
  committee?: { name: string } | null;
  created_at: string;
  updated_at: string;
}

export type CounselingService = 'personal' | 'relationship' | 'academic' | 'crisis';
export type CounselingStatus = 'pending' | 'scheduled' | 'completed';

export interface CounselingRequest {
  id: string;
  user_id?: string | null;
  name: string;
  email: string;
  phone?: string | null;
  service_type: CounselingService;
  preferred_counselor?: string | null;
  message: string;
  status: CounselingStatus;
  appointment_date?: string | null;
  created_at: string;
  updated_at: string;
}

export interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  subject?: string | null;
  message: string;
  created_at: string;
}

export type OrderStatus = 'pending' | 'confirmed' | 'ready' | 'collected' | 'cancelled';

export interface OrderItem {
  product_slug: string;
  name: string;
  size?: string | null;
  color?: string | null;
  quantity: number;
  unit_price_zmw: number;
}

export interface Order {
  id: string;
  user_id: string | null;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  pickup_note?: string | null;
  items: OrderItem[];
  total_zmw: number;
  status: OrderStatus;
  created_at: string;
  updated_at: string;
}
