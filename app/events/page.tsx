"use client"

import { Calendar, Clock, MapPin, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { MinistryPageShell } from "@/components/layout/MinistryPageShell"
import { MinistryContent } from "@/components/layout/MinistryContent"
import { ScrollToBottom } from "@/components/ui/scroll-to-bottom"

export default function EventsPage() {
  const upcomingEvents = [
    {
      title: "Campus Revival Week",
      date: "February 15-22, 2025",
      time: "7:00 PM Daily",
      location: "Main Auditorium",
      description: "A week of spiritual renewal with guest speakers, worship, and prayer.",
      attendees: "500+ expected"
    },
    {
      title: "Bible Study Marathon",
      date: "March 5, 2025",
      time: "9:00 AM - 6:00 PM",
      location: "Student Center",
      description: "Intensive Bible study covering the book of Revelation.",
      attendees: "150+ registered"
    },
    {
      title: "Community Service Day",
      date: "March 12, 2025",
      time: "8:00 AM - 4:00 PM",
      location: "Various Locations",
      description: "Serve the local community through various outreach projects.",
      attendees: "200+ volunteers"
    },
    {
      title: "Youth Retreat Weekend",
      date: "March 25-27, 2025",
      time: "Friday 6 PM - Sunday 4 PM",
      location: "Mountain View Camp",
      description: "Weekend retreat for spiritual growth and fellowship.",
      attendees: "80+ participants"
    }
  ]

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

          <div className="space-y-6">
            {upcomingEvents.map((event, index) => (
              <div key={index} className="rounded-2xl bg-gray-50 ring-1 ring-gray-200 p-8">
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

                <Button className="bg-gray-900 text-white hover:bg-gray-800 rounded-full px-6" asChild>
                  <a href="https://forms.gle/F8CZ42LMRQG4LyC86" target="_blank" rel="noopener noreferrer">
                    Register Now
                  </a>
                </Button>
              </div>
            ))}
          </div>
        </div>
      </MinistryContent>
    </MinistryPageShell>
  )
}