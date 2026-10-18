'use client'

import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { useAuth } from '@/components/auth/AuthProvider'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollToBottom } from '@/components/ui/scroll-to-bottom'
import { getMemberData, updateMyProfile, type MemberData } from '@/lib/data/admin'
import {
  Calendar,
  Users,
  Heart,
  LogOut,
  ChevronRight,
  MessageCircle,
  HandHeart,
  ShoppingBag,
  Pencil,
  LayoutDashboard,
  MapPin
} from 'lucide-react'

const fmtDate = (d: string) =>
  new Date(d).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })

const statusColor = (status: string) => {
  switch (status) {
    case 'pending': return 'bg-yellow-500/20 text-yellow-300'
    case 'active':
    case 'scheduled':
    case 'confirmed':
    case 'ready': return 'bg-blue-500/20 text-blue-300'
    case 'answered':
    case 'completed':
    case 'collected': return 'bg-green-500/20 text-green-300'
    case 'cancelled':
    case 'inactive': return 'bg-red-500/20 text-red-300'
    default: return 'bg-white/10 text-white/70'
  }
}

function StatusPill({ status }: { status: string }) {
  return (
    <span className={`text-xs px-2 py-1 rounded-full capitalize shrink-0 ${statusColor(status)}`}>{status}</span>
  )
}

function Section({
  title,
  icon: Icon,
  empty,
  action,
  children,
  count
}: {
  title: string
  icon: typeof Calendar
  empty: string
  action?: { label: string; href: string }
  children: React.ReactNode
  count: number
}) {
  return (
    <div className="rounded-xl bg-white/5 ring-1 ring-white/10 p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold flex items-center gap-2">
          <Icon className="w-5 h-5 text-white/60" />
          {title}
        </h2>
        {action && (
          <Link href={action.href} className="text-sm text-white/60 hover:text-white flex items-center gap-1">
            {action.label}
            <ChevronRight className="w-4 h-4" />
          </Link>
        )}
      </div>
      {count === 0 ? <p className="text-sm text-white/50">{empty}</p> : <div className="divide-y divide-white/10">{children}</div>}
    </div>
  )
}

export default function MemberDashboard() {
  const { user, profile, loading, isLeader, refreshProfile, signOut } = useAuth()
  const router = useRouter()
  const [data, setData] = useState<MemberData | null>(null)
  const [dataError, setDataError] = useState<string | null>(null)
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({ name: '', phone: '' })

  useEffect(() => {
    if (loading) return
    if (!user) router.push('/login?next=/member-dashboard')
  }, [user, loading, router])

  const load = useCallback(async (userId: string) => {
    try {
      setData(await getMemberData(userId))
      setDataError(null)
    } catch (err: unknown) {
      setDataError(err instanceof Error ? err.message : 'Could not load your activity.')
    }
  }, [])

  useEffect(() => {
    if (user) load(user.id)
  }, [user, load])

  useEffect(() => {
    if (profile) setForm({ name: profile.name ?? '', phone: profile.phone ?? '' })
  }, [profile])

  const handleSignOut = async () => {
    await signOut()
    router.push('/')
  }

  const saveProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return
    const name = form.name.trim()
    if (!name) {
      toast.error('Name is required')
      return
    }
    setSaving(true)
    try {
      await updateMyProfile(user.id, { name, phone: form.phone.trim() || null })
      await refreshProfile()
      toast.success('Profile updated')
      setEditing(false)
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Could not update profile')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B0F12] flex items-center justify-center text-white">
        Loading...
      </div>
    )
  }

  if (!user) {
    return null
  }

  const now = Date.now()
  const upcomingRsvps = data?.rsvps.filter((e) => new Date(e.date).getTime() >= now) ?? []
  const pastRsvps = data ? data.rsvps.length - upcomingRsvps.length : 0
  const stat = (n: number | undefined) => (data ? n ?? 0 : '—')

  return (
    <div className="min-h-screen bg-[#0B0F12] text-white relative">
      <ScrollToBottom targetId="dashboard-content" label="Scroll" />

      {/* Header */}
      <div className="border-b border-white/10 px-4 md:px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          <div className="min-w-0">
            <h1 className="text-xl md:text-2xl font-bold truncate">Welcome, {profile?.name || user.email?.split('@')[0]}</h1>
            <p className="text-white/60 text-sm">Member Dashboard</p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {isLeader && (
              <Button asChild variant="outline" size="sm" className="bg-black/40 ring-1 ring-white/20 border-0 text-white hover:bg-black/50">
                <Link href="/admin">
                  <LayoutDashboard className="w-4 h-4 sm:mr-2" />
                  <span className="hidden sm:inline">Admin</span>
                </Link>
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={handleSignOut}
              aria-label="Sign out"
              className="text-white/70 hover:text-white"
            >
              <LogOut className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div id="dashboard-content" className="max-w-6xl mx-auto px-4 md:px-6 py-8 space-y-8">
        {(dataError || (data && data.errors.length > 0)) && (
          <div className="p-4 rounded-xl bg-yellow-500/10 ring-1 ring-yellow-500/20 text-sm text-white/80">
            {dataError
              ? `We couldn't load your activity right now: ${dataError}`
              : `Some sections couldn't be loaded (${data!.errors.join(', ')}). Please try again later.`}
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="rounded-xl bg-white/5 ring-1 ring-white/10 p-6 text-center">
            <div className="text-3xl font-bold text-blue-400 mb-1">{stat(upcomingRsvps.length)}</div>
            <div className="text-sm text-white/60">Upcoming RSVPs</div>
          </div>
          <div className="rounded-xl bg-white/5 ring-1 ring-white/10 p-6 text-center">
            <div className="text-3xl font-bold text-purple-400 mb-1">{stat(data?.bands.length)}</div>
            <div className="text-sm text-white/60">My Bands</div>
          </div>
          <div className="rounded-xl bg-white/5 ring-1 ring-white/10 p-6 text-center">
            <div className="text-3xl font-bold text-green-400 mb-1">{stat(pastRsvps)}</div>
            <div className="text-sm text-white/60">Past Events</div>
          </div>
          <div className="rounded-xl bg-white/5 ring-1 ring-white/10 p-6 text-center">
            <div className="text-3xl font-bold text-red-400 mb-1">{stat(data?.prayers.length)}</div>
            <div className="text-sm text-white/60">Prayer Requests</div>
          </div>
        </div>

        {/* Profile */}
        <div className="rounded-xl bg-white/5 ring-1 ring-white/10 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold">My Profile</h2>
            {!editing && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setEditing(true)}
                disabled={!profile}
                className="bg-black/40 ring-1 ring-white/20 border-0 text-white hover:bg-black/50"
              >
                <Pencil className="w-4 h-4 mr-2" />
                Edit
              </Button>
            )}
          </div>
          {editing ? (
            <form onSubmit={saveProfile} className="grid sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="name" className="block text-sm text-white/70 mb-1">Name</label>
                <Input
                  id="name"
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  required
                  className="bg-black/40 border-white/20"
                />
              </div>
              <div>
                <label htmlFor="phone" className="block text-sm text-white/70 mb-1">Phone</label>
                <Input
                  id="phone"
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                  className="bg-black/40 border-white/20"
                  placeholder="Optional"
                />
              </div>
              <div className="sm:col-span-2 flex gap-2 justify-end">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => {
                    setEditing(false)
                    setForm({ name: profile?.name ?? '', phone: profile?.phone ?? '' })
                  }}
                  className="text-white/70 hover:text-white"
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={saving} className="bg-white text-black hover:bg-white/90 rounded-full">
                  {saving ? 'Saving...' : 'Save'}
                </Button>
              </div>
            </form>
          ) : (
            <dl className="grid sm:grid-cols-3 gap-4 text-sm">
              <div>
                <dt className="text-white/50">Name</dt>
                <dd className="mt-1">{profile?.name || '—'}</dd>
              </div>
              <div className="min-w-0">
                <dt className="text-white/50">Email</dt>
                <dd className="mt-1 truncate">{profile?.email || user.email}</dd>
              </div>
              <div>
                <dt className="text-white/50">Phone</dt>
                <dd className="mt-1">{profile?.phone || '—'}</dd>
              </div>
            </dl>
          )}
        </div>

        {data && (
          <div className="grid md:grid-cols-2 gap-6">
            <Section title="My RSVPs" icon={Calendar} count={data.rsvps.length} empty="You haven't RSVP'd to any events yet." action={{ label: 'Events', href: '/events' }}>
              {data.rsvps.map((e) => (
                <div key={e.id} className="py-3 flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-medium truncate">{e.title}</p>
                    <p className="text-sm text-white/50 flex items-center gap-1">
                      {fmtDate(e.date)}
                      {e.location && (
                        <>
                          <span>·</span>
                          <MapPin className="w-3 h-3" />
                          <span className="truncate">{e.location}</span>
                        </>
                      )}
                    </p>
                  </div>
                  {new Date(e.date).getTime() < now && <StatusPill status="past" />}
                </div>
              ))}
            </Section>

            <Section title="My Bands" icon={Users} count={data.bands.length} empty="You haven't joined a band yet." action={{ label: 'Bands', href: '/bands' }}>
              {data.bands.map((b) => (
                <div key={b.id} className="py-3 flex items-center justify-between gap-3">
                  {b.slug ? (
                    <Link href={`/bands/${b.slug}`} className="font-medium hover:underline truncate">{b.name}</Link>
                  ) : (
                    <span className="font-medium truncate">{b.name}</span>
                  )}
                  <StatusPill status={b.role} />
                </div>
              ))}
            </Section>

            <Section title="Prayer Requests" icon={Heart} count={data.prayers.length} empty="No prayer requests yet." action={{ label: 'New', href: '/prayer-request' }}>
              {data.prayers.map((p) => (
                <div key={p.id} className="py-3 flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm line-clamp-2">{p.request}</p>
                    <p className="text-xs text-white/50 mt-1 capitalize">{p.category} · {fmtDate(p.created_at)}</p>
                  </div>
                  <StatusPill status={p.status} />
                </div>
              ))}
            </Section>

            <Section title="Counseling" icon={MessageCircle} count={data.counseling.length} empty="No counseling requests." action={{ label: 'Request', href: '/counseling' }}>
              {data.counseling.map((c) => (
                <div key={c.id} className="py-3 flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-medium capitalize">{c.service_type} counseling</p>
                    <p className="text-xs text-white/50 mt-1">
                      Requested {fmtDate(c.created_at)}
                      {c.appointment_date && ` · Appointment ${fmtDate(c.appointment_date)}`}
                    </p>
                  </div>
                  <StatusPill status={c.status} />
                </div>
              ))}
            </Section>

            <Section title="Volunteer Applications" icon={HandHeart} count={data.volunteering.length} empty="No volunteer applications.">
              {data.volunteering.map((v) => (
                <div key={v.id} className="py-3 flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-medium truncate">{v.role}</p>
                    <p className="text-xs text-white/50 mt-1">
                      {v.committee_name ? `${v.committee_name} · ` : ''}{fmtDate(v.created_at)}
                    </p>
                  </div>
                  <StatusPill status={v.status} />
                </div>
              ))}
            </Section>

            <Section title="Orders" icon={ShoppingBag} count={data.orders.length} empty="No merch orders yet." action={{ label: 'Shop', href: '/merch' }}>
              {data.orders.map((o) => (
                <div key={o.id} className="py-3 flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-medium">
                      {o.reference} · K{Number(o.total_zmw).toFixed(2)}
                    </p>
                    <p className="text-xs text-white/50 mt-1 line-clamp-2">
                      {(Array.isArray(o.items) ? o.items : [])
                        .map((i) => `${i.quantity}× ${i.name}${i.size ? ` (${i.size})` : ''}`)
                        .join(', ')}
                      {' · '}{fmtDate(o.created_at)}
                    </p>
                  </div>
                  <StatusPill status={o.status} />
                </div>
              ))}
            </Section>
          </div>
        )}

        {!data && !dataError && (
          <div className="grid md:grid-cols-2 gap-6 animate-pulse">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-40 rounded-xl bg-white/5" />
            ))}
          </div>
        )}

        {/* Contact Support */}
        <div className="rounded-xl bg-gradient-to-r from-[#0f2d6e]/30 to-[#0f2d6e]/10 ring-1 ring-[#0f2d6e]/30 p-6">
          <h2 className="font-semibold mb-2">Need Help?</h2>
          <p className="text-white/70 text-sm mb-4">
            Contact the ministry team for support or questions about your membership.
          </p>
          <Button asChild className="bg-white text-black hover:bg-white/90 rounded-full">
            <Link href="/support">Contact Ministry Team</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
