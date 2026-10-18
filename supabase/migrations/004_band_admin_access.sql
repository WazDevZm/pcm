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
