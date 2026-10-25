'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter, useParams } from 'next/navigation'
import { useAuth } from '@/components/auth/AuthProvider'
import {
  getBandBySlug,
  getBandAnnouncements,
  getBandEvents,
  canManageBand,
  createBandAnnouncement,
  deleteBandAnnouncement,
  updateBand,
  createBandEvent,
  deleteBandEvent,
} from '@/lib/bands'
import { uploadImage } from '@/lib/storage'
import { getBandCounts } from '@/lib/data/admin'
import type { Band, BandAnnouncement, Event } from '@/lib/supabase'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { BandMembers } from '@/components/bands/BandMembers'
import { HavenWordmark } from '@/components/brand/HavenLogo'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { ArrowLeft, ArrowRight, ExternalLink, Megaphone, Plus, Trash2, Save } from 'lucide-react'
import { toast } from 'sonner'
import { FRONTEND_ONLY } from '@/lib/config'

export default function BandAdminDashboard() {
  const params = useParams()
  const slug = params.slug as string
  const { user, profile, loading } = useAuth()
  const router = useRouter()

  const [band, setBand] = useState<Band | null>(null)
  const [announcements, setAnnouncements] = useState<BandAnnouncement[]>([])
  const [events, setEvents] = useState<Event[]>([])
  const [authorized, setAuthorized] = useState(false)
  const [saving, setSaving] = useState(false)
  const [bandStats, setBandStats] = useState<{
    memberCount: number | null
    upcomingEvents: number
    totalAnnouncements: number
    activeVolunteers: number | null
  }>({
    memberCount: 0,
    upcomingEvents: 0,
    totalAnnouncements: 0,
    activeVolunteers: 0
  })

  const [bandForm, setBandForm] = useState<Partial<Band>>({})
  const [newAnn, setNewAnn] = useState<{ title: string; content: string; type: BandAnnouncement['type'] }>({
    title: '',
    content: '',
    type: 'announcement',
  })
  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    date: '',
    location: '',
    category: 'fellowship' as Event['category'],
  })

  useEffect(() => {
    if (loading) return
    if (!FRONTEND_ONLY && !user) {
      router.push(`/login?next=/band-admin/${slug}`)
      return
    }

    async function init() {
      const b = await getBandBySlug(slug)
      if (!b) {
        router.push('/band-admin')
        return
      }

      const canManage =
        FRONTEND_ONLY ||
        profile?.role === 'admin' ||
        (user && (await canManageBand(user.id, b.id, profile?.role)))

      if (!canManage && profile?.role !== 'admin') {
        router.push('/band-admin')
        return
      }

      setAuthorized(true)
      setBand(b)
      setBandForm({
        description: b.description,
        mission: b.mission,
        responsibilities: b.responsibilities,
        how_to_join: b.how_to_join,
        important_info: b.important_info,
        meeting_time: b.meeting_time,
        meeting_location: b.meeting_location,
        leader_name: b.leader_name,
        leader_position: b.leader_position,
        leader_tenure: b.leader_tenure,
        leader_email: b.leader_email,
        leader_phone: b.leader_phone,
        leader_image_url: b.leader_image_url,
      })

      const [ann, ev, counts] = await Promise.all([
        getBandAnnouncements(b.id, slug),
        getBandEvents(b.id),
        getBandCounts(b.id).catch(() => ({ members: null, activeVolunteers: null })),
      ])
      setAnnouncements(ann)
      setEvents(ev)
      
      // Calculate band stats
      setBandStats({
        memberCount: counts.members,
        upcomingEvents: ev.filter(e => new Date(e.date) >= new Date()).length,
        totalAnnouncements: ann.length,
        activeVolunteers: counts.activeVolunteers,
      })
    }

    init()
  }, [user, profile, loading, slug, router])

  const handleSaveBand = async () => {
    if (!band) return
    setSaving(true)
    try {
      const updated = await updateBand(band.id, bandForm)
      setBand(updated)
      toast.success('Band details saved')
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : 'Failed to save')
    } finally {
      setSaving(false)
    }
  }

  const handleLeaderImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !band) return
    try {
      const url = await uploadImage(file, `bands/${slug}/leader`)
      setBandForm((f) => ({ ...f, leader_image_url: url }))
      toast.success('Image uploaded')
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Upload failed')
    }
  }

  const handleCreateAnnouncement = async () => {
    if (!band || !user || !newAnn.title) return
    setSaving(true)
    try {
      const created = await createBandAnnouncement({
        committee_id: band.id,
        title: newAnn.title,
        content: newAnn.content,
        type: newAnn.type,
        author_id: user.id,
        published_at: new Date().toISOString(),
      })
      setAnnouncements((a) => [created, ...a])
      setNewAnn({ title: '', content: '', type: 'announcement' })
      toast.success('Announcement published')
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : 'Failed to create')
    } finally {
      setSaving(false)
    }
  }

  const handleCreateEvent = async () => {
    if (!band || !user || !newEvent.title || !newEvent.date) return
    setSaving(true)
    try {
      const created = await createBandEvent({
        title: newEvent.title,
        description: newEvent.description,
        date: new Date(newEvent.date).toISOString(),
        location: newEvent.location,
        category: newEvent.category,
        committee_id: band.id,
        created_by: user.id,
      })
      setEvents((ev) => [...ev, created])
      setNewEvent({ title: '', description: '', date: '', location: '', category: 'fellowship' })
      toast.success('Event created')
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : 'Failed to create event')
    } finally {
      setSaving(false)
    }
  }

  if (loading || !authorized || !band) {
    return (
      <div className="min-h-screen bg-canvas flex items-center justify-center text-ink">
        Loading...
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-canvas text-ink relative">
      <header className="relative overflow-hidden bg-navy-deep text-white">
        <div className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-gold/15 blur-3xl" aria-hidden />
        <div className="relative max-w-4xl mx-auto px-6 pt-6 pb-10">
          <div className="flex items-center justify-between gap-3">
            <Link href="/band-admin" className="inline-flex items-center gap-1.5 text-sm font-semibold text-white/75 hover:text-white">
              <ArrowLeft className="h-4 w-4" /> My bands
            </Link>
            <Link href="/" aria-label="The Haven home"><HavenWordmark tone="onDark" className="text-xl" /></Link>
          </div>
          <p className="eyebrow text-gold mt-8">Band dashboard</p>
          <h1 className="mt-2 text-3xl md:text-4xl">{band.name}</h1>
          <Link href={`/bands/${slug}`} className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-white/80 hover:text-white">
            View public page <ExternalLink className="h-3.5 w-3.5" />
          </Link>
        </div>
      </header>

      <div id="band-admin-content" className="max-w-4xl mx-auto p-6">
        {/* Band Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="rounded-2xl bg-white border border-border p-4 text-center">
            <div className="font-serif text-3xl text-ink">{bandStats.memberCount ?? '—'}</div>
            <div className="text-xs text-muted-foreground mt-1">Members</div>
          </div>
          <div className="rounded-2xl bg-white border border-border p-4 text-center">
            <div className="font-serif text-3xl text-ink">{bandStats.upcomingEvents}</div>
            <div className="text-xs text-muted-foreground mt-1">Upcoming Events</div>
          </div>
          <div className="rounded-2xl bg-white border border-border p-4 text-center">
            <div className="font-serif text-3xl text-ink">{bandStats.totalAnnouncements}</div>
            <div className="text-xs text-muted-foreground mt-1">Announcements</div>
          </div>
          <div className="rounded-2xl bg-white border border-border p-4 text-center">
            <div className="font-serif text-3xl text-ink">{bandStats.activeVolunteers ?? '—'}</div>
            <div className="text-xs text-muted-foreground mt-1">Active Volunteers</div>
          </div>
        </div>

        {slug === 'publicity-committee' && (
          <Link
            href="/admin"
            className="mb-8 flex items-center gap-4 rounded-2xl bg-navy p-5 text-white transition-colors hover:bg-navy-deep"
          >
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/10 text-gold">
              <Megaphone className="h-6 w-6" />
            </span>
            <span className="flex-1">
              <span className="block font-bold">Website content</span>
              <span className="block text-sm text-white/75">
                Publish posts, events, photos and resources that appear on the landing page, the website and the app.
              </span>
            </span>
            <ArrowRight className="h-5 w-5 shrink-0 text-gold" />
          </Link>
        )}

        <Tabs defaultValue="announcements">
          <TabsList className="bg-white mb-6">
            <TabsTrigger value="announcements">Announcements</TabsTrigger>
            <TabsTrigger value="events">Events</TabsTrigger>
            <TabsTrigger value="details">Band Details</TabsTrigger>
            <TabsTrigger value="leader">Leadership</TabsTrigger>
            <TabsTrigger value="members">Members</TabsTrigger>
          </TabsList>

          <TabsContent value="announcements" className="space-y-6">
            <div className="rounded-2xl bg-white ring-1 ring-border p-6 space-y-4">
              <h2 className="font-semibold flex items-center gap-2">
                <Plus className="w-4 h-4" /> New announcement
              </h2>
              <Input
                placeholder="Title"
                value={newAnn.title}
                onChange={(e) => setNewAnn((a) => ({ ...a, title: e.target.value }))}
                className="bg-white border-border"
              />
              <Textarea
                placeholder="Content"
                value={newAnn.content}
                onChange={(e) => setNewAnn((a) => ({ ...a, content: e.target.value }))}
                className="bg-white border-border min-h-[100px]"
              />
              <select
                value={newAnn.type}
                onChange={(e) =>
                  setNewAnn((a) => ({ ...a, type: e.target.value as BandAnnouncement['type'] }))
                }
                className="w-full rounded-md bg-white border border-border px-3 py-2 text-sm"
              >
                <option value="announcement">Announcement</option>
                <option value="meeting">Meeting</option>
                <option value="update">Update</option>
              </select>
              <Button onClick={handleCreateAnnouncement} disabled={saving} className="rounded-full">
                Publish
              </Button>
            </div>

            <div className="space-y-3">
              {announcements.map((ann) => (
                <div key={ann.id} className="rounded-xl bg-white ring-1 ring-border p-4 flex justify-between gap-4">
                  <div>
                    <h3 className="font-medium">{ann.title}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">{ann.content}</p>
                  </div>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="text-red-700 shrink-0"
                    onClick={async () => {
                      try {
                        await deleteBandAnnouncement(ann.id)
                        setAnnouncements((list) => list.filter((x) => x.id !== ann.id))
                        toast.success('Deleted')
                      } catch {
                        toast.error('Delete failed (requires database)')
                      }
                    }}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="events" className="space-y-6">
            <div className="rounded-2xl bg-white ring-1 ring-border p-6 space-y-4">
              <h2 className="font-semibold">New event</h2>
              <Input
                placeholder="Event title"
                value={newEvent.title}
                onChange={(e) => setNewEvent((ev) => ({ ...ev, title: e.target.value }))}
                className="bg-white border-border"
              />
              <Textarea
                placeholder="Description"
                value={newEvent.description}
                onChange={(e) => setNewEvent((ev) => ({ ...ev, description: e.target.value }))}
                className="bg-white border-border"
              />
              <Input
                type="datetime-local"
                value={newEvent.date}
                onChange={(e) => setNewEvent((ev) => ({ ...ev, date: e.target.value }))}
                className="bg-white border-border"
              />
              <Input
                placeholder="Location"
                value={newEvent.location}
                onChange={(e) => setNewEvent((ev) => ({ ...ev, location: e.target.value }))}
                className="bg-white border-border"
              />
              <Button onClick={handleCreateEvent} disabled={saving} className="rounded-full">
                Add event
              </Button>
            </div>
            {events.map((ev) => (
              <div key={ev.id} className="rounded-xl bg-white p-4 flex justify-between">
                <span>{ev.title}</span>
                <Button
                  size="icon"
                  variant="ghost"
                  className="text-red-700"
                  onClick={async () => {
                    try {
                      await deleteBandEvent(ev.id)
                      setEvents((list) => list.filter((x) => x.id !== ev.id))
                    } catch {
                      toast.error('Delete requires database')
                    }
                  }}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </TabsContent>

          <TabsContent value="details" className="space-y-4">
            {(['description', 'mission', 'responsibilities', 'how_to_join', 'important_info', 'meeting_time', 'meeting_location'] as const).map(
              (field) => (
                <div key={field}>
                  <label className="text-sm text-muted-foreground capitalize block mb-1">
                    {field.replace(/_/g, ' ')}
                  </label>
                  <Textarea
                    value={(bandForm[field] as string) || ''}
                    onChange={(e) => setBandForm((f) => ({ ...f, [field]: e.target.value }))}
                    className="bg-white border-border"
                  />
                </div>
              )
            )}
            <Button onClick={handleSaveBand} disabled={saving} className="rounded-full">
              <Save className="w-4 h-4 mr-2" />
              Save details
            </Button>
          </TabsContent>

          <TabsContent value="leader" className="space-y-4">
            {(['leader_name', 'leader_position', 'leader_tenure', 'leader_email', 'leader_phone'] as const).map(
              (field) => (
                <div key={field}>
                  <label className="text-sm text-muted-foreground block mb-1">{field.replace(/_/g, ' ')}</label>
                  <Input
                    value={(bandForm[field] as string) || ''}
                    onChange={(e) => setBandForm((f) => ({ ...f, [field]: e.target.value }))}
                    className="bg-white border-border"
                  />
                </div>
              )
            )}
            <div>
              <label className="text-sm text-muted-foreground block mb-1">Leader photo</label>
              <Input type="file" accept="image/*" onChange={handleLeaderImage} className="bg-white border-border" />
            </div>
            <Button onClick={handleSaveBand} disabled={saving} className="rounded-full">
              Save leadership
            </Button>
          </TabsContent>

          <TabsContent value="members" className="space-y-4">
            <BandMembers bandId={band.id} bandName={band.name} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
