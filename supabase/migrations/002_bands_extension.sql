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
