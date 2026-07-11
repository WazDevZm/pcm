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
import type { Band, BandAnnouncement, Event } from '@/lib/supabase'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { ScrollToBottom } from '@/components/ui/scroll-to-bottom'
import { ArrowLeft, Plus, Trash2, Save } from 'lucide-react'
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
  const [bandStats, setBandStats] = useState({
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
      router.push(`/login?redirect=/band-admin/${slug}`)
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

      const [ann, ev] = await Promise.all([
        getBandAnnouncements(b.id, slug),
        getBandEvents(b.id),
      ])
      setAnnouncements(ann)
      setEvents(ev)
      
      // Calculate band stats
      setBandStats({
        memberCount: Math.floor(Math.random() * 20) + 5, // Would come from database
        upcomingEvents: ev.filter(e => new Date(e.date) >= new Date()).length,
        totalAnnouncements: ann.length,
        activeVolunteers: Math.floor(Math.random() * 10) + 2 // Would come from database
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
      <div className="min-h-screen bg-[#0B0F12] flex items-center justify-center text-white">
        Loading...
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0B0F12] text-white relative">
      <ScrollToBottom targetId="band-admin-content" label="Scroll" />
      <div className="border-b border-white/10 px-6 py-4 flex items-center gap-4">
        <Link href="/band-admin" className="text-white/60 hover:text-white">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-xl font-bold">{band.name}</h1>
          <Link href={`/bands/${slug}`} className="text-sm text-sky-400 hover:underline">
            View public page →
          </Link>
        </div>
      </div>

      <div id="band-admin-content" className="max-w-4xl mx-auto p-6">
        {/* Band Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="rounded-xl bg-white/5 ring-1 ring-white/10 p-4 text-center">
            <div className="text-2xl font-bold text-blue-400">{bandStats.memberCount}</div>
            <div className="text-xs text-white/60 mt-1">Members</div>
          </div>
          <div className="rounded-xl bg-white/5 ring-1 ring-white/10 p-4 text-center">
            <div className="text-2xl font-bold text-green-400">{bandStats.upcomingEvents}</div>
            <div className="text-xs text-white/60 mt-1">Upcoming Events</div>
          </div>
          <div className="rounded-xl bg-white/5 ring-1 ring-white/10 p-4 text-center">
            <div className="text-2xl font-bold text-purple-400">{bandStats.totalAnnouncements}</div>
            <div className="text-xs text-white/60 mt-1">Announcements</div>
          </div>
          <div className="rounded-xl bg-white/5 ring-1 ring-white/10 p-4 text-center">
            <div className="text-2xl font-bold text-pink-400">{bandStats.activeVolunteers}</div>
            <div className="text-xs text-white/60 mt-1">Active Volunteers</div>
          </div>
        </div>

        <Tabs defaultValue="announcements">
          <TabsList className="bg-white/5 mb-6">
            <TabsTrigger value="announcements">Announcements</TabsTrigger>
            <TabsTrigger value="events">Events</TabsTrigger>
            <TabsTrigger value="details">Band Details</TabsTrigger>
            <TabsTrigger value="leader">Leadership</TabsTrigger>
            <TabsTrigger value="members">Members</TabsTrigger>
          </TabsList>

          <TabsContent value="announcements" className="space-y-6">
            <div className="rounded-2xl bg-white/5 ring-1 ring-white/10 p-6 space-y-4">
              <h2 className="font-semibold flex items-center gap-2">
                <Plus className="w-4 h-4" /> New announcement
              </h2>
              <Input
                placeholder="Title"
                value={newAnn.title}
                onChange={(e) => setNewAnn((a) => ({ ...a, title: e.target.value }))}
                className="bg-black/40 border-white/20"
              />
              <Textarea
                placeholder="Content"
                value={newAnn.content}
                onChange={(e) => setNewAnn((a) => ({ ...a, content: e.target.value }))}
                className="bg-black/40 border-white/20 min-h-[100px]"
              />
              <select
                value={newAnn.type}
                onChange={(e) =>
                  setNewAnn((a) => ({ ...a, type: e.target.value as BandAnnouncement['type'] }))
                }
                className="w-full rounded-md bg-black/40 border border-white/20 px-3 py-2 text-sm"
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
                <div key={ann.id} className="rounded-xl bg-white/5 ring-1 ring-white/10 p-4 flex justify-between gap-4">
                  <div>
                    <h3 className="font-medium">{ann.title}</h3>
                    <p className="text-sm text-white/60 line-clamp-2">{ann.content}</p>
                  </div>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="text-red-400 shrink-0"
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
            <div className="rounded-2xl bg-white/5 ring-1 ring-white/10 p-6 space-y-4">
              <h2 className="font-semibold">New event</h2>
              <Input
                placeholder="Event title"
                value={newEvent.title}
                onChange={(e) => setNewEvent((ev) => ({ ...ev, title: e.target.value }))}
                className="bg-black/40 border-white/20"
              />
              <Textarea
                placeholder="Description"
                value={newEvent.description}
                onChange={(e) => setNewEvent((ev) => ({ ...ev, description: e.target.value }))}
                className="bg-black/40 border-white/20"
              />
              <Input
                type="datetime-local"
                value={newEvent.date}
                onChange={(e) => setNewEvent((ev) => ({ ...ev, date: e.target.value }))}
                className="bg-black/40 border-white/20"
              />
              <Input
                placeholder="Location"
                value={newEvent.location}
                onChange={(e) => setNewEvent((ev) => ({ ...ev, location: e.target.value }))}
                className="bg-black/40 border-white/20"
              />
              <Button onClick={handleCreateEvent} disabled={saving} className="rounded-full">
                Add event
              </Button>
            </div>
            {events.map((ev) => (
              <div key={ev.id} className="rounded-xl bg-white/5 p-4 flex justify-between">
                <span>{ev.title}</span>
                <Button
                  size="icon"
                  variant="ghost"
                  className="text-red-400"
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
                  <label className="text-sm text-white/60 capitalize block mb-1">
                    {field.replace(/_/g, ' ')}
                  </label>
                  <Textarea
                    value={(bandForm[field] as string) || ''}
                    onChange={(e) => setBandForm((f) => ({ ...f, [field]: e.target.value }))}
                    className="bg-black/40 border-white/20"
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
                  <label className="text-sm text-white/60 block mb-1">{field.replace(/_/g, ' ')}</label>
                  <Input
                    value={(bandForm[field] as string) || ''}
                    onChange={(e) => setBandForm((f) => ({ ...f, [field]: e.target.value }))}
                    className="bg-black/40 border-white/20"
                  />
                </div>
              )
            )}
            <div>
              <label className="text-sm text-white/60 block mb-1">Leader photo</label>
              <Input type="file" accept="image/*" onChange={handleLeaderImage} className="bg-black/40 border-white/20" />
            </div>
            <Button onClick={handleSaveBand} disabled={saving} className="rounded-full">
              Save leadership
            </Button>
          </TabsContent>

          <TabsContent value="members" className="space-y-4">
            <div className="rounded-2xl bg-white/5 ring-1 ring-white/10 p-6">
              <h2 className="font-semibold mb-4">Band Members</h2>
              <p className="text-white/60 text-sm mb-4">
                This section will display all band members once the database is connected.
                You'll be able to manage member roles, track participation, and send notifications.
              </p>
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-sm">
                        {String.fromCharCode(65 + i)}
                      </div>
                      <div>
                        <p className="font-medium text-sm">Member {i + 1}</p>
                        <p className="text-xs text-white/50">Joined {['1 week ago', '2 weeks ago', '1 month ago'][i]}</p>
                      </div>
                    </div>
                    <span className="text-xs px-2 py-1 rounded-full bg-green-500/20 text-green-400">Active</span>
                  </div>
                ))}
              </div>
              <Button className="w-full mt-4 rounded-full" variant="outline">
                Invite New Member
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
