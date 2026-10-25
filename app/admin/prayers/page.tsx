'use client'

import { useState } from 'react'
import { Check, Archive, Heart, RotateCcw } from 'lucide-react'
import { AdminPage, LoadingRows, StatusTabs, useQueue, when } from '@/components/admin/kit'
import { Badge, Card, EmptyState, Notice } from '@/components/ui/haven'
import { Button } from '@/components/ui/button'
import { getPrayers, setPrayerStatus, type PrayerRow, type PrayerStatus } from '@/lib/data/queues'

const STATUSES = ['active', 'answered', 'archived'] as const

export default function AdminPrayersPage() {
  const [status, setStatus] = useState<PrayerStatus>('active')
  const { rows, error, busy, act } = useQueue<PrayerRow>(() => getPrayers(status), [status])

  return (
    <AdminPage title="Prayer requests" description="Pray over each request, then mark it answered or archive it. Requests are private to leaders and the requester.">
      <StatusTabs options={STATUSES} value={status} onChange={setStatus} />
      {error && <Notice tone="error" className="mb-4">{error}</Notice>}
      {!rows ? (
        <LoadingRows />
      ) : rows.length === 0 ? (
        <Card className="p-0"><EmptyState icon={Heart} title={`No ${status} requests`} /></Card>
      ) : (
        <div className="space-y-3">
          {rows.map((r) => (
            <Card key={r.id}>
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <Badge tone="navy">{r.category}</Badge>
                {r.is_anonymous && <Badge tone="muted">Anonymous</Badge>}
                <span className="text-xs text-muted-foreground ml-auto">{when(r.created_at)}</span>
              </div>
              <p className="text-ink leading-relaxed whitespace-pre-wrap">{r.request}</p>
              {!r.is_anonymous && (r.requester_name || r.requester_email) && (
                <p className="mt-3 text-sm text-muted-foreground">
                  {r.requester_name}
                  {r.requester_email && <> · <a className="text-navy hover:underline" href={`mailto:${r.requester_email}`}>{r.requester_email}</a></>}
                </p>
              )}
              <div className="mt-4 flex flex-wrap gap-2">
                {status === 'active' ? (
                  <>
                    <Button size="sm" disabled={busy === r.id} onClick={() => act(r.id, () => setPrayerStatus(r.id, 'answered'), 'Marked answered')}>
                      <Check /> Mark answered
                    </Button>
                    <Button size="sm" variant="outline" disabled={busy === r.id} onClick={() => act(r.id, () => setPrayerStatus(r.id, 'archived'), 'Archived')}>
                      <Archive /> Archive
                    </Button>
                  </>
                ) : (
                  <Button size="sm" variant="outline" disabled={busy === r.id} onClick={() => act(r.id, () => setPrayerStatus(r.id, 'active'), 'Moved back to active')}>
                    <RotateCcw /> Move to active
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
