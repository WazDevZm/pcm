'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowRight, ExternalLink, UserPlus, X } from 'lucide-react'
import { toast } from 'sonner'
import { AdminPage, LoadingRows } from '@/components/admin/kit'
import { useAuth } from '@/components/auth/AuthProvider'
import { Badge, Card, Notice, fieldClass } from '@/components/ui/haven'
import { Button } from '@/components/ui/button'
import { getBands } from '@/lib/bands'
import type { Band } from '@/lib/supabase'
import { addBandAdmin, findUserByEmail, getAllBandAdmins, getMemberCounts, removeBandAdmin, type PersonRow } from '@/lib/data/queues'

function AddHead({ band, onAdded }: { band: Band; onAdded: () => void }) {
  const [email, setEmail] = useState('')
  const [busy, setBusy] = useState(false)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setBusy(true)
    try {
      const person = await findUserByEmail(email)
      if (!person) throw new Error('No account with that email. Ask them to sign in once first.')
      await addBandAdmin(band.id, person.id)
      toast.success(`${person.name} can now run ${band.name}`)
      setEmail('')
      onAdded()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Could not add head')
    } finally {
      setBusy(false)
    }
  }

  return (
    <form onSubmit={submit} className="mt-4 flex gap-2">
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Head’s email"
        aria-label={`Add a head to ${band.name}`}
        className={`${fieldClass} !min-h-10 text-sm`}
      />
      <Button type="submit" size="sm" disabled={busy} className="h-10 shrink-0">
        <UserPlus /> Add
      </Button>
    </form>
  )
}

export default function AdminBandsPage() {
  const { isAdmin } = useAuth()
  const [bands, setBands] = useState<Band[] | null>(null)
  const [heads, setHeads] = useState<Record<string, PersonRow[]>>({})
  const [members, setMembers] = useState<Record<string, number>>({})

  const loadHeads = () => getAllBandAdmins().then(setHeads).catch(() => {})

  useEffect(() => {
    getBands().then(setBands)
    loadHeads()
    getMemberCounts().then(setMembers).catch(() => {})
  }, [])

  const remove = async (band: Band, person: PersonRow) => {
    if (!confirm(`Remove ${person.name} as head of ${band.name}?`)) return
    try {
      await removeBandAdmin(band.id, person.id)
      toast.success('Removed')
      loadHeads()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Could not remove')
    }
  }

  return (
    <AdminPage
      title="Bands & committees"
      description="Each band’s head runs its own dashboard: announcements, events, band details and members. Heads of the Publicity Committee also manage website content."
    >
      {!isAdmin && <Notice className="mb-6">Only admins can assign or remove heads.</Notice>}
      {!bands ? (
        <LoadingRows />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {bands.map((band) => {
            const h = heads[band.id] ?? []
            return (
              <Card key={band.id} className="flex flex-col">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="font-serif text-xl text-ink">{band.name}</h2>
                    <p className="text-sm text-muted-foreground">
                      {members[band.id] ?? 0} members · {band.meeting_time}
                    </p>
                  </div>
                  {band.slug === 'publicity-committee' && <Badge tone="gold">Runs website</Badge>}
                </div>

                <div className="mt-4 flex-1">
                  <p className="eyebrow text-navy mb-2">Heads</p>
                  {h.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No head assigned yet.</p>
                  ) : (
                    <ul className="space-y-1.5">
                      {h.map((p) => (
                        <li key={p.id} className="flex items-center justify-between gap-2 rounded-xl bg-canvas px-3 py-2 text-sm">
                          <span className="min-w-0 truncate">
                            <b className="text-ink">{p.name}</b> <span className="text-muted-foreground">· {p.email}</span>
                          </span>
                          {isAdmin && (
                            <button onClick={() => remove(band, p)} className="rounded-full p-1 text-muted-foreground hover:bg-danger-soft hover:text-destructive" aria-label={`Remove ${p.name}`}>
                              <X className="h-4 w-4" />
                            </button>
                          )}
                        </li>
                      ))}
                    </ul>
                  )}
                  {isAdmin && <AddHead band={band} onAdded={loadHeads} />}
                </div>

                <div className="mt-5 flex gap-2 border-t border-border pt-4">
                  <Button asChild size="sm">
                    <Link href={`/band-admin/${band.slug}`}>
                      Open dashboard <ArrowRight />
                    </Link>
                  </Button>
                  <Button asChild size="sm" variant="outline">
                    <Link href={`/bands/${band.slug}`}>
                      Public page <ExternalLink />
                    </Link>
                  </Button>
                </div>
              </Card>
            )
          })}
        </div>
      )}
    </AdminPage>
  )
}
