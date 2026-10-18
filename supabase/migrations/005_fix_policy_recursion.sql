-- Fix: "infinite recursion detected in policy for relation users"
-- Run once in the SQL Editor if you ran setup.sql before this file existed.
-- (setup.sql and 004 already include this fix for new projects.)

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
