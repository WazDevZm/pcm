'use client'

import { useState } from 'react'
import { CalendarCheck, CheckCircle2, MessagesSquare, Phone, Mail } from 'lucide-react'
import { AdminPage, LoadingRows, StatusTabs, useQueue, when } from '@/components/admin/kit'
import { Badge, Card, EmptyState, Notice, fieldClass } from '@/components/ui/haven'
import { Button } from '@/components/ui/button'
import { getCounseling, updateCounseling, type CounselingRow, type CounselingStatus } from '@/lib/data/queues'

const STATUSES = ['pending', 'scheduled', 'completed'] as const

function ScheduleForm({ row, busy, onSave }: { row: CounselingRow; busy: boolean; onSave: (iso: string) => void }) {
  const [value, setValue] = useState(row.appointment_date ? row.appointment_date.slice(0, 16) : '')
  return (
    <form
      className="flex flex-wrap items-center gap-2"
      onSubmit={(e) => {
        e.preventDefault()
        if (value) onSave(new Date(value).toISOString())
      }}
    >
      <input type="datetime-local" required value={value} onChange={(e) => setValue(e.target.value)} className={`${fieldClass} !min-h-10 !w-auto`} aria-label="Appointment date and time" />
      <Button size="sm" type="submit" disabled={busy}>
        <CalendarCheck /> {row.status === 'scheduled' ? 'Reschedule' : 'Schedule'}
      </Button>
    </form>
  )
}

export default function AdminCounselingPage() {
  const [status, setStatus] = useState<CounselingStatus>('pending')
  const { rows, error, busy, act } = useQueue<CounselingRow>(() => getCounseling(status), [status])

  return (
    <AdminPage title="Counseling" description="Confidential requests. Schedule an appointment, then mark it completed after the session.">
      <StatusTabs options={STATUSES} value={status} onChange={setStatus} />
      {error && <Notice tone="error" className="mb-4">{error}</Notice>}
      {!rows ? (
        <LoadingRows />
      ) : rows.length === 0 ? (
        <Card className="p-0"><EmptyState icon={MessagesSquare} title={`No ${status} requests`} /></Card>
      ) : (
        <div className="space-y-3">
          {rows.map((r) => (
            <Card key={r.id}>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-bold text-ink">{r.name}</p>
                  <p className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
                    <a href={`mailto:${r.email}`} className="flex items-center gap-1 text-navy hover:underline"><Mail className="h-3.5 w-3.5" />{r.email}</a>
                    {r.phone && <a href={`tel:${r.phone}`} className="flex items-center gap-1 text-navy hover:underline"><Phone className="h-3.5 w-3.5" />{r.phone}</a>}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Badge tone={r.service_type === 'crisis' ? 'danger' : 'navy'}>{r.service_type}</Badge>
                  {r.preferred_counselor && <Badge tone="muted">{r.preferred_counselor}</Badge>}
                </div>
              </div>
              <p className="mt-3 text-ink/85 leading-relaxed whitespace-pre-wrap">{r.message}</p>
              <p className="mt-3 text-xs text-muted-foreground">
                Received {when(r.created_at)}
                {r.appointment_date && <> · <span className="font-semibold text-navy">Appointment {when(r.appointment_date)}</span></>}
              </p>
              {status !== 'completed' && (
                <div className="mt-4 flex flex-wrap items-center gap-3 border-t border-border pt-4">
                  <ScheduleForm row={r} busy={busy === r.id} onSave={(iso) => act(r.id, () => updateCounseling(r.id, { status: 'scheduled', appointment_date: iso }), 'Appointment scheduled')} />
                  {status === 'scheduled' && (
                    <Button size="sm" variant="outline" disabled={busy === r.id} onClick={() => act(r.id, () => updateCounseling(r.id, { status: 'completed' }), 'Marked completed')}>
                      <CheckCircle2 /> Mark completed
                    </Button>
                  )}
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
    </AdminPage>
  )
}
