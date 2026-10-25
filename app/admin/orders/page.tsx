'use client'

import { useState } from 'react'
import { ArrowRight, Mail, Phone, ShoppingBag, X } from 'lucide-react'
import { AdminPage, LoadingRows, StatusTabs, useQueue, when } from '@/components/admin/kit'
import { Badge, Card, EmptyState, Notice } from '@/components/ui/haven'
import { Button } from '@/components/ui/button'
import { getOrders, setOrderStatus, type OrderRow, type OrderStatus } from '@/lib/data/queues'

const STATUSES = ['pending', 'confirmed', 'ready', 'collected', 'cancelled'] as const
const NEXT: Partial<Record<OrderStatus, { status: OrderStatus; label: string }>> = {
  pending: { status: 'confirmed', label: 'Confirm' },
  confirmed: { status: 'ready', label: 'Mark ready' },
  ready: { status: 'collected', label: 'Mark collected' },
}
const zmw = (n: number) => `K${Number(n).toLocaleString('en-ZM', { maximumFractionDigits: 2 })}`

export default function AdminOrdersPage() {
  const [status, setStatus] = useState<OrderStatus>('pending')
  const { rows, error, busy, act } = useQueue<OrderRow>(() => getOrders(status), [status])

  return (
    <AdminPage title="Merch orders" description="Pay on collection: confirm the order, mark it ready when it can be picked up, then collected.">
      <StatusTabs options={STATUSES} value={status} onChange={setStatus} />
      {error && <Notice tone="error" className="mb-4">{error}</Notice>}
      {!rows ? (
        <LoadingRows />
      ) : rows.length === 0 ? (
        <Card className="p-0"><EmptyState icon={ShoppingBag} title={`No ${status} orders`} /></Card>
      ) : (
        <div className="space-y-3">
          {rows.map((o) => {
            const next = NEXT[o.status]
            return (
              <Card key={o.id}>
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-mono text-sm font-semibold text-navy">{o.reference}</p>
                    <p className="mt-1 font-bold text-ink">{o.customer_name}</p>
                    <p className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-sm">
                      <a href={`mailto:${o.customer_email}`} className="flex items-center gap-1 text-navy hover:underline"><Mail className="h-3.5 w-3.5" />{o.customer_email}</a>
                      <a href={`tel:${o.customer_phone}`} className="flex items-center gap-1 text-navy hover:underline"><Phone className="h-3.5 w-3.5" />{o.customer_phone}</a>
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-serif text-2xl text-ink">{zmw(o.total_zmw)}</p>
                    <p className="text-xs text-muted-foreground">{when(o.created_at)}</p>
                  </div>
                </div>
                <ul className="mt-4 divide-y divide-border rounded-xl border border-border">
                  {o.items.map((it, i) => (
                    <li key={i} className="flex items-center justify-between gap-3 px-4 py-2.5 text-sm">
                      <span>
                        <span className="font-semibold">{it.quantity}×</span> {it.name}
                        {(it.size || it.color) && <span className="text-muted-foreground"> · {[it.size, it.color].filter(Boolean).join(' · ')}</span>}
                      </span>
                      {it.unit_price_zmw != null && <span className="text-muted-foreground">{zmw(it.unit_price_zmw * it.quantity)}</span>}
                    </li>
                  ))}
                </ul>
                {o.pickup_note && <p className="mt-3 text-sm text-muted-foreground">Note: {o.pickup_note}</p>}
                <div className="mt-4 flex flex-wrap items-center gap-2">
                  <Badge tone={o.status === 'cancelled' ? 'danger' : o.status === 'collected' ? 'success' : 'gold'}>{o.status}</Badge>
                  {next && (
                    <Button size="sm" disabled={busy === o.id} onClick={() => act(o.id, () => setOrderStatus(o.id, next.status), `Order ${next.status}`)}>
                      {next.label} <ArrowRight />
                    </Button>
                  )}
                  {(o.status === 'pending' || o.status === 'confirmed') && (
                    <Button size="sm" variant="destructive" disabled={busy === o.id} onClick={() => confirm(`Cancel order ${o.reference}?`) && act(o.id, () => setOrderStatus(o.id, 'cancelled'), 'Order cancelled')}>
                      <X /> Cancel
                    </Button>
                  )}
                </div>
              </Card>
            )
          })}
        </div>
      )}
    </AdminPage>
  )
}
