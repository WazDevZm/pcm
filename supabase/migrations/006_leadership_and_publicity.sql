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
