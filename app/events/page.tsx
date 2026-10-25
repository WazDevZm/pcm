"use client"

import { useCallback, useEffect, useState } from "react"
import Link from "next/link"
import { Calendar, Clock, MapPin, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { MinistryPageShell } from "@/components/layout/MinistryPageShell"
import { MinistryContent } from "@/components/layout/MinistryContent"
import { Badge, Notice, cardClass } from "@/components/ui/haven"
import { cn } from "@/lib/utils"
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
  month: string
  day: string
}

const FALLBACK: EventCard[] = [
  {
    id: null,
    title: "Campus Revival Week",
    date: "February 15-22, 2025",
    month: "Feb",
    day: "15",
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
    month: "Mar",
    day: "5",
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
    month: "Mar",
    day: "12",
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
    month: "Mar",
    day: "25",
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
    month: new Date(e.date).toLocaleDateString("en-GB", { month: "short" }),
    day: String(new Date(e.date).getDate()),
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
      eyebrow="Coming up"
      title="Events"
      subtitle="Worship, study nights, outreach and fellowship. RSVP so we know you're coming."
    >
      <MinistryContent>
        <div id="events-content" className="max-w-4xl mx-auto">
          {!events && (
            <div className="space-y-4">
              {[0, 1, 2].map((i) => (
                <div key={i} className={cn(cardClass, "h-40 animate-pulse")} />
              ))}
            </div>
          )}

          <div className="space-y-4">
            {(events ?? []).map((event, index) => {
              const attending = event.id ? myEvents.has(event.id) : false
              return (
                <article key={event.id ?? index} className={cn(cardClass, "p-5 sm:p-6 flex flex-col sm:flex-row gap-5")}>
                  <div className="flex sm:flex-col items-center sm:justify-center gap-3 sm:gap-0 sm:h-20 sm:w-20 shrink-0 rounded-2xl sm:bg-navy sm:text-white">
                    <span className="flex h-14 w-14 sm:h-auto sm:w-auto flex-col items-center justify-center rounded-2xl bg-navy text-white sm:bg-transparent">
                      <span className="eyebrow !text-[10px] text-gold">{event.month}</span>
                      <span className="font-serif text-2xl sm:text-3xl leading-none">{event.day}</span>
                    </span>
                    {attending && <Badge tone="success" className="sm:hidden">Attending</Badge>}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="text-xl font-bold text-ink">{event.title}</h3>
                      {attending && <Badge tone="success" className="hidden sm:inline-flex shrink-0">Attending</Badge>}
                      {event.full && !attending && <Badge tone="muted" className="shrink-0">Full</Badge>}
                    </div>
                    <p className="mt-2 text-muted-foreground leading-relaxed">{event.description}</p>

                    <ul className="mt-4 grid sm:grid-cols-2 gap-x-6 gap-y-2 text-sm">
                      <li className="flex items-center gap-2 text-ink/80"><Calendar className="h-4 w-4 text-navy shrink-0" />{event.date}</li>
                      <li className="flex items-center gap-2 text-ink/80"><Clock className="h-4 w-4 text-navy shrink-0" />{event.time}</li>
                      <li className="flex items-center gap-2 text-ink/80"><MapPin className="h-4 w-4 text-navy shrink-0" />{event.location}</li>
                      <li className="flex items-center gap-2 text-ink/80"><Users className="h-4 w-4 text-navy shrink-0" />{event.attendees}</li>
                    </ul>

                    {event.id && !authLoading && (
                      <div className="mt-5 flex flex-wrap items-center gap-3">
                        {!user ? (
                          <Button asChild>
                            <Link href="/login?next=/events">Sign in to RSVP</Link>
                          </Button>
                        ) : attending ? (
                          <Button variant="outline" disabled={pending === event.id} onClick={() => toggleRsvp(event.id!)}>
                            {pending === event.id ? "Cancelling…" : "Cancel RSVP"}
                          </Button>
                        ) : (
                          <Button disabled={event.full || pending === event.id} onClick={() => toggleRsvp(event.id!)}>
                            {event.full ? "Event full" : pending === event.id ? "Saving…" : "RSVP"}
                          </Button>
                        )}
                        {message?.id === event.id && <p className="text-sm text-destructive">{message.text}</p>}
                      </div>
                    )}
                  </div>
                </article>
              )
            })}
          </div>

          {events && events.length > 0 && events.every((e) => !e.id) && (
            <Notice className="mt-6">These are example events. Live events appear here as soon as leaders post them.</Notice>
          )}
        </div>
      </MinistryContent>
    </MinistryPageShell>
  )
}
