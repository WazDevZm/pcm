"use client"

import { useCallback, useEffect, useState } from "react"
import Link from "next/link"
import { Calendar, Clock, MapPin, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { MinistryPageShell } from "@/components/layout/MinistryPageShell"
import { MinistryContent } from "@/components/layout/MinistryContent"
import { ScrollToBottom } from "@/components/ui/scroll-to-bottom"
import { useAuth } from "@/components/auth/AuthProvider"
import type { Event } from "@/lib/supabase"
import {
  cancelRsvp,
  formatDate,
  formatTime,
  getEventById,
  getMyEventIds,
  getUpcomingEvents,
  rsvpToEvent,
} from "@/lib/data/content"

type EventCard = {
  id: string | null
  title: string
  date: string
  time: string
  location: string
  description: string
  attendees: string
  full: boolean
}

const FALLBACK: EventCard[] = [
  {
    id: null,
    title: "Campus Revival Week",
    date: "February 15-22, 2025",
    time: "7:00 PM Daily",
    location: "Main Auditorium",
    description: "A week of spiritual renewal with guest speakers, worship, and prayer.",
    attendees: "500+ expected",
    full: false,
  },
  {
    id: null,
    title: "Bible Study Marathon",
    date: "March 5, 2025",
    time: "9:00 AM - 6:00 PM",
    location: "Student Center",
    description: "Intensive Bible study covering the book of Revelation.",
    attendees: "150+ registered",
    full: false,
  },
  {
    id: null,
    title: "Community Service Day",
    date: "March 12, 2025",
    time: "8:00 AM - 4:00 PM",
    location: "Various Locations",
    description: "Serve the local community through various outreach projects.",
    attendees: "200+ volunteers",
    full: false,
  },
  {
    id: null,
    title: "Youth Retreat Weekend",
    date: "March 25-27, 2025",
    time: "Friday 6 PM - Sunday 4 PM",
    location: "Mountain View Camp",
    description: "Weekend retreat for spiritual growth and fellowship.",
    attendees: "80+ participants",
    full: false,
  },
]

function toCard(e: Event): EventCard {
  const start = formatDate(e.date)
  const end = e.end_date ? formatDate(e.end_date) : ""
  const time = e.end_date ? `${formatTime(e.date)} - ${formatTime(e.end_date)}` : formatTime(e.date)
  const count = e.current_attendees ?? 0
  return {
    id: e.id,
    title: e.title,
    date: end && end !== start ? `${start} - ${end}` : start,
    time,
    location: e.location,
    description: e.description,
    attendees: e.max_attendees ? `${count} / ${e.max_attendees} attending` : `${count} attending`,
    full: Boolean(e.max_attendees && count >= e.max_attendees),
  }
}

export default function EventsPage() {
  const { user, loading: authLoading } = useAuth()
  const [events, setEvents] = useState<EventCard[] | null>(null)
  const [myEvents, setMyEvents] = useState<Set<string>>(new Set())
  const [pending, setPending] = useState<string | null>(null)
  const [message, setMessage] = useState<{ id: string; text: string } | null>(null)

  useEffect(() => {
    let active = true
    getUpcomingEvents().then((rows) => {
      if (active) setEvents(rows ? rows.map(toCard) : FALLBACK)
    })
    return () => {
      active = false
    }
  }, [])

  useEffect(() => {
    let active = true
    if (!user) {
      setMyEvents(new Set())
      return
    }
    getMyEventIds(user.id).then((ids) => {
      if (active) setMyEvents(ids)
    })
    return () => {
      active = false
    }
  }, [user])

  const toggleRsvp = useCallback(
    async (eventId: string) => {
      if (!user) return
      const attending = myEvents.has(eventId)
      setPending(eventId)
      setMessage(null)
      const { error } = attending ? await cancelRsvp(eventId, user.id) : await rsvpToEvent(eventId, user.id)
      if (error) {
        setMessage({ id: eventId, text: error })
      } else {
        setMyEvents((prev) => {
          const next = new Set(prev)
          if (attending) next.delete(eventId)
          else next.add(eventId)
          return next
        })
        const fresh = await getEventById(eventId)
        if (fresh) setEvents((prev) => prev && prev.map((e) => (e.id === eventId ? toCard(fresh) : e)))
      }
      setPending(null)
    },
    [user, myEvents]
  )

  return (
    <MinistryPageShell
      heroImage="/Features/KCM_0741.jpg"
      title="Ministry Events"
      subtitle="Join us for inspiring events that strengthen faith, build community, and serve others in Christ's love."
    >
      <ScrollToBottom targetId="events-content" label="Scroll" />
      <MinistryContent>
        <div id="events-content" className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4 text-balance text-gray-900">Upcoming Events</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto text-pretty">
              Mark your calendar for these exciting ministry events and spiritual gatherings.
            </p>
          </div>

          {!events && <p className="text-center text-gray-500">Loading events...</p>}

          <div className="space-y-6">
            {(events ?? []).map((event, index) => {
              const attending = event.id ? myEvents.has(event.id) : false
              return (
                <div key={event.id ?? index} className="rounded-2xl bg-gray-50 ring-1 ring-gray-200 p-8">
                  <h3 className="text-2xl font-semibold mb-4 text-gray-900">{event.title}</h3>
                  <p className="text-gray-600 leading-relaxed mb-6">{event.description}</p>

                  <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-3 text-gray-700">
                      <Calendar className="w-5 h-5" />
                      <span>{event.date}</span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-700">
                      <Clock className="w-5 h-5" />
                      <span>{event.time}</span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-700">
                      <MapPin className="w-5 h-5" />
                      <span>{event.location}</span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-700">
                      <Users className="w-5 h-5" />
                      <span>{event.attendees}</span>
                    </div>
                  </div>

                  {event.id && !authLoading && (
                    <div className="flex flex-wrap items-center gap-4">
                      {!user ? (
                        <Button className="bg-gray-900 text-white hover:bg-gray-800 rounded-full px-6" asChild>
                          <Link href="/login?next=/events">Sign in to RSVP</Link>
                        </Button>
                      ) : attending ? (
                        <>
                          <span className="text-sm font-medium text-[#0f2d6e]">You&apos;re attending</span>
                          <Button
                            variant="outline"
                            className="rounded-full px-6 border-gray-300"
                            disabled={pending === event.id}
                            onClick={() => toggleRsvp(event.id!)}
                          >
                            {pending === event.id ? "Cancelling..." : "Cancel RSVP"}
                          </Button>
                        </>
                      ) : (
                        <Button
                          className="bg-gray-900 text-white hover:bg-gray-800 rounded-full px-6"
                          disabled={event.full || pending === event.id}
                          onClick={() => toggleRsvp(event.id!)}
                        >
                          {event.full ? "Event Full" : pending === event.id ? "Saving..." : "RSVP"}
                        </Button>
                      )}
                      {message?.id === event.id && <p className="text-sm text-red-600">{message.text}</p>}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </MinistryContent>
    </MinistryPageShell>
  )
}
