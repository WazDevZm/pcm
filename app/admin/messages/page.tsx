'use client'

import { Mail, Reply, Trash2 } from 'lucide-react'
import { AdminPage, LoadingRows, useQueue, when } from '@/components/admin/kit'
import { Card, EmptyState, Notice } from '@/components/ui/haven'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/components/auth/AuthProvider'
import { deleteMessage, getMessages, type MessageRow } from '@/lib/data/queues'

export default function AdminMessagesPage() {
  const { isAdmin } = useAuth()
  const { rows, error, busy, act } = useQueue<MessageRow>(getMessages, [])

  return (
    <AdminPage title="Messages" description="Inquiries sent through the contact form on the website and in the app.">
      {error && <Notice tone="error" className="mb-4">{error}</Notice>}
      {!rows ? (
        <LoadingRows />
      ) : rows.length === 0 ? (
        <Card className="p-0"><EmptyState icon={Mail} title="No messages yet" /></Card>
      ) : (
        <div className="space-y-3">
          {rows.map((m) => (
            <Card key={m.id}>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-bold text-ink">{m.name}</p>
                  <a href={`mailto:${m.email}`} className="text-sm text-navy hover:underline">{m.email}</a>
                </div>
                <span className="text-xs text-muted-foreground">{when(m.created_at)}</span>
              </div>
              {m.subject && <p className="mt-3 text-sm font-semibold text-ink">{m.subject}</p>}
              <p className="mt-2 text-ink/85 leading-relaxed whitespace-pre-wrap">{m.message}</p>
              <div className="mt-4 flex gap-2">
                <Button size="sm" asChild>
                  <a href={`mailto:${m.email}?subject=${encodeURIComponent('Re: ' + (m.subject || 'Your message to The Haven'))}`}>
                    <Reply /> Reply
                  </a>
                </Button>
                {isAdmin && (
                  <Button size="sm" variant="destructive" disabled={busy === m.id} onClick={() => confirm('Delete this message?') && act(m.id, () => deleteMessage(m.id), 'Message deleted')}>
                    <Trash2 /> Delete
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
