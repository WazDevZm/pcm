'use client'

import { useCallback, useEffect, useState } from 'react'
import { Mail, UserMinus, Users } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { EmptyState, Notice } from '@/components/ui/haven'
import { getBandMembers, removeBandMember, type MemberRow } from '@/lib/data/queues'

/** Real member list for a band dashboard (same query as the app's band admin) */
export function BandMembers({ bandId, bandName }: { bandId: string; bandName: string }) {
  const [members, setMembers] = useState<MemberRow[] | null>(null)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState<string | null>(null)

  const load = useCallback(() => {
    getBandMembers(bandId)
      .then((rows) => {
        setMembers(rows)
        setError('')
      })
      .catch((err) => {
        setMembers([])
        setError(err instanceof Error ? err.message : 'Could not load members')
      })
  }, [bandId])

  useEffect(load, [load])

  const remove = async (m: MemberRow) => {
    if (!m.user || !confirm(`Remove ${m.user.name} from ${bandName}?`)) return
    setBusy(m.id)
    try {
      await removeBandMember(bandId, m.user.id)
      toast.success('Member removed')
      load()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Could not remove member')
    } finally {
      setBusy(null)
    }
  }

  const emails = (members ?? []).map((m) => m.user?.email).filter(Boolean).join(',')

  return (
    <div className="rounded-2xl bg-white border border-border p-6">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-serif text-xl text-ink">Members</h2>
          <p className="text-sm text-muted-foreground">People who joined {bandName} on the website or in the app.</p>
        </div>
        {emails && (
          <Button asChild size="sm" variant="outline">
            <a href={`mailto:?bcc=${emails}&subject=${encodeURIComponent(bandName)}`}>
              <Mail /> Email everyone
            </a>
          </Button>
        )}
      </div>
      {error && <Notice tone="error" className="mb-4">{error}</Notice>}
      {!members ? (
        <p className="py-8 text-center text-muted-foreground">Loading…</p>
      ) : members.length === 0 ? (
        <EmptyState icon={Users} title="No members yet" body="Members appear here when they choose “Join this band” on the band page or in the app." />
      ) : (
        <ul className="divide-y divide-border">
          {members.map((m) => (
            <li key={m.id} className="flex items-center justify-between gap-3 py-3">
              <div className="flex min-w-0 items-center gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-navy-soft font-bold text-navy">
                  {(m.user?.name || '?').slice(0, 1).toUpperCase()}
                </span>
                <div className="min-w-0">
                  <p className="truncate font-semibold text-ink">{m.user?.name ?? 'Member'}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {m.user?.email} · joined {new Date(m.joined_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </p>
                </div>
              </div>
              <Button size="sm" variant="ghost" disabled={busy === m.id} onClick={() => remove(m)} className="text-destructive hover:bg-danger-soft hover:text-destructive">
                <UserMinus /> <span className="hidden sm:inline">Remove</span>
              </Button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
