'use client'

import { useCallback, useEffect, useState } from 'react'
import { CheckCircle2, Database, KeyRound, RefreshCw, ShieldCheck, XCircle } from 'lucide-react'
import { AdminPage } from '@/components/admin/kit'
import { useAuth } from '@/components/auth/AuthProvider'
import { Badge, Card, IconTile, Notice } from '@/components/ui/haven'
import { Button } from '@/components/ui/button'
import { supabase } from '@/lib/supabase'
import { OFFICE_LABEL } from '@/lib/brand'
import { cn } from '@/lib/utils'

const TABLES = [
  'users', 'posts', 'events', 'committees', 'committee_members', 'band_admins', 'band_announcements',
  'event_attendees', 'prayer_requests', 'counseling_requests', 'volunteers', 'donations', 'orders',
  'contact_submissions', 'gallery_items', 'resources',
] as const

type Check = { label: string; ok: boolean; detail: string }

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ''
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ''

export default function DeveloperPage() {
  const { user, profile, managedBands } = useAuth()
  const [checks, setChecks] = useState<Check[] | null>(null)
  const [counts, setCounts] = useState<Record<string, number | string>>({})
  const [leadership, setLeadership] = useState<{ name: string; email: string; role: string; office: string | null }[]>([])
  const [running, setRunning] = useState(false)

  const run = useCallback(async () => {
    if (!supabase) return
    setRunning(true)
    const out: Check[] = []
    const t0 = performance.now()
    try {
      const res = await fetch(`${SUPABASE_URL}/auth/v1/settings`, { headers: { apikey: SUPABASE_KEY } })
      const s = await res.json()
      const ms = Math.round(performance.now() - t0)
      out.push({ label: 'Supabase reachable', ok: res.ok, detail: `${new URL(SUPABASE_URL).host} · ${ms} ms` })
      const providers = Object.entries(s.external ?? {}).filter(([, v]) => v === true).map(([k]) => k)
      out.push({ label: 'Email sign-in', ok: Boolean(s.external?.email), detail: s.mailer_autoconfirm ? 'No confirmation needed' : 'Email confirmation required' })
      out.push({ label: 'Google sign-in', ok: Boolean(s.external?.google), detail: s.external?.google ? 'Enabled' : 'Not enabled — add the Google OAuth client in Supabase' })
      out.push({ label: 'Providers', ok: providers.length > 0, detail: providers.join(', ') || 'none' })
    } catch (err) {
      out.push({ label: 'Supabase reachable', ok: false, detail: err instanceof Error ? err.message : 'Network error' })
    }

    const { data: officeCol, error: officeErr } = await supabase.from('users').select('office').limit(1)
    out.push({
      label: 'Migration 006 (offices & publicity)',
      ok: !officeErr && Array.isArray(officeCol),
      detail: officeErr ? officeErr.message : 'users.office present',
    })

    const { error: bucketErr } = await supabase.storage.from('media').list('', { limit: 1 })
    out.push({ label: 'Storage bucket “media”', ok: !bucketErr, detail: bucketErr ? bucketErr.message : 'Readable' })

    out.push({ label: 'Signed in', ok: Boolean(user), detail: `${user?.email} · ${profile?.role}${profile?.office ? ` · ${OFFICE_LABEL[profile.office]}` : ''}` })
    out.push({ label: 'Bands you run', ok: true, detail: managedBands.join(', ') || 'none' })
    setChecks(out)

    const c: Record<string, number | string> = {}
    await Promise.all(
      TABLES.map(async (t) => {
        const { count, error } = await supabase!.from(t).select('*', { count: 'exact', head: true })
        c[t] = error ? error.message : count ?? 0
      })
    )
    setCounts(c)

    const { data: leaders } = await supabase
      .from('users')
      .select('name, email, role, office')
      .in('role', ['admin', 'leader'])
      .order('role')
    setLeadership(leaders ?? [])
    setRunning(false)
  }, [user, profile, managedBands])

  useEffect(() => {
    run()
  }, [run])

  return (
    <AdminPage
      eyebrow="System"
      title="Developer"
      description="Health of the shared Supabase backend that the website and the app both use."
      actions={
        <Button variant="outline" onClick={run} disabled={running}>
          <RefreshCw className={cn(running && 'animate-spin')} /> Re-run checks
        </Button>
      }
    >
      {!supabase && <Notice tone="error">Supabase is not configured in this build.</Notice>}

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <div className="flex items-center gap-3 mb-4">
            <IconTile icon={ShieldCheck} />
            <h2 className="text-xl text-ink">Checks</h2>
          </div>
          <ul className="space-y-2">
            {(checks ?? []).map((c) => (
              <li key={c.label} className="flex items-start gap-3 rounded-xl bg-canvas px-3 py-2.5">
                {c.ok ? <CheckCircle2 className="h-5 w-5 shrink-0 text-success" /> : <XCircle className="h-5 w-5 shrink-0 text-destructive" />}
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-ink">{c.label}</p>
                  <p className="text-xs text-muted-foreground break-words">{c.detail}</p>
                </div>
              </li>
            ))}
            {!checks && <p className="text-sm text-muted-foreground">Running…</p>}
          </ul>
        </Card>

        <Card>
          <div className="flex items-center gap-3 mb-4">
            <IconTile icon={Database} />
            <h2 className="text-xl text-ink">Tables</h2>
          </div>
          <p className="text-xs text-muted-foreground mb-3">Row counts as your account sees them (row-level security applies).</p>
          <ul className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-sm">
            {TABLES.map((t) => (
              <li key={t} className="flex justify-between gap-2 border-b border-border/60 py-1">
                <span className="font-mono text-xs text-ink/80 truncate">{t}</span>
                <span className={cn('font-semibold', typeof counts[t] === 'string' && 'text-destructive text-xs')}>{counts[t] ?? '…'}</span>
              </li>
            ))}
          </ul>
        </Card>

        <Card className="lg:col-span-2">
          <div className="flex items-center gap-3 mb-4">
            <IconTile icon={KeyRound} />
            <h2 className="text-xl text-ink">Leaders & admins</h2>
          </div>
          <ul className="divide-y divide-border">
            {leadership.map((l) => (
              <li key={l.email} className="flex flex-wrap items-center justify-between gap-2 py-2.5 text-sm">
                <span>
                  <b className="text-ink">{l.name}</b> <span className="text-muted-foreground">· {l.email}</span>
                </span>
                <span className="flex gap-2">
                  {l.office && <Badge tone="gold">{OFFICE_LABEL[l.office] ?? l.office}</Badge>}
                  <Badge tone={l.role === 'admin' ? 'navy' : 'muted'}>{l.role}</Badge>
                </span>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-xs text-muted-foreground">
            Roles and offices are changed under Users &amp; roles. Test logins are (re)issued with <code className="font-mono">node scripts/admin/provision.mjs</code>.
          </p>
        </Card>
      </div>
    </AdminPage>
  )
}
