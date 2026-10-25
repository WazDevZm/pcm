-- The Haven: full database setup (web + mobile share this backend)
-- Paste into Supabase → SQL Editor → New query → Run. For a NEW, empty project only.
-- Generated from schema.sql + migrations/002–004 + seed-bands.sql + migrations/006 — edit those files, not this one.


-- ════════════════ schema.sql ════════════════

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (extends Supabase auth.users)
CREATE TABLE public.users (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email VARCHAR UNIQUE NOT NULL,
  name VARCHAR NOT NULL,
  role VARCHAR DEFAULT 'student' CHECK (role IN ('student', 'leader', 'admin')),
  phone VARCHAR,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Posts table (for news/blog/testimonies)
CREATE TABLE public.posts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title VARCHAR NOT NULL,
  content TEXT NOT NULL,
  excerpt VARCHAR NOT NULL,
  author_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  category VARCHAR NOT NULL CHECK (category IN ('testimony', 'news', 'announcement', 'ministry')),
  published_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  image_url VARCHAR,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Events table
CREATE TABLE public.events (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title VARCHAR NOT NULL,
  description TEXT NOT NULL,
  date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE,
  location VARCHAR NOT NULL,
  max_attendees INTEGER,
  current_attendees INTEGER DEFAULT 0,
  category VARCHAR NOT NULL CHECK (category IN ('worship', 'outreach', 'study', 'fellowship', 'special')),
  image_url VARCHAR,
  created_by UUID REFERENCES public.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Committees table
CREATE TABLE public.committees (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name VARCHAR NOT NULL,
  description TEXT NOT NULL,
  focus_area VARCHAR NOT NULL,
  meeting_time VARCHAR NOT NULL,
  meeting_location VARCHAR NOT NULL,
  leader_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  activities TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Prayer requests table
CREATE TABLE public.prayer_requests (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  request TEXT NOT NULL,
  requester_name VARCHAR,
  requester_email VARCHAR,
  is_anonymous BOOLEAN DEFAULT FALSE,
  status VARCHAR DEFAULT 'active' CHECK (status IN ('active', 'answered', 'archived')),
  category VARCHAR NOT NULL CHECK (category IN ('personal', 'family', 'health', 'academic', 'ministry')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Gallery items table
CREATE TABLE public.gallery_items (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title VARCHAR NOT NULL,
  description TEXT,
  image_url VARCHAR NOT NULL,
  category VARCHAR NOT NULL CHECK (category IN ('worship', 'events', 'outreach', 'fellowship', 'baptisms')),
  event_date TIMESTAMP WITH TIME ZONE NOT NULL,
  location VARCHAR NOT NULL,
  attendees INTEGER,
  uploaded_by UUID REFERENCES public.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Resources table
CREATE TABLE public.resources (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title VARCHAR NOT NULL,
  description TEXT NOT NULL,
  type VARCHAR NOT NULL CHECK (type IN ('bible_study', 'sermon', 'devotional', 'manual')),
  category VARCHAR NOT NULL,
  file_url VARCHAR,
  download_url VARCHAR,
  duration VARCHAR,
  lessons INTEGER,
  level VARCHAR DEFAULT 'beginner' CHECK (level IN ('beginner', 'intermediate', 'advanced')),
  author VARCHAR NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Volunteers table
CREATE TABLE public.volunteers (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  committee_id UUID REFERENCES public.committees(id) ON DELETE CASCADE,
  role VARCHAR NOT NULL,
  skills TEXT[] DEFAULT '{}',
  availability VARCHAR NOT NULL,
  commitment_hours INTEGER NOT NULL,
  status VARCHAR DEFAULT 'pending' CHECK (status IN ('active', 'inactive', 'pending')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Counseling requests table
CREATE TABLE public.counseling_requests (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  name VARCHAR NOT NULL,
  email VARCHAR NOT NULL,
  phone VARCHAR,
  service_type VARCHAR NOT NULL CHECK (service_type IN ('personal', 'relationship', 'academic', 'crisis')),
  preferred_counselor VARCHAR,
  message TEXT NOT NULL,
  status VARCHAR DEFAULT 'pending' CHECK (status IN ('pending', 'scheduled', 'completed')),
  appointment_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Donations table
CREATE TABLE public.donations (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  donor_name VARCHAR,
  donor_email VARCHAR,
  amount DECIMAL(10,2) NOT NULL,
  type VARCHAR NOT NULL CHECK (type IN ('monthly', 'one_time', 'event_sponsorship', 'student_support')),
  purpose VARCHAR NOT NULL,
  is_anonymous BOOLEAN DEFAULT FALSE,
  status VARCHAR DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Event attendees table (many-to-many)
CREATE TABLE public.event_attendees (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  event_id UUID REFERENCES public.events(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  registered_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(event_id, user_id)
);

-- Committee members table (many-to-many)
CREATE TABLE public.committee_members (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  committee_id UUID REFERENCES public.committees(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  role VARCHAR DEFAULT 'member',
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(committee_id, user_id)
);

-- Create indexes for better performance
CREATE INDEX idx_posts_category ON public.posts(category);
CREATE INDEX idx_posts_published_at ON public.posts(published_at DESC);
CREATE INDEX idx_events_date ON public.events(date);
CREATE INDEX idx_events_category ON public.events(category);
CREATE INDEX idx_prayer_requests_status ON public.prayer_requests(status);
CREATE INDEX idx_gallery_items_category ON public.gallery_items(category);
CREATE INDEX idx_gallery_items_event_date ON public.gallery_items(event_date DESC);
CREATE INDEX idx_resources_type ON public.resources(type);
CREATE INDEX idx_volunteers_status ON public.volunteers(status);

-- Enable Row Level Security (RLS)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.committees ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prayer_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.volunteers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.counseling_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.donations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_attendees ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.committee_members ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Users: Users can read all profiles, but only update their own
CREATE POLICY "Users can view all profiles" ON public.users FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.users FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.users FOR INSERT WITH CHECK (auth.uid() = id);

-- Posts: Everyone can read published posts, only authors and admins can modify
CREATE POLICY "Anyone can view published posts" ON public.posts FOR SELECT USING (true);
CREATE POLICY "Authors can manage their posts" ON public.posts FOR ALL USING (auth.uid() = author_id);
CREATE POLICY "Admins can manage all posts" ON public.posts FOR ALL USING (
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
);

-- Events: Everyone can read, leaders and admins can manage
CREATE POLICY "Anyone can view events" ON public.events FOR SELECT USING (true);
CREATE POLICY "Leaders can manage events" ON public.events FOR ALL USING (
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('leader', 'admin'))
);

-- Committees: Everyone can read, leaders and admins can manage
CREATE POLICY "Anyone can view committees" ON public.committees FOR SELECT USING (true);
CREATE POLICY "Leaders can manage committees" ON public.committees FOR ALL USING (
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('leader', 'admin'))
);

-- Prayer requests: Everyone can read non-anonymous requests, anyone can insert
CREATE POLICY "Anyone can view non-anonymous prayer requests" ON public.prayer_requests FOR SELECT USING (
  NOT is_anonymous OR EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('leader', 'admin'))
);
CREATE POLICY "Anyone can submit prayer requests" ON public.prayer_requests FOR INSERT WITH CHECK (true);
CREATE POLICY "Leaders can manage prayer requests" ON public.prayer_requests FOR ALL USING (
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('leader', 'admin'))
);

-- Gallery: Everyone can read, authenticated users can upload, leaders can manage
CREATE POLICY "Anyone can view gallery" ON public.gallery_items FOR SELECT USING (true);
CREATE POLICY "Authenticated users can upload to gallery" ON public.gallery_items FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Users can manage their uploads" ON public.gallery_items FOR ALL USING (auth.uid() = uploaded_by);
CREATE POLICY "Leaders can manage all gallery items" ON public.gallery_items FOR ALL USING (
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('leader', 'admin'))
);

-- Resources: Everyone can read, leaders and admins can manage
CREATE POLICY "Anyone can view resources" ON public.resources FOR SELECT USING (true);
CREATE POLICY "Leaders can manage resources" ON public.resources FOR ALL USING (
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('leader', 'admin'))
);

-- Volunteers: Users can manage their own applications, leaders can view all
CREATE POLICY "Users can manage their volunteer applications" ON public.volunteers FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Leaders can view all volunteers" ON public.volunteers FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('leader', 'admin'))
);

-- Counseling: Users can manage their own requests, counselors can view assigned
CREATE POLICY "Users can manage their counseling requests" ON public.counseling_requests FOR ALL USING (
  auth.uid() = user_id OR 
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('leader', 'admin'))
);
CREATE POLICY "Anyone can submit counseling requests" ON public.counseling_requests FOR INSERT WITH CHECK (true);

-- Donations: Donors can view their own, admins can view all
CREATE POLICY "Anyone can make donations" ON public.donations FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can view all donations" ON public.donations FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
);

-- Event attendees: Users can manage their own registrations
CREATE POLICY "Users can manage their event registrations" ON public.event_attendees FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Anyone can view event attendees" ON public.event_attendees FOR SELECT USING (true);

-- Committee members: Users can view memberships, leaders can manage
CREATE POLICY "Anyone can view committee members" ON public.committee_members FOR SELECT USING (true);
CREATE POLICY "Users can join committees" ON public.committee_members FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Leaders can manage committee members" ON public.committee_members FOR ALL USING (
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('leader', 'admin'))
);

-- Functions for updating timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_posts_updated_at BEFORE UPDATE ON public.posts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON public.events FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_committees_updated_at BEFORE UPDATE ON public.committees FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_prayer_requests_updated_at BEFORE UPDATE ON public.prayer_requests FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_resources_updated_at BEFORE UPDATE ON public.resources FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_volunteers_updated_at BEFORE UPDATE ON public.volunteers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_counseling_requests_updated_at BEFORE UPDATE ON public.counseling_requests FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();


-- ════════════════ migrations/002_bands_extension.sql ════════════════

-- Bands & Committees extension for PCM

-- Extend committees with band page fields
ALTER TABLE public.committees
  ADD COLUMN IF NOT EXISTS slug VARCHAR UNIQUE,
  ADD COLUMN IF NOT EXISTS mission TEXT,
  ADD COLUMN IF NOT EXISTS responsibilities TEXT,
  ADD COLUMN IF NOT EXISTS how_to_join TEXT,
  ADD COLUMN IF NOT EXISTS important_info TEXT,
  ADD COLUMN IF NOT EXISTS hero_image_url VARCHAR,
  ADD COLUMN IF NOT EXISTS leader_name VARCHAR,
  ADD COLUMN IF NOT EXISTS leader_position VARCHAR,
  ADD COLUMN IF NOT EXISTS leader_tenure VARCHAR,
  ADD COLUMN IF NOT EXISTS leader_image_url VARCHAR,
  ADD COLUMN IF NOT EXISTS leader_email VARCHAR,
  ADD COLUMN IF NOT EXISTS leader_phone VARCHAR,
  ADD COLUMN IF NOT EXISTS is_band BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS sort_order INTEGER DEFAULT 0;

-- Link events to a specific band/committee
ALTER TABLE public.events
  ADD COLUMN IF NOT EXISTS committee_id UUID REFERENCES public.committees(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_events_committee_id ON public.events(committee_id);
CREATE INDEX IF NOT EXISTS idx_committees_slug ON public.committees(slug);

-- Band announcements (weekly posts, meeting notes)
CREATE TABLE IF NOT EXISTS public.band_announcements (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  committee_id UUID REFERENCES public.committees(id) ON DELETE CASCADE NOT NULL,
  title VARCHAR NOT NULL,
  content TEXT NOT NULL,
  type VARCHAR DEFAULT 'announcement' CHECK (type IN ('announcement', 'meeting', 'update')),
  image_url VARCHAR,
  author_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  published_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_band_announcements_committee ON public.band_announcements(committee_id);
CREATE INDEX IF NOT EXISTS idx_band_announcements_published ON public.band_announcements(published_at DESC);

-- Per-band admin assignments (band leaders manage only their band)
CREATE TABLE IF NOT EXISTS public.band_admins (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  committee_id UUID REFERENCES public.committees(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(committee_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_band_admins_user ON public.band_admins(user_id);

-- Contact form submissions
CREATE TABLE IF NOT EXISTS public.contact_submissions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name VARCHAR NOT NULL,
  email VARCHAR NOT NULL,
  subject VARCHAR,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS for new tables
ALTER TABLE public.band_announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.band_admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;

-- Anyone can read band announcements
CREATE POLICY "Anyone can view band announcements" ON public.band_announcements
  FOR SELECT USING (true);

-- Band admins, committee leaders, and site admins can manage announcements
CREATE POLICY "Band admins can manage announcements" ON public.band_announcements
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
    OR EXISTS (
      SELECT 1 FROM public.band_admins ba
      WHERE ba.user_id = auth.uid() AND ba.committee_id = band_announcements.committee_id
    )
    OR EXISTS (
      SELECT 1 FROM public.committees c
      WHERE c.id = band_announcements.committee_id AND c.leader_id = auth.uid()
    )
    OR EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'leader')
  );

CREATE POLICY "Anyone can view band admins" ON public.band_admins FOR SELECT USING (true);
CREATE POLICY "Admins manage band admins" ON public.band_admins FOR ALL USING (
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
);

CREATE POLICY "Anyone can submit contact" ON public.contact_submissions FOR INSERT WITH CHECK (true);
CREATE POLICY "Leaders view contact submissions" ON public.contact_submissions FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('leader', 'admin'))
);

-- Band-specific committee update policy
CREATE POLICY "Band admins can update their committee" ON public.committees
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
    OR EXISTS (
      SELECT 1 FROM public.band_admins ba
      WHERE ba.user_id = auth.uid() AND ba.committee_id = committees.id
    )
    OR leader_id = auth.uid()
  );

-- Band admins can manage events for their committee
CREATE POLICY "Band admins can manage committee events" ON public.events
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
    OR EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'leader')
    OR (
      committee_id IS NOT NULL AND EXISTS (
        SELECT 1 FROM public.band_admins ba
        WHERE ba.user_id = auth.uid() AND ba.committee_id = events.committee_id
      )
    )
    OR (
      committee_id IS NOT NULL AND EXISTS (
        SELECT 1 FROM public.committees c
        WHERE c.id = events.committee_id AND c.leader_id = auth.uid()
      )
    )
  );

CREATE TRIGGER update_band_announcements_updated_at
  BEFORE UPDATE ON public.band_announcements
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Event attendee increment RPC
CREATE OR REPLACE FUNCTION increment_event_attendees(event_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE public.events
  SET current_attendees = COALESCE(current_attendees, 0) + 1
  WHERE id = event_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Storage bucket for band/media images (run in Supabase dashboard or via API)
-- INSERT INTO storage.buckets (id, name, public) VALUES ('media', 'media', true);



-- ════════════════ migrations/003_the_haven_app.sql ════════════════

-- The Haven mobile app: Google sign-in profiles, security hardening, orders, storage
-- Run after schema.sql and 002_bands_extension.sql

-- ───────────────────────── Role helpers ─────────────────────────
-- SECURITY DEFINER so policies can check roles without recursing through users RLS
CREATE OR REPLACE FUNCTION public.current_role_name()
RETURNS text LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT role FROM public.users WHERE id = auth.uid()
$$;

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT coalesce(public.current_role_name() = 'admin', false)
$$;

CREATE OR REPLACE FUNCTION public.is_leader()
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT coalesce(public.current_role_name() IN ('leader', 'admin'), false)
$$;

-- ───────────────────────── Profiles ─────────────────────────
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS avatar_url VARCHAR;

-- Create a profile for every new auth user (email or Google). Role is always 'student'.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.users (id, email, name, role, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    coalesce(
      NEW.raw_user_meta_data ->> 'full_name',
      NEW.raw_user_meta_data ->> 'name',
      split_part(NEW.email, '@', 1)
    ),
    'student',
    NEW.raw_user_meta_data ->> 'avatar_url'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Backfill profiles for anyone who signed up before this migration
INSERT INTO public.users (id, email, name, role)
SELECT u.id, u.email, coalesce(u.raw_user_meta_data ->> 'full_name', u.raw_user_meta_data ->> 'name', split_part(u.email, '@', 1)), 'student'
FROM auth.users u
WHERE NOT EXISTS (SELECT 1 FROM public.users p WHERE p.id = u.id);

-- Only admins may change roles. auth.uid() is NULL in the SQL editor, which lets you promote the first admin.
CREATE OR REPLACE FUNCTION public.guard_role_change()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NEW.role IS DISTINCT FROM OLD.role AND auth.uid() IS NOT NULL AND NOT public.is_admin() THEN
    RAISE EXCEPTION 'Only admins can change roles';
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS guard_user_role ON public.users;
CREATE TRIGGER guard_user_role BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION public.guard_role_change();

DROP POLICY IF EXISTS "Users can view all profiles" ON public.users;
DROP POLICY IF EXISTS "Users can update own profile" ON public.users;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.users;
CREATE POLICY "View own profile, leaders view all" ON public.users
  FOR SELECT USING (auth.uid() = id OR public.is_leader());
CREATE POLICY "Update own profile" ON public.users
  FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Admins update any profile" ON public.users
  FOR UPDATE USING (public.is_admin());
CREATE POLICY "Insert own student profile" ON public.users
  FOR INSERT WITH CHECK (auth.uid() = id AND role = 'student');

-- ───────────────────────── Posts ─────────────────────────
-- Previously any signed-in user could publish; now leaders and admins only
DROP POLICY IF EXISTS "Authors can manage their posts" ON public.posts;
DROP POLICY IF EXISTS "Admins can manage all posts" ON public.posts;
CREATE POLICY "Leaders manage posts" ON public.posts
  FOR ALL USING (public.is_leader()) WITH CHECK (public.is_leader());

-- ───────────────────────── Prayer requests ─────────────────────────
ALTER TABLE public.prayer_requests ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES public.users(id) ON DELETE SET NULL;
-- Requests are private: only the requester and the prayer team (leaders) can read them
DROP POLICY IF EXISTS "Anyone can view non-anonymous prayer requests" ON public.prayer_requests;
DROP POLICY IF EXISTS "Anyone can submit prayer requests" ON public.prayer_requests;
CREATE POLICY "Requester or leaders view prayer requests" ON public.prayer_requests
  FOR SELECT USING ((user_id IS NOT NULL AND auth.uid() = user_id) OR public.is_leader());
CREATE POLICY "Anyone can submit prayer requests" ON public.prayer_requests
  FOR INSERT WITH CHECK (status = 'active' AND (user_id IS NULL OR auth.uid() = user_id));

-- ───────────────────────── Gallery ─────────────────────────
DROP POLICY IF EXISTS "Authenticated users can upload to gallery" ON public.gallery_items;
DROP POLICY IF EXISTS "Users can manage their uploads" ON public.gallery_items;

-- ───────────────────────── Volunteers ─────────────────────────
CREATE POLICY "Leaders update volunteers" ON public.volunteers
  FOR UPDATE USING (public.is_leader());

-- ───────────────────────── Counseling ─────────────────────────
DROP POLICY IF EXISTS "Anyone can submit counseling requests" ON public.counseling_requests;
CREATE POLICY "Anyone can submit counseling requests" ON public.counseling_requests
  FOR INSERT WITH CHECK (status = 'pending' AND (user_id IS NULL OR auth.uid() = user_id));

-- ───────────────────────── Donations (pledges) ─────────────────────────
ALTER TABLE public.donations ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES public.users(id) ON DELETE SET NULL;
CREATE POLICY "Donors view own pledges" ON public.donations
  FOR SELECT USING (user_id IS NOT NULL AND auth.uid() = user_id);
CREATE POLICY "Admins update donations" ON public.donations
  FOR UPDATE USING (public.is_admin());

-- ───────────────────────── Events: attendee count via trigger ─────────────────────────
-- Replaces the client-callable increment RPC, which anyone could call repeatedly
CREATE OR REPLACE FUNCTION public.sync_event_attendees()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  target UUID := coalesce(NEW.event_id, OLD.event_id);
BEGIN
  UPDATE public.events
  SET current_attendees = (SELECT count(*) FROM public.event_attendees WHERE event_id = target)
  WHERE id = target;
  RETURN NULL;
END;
$$;

DROP TRIGGER IF EXISTS event_attendees_count ON public.event_attendees;
CREATE TRIGGER event_attendees_count
  AFTER INSERT OR DELETE ON public.event_attendees
  FOR EACH ROW EXECUTE FUNCTION public.sync_event_attendees();

REVOKE EXECUTE ON FUNCTION public.increment_event_attendees(UUID) FROM anon, authenticated;

-- Attendee lists are visible to the attendee and leaders only
DROP POLICY IF EXISTS "Anyone can view event attendees" ON public.event_attendees;
CREATE POLICY "Own registrations or leaders" ON public.event_attendees
  FOR SELECT USING (auth.uid() = user_id OR public.is_leader());

-- ───────────────────────── Band membership ─────────────────────────
DROP POLICY IF EXISTS "Anyone can view committee members" ON public.committee_members;
CREATE POLICY "Members see own membership, leaders see all" ON public.committee_members
  FOR SELECT USING (auth.uid() = user_id OR public.is_leader());
CREATE POLICY "Members can leave" ON public.committee_members
  FOR DELETE USING (auth.uid() = user_id);

-- Public member counts per band without exposing who the members are
CREATE OR REPLACE FUNCTION public.band_member_count(band UUID)
RETURNS integer LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT count(*)::int FROM public.committee_members WHERE committee_id = band
$$;

-- ───────────────────────── Contact messages ─────────────────────────
CREATE POLICY "Admins delete contact submissions" ON public.contact_submissions
  FOR DELETE USING (public.is_admin());

-- ───────────────────────── Merch orders ─────────────────────────
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  reference VARCHAR UNIQUE NOT NULL,
  user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  customer_name VARCHAR NOT NULL,
  customer_email VARCHAR NOT NULL,
  customer_phone VARCHAR NOT NULL,
  pickup_note TEXT,
  items JSONB NOT NULL,
  total_zmw NUMERIC(10,2) NOT NULL CHECK (total_zmw >= 0),
  status VARCHAR NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'confirmed', 'ready', 'collected', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_orders_user ON public.orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_created ON public.orders(created_at DESC);
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Members place their own orders" ON public.orders
  FOR INSERT WITH CHECK (auth.uid() = user_id AND status = 'pending');
CREATE POLICY "Members view own orders, leaders view all" ON public.orders
  FOR SELECT USING (auth.uid() = user_id OR public.is_leader());
CREATE POLICY "Leaders update orders" ON public.orders
  FOR UPDATE USING (public.is_leader());

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON public.orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ───────────────────────── Storage: public "media" bucket ─────────────────────────
INSERT INTO storage.buckets (id, name, public)
VALUES ('media', 'media', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public read media" ON storage.objects
  FOR SELECT USING (bucket_id = 'media');
CREATE POLICY "Leaders upload media" ON storage.objects
  FOR INSERT TO authenticated WITH CHECK (bucket_id = 'media' AND public.is_leader());
CREATE POLICY "Leaders delete media" ON storage.objects
  FOR DELETE TO authenticated USING (bucket_id = 'media' AND public.is_leader());



-- ════════════════ migrations/004_band_admin_access.sql ════════════════

-- Band admin access for The Haven app
-- Run after 003_the_haven_app.sql
-- Band admins and band leaders (who may be students) can see and remove the members of the bands they manage.

CREATE OR REPLACE FUNCTION public.manages_band(band UUID)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT public.is_admin()
    OR EXISTS (SELECT 1 FROM public.band_admins WHERE committee_id = band AND user_id = auth.uid())
    OR EXISTS (SELECT 1 FROM public.committees WHERE id = band AND leader_id = auth.uid())
$$;

DROP POLICY IF EXISTS "Band managers see their members" ON public.committee_members;
CREATE POLICY "Band managers see their members" ON public.committee_members
  FOR SELECT USING (public.manages_band(committee_id));

DROP POLICY IF EXISTS "Band managers remove members" ON public.committee_members;
CREATE POLICY "Band managers remove members" ON public.committee_members
  FOR DELETE USING (public.manages_band(committee_id));

-- Names and emails of their band's members only.
-- SECURITY DEFINER so this check doesn't read committee_members through RLS (which would loop back to users).
CREATE OR REPLACE FUNCTION public.manages_member(member UUID)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.committee_members cm
    WHERE cm.user_id = member AND public.manages_band(cm.committee_id)
  )
$$;

DROP POLICY IF EXISTS "Band managers see member profiles" ON public.users;
CREATE POLICY "Band managers see member profiles" ON public.users
  FOR SELECT USING (public.manages_member(id));

-- schema.sql's leader policy reads public.users through RLS; use the helper instead
DROP POLICY IF EXISTS "Leaders can manage committee members" ON public.committee_members;
CREATE POLICY "Leaders can manage committee members" ON public.committee_members
  FOR ALL USING (public.is_leader()) WITH CHECK (public.is_leader());



-- ════════════════ seed-bands.sql ════════════════

-- Seed the five ministry bands (run after 002_bands_extension.sql)

INSERT INTO public.committees (
  name, slug, description, focus_area, meeting_time, meeting_location,
  mission, responsibilities, how_to_join, important_info,
  leader_name, leader_position, leader_tenure,
  leader_email, leader_phone, leader_image_url,
  is_band, sort_order, activities, hero_image_url
) VALUES
(
  'Bible Study Band', 'bible-study-band',
  'The Bible Study Band leads weekly Scripture studies, discipleship groups, and topical studies.',
  'Biblical Education & Spiritual Growth', 'Wednesdays, 7:00 PM', 'Ministry Center – Room A',
  'To nurture a deep love for God''s Word and equip students to study Scripture faithfully.',
  'Plan and facilitate weekly studies, prepare discussion guides, and mentor new study leaders.',
  'Attend any Wednesday Bible study or speak with the band leader after Sabbath worship.',
  'Bring your Bible and a notebook. Study outlines are shared each week.',
  'Coordinator TBD', 'Bible Study Band Leader', 'Academic Year 2025–2026',
  NULL, NULL, NULL,
  true, 1,
  ARRAY['Weekly Bible studies', 'Topical series', 'Scripture memorization', 'Small group discipleship'], 'local:kcm_0729'
),
(
  'Publicity Committee', 'publicity-committee',
  'The Publicity Committee communicates ministry news across campus through digital and print media.',
  'Communications & Outreach', 'Thursdays, 5:30 PM', 'Media Room',
  'To proclaim Christ and our ministry events clearly, creatively, and consistently.',
  'Design promotional materials, manage social channels, and coordinate cross-promotion.',
  'Come to Thursday meetings with ideas or skills in design, writing, or photography.',
  'Submit event promo requests at least one week before your event date.',
  'Coordinator TBD', 'Publicity Committee Chair', 'Academic Year 2025–2026',
  NULL, NULL, NULL,
  true, 2,
  ARRAY['Social media', 'Flyers & posters', 'Photography', 'Website updates'], 'local:kcm_0681'
),
(
  'Welfare Band', 'welfare-band',
  'The Welfare Band cares for students'' practical and emotional needs through visitation and care packages.',
  'Pastoral Care & Student Support', 'Sundays, 1:00 PM', 'Fellowship Hall',
  'To reflect Christ''s compassion by meeting tangible needs and walking alongside students.',
  'Coordinate welfare visits, manage care fund requests, and organize care packages.',
  'Speak with the welfare leader after Sabbath service or message us in The Haven app.',
  'Welfare needs can be submitted confidentially through the prayer request screen in The Haven app.',
  'Coordinator TBD', 'Welfare Band Leader', 'Academic Year 2025–2026',
  NULL, NULL, NULL,
  true, 3,
  ARRAY['Hospital visits', 'Care packages', 'Meal support', 'Crisis response'], 'local:kcm_0741'
),
(
  'Health Band', 'health-band',
  'The Health Band promotes wholistic health through seminars, lifestyle education, and wellness activities.',
  'Health Ministry & Wellness', 'Tuesdays, 6:00 PM', 'Wellness Room',
  'To teach biblical principles of health and empower students to honor God with their bodies.',
  'Plan health seminars, partner with professionals, and promote NEWSTART principles.',
  'Attend a Tuesday meeting or volunteer for our next health expo.',
  'Our annual Health Expo is held each spring—watch announcements for dates.',
  'Coordinator TBD', 'Health Band Leader', 'Academic Year 2025–2026',
  NULL, NULL, NULL,
  true, 4,
  ARRAY['Health expos', 'Cooking demos', 'Fitness walks', 'Mental health workshops'], 'local:kcm_0669'
),
(
  'Witnessing Band', 'witnessing-band',
  'The Witnessing Band equips students to share their faith on campus through outreach and literature.',
  'Evangelism & Soul Winning', 'Fridays, 6:00 PM', 'Ministry Center',
  'To fulfill the Great Commission by training every member to share Christ with love and clarity.',
  'Organize weekly outreach, train members, coordinate literature, and follow up with interested students.',
  'Join Friday outreach nights—training is provided every week.',
  'Outreach materials are provided. Wear comfortable shoes and bring a friend!',
  'Coordinator TBD', 'Witnessing Band Leader', 'Academic Year 2025–2026',
  NULL, NULL, NULL,
  true, 5,
  ARRAY['Campus outreach', 'Literature evangelism', 'Bible mark studies', 'Mission trips'], 'local:kcm_0822'
)
ON CONFLICT (slug) DO NOTHING;

-- Bundled app photos for any band without a hero image
UPDATE public.committees SET hero_image_url = 'local:kcm_0549' WHERE is_band AND hero_image_url IS NULL;



-- ════════════════ migrations/006_leadership_and_publicity.sql ════════════════

-- Leadership offices, Publicity Committee content access, and new bands
-- Run after 005_fix_policy_recursion.sql. Safe to run more than once.

-- ───────────────────────── Leadership offices ─────────────────────────
-- Developer, Chairperson and Vice Chairperson are admins with a named office.
-- The app keeps working off `role`; the website shows each office its own panel.
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS office VARCHAR;
ALTER TABLE public.users DROP CONSTRAINT IF EXISTS users_office_check;
ALTER TABLE public.users ADD CONSTRAINT users_office_check
  CHECK (office IS NULL OR office IN ('developer', 'chairperson', 'vice_chairperson'));

-- Only admins may change roles or offices. auth.uid() is NULL in the SQL editor, which lets you set the first admin.
CREATE OR REPLACE FUNCTION public.guard_role_change()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF (NEW.role IS DISTINCT FROM OLD.role OR NEW.office IS DISTINCT FROM OLD.office)
     AND auth.uid() IS NOT NULL AND NOT public.is_admin() THEN
    RAISE EXCEPTION 'Only admins can change roles or offices';
  END IF;
  RETURN NEW;
END;
$$;

-- ───────────────────────── Publicity Committee ─────────────────────────
-- The Publicity Committee runs what the website and app show: posts, events, gallery, resources and media.
CREATE OR REPLACE FUNCTION public.is_publicity_admin()
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT public.is_leader()
    OR EXISTS (
      SELECT 1 FROM public.band_admins ba
      JOIN public.committees c ON c.id = ba.committee_id
      WHERE ba.user_id = auth.uid() AND c.slug = 'publicity-committee'
    )
    OR EXISTS (SELECT 1 FROM public.committees WHERE slug = 'publicity-committee' AND leader_id = auth.uid())
$$;

DROP POLICY IF EXISTS "Publicity manages posts" ON public.posts;
CREATE POLICY "Publicity manages posts" ON public.posts
  FOR ALL USING (public.is_publicity_admin()) WITH CHECK (public.is_publicity_admin());

DROP POLICY IF EXISTS "Publicity manages events" ON public.events;
CREATE POLICY "Publicity manages events" ON public.events
  FOR ALL USING (public.is_publicity_admin()) WITH CHECK (public.is_publicity_admin());

DROP POLICY IF EXISTS "Publicity manages gallery" ON public.gallery_items;
CREATE POLICY "Publicity manages gallery" ON public.gallery_items
  FOR ALL USING (public.is_publicity_admin()) WITH CHECK (public.is_publicity_admin());

DROP POLICY IF EXISTS "Publicity manages resources" ON public.resources;
CREATE POLICY "Publicity manages resources" ON public.resources
  FOR ALL USING (public.is_publicity_admin()) WITH CHECK (public.is_publicity_admin());

DROP POLICY IF EXISTS "Publicity uploads media" ON storage.objects;
CREATE POLICY "Publicity uploads media" ON storage.objects
  FOR INSERT TO authenticated WITH CHECK (bucket_id = 'media' AND public.is_publicity_admin());
DROP POLICY IF EXISTS "Publicity deletes media" ON storage.objects;
CREATE POLICY "Publicity deletes media" ON storage.objects
  FOR DELETE TO authenticated USING (bucket_id = 'media' AND public.is_publicity_admin());

-- Band managers upload their band's photos (announcements, band header)
DROP POLICY IF EXISTS "Band admins upload media" ON storage.objects;
CREATE POLICY "Band admins upload media" ON storage.objects
  FOR INSERT TO authenticated WITH CHECK (
    bucket_id = 'media' AND EXISTS (SELECT 1 FROM public.band_admins WHERE user_id = auth.uid())
  );

-- ───────────────────────── New bands & committees ─────────────────────────
INSERT INTO public.committees (
  name, slug, description, focus_area, meeting_time, meeting_location,
  mission, responsibilities, how_to_join, important_info,
  leader_name, leader_position, leader_tenure,
  is_band, sort_order, activities, hero_image_url
) VALUES
(
  'Stu-MM', 'stu-mm',
  'Stu-MM, the Student Missionary Movement, trains and sends students to share Christ on campus and in the communities around it.',
  'Missions & Evangelism', 'Sundays, 2:00 PM', 'Ministry Center',
  'To raise a generation of students who live as missionaries wherever God places them.',
  'Plan mission trips and outreach weekends, train student missionaries and follow up new believers.',
  'Come to a Sunday meeting or talk to the Stu-MM leader after Sabbath worship.',
  NULL,
  'Coordinator TBD', 'Stu-MM Leader', 'Academic Year 2026–2027',
  true, 6, ARRAY['Mission trips', 'Community outreach', 'Missionary training', 'Follow-up visits'], 'local:kcm_0799'
),
(
  'Creativity & Arts Band', 'creativity-arts-band',
  'The Creativity & Arts Band uses music, drama, poetry and visual art to tell the gospel story in fresh ways.',
  'Music, Drama & Creative Arts', 'Fridays, 4:00 PM', 'Music Room',
  'To glorify God with every creative gift and bring the gospel to life on stage and screen.',
  'Prepare special music, skits and spoken word for worship and events, and design artwork for programs.',
  'Bring your gift, whether singing, acting, writing or drawing, to any Friday rehearsal.',
  NULL,
  'Coordinator TBD', 'Creativity & Arts Band Leader', 'Academic Year 2026–2027',
  true, 7, ARRAY['Special music', 'Drama & skits', 'Spoken word', 'Artwork & design'], 'local:kcm_0681'
),
(
  'Education Committee', 'education-committee',
  'The Education Committee supports students academically with study groups, tutoring and seminars on faith and learning.',
  'Academic Support & Mentorship', 'Tuesdays, 5:00 PM', 'Ministry Center – Room B',
  'To help every student excel in their studies as an act of worship.',
  'Run study groups and peer tutoring, organise academic seminars and connect students with mentors.',
  'Sign up for a study group or volunteer as a tutor at any Tuesday meeting.',
  NULL,
  'Coordinator TBD', 'Education Committee Chair', 'Academic Year 2026–2027',
  true, 8, ARRAY['Study groups', 'Peer tutoring', 'Academic seminars', 'Mentorship'], 'local:kcm_0729'
),
(
  'Catering Committee', 'catering-committee',
  'The Catering Committee prepares and serves meals for fellowship lunches, retreats and ministry events.',
  'Hospitality & Fellowship Meals', 'Thursdays, 4:00 PM', 'Fellowship Hall',
  'To show Christ''s love through the ministry of hospitality.',
  'Plan menus and budgets, prepare and serve food at events and keep the kitchen running smoothly.',
  'Join the team at a Thursday meeting. No cooking experience needed.',
  'Food requests for events should reach the committee at least one week ahead.',
  'Coordinator TBD', 'Catering Committee Chair', 'Academic Year 2026–2027',
  true, 9, ARRAY['Fellowship lunches', 'Event catering', 'Retreat meals', 'Menu planning'], 'local:kcm_0741'
)
ON CONFLICT (slug) DO NOTHING;
