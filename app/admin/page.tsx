'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import {
  ArrowRight,
  BookOpen,
  Calendar,
  FileText,
  HandHeart,
  Heart,
  Image as ImageIcon,
  Mail,
  MessageCircle,
  Plus,
  ShoppingBag,
  Upload,
  Users,
  type LucideIcon,
} from 'lucide-react'
import { AdminPage } from '@/components/admin/kit'
import { useAuth } from '@/components/auth/AuthProvider'
import { Badge, IconTile, Notice, cardClass, cardHoverClass } from '@/components/ui/haven'
import { Button } from '@/components/ui/button'
import { getAdminCounts, type AdminCounts, type AdminCountKey } from '@/lib/data/admin'
import { getAllBandAdmins, getMemberCounts, type PersonRow } from '@/lib/data/queues'
import { getBands } from '@/lib/bands'
import type { Band } from '@/lib/supabase'
import { OFFICE_LABEL } from '@/lib/brand'
import { cn } from '@/lib/utils'

type Tile = { key: AdminCountKey; label: string; icon: LucideIcon; href: string; attention?: boolean }

const LEADER_TILES: Tile[] = [
  { key: 'users', label: 'Members', icon: Users, href: '/admin/users' },
  { key: 'upcomingEvents', label: 'Upcoming events', icon: Calendar, href: '/admin/events' },
  { key: 'posts', label: 'Posts', icon: FileText, href: '/admin/content' },
  { key: 'pendingPrayers', label: 'Active prayers', icon: Heart, href: '/admin/prayers', attention: true },
  { key: 'pendingCounseling', label: 'Pending counseling', icon: MessageCircle, href: '/admin/counseling', attention: true },
  { key: 'pendingVolunteers', label: 'Pending volunteers', icon: HandHeart, href: '/admin/volunteers', attention: true },
  { key: 'pendingOrders', label: 'Pending orders', icon: ShoppingBag, href: '/admin/orders', attention: true },
  { key: 'messages', label: 'Messages', icon: Mail, href: '/admin/messages' },
]

const CONTENT_TILES: Tile[] = [
  { key: 'posts', label: 'Posts & news', icon: FileText, href: '/admin/content' },
  { key: 'upcomingEvents', label: 'Upcoming events', icon: Calendar, href: '/admin/events' },
  { key: 'gallery', label: 'Gallery photos', icon: ImageIcon, href: '/admin/gallery' },
  { key: 'resources', label: 'Resources', icon: BookOpen, href: '/admin/resources' },
]

const PUBLISH = [
  { label: 'New post', href: '/admin/content/new', icon: Plus },
  { label: 'New event', href: '/admin/events/new', icon: Calendar },
  { label: 'Upload photos', href: '/admin/gallery/upload', icon: Upload },
  { label: 'New resource', href: '/admin/resources/new', icon: BookOpen },
]

function StatTile({ tile, value }: { tile: Tile; value: number | null | undefined }) {
  const hot = tile.attention && (value ?? 0) > 0
  return (
    <Link
      href={tile.href}
      className={cn(cardClass, cardHoverClass, 'p-5 flex flex-col gap-3', hot && 'bg-gold-soft border-gold/60')}
    >
      <IconTile icon={tile.icon} className={hot ? 'bg-gold text-ink' : undefined} />
      <span className="font-serif text-3xl leading-none text-ink">{value === undefined ? '…' : value ?? '—'}</span>
      <span className="text-sm text-muted-foreground">{tile.label}</span>
    </Link>
  )
}

function BandsOverview() {
  const [bands, setBands] = useState<Band[] | null>(null)
  const [heads, setHeads] = useState<Record<string, PersonRow[]>>({})
  const [members, setMembers] = useState<Record<string, number>>({})

  useEffect(() => {
    getBands().then(setBands)
    getAllBandAdmins().then(setHeads).catch(() => {})
    getMemberCounts().then(setMembers).catch(() => {})
  }, [])

  return (
    <section className="mt-12">
      <div className="mb-4 flex items-end justify-between gap-4">
        <div>
          <p className="eyebrow text-navy mb-1">Oversight</p>
          <h2 className="text-2xl text-ink">Bands & committees</h2>
        </div>
        <Link href="/admin/bands" className="text-sm font-semibold text-navy hover:underline">
          Assign heads →
        </Link>
      </div>
      <div className={cn(cardClass, 'overflow-hidden')}>
        <div className="hidden md:grid grid-cols-[1.4fr_1.4fr_0.6fr_auto] gap-4 border-b border-border bg-canvas px-5 py-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">
          <span>Band</span>
          <span>Head(s)</span>
          <span>Members</span>
          <span />
        </div>
        {!bands ? (
          <p className="px-5 py-8 text-center text-muted-foreground">Loading…</p>
        ) : (
          <ul className="divide-y divide-border">
            {bands.map((b) => {
              const h = heads[b.id] ?? []
              return (
                <li key={b.id} className="grid gap-2 px-5 py-4 md:grid-cols-[1.4fr_1.4fr_0.6fr_auto] md:items-center md:gap-4">
                  <div>
                    <p className="font-bold text-ink">{b.name}</p>
                    <p className="text-xs text-muted-foreground">{b.meeting_time}</p>
                  </div>
                  <div className="text-sm">
                    {h.length ? (
                      h.map((p) => (
                        <p key={p.id} className="truncate">
                          {p.name} <span className="text-muted-foreground">· {p.email}</span>
                        </p>
                      ))
                    ) : (
                      <Badge tone="gold">No head assigned</Badge>
                    )}
                  </div>
                  <p className="text-sm">
                    <span className="font-serif text-xl text-ink">{members[b.id] ?? 0}</span>
                    <span className="md:hidden text-muted-foreground"> members</span>
                  </p>
                  <Button asChild size="sm" variant="outline">
                    <Link href={`/band-admin/${b.slug}`}>
                      Dashboard <ArrowRight />
                    </Link>
                  </Button>
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </section>
  )
}

export default function AdminDashboard() {
  const { profile, isLeader } = useAuth()
  const [counts, setCounts] = useState<AdminCounts | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    getAdminCounts()
      .then(setCounts)
      .catch((err) => setError(err instanceof Error ? err.message : 'Could not load counts'))
  }, [])

  const first = (profile?.name || 'there').split(' ')[0]
  const office = profile?.office ? OFFICE_LABEL[profile.office] : null
  const tiles = isLeader ? LEADER_TILES : CONTENT_TILES

  return (
    <AdminPage
      eyebrow={office ?? (isLeader ? 'The Haven leadership' : 'Publicity Committee')}
      title={`Welcome, ${first}`}
      description={
        isLeader
          ? 'Everything that needs your attention across the ministry. Gold tiles have items waiting.'
          : 'You run what visitors see. Posts, events, photos and resources you publish appear on the landing page, across the website and in The Haven app.'
      }
      actions={
        !isLeader || profile?.office ? (
          <>
            {PUBLISH.slice(0, 2).map((p) => (
              <Button key={p.href} asChild variant={p.href.includes('content') ? 'default' : 'outline'}>
                <Link href={p.href}>
                  <p.icon /> {p.label}
                </Link>
              </Button>
            ))}
          </>
        ) : undefined
      }
    >
      {error && <Notice tone="error" className="mb-6">{error}</Notice>}

      <div className={cn('grid gap-4', isLeader ? 'grid-cols-2 lg:grid-cols-4' : 'grid-cols-2 lg:grid-cols-4')}>
        {tiles.map((t) => (
          <StatTile key={t.key + t.href} tile={t} value={counts ? counts[t.key] : undefined} />
        ))}
      </div>

      {!isLeader && (
        <section className="mt-10">
          <h2 className="text-2xl text-ink mb-4">Publish</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {PUBLISH.map((p) => (
              <Link key={p.href} href={p.href} className={cn(cardClass, cardHoverClass, 'flex items-center gap-3 p-4')}>
                <IconTile icon={p.icon} />
                <span className="font-semibold text-ink">{p.label}</span>
              </Link>
            ))}
          </div>
          <Notice className="mt-6">
            Where things appear: <b>events</b> show on the landing page (next three) and the Events page; <b>posts</b> show
            under “Latest news” on the landing page and on News; <b>photos</b> in Gallery; <b>resources</b> in Resources.
          </Notice>
        </section>
      )}

      {isLeader && <BandsOverview />}
    </AdminPage>
  )
}
