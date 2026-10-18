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
