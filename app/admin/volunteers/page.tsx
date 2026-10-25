'use client'

import { useState } from 'react'
import { Check, HandHeart, PauseCircle, X } from 'lucide-react'
import { AdminPage, LoadingRows, StatusTabs, useQueue, when } from '@/components/admin/kit'
import { Badge, Card, EmptyState, Notice } from '@/components/ui/haven'
import { Button } from '@/components/ui/button'
import { getVolunteerQueue, setVolunteerStatus, type VolunteerRow, type VolunteerStatus } from '@/lib/data/queues'

const STATUSES = ['pending', 'active', 'inactive'] as const

export default function AdminVolunteersPage() {
  const [status, setStatus] = useState<VolunteerStatus>('pending')
  const { rows, error, busy, act } = useQueue<VolunteerRow>(() => getVolunteerQueue(status), [status])

  return (
    <AdminPage title="Volunteers" description="Approve applications to make volunteers active, or pause them when they step back.">
      <StatusTabs options={STATUSES} value={status} onChange={setStatus} />
      {error && <Notice tone="error" className="mb-4">{error}</Notice>}
      {!rows ? (
        <LoadingRows />
      ) : rows.length === 0 ? (
        <Card className="p-0"><EmptyState icon={HandHeart} title={`No ${status} volunteers`} /></Card>
      ) : (
        <div className="grid gap-3 md:grid-cols-2">
          {rows.map((v) => (
            <Card key={v.id} className="flex flex-col">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-bold text-ink">{v.user?.name ?? 'Unknown member'}</p>
                  {v.user?.email && <a href={`mailto:${v.user.email}`} className="text-sm text-navy hover:underline break-all">{v.user.email}</a>}
                </div>
                <Badge tone="gold">{v.role}</Badge>
              </div>
              <dl className="mt-4 grid grid-cols-2 gap-2 text-sm flex-1">
                <div><dt className="text-muted-foreground">Availability</dt><dd className="font-medium">{v.availability}</dd></div>
                <div><dt className="text-muted-foreground">Hours / week</dt><dd className="font-medium">{v.commitment_hours}</dd></div>
                {v.committee?.name && <div className="col-span-2"><dt className="text-muted-foreground">Band</dt><dd className="font-medium">{v.committee.name}</dd></div>}
                {v.skills && v.skills.length > 0 && <div className="col-span-2"><dt className="text-muted-foreground">Skills</dt><dd className="font-medium">{v.skills.join(', ')}</dd></div>}
              </dl>
              <p className="mt-3 text-xs text-muted-foreground">Applied {when(v.created_at)}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {status !== 'active' && (
                  <Button size="sm" disabled={busy === v.id} onClick={() => act(v.id, () => setVolunteerStatus(v.id, 'active'), 'Volunteer approved')}>
                    <Check /> Approve
                  </Button>
                )}
                {status === 'pending' && (
                  <Button size="sm" variant="outline" disabled={busy === v.id} onClick={() => act(v.id, () => setVolunteerStatus(v.id, 'inactive'), 'Application declined')}>
                    <X /> Decline
                  </Button>
                )}
                {status === 'active' && (
                  <Button size="sm" variant="outline" disabled={busy === v.id} onClick={() => act(v.id, () => setVolunteerStatus(v.id, 'inactive'), 'Volunteer paused')}>
                    <PauseCircle /> Pause
                  </Button>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </AdminPage>
  )
}
