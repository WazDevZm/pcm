"use client"

import { ArrowLeft, Calendar, Clock, MapPin, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

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
    <div className="min-h-screen bg-[#0B0F12] text-white">
      <div className="relative min-h-screen">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url(/Features/KCM_0741.jpg)" }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-black/80" />
        </div>

        <nav className="relative z-10 flex items-center justify-between p-6">
          <div className="flex items-center gap-4 px-6 py-3 bg-black/60 ring-1 ring-white/30 backdrop-blur rounded-full">
            <img src="/logo (2).png" alt="Logo 2" className="w-12 h-12 object-contain" />
          </div>

          <div className="hidden md:flex items-center gap-1">
            {[
              { name: "Programs", href: "/programs" },
              { name: "Events", href: "/events" },
              { name: "Magazines", href: "/magazines" },
              { name: "News", href: "/news" },
              { name: "Prayer Request", href: "/prayer-request" }
            ].map((item) => (
              <Link key={item.name} href={item.href} className="px-4 py-2 bg-black/40 ring-1 ring-white/20 backdrop-blur rounded-full hover:bg-black/50 transition-colors">
                {item.name}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <Link href="/" className="px-4 py-2 bg-black/40 ring-1 ring-white/20 backdrop-blur rounded-full hover:bg-black/50 transition-colors">
              <ArrowLeft className="w-4 h-4 inline mr-2" />
              Back to Home
            </Link>
          </div>
        </nav>

        <div className="relative z-10 flex flex-col items-center justify-center min-h-[calc(100vh-120px)] px-6 text-center">
          <div className="mb-6 px-4 py-2 bg-black/40 ring-1 ring-white/20 backdrop-blur rounded-full">
            <span className="text-sm font-medium">Upcoming Events</span>
          </div>

          <h1 className="text-6xl md:text-8xl font-bold tracking-tight mb-6 text-balance"><strong>Ministry Events</strong></h1>

          <p className="text-xl md:text-2xl text-white/90 max-w-4xl mb-12 leading-relaxed text-pretty">
            Join us for inspiring events that strengthen faith, build community, and serve others in Christ's love.
          </p>

          {/* Logo 2 in bottom right of hero */}
          <div className="absolute bottom-8 right-8">
            <img src="/logo (2).png" alt="Logo 2" className="w-24 h-24 object-contain opacity-80" />
          </div>
        </div>
      </div>

      {/* Events Section */}
      <section className="relative z-10 py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl font-bold tracking-tight mb-6 text-balance text-gray-900">Upcoming Events</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto text-pretty">
              Mark your calendar for these exciting ministry events and spiritual gatherings.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
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
      </section>

      {/* Footer */}
      <footer className="relative z-10 py-24 px-6 bg-black">
        <div className="max-w-7xl mx-auto">
          <div className="rounded-3xl bg-black ring-1 ring-gray-800 p-12">
            <div className="text-center">
              <div className="flex items-center justify-center gap-4 mb-6">
                <img src="/logo (1).png" alt="Logo 1" className="w-8 h-8 object-contain" />
                <img src="/logo (2).png" alt="Logo 2" className="w-8 h-8 object-contain" />
                <span className="text-xl font-semibold text-white">CBU SDA Public Campus Ministries</span>
              </div>
              <p className="text-gray-400 text-sm">© 2025 CBU SDA Public Campus Ministries</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}