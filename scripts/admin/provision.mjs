#!/usr/bin/env node
/**
 * Provision The Haven's Supabase project for testing:
 *   1. apply supabase/migrations/006_leadership_and_publicity.sql
 *   2. create pre-confirmed logins for leadership and band/committee heads
 *   3. assign offices (developer / chairperson / vice chairperson) and band dashboards
 *   4. turn on Google sign-in and set redirect URLs (when Google credentials are present)
 *
 * Reads SUPABASE_ACCESS_TOKEN (+ optional GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET) from .env.admin.local.
 * The service key is fetched in memory and never written to disk.
 * Writes the logins to CREDENTIALS.local.md (git-ignored). Safe to run again: passwords come from
 * credentials.local.json (see accounts.mjs); pass --rotate for new ones.
 *
 *   node scripts/admin/provision.mjs [--site https://your-site.vercel.app] [--skip-migration] [--rotate]
 */
import fs from 'node:fs'
import path from 'node:path'
import { createClient } from '@supabase/supabase-js'
import { withPasswords, writeHandover } from './accounts.mjs'
import { authEmailConfig } from './email-templates.mjs'

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '../..')
const readEnv = (file) =>
  fs.existsSync(file)
    ? Object.fromEntries(
        fs
          .readFileSync(file, 'utf8')
          .split('\n')
          .filter((l) => /^[A-Z_]+=/.test(l))
          .map((l) => [l.slice(0, l.indexOf('=')), l.slice(l.indexOf('=') + 1).trim()])
      )
    : {}

const env = { ...readEnv(path.join(root, '.env.local')), ...readEnv(path.join(root, '.env.admin.local')) }
const args = process.argv.slice(2)
const site = args.includes('--site') ? args[args.indexOf('--site') + 1].replace(/\/$/, '') : null
const url = env.NEXT_PUBLIC_SUPABASE_URL
const ref = url?.match(/https:\/\/([a-z0-9]+)\.supabase\.co/)?.[1]
const token = env.SUPABASE_ACCESS_TOKEN

if (!ref) throw new Error('NEXT_PUBLIC_SUPABASE_URL missing from .env.local')
if (!token) throw new Error('SUPABASE_ACCESS_TOKEN missing from .env.admin.local')

const api = async (method, p, body) => {
  const res = await fetch(`https://api.supabase.com/v1/projects/${ref}${p}`, {
    method,
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  })
  const text = await res.text()
  if (!res.ok) throw new Error(`${method} ${p} → ${res.status} ${text.slice(0, 300)}`)
  return text ? JSON.parse(text) : null
}
const sql = (query) => api('POST', '/database/query', { query })
const lit = (v) => (v == null ? 'NULL' : `'${String(v).replace(/'/g, "''")}'`)

async function main() {
  // 1. Migration
  if (!args.includes('--skip-migration')) {
    const migration = fs.readFileSync(path.join(root, 'supabase/migrations/006_leadership_and_publicity.sql'), 'utf8')
    await sql(migration)
    console.log('✓ Applied 006_leadership_and_publicity.sql')
  }

  // 2. Service client (in memory only)
  const keys = await api('GET', '/api-keys?reveal=true')
  const secret =
    keys.find((k) => k.type === 'secret' && k.api_key)?.api_key ?? keys.find((k) => k.name === 'service_role')?.api_key
  if (!secret) throw new Error('Could not read a secret key for the project')
  const admin = createClient(url, secret, { auth: { persistSession: false, autoRefreshToken: false } })

  const existing = new Map()
  for (let page = 1; ; page++) {
    const { data, error } = await admin.auth.admin.listUsers({ page, perPage: 1000 })
    if (error) throw error
    data.users.forEach((u) => existing.set(u.email?.toLowerCase(), u))
    if (data.users.length < 1000) break
  }

  const created = []
  for (const acct of withPasswords({ rotate: args.includes('--rotate') })) {
    const pw = acct.password
    let user = existing.get(acct.email)
    if (user) {
      const { data, error } = await admin.auth.admin.updateUserById(user.id, { password: pw, email_confirm: true })
      if (error) throw error
      user = data.user
    } else {
      const { data, error } = await admin.auth.admin.createUser({
        email: acct.email,
        password: pw,
        email_confirm: true,
        user_metadata: { name: acct.name, full_name: acct.name },
      })
      if (error) throw error
      user = data.user
    }
    created.push({ ...acct, id: user.id, password: pw })
    console.log(`✓ ${existing.has(acct.email) ? 'Reset' : 'Created'} ${acct.email}`)
  }

  // 3. Roles, offices and band dashboards (runs as postgres, so the role guard allows it)
  const statements = []
  for (const a of created) {
    const isLeadership = Boolean(a.office)
    statements.push(
      `INSERT INTO public.users (id, email, name, role) VALUES (${lit(a.id)}, ${lit(a.email)}, ${lit(a.name)}, 'student') ON CONFLICT (id) DO NOTHING;`,
      `UPDATE public.users SET name = ${lit(a.name)}, role = ${isLeadership ? "'admin'" : "'student'"}, office = ${lit(a.office ?? null)} WHERE id = ${lit(a.id)};`
    )
    if (a.band) {
      statements.push(
        `INSERT INTO public.band_admins (committee_id, user_id) SELECT id, ${lit(a.id)} FROM public.committees WHERE slug = ${lit(a.band)} AND NOT EXISTS (SELECT 1 FROM public.band_admins ba WHERE ba.committee_id = committees.id AND ba.user_id = ${lit(a.id)});`
      )
    }
  }
  await sql(statements.join('\n'))
  const check = await sql(
    `SELECT u.email, u.role, u.office, string_agg(c.slug, ', ') AS bands FROM public.users u LEFT JOIN public.band_admins ba ON ba.user_id = u.id LEFT JOIN public.committees c ON c.id = ba.committee_id WHERE u.email LIKE '%@thehaven.test' GROUP BY 1,2,3 ORDER BY 1;`
  )
  console.table(check)

  // 4. Auth settings: redirect URLs, site URL and Google
  const auth = await api('GET', '/config/auth')
  const allow = new Set((auth.uri_allow_list || '').split(',').map((s) => s.trim()).filter(Boolean))
  ;['http://localhost:3000/**', 'exp://**', 'thehaven://**'].forEach((u) => allow.add(u))
  if (site) allow.add(`${site}/**`)
  // Email links (confirm, reset) land on the live site, not localhost
  const siteUrl = site ?? 'https://pcm-pi.vercel.app'
  allow.add(`${siteUrl}/**`)
  const patch = { uri_allow_list: [...allow].join(','), site_url: siteUrl, ...authEmailConfig() }
  if (env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET) {
    Object.assign(patch, {
      external_google_enabled: true,
      external_google_client_id: env.GOOGLE_CLIENT_ID,
      external_google_secret: env.GOOGLE_CLIENT_SECRET,
    })
  }
  await api('PATCH', '/config/auth', patch)
  console.log(`✓ Auth settings updated: site URL ${siteUrl}, branded emails${patch.external_google_enabled ? ', Google sign-in on' : ' (Google credentials not set — Google left as is)'}`)
  console.log('  Redirect URLs:', patch.uri_allow_list)

  // 5. Hand-over file
  writeHandover(created, site ?? 'https://pcm-pi.vercel.app')
  console.log('✓ Wrote CREDENTIALS.local.md')
}

main().catch((err) => {
  console.error('✗', err.message)
  process.exit(1)
})
