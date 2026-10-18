import { DEFAULT_BAND_ANNOUNCEMENTS, DEFAULT_BANDS, getDefaultBandBySlug } from '@/data/bands';
import { generateOrderId } from '@/data/merch';
import { isSupabaseConfigured, MEDIA_BUCKET, supabase } from '@/lib/supabase';
import type {
  ApplicationStatus,
  Band,
  BandAnnouncement,
  ContactSubmission,
  CounselingRequest,
  CounselingService,
  CounselingStatus,
  EventCategory,
  GalleryCategory,
  GalleryItem,
  HavenEvent,
  Order,
  OrderItem,
  OrderStatus,
  Post,
  PostCategory,
  PrayerCategory,
  PrayerRequest,
  PrayerStatus,
  Profile,
  Resource,
  ResourceType,
  Role,
  Volunteer,
} from '@/lib/types';

export class NotConfiguredError extends Error {
  constructor() {
    super('The app is not connected to Supabase yet. Add your keys to .env and restart.');
  }
}

function requireBackend() {
  if (!isSupabaseConfigured) throw new NotConfiguredError();
}

function unwrap<T>({ data, error }: { data: T | null; error: { message: string } | null }): T {
  if (error) throw new Error(error.message);
  return data as T;
}

// ───────────────────────── Profiles ─────────────────────────

export async function getProfile(userId: string): Promise<Profile | null> {
  const { data, error } = await supabase.from('users').select('*').eq('id', userId).maybeSingle();
  if (error) throw new Error(error.message);
  return data as Profile | null;
}

export async function updateProfile(userId: string, updates: Partial<Pick<Profile, 'name' | 'phone'>>) {
  requireBackend();
  return unwrap(await supabase.from('users').update(updates).eq('id', userId).select().single()) as Profile;
}

export async function listUsers(search?: string): Promise<Profile[]> {
  requireBackend();
  let q = supabase.from('users').select('*').order('created_at', { ascending: false }).limit(200);
  if (search?.trim()) q = q.or(`name.ilike.%${search.trim()}%,email.ilike.%${search.trim()}%`);
  return unwrap(await q) as Profile[];
}

export async function setUserRole(userId: string, role: Role) {
  requireBackend();
  return unwrap(await supabase.from('users').update({ role }).eq('id', userId).select().single()) as Profile;
}

// ───────────────────────── Posts / News ─────────────────────────

export async function getPosts(category?: PostCategory, limit = 50): Promise<Post[]> {
  if (!isSupabaseConfigured) return [];
  let q = supabase
    .from('posts')
    .select('*, author:users(name)')
    .order('published_at', { ascending: false })
    .limit(limit);
  if (category) q = q.eq('category', category);
  return unwrap(await q) as Post[];
}

export async function getPost(id: string): Promise<Post | null> {
  requireBackend();
  const { data, error } = await supabase.from('posts').select('*, author:users(name)').eq('id', id).maybeSingle();
  if (error) throw new Error(error.message);
  return data as Post | null;
}

export type PostInput = Pick<Post, 'title' | 'content' | 'excerpt' | 'category'> & { image_url?: string | null };

export async function createPost(input: PostInput, authorId: string) {
  requireBackend();
  return unwrap(
    await supabase
      .from('posts')
      .insert({ ...input, author_id: authorId, published_at: new Date().toISOString() })
      .select()
      .single()
  ) as Post;
}

export async function updatePost(id: string, input: Partial<PostInput>) {
  requireBackend();
  return unwrap(await supabase.from('posts').update(input).eq('id', id).select().single()) as Post;
}

export async function deletePost(id: string) {
  requireBackend();
  unwrap(await supabase.from('posts').delete().eq('id', id));
}

// ───────────────────────── Events ─────────────────────────

export async function getEvents(opts: { upcoming?: boolean; category?: EventCategory; committeeId?: string } = {}) {
  if (!isSupabaseConfigured) return [] as HavenEvent[];
  let q = supabase.from('events').select('*').order('date', { ascending: true });
  if (opts.upcoming) q = q.gte('date', new Date(Date.now() - 6 * 3600_000).toISOString());
  if (opts.category) q = q.eq('category', opts.category);
  if (opts.committeeId) q = q.eq('committee_id', opts.committeeId);
  return unwrap(await q) as HavenEvent[];
}

export async function getEvent(id: string): Promise<HavenEvent | null> {
  requireBackend();
  const { data, error } = await supabase.from('events').select('*').eq('id', id).maybeSingle();
  if (error) throw new Error(error.message);
  return data as HavenEvent | null;
}

export type EventInput = Pick<HavenEvent, 'title' | 'description' | 'date' | 'location' | 'category'> & {
  end_date?: string | null;
  max_attendees?: number | null;
  image_url?: string | null;
  committee_id?: string | null;
};

export async function createEvent(input: EventInput, userId: string) {
  requireBackend();
  return unwrap(await supabase.from('events').insert({ ...input, created_by: userId }).select().single()) as HavenEvent;
}

export async function updateEvent(id: string, input: Partial<EventInput>) {
  requireBackend();
  return unwrap(await supabase.from('events').update(input).eq('id', id).select().single()) as HavenEvent;
}

export async function deleteEvent(id: string) {
  requireBackend();
  unwrap(await supabase.from('events').delete().eq('id', id));
}

export async function isRegisteredForEvent(eventId: string, userId: string) {
  if (!isSupabaseConfigured) return false;
  const { data } = await supabase
    .from('event_attendees')
    .select('id')
    .eq('event_id', eventId)
    .eq('user_id', userId)
    .maybeSingle();
  return Boolean(data);
}

/** Attendee count is kept in sync by a database trigger */
export async function registerForEvent(eventId: string, userId: string) {
  requireBackend();
  unwrap(await supabase.from('event_attendees').insert({ event_id: eventId, user_id: userId }));
}

export async function cancelEventRegistration(eventId: string, userId: string) {
  requireBackend();
  unwrap(await supabase.from('event_attendees').delete().eq('event_id', eventId).eq('user_id', userId));
}

export async function getMyEvents(userId: string): Promise<HavenEvent[]> {
  if (!isSupabaseConfigured) return [];
  const rows = unwrap(
    await supabase.from('event_attendees').select('event:events(*)').eq('user_id', userId)
  ) as unknown as { event: HavenEvent | null }[];
  return rows
    .map((r) => r.event)
    .filter((e): e is HavenEvent => Boolean(e))
    .sort((a, b) => a.date.localeCompare(b.date));
}

// ───────────────────────── Bands ─────────────────────────

export async function getBands(): Promise<Band[]> {
  if (!isSupabaseConfigured) return DEFAULT_BANDS;
  try {
    const data = unwrap(
      await supabase.from('committees').select('*').eq('is_band', true).order('sort_order', { ascending: true })
    ) as Band[];
    return data.length ? data : DEFAULT_BANDS;
  } catch {
    return DEFAULT_BANDS;
  }
}

/** Non-band committees (worship, prayer, media…) */
export async function getCommittees(): Promise<Band[]> {
  if (!isSupabaseConfigured) return [];
  return unwrap(
    await supabase.from('committees').select('*').or('is_band.is.null,is_band.eq.false').order('name')
  ) as Band[];
}

export async function getBandBySlug(slug: string): Promise<Band | null> {
  if (!isSupabaseConfigured) return getDefaultBandBySlug(slug) ?? null;
  const { data } = await supabase.from('committees').select('*').eq('slug', slug).maybeSingle();
  return (data as Band | null) ?? getDefaultBandBySlug(slug) ?? null;
}

/** Bands from the static fallback have ids like "band-…" and don't exist in the database */
export function isLocalBand(band: Band) {
  return band.id.startsWith('band-');
}

export async function getBandAnnouncements(band: Band): Promise<BandAnnouncement[]> {
  if (!isSupabaseConfigured || isLocalBand(band)) return DEFAULT_BAND_ANNOUNCEMENTS[band.slug] ?? [];
  return unwrap(
    await supabase
      .from('band_announcements')
      .select('*')
      .eq('committee_id', band.id)
      .order('published_at', { ascending: false })
      .limit(30)
  ) as BandAnnouncement[];
}

export async function createBandAnnouncement(
  input: Pick<BandAnnouncement, 'committee_id' | 'title' | 'content' | 'type'> & { image_url?: string | null },
  authorId: string
) {
  requireBackend();
  return unwrap(
    await supabase
      .from('band_announcements')
      .insert({ ...input, author_id: authorId, published_at: new Date().toISOString() })
      .select()
      .single()
  ) as BandAnnouncement;
}

export async function deleteBandAnnouncement(id: string) {
  requireBackend();
  unwrap(await supabase.from('band_announcements').delete().eq('id', id));
}

export async function updateBand(id: string, updates: Partial<Band>) {
  requireBackend();
  return unwrap(await supabase.from('committees').update(updates).eq('id', id).select().single()) as Band;
}

export async function getBandMemberCount(bandId: string) {
  if (!isSupabaseConfigured) return 0;
  const { data } = await supabase.rpc('band_member_count', { band: bandId });
  return (data as number | null) ?? 0;
}

export async function getBandMembers(bandId: string) {
  requireBackend();
  return unwrap(
    await supabase
      .from('committee_members')
      .select('id, role, joined_at, user:users(id, name, email)')
      .eq('committee_id', bandId)
      .order('joined_at', { ascending: false })
  ) as unknown as { id: string; role: string; joined_at: string; user: { id: string; name: string; email: string } | null }[];
}

export async function getMyBandIds(userId: string): Promise<string[]> {
  if (!isSupabaseConfigured) return [];
  const rows = unwrap(await supabase.from('committee_members').select('committee_id').eq('user_id', userId)) as {
    committee_id: string;
  }[];
  return rows.map((r) => r.committee_id);
}

export async function joinBand(bandId: string, userId: string) {
  requireBackend();
  unwrap(await supabase.from('committee_members').insert({ committee_id: bandId, user_id: userId, role: 'member' }));
}

export async function leaveBand(bandId: string, userId: string) {
  requireBackend();
  unwrap(await supabase.from('committee_members').delete().eq('committee_id', bandId).eq('user_id', userId));
}

/** Bands this user may manage: admins get all, otherwise band_admins rows + bands they lead */
export async function getManagedBands(profile: Profile): Promise<Band[]> {
  requireBackend();
  const bands = await getBands();
  if (profile.role === 'admin') return bands.filter((b) => !isLocalBand(b));
  const adminRows = unwrap(
    await supabase.from('band_admins').select('committee_id').eq('user_id', profile.id)
  ) as { committee_id: string }[];
  const ids = new Set(adminRows.map((r) => r.committee_id));
  return bands.filter((b) => !isLocalBand(b) && (ids.has(b.id) || b.leader_id === profile.id));
}

export async function addBandAdmin(bandId: string, userId: string) {
  requireBackend();
  unwrap(await supabase.from('band_admins').insert({ committee_id: bandId, user_id: userId }));
}

export async function removeBandAdmin(bandId: string, userId: string) {
  requireBackend();
  unwrap(await supabase.from('band_admins').delete().eq('committee_id', bandId).eq('user_id', userId));
}

export async function getBandAdmins(bandId: string) {
  requireBackend();
  return unwrap(
    await supabase.from('band_admins').select('id, user:users(id, name, email)').eq('committee_id', bandId)
  ) as unknown as { id: string; user: { id: string; name: string; email: string } | null }[];
}

export async function removeBandMember(bandId: string, userId: string) {
  requireBackend();
  unwrap(await supabase.from('committee_members').delete().eq('committee_id', bandId).eq('user_id', userId));
}

// ───────────────────────── Prayer ─────────────────────────

export async function submitPrayerRequest(input: {
  request: string;
  category: PrayerCategory;
  is_anonymous: boolean;
  requester_name?: string | null;
  requester_email?: string | null;
  user_id?: string | null;
}) {
  requireBackend();
  const row = input.is_anonymous
    ? { ...input, requester_name: null, requester_email: null, user_id: null }
    : input;
  unwrap(await supabase.from('prayer_requests').insert({ ...row, status: 'active' }));
}

export async function getPrayerRequests(status?: PrayerStatus): Promise<PrayerRequest[]> {
  requireBackend();
  let q = supabase.from('prayer_requests').select('*').order('created_at', { ascending: false });
  if (status) q = q.eq('status', status);
  return unwrap(await q) as PrayerRequest[];
}

export async function getMyPrayerRequests(userId: string): Promise<PrayerRequest[]> {
  if (!isSupabaseConfigured) return [];
  return unwrap(
    await supabase.from('prayer_requests').select('*').eq('user_id', userId).order('created_at', { ascending: false })
  ) as PrayerRequest[];
}

export async function setPrayerStatus(id: string, status: PrayerStatus) {
  requireBackend();
  unwrap(await supabase.from('prayer_requests').update({ status }).eq('id', id));
}

// ───────────────────────── Counseling ─────────────────────────

export async function submitCounselingRequest(input: {
  name: string;
  email: string;
  phone?: string | null;
  service_type: CounselingService;
  preferred_counselor?: string | null;
  message: string;
  user_id?: string | null;
}) {
  requireBackend();
  unwrap(await supabase.from('counseling_requests').insert({ ...input, status: 'pending' }));
}

export async function getCounselingRequests(status?: CounselingStatus): Promise<CounselingRequest[]> {
  requireBackend();
  let q = supabase.from('counseling_requests').select('*').order('created_at', { ascending: false });
  if (status) q = q.eq('status', status);
  return unwrap(await q) as CounselingRequest[];
}

export async function getMyCounselingRequests(userId: string): Promise<CounselingRequest[]> {
  if (!isSupabaseConfigured) return [];
  return unwrap(
    await supabase.from('counseling_requests').select('*').eq('user_id', userId).order('created_at', { ascending: false })
  ) as CounselingRequest[];
}

export async function updateCounselingRequest(
  id: string,
  updates: { status?: CounselingStatus; appointment_date?: string | null }
) {
  requireBackend();
  unwrap(await supabase.from('counseling_requests').update(updates).eq('id', id));
}

// ───────────────────────── Volunteers ─────────────────────────

export async function applyToVolunteer(input: {
  user_id: string;
  committee_id: string | null;
  role: string;
  skills: string[];
  availability: string;
  commitment_hours: number;
}) {
  requireBackend();
  unwrap(await supabase.from('volunteers').insert({ ...input, status: 'pending' }));
}

export async function getVolunteers(status?: ApplicationStatus): Promise<Volunteer[]> {
  requireBackend();
  let q = supabase
    .from('volunteers')
    .select('*, user:users(name, email), committee:committees(name)')
    .order('created_at', { ascending: false });
  if (status) q = q.eq('status', status);
  return unwrap(await q) as Volunteer[];
}

export async function getMyVolunteerApplications(userId: string): Promise<Volunteer[]> {
  if (!isSupabaseConfigured) return [];
  return unwrap(
    await supabase
      .from('volunteers')
      .select('*, committee:committees(name)')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
  ) as Volunteer[];
}

export async function setVolunteerStatus(id: string, status: ApplicationStatus) {
  requireBackend();
  unwrap(await supabase.from('volunteers').update({ status }).eq('id', id));
}

// ───────────────────────── Giving (pledges) ─────────────────────────

export async function submitPledge(input: {
  amount: number;
  type: 'monthly' | 'one_time' | 'event_sponsorship' | 'student_support';
  purpose: string;
  donor_name?: string | null;
  donor_email?: string | null;
  is_anonymous: boolean;
  user_id?: string | null;
}) {
  requireBackend();
  unwrap(await supabase.from('donations').insert(input));
}

// ───────────────────────── Gallery ─────────────────────────

export async function getGalleryItems(category?: GalleryCategory): Promise<GalleryItem[]> {
  if (!isSupabaseConfigured) return [];
  let q = supabase.from('gallery_items').select('*').order('event_date', { ascending: false });
  if (category) q = q.eq('category', category);
  return unwrap(await q) as GalleryItem[];
}

export async function createGalleryItem(input: Omit<GalleryItem, 'id' | 'created_at'>) {
  requireBackend();
  return unwrap(await supabase.from('gallery_items').insert(input).select().single()) as GalleryItem;
}

export async function deleteGalleryItem(id: string) {
  requireBackend();
  unwrap(await supabase.from('gallery_items').delete().eq('id', id));
}

// ───────────────────────── Resources ─────────────────────────

export async function getResources(type?: ResourceType): Promise<Resource[]> {
  if (!isSupabaseConfigured) return [];
  let q = supabase.from('resources').select('*').order('created_at', { ascending: false });
  if (type) q = q.eq('type', type);
  return unwrap(await q) as Resource[];
}

export type ResourceInput = Omit<Resource, 'id' | 'created_at' | 'updated_at'>;

export async function createResource(input: ResourceInput) {
  requireBackend();
  return unwrap(await supabase.from('resources').insert(input).select().single()) as Resource;
}

export async function updateResource(id: string, input: Partial<ResourceInput>) {
  requireBackend();
  return unwrap(await supabase.from('resources').update(input).eq('id', id).select().single()) as Resource;
}

export async function deleteResource(id: string) {
  requireBackend();
  unwrap(await supabase.from('resources').delete().eq('id', id));
}

// ───────────────────────── Contact ─────────────────────────

export async function submitContact(input: { name: string; email: string; subject?: string; message: string }) {
  requireBackend();
  unwrap(
    await supabase.from('contact_submissions').insert({ ...input, subject: input.subject || 'General inquiry' })
  );
}

export async function getContactSubmissions(): Promise<ContactSubmission[]> {
  requireBackend();
  return unwrap(
    await supabase.from('contact_submissions').select('*').order('created_at', { ascending: false })
  ) as ContactSubmission[];
}

export async function deleteContactSubmission(id: string) {
  requireBackend();
  unwrap(await supabase.from('contact_submissions').delete().eq('id', id));
}

// ───────────────────────── Merch orders ─────────────────────────

export async function placeOrder(input: {
  user_id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  pickup_note?: string | null;
  items: OrderItem[];
  total_zmw: number;
}): Promise<Order & { reference: string }> {
  requireBackend();
  return unwrap(
    await supabase
      .from('orders')
      .insert({ ...input, reference: generateOrderId(), status: 'pending' })
      .select()
      .single()
  ) as Order & { reference: string };
}

export async function getMyOrders(userId: string) {
  if (!isSupabaseConfigured) return [] as (Order & { reference: string })[];
  return unwrap(
    await supabase.from('orders').select('*').eq('user_id', userId).order('created_at', { ascending: false })
  ) as (Order & { reference: string })[];
}

export async function getOrders(status?: OrderStatus) {
  requireBackend();
  let q = supabase.from('orders').select('*').order('created_at', { ascending: false });
  if (status) q = q.eq('status', status);
  return unwrap(await q) as (Order & { reference: string })[];
}

export async function setOrderStatus(id: string, status: OrderStatus) {
  requireBackend();
  unwrap(await supabase.from('orders').update({ status }).eq('id', id));
}

// ───────────────────────── Admin dashboard ─────────────────────────

async function count(table: string, filter?: (q: any) => any) {
  let q = supabase.from(table).select('id', { count: 'exact', head: true });
  if (filter) q = filter(q);
  const { count: n, error } = await q;
  if (error) throw new Error(error.message);
  return n ?? 0;
}

export async function getDashboardStats() {
  requireBackend();
  const [users, upcomingEvents, posts, activePrayers, pendingCounseling, pendingVolunteers, pendingOrders, messages] =
    await Promise.all([
      count('users'),
      count('events', (q) => q.gte('date', new Date().toISOString())),
      count('posts'),
      count('prayer_requests', (q) => q.eq('status', 'active')),
      count('counseling_requests', (q) => q.eq('status', 'pending')),
      count('volunteers', (q) => q.eq('status', 'pending')),
      count('orders', (q) => q.eq('status', 'pending')),
      count('contact_submissions'),
    ]);
  return { users, upcomingEvents, posts, activePrayers, pendingCounseling, pendingVolunteers, pendingOrders, messages };
}

// ───────────────────────── Storage ─────────────────────────

/** Upload a local image (from expo-image-picker) to the public media bucket and return its URL */
export async function uploadImage(localUri: string, folder: string, mimeType = 'image/jpeg'): Promise<string> {
  requireBackend();
  const ext = mimeType.split('/')[1]?.replace('jpeg', 'jpg') || 'jpg';
  const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const body = await (await fetch(localUri)).arrayBuffer();
  const { error } = await supabase.storage.from(MEDIA_BUCKET).upload(path, body, { contentType: mimeType });
  if (error) throw new Error(error.message);
  return supabase.storage.from(MEDIA_BUCKET).getPublicUrl(path).data.publicUrl;
}
