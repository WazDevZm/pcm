#!/usr/bin/env node
/**
 * Writes supabase/provision.local.sql (git-ignored): one file to paste into
 * Supabase → SQL Editor → Run. It applies migration 006 and creates every dashboard login
 * (pre-confirmed, so they can sign in straight away) with its role, office and band.
 * Safe to run again: existing accounts get the passwords from credentials.local.json.
 *
 *   node scripts/admin/make-sql.mjs [--rotate]
 */
import fs from 'node:fs'
import path from 'node:path'
import { root, withPasswords, writeHandover } from './accounts.mjs'

const lit = (v) => (v == null ? 'NULL' : `'${String(v).replace(/'/g, "''")}'`)
const accounts = withPasswords({ rotate: process.argv.includes('--rotate') })
const migration = fs.readFileSync(path.join(root, 'supabase/migrations/006_leadership_and_publicity.sql'), 'utf8')

const userBlock = (a) => `
-- ${a.title}
DO $$
DECLARE uid uuid;
BEGIN
  SELECT id INTO uid FROM auth.users WHERE lower(email) = lower(${lit(a.email)});
  IF uid IS NULL THEN
    uid := gen_random_uuid();
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
      raw_app_meta_data, raw_user_meta_data, created_at, updated_at,
      confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
      '00000000-0000-0000-0000-000000000000', uid, 'authenticated', 'authenticated', ${lit(a.email)},
      extensions.crypt(${lit(a.password)}, extensions.gen_salt('bf')), now(),
      '{"provider":"email","providers":["email"]}'::jsonb,
      jsonb_build_object('name', ${lit(a.name)}, 'full_name', ${lit(a.name)}),
      now(), now(), '', '', '', ''
    );
    INSERT INTO auth.identities (id, user_id, provider_id, identity_data, provider, last_sign_in_at, created_at, updated_at)
    VALUES (
      gen_random_uuid(), uid, uid::text,
      jsonb_build_object('sub', uid::text, 'email', ${lit(a.email)}, 'email_verified', true),
      'email', now(), now(), now()
    );
  ELSE
    UPDATE auth.users
      SET encrypted_password = extensions.crypt(${lit(a.password)}, extensions.gen_salt('bf')),
          email_confirmed_at = coalesce(email_confirmed_at, now()), updated_at = now()
      WHERE id = uid;
  END IF;

  INSERT INTO public.users (id, email, name, role) VALUES (uid, ${lit(a.email)}, ${lit(a.name)}, 'student')
    ON CONFLICT (id) DO NOTHING;
  UPDATE public.users
    SET name = ${lit(a.name)}, role = ${a.office ? "'admin'" : "'student'"}, office = ${lit(a.office ?? null)}
    WHERE id = uid;
${
  a.band
    ? `  INSERT INTO public.band_admins (committee_id, user_id)
    SELECT c.id, uid FROM public.committees c
    WHERE c.slug = ${lit(a.band)}
      AND NOT EXISTS (SELECT 1 FROM public.band_admins ba WHERE ba.committee_id = c.id AND ba.user_id = uid);
`
    : ''
}END $$;
`

const sql = `-- The Haven: dashboards, bands and logins (PRIVATE — contains passwords; do not commit or share)
-- Paste the whole file into Supabase → SQL Editor → New query → Run. Safe to run more than once.
-- Generated ${new Date().toISOString()} by scripts/admin/make-sql.mjs

-- ════════════════ 1. Migration 006: offices, Publicity Committee access, new bands ════════════════
${migration}

-- ════════════════ 2. Dashboard logins ════════════════
${accounts.map(userBlock).join('')}
-- ════════════════ 3. Check ════════════════
SELECT u.email, u.role, u.office, string_agg(c.slug, ', ') AS runs
FROM public.users u
LEFT JOIN public.band_admins ba ON ba.user_id = u.id
LEFT JOIN public.committees c ON c.id = ba.committee_id
WHERE u.email LIKE '%@thehaven.test'
GROUP BY 1, 2, 3
ORDER BY 1;
`

const out = path.join(root, 'supabase/provision.local.sql')
fs.writeFileSync(out, sql, { mode: 0o600 })
writeHandover(accounts)
console.log(`✓ Wrote ${path.relative(root, out)} and CREDENTIALS.local.md for ${accounts.length} logins`)
