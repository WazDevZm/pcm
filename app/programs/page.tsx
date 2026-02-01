"use client"

import { ArrowLeft, Book, Users, Heart, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function ProgramsPage() {
  const programs = [
    {
      title: "Bible Study Groups",
      description: "Weekly in-depth study of Scripture with fellow believers",
      schedule: "Wednesdays 7:00 PM",
      location: "Campus Ministry Center",
      icon: Book
    },
    {
      title: "Youth Ministry",
      description: "Dynamic programs designed for college-age students",
      schedule: "Fridays 6:30 PM",
      location: "Student Union Building",
      icon: Users
    },
    {
      title: "Prayer & Worship",
      description: "Weekly worship services and prayer meetings",
      schedule: "Saturdays 10:00 AM",
      location: "Chapel",
      icon: Heart
    },
    {
      title: "Evangelism Training",
      description: "Learn to share your faith effectively on campus",
      schedule: "Sundays 4:00 PM",
      location: "Ministry Office",
      icon: Calendar
    }
  ]

  return (
    <div className="min-h-screen bg-[#0B0F12] text-white">
      <div className="relative min-h-screen">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url(/Features/KCM_0729.jpg)" }}
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
            <span className="text-sm font-medium">Ministry Programs</span>
          </div>

          <h1 className="text-6xl md:text-8xl font-bold tracking-tight mb-6 text-balance"><strong>Our Programs</strong></h1>

          <p className="text-xl md:text-2xl text-white/90 max-w-4xl mb-12 leading-relaxed text-pretty">
            Join our various ministry programs designed to strengthen your faith and build community with fellow believers.
          </p>

          {/* Logo 2 in bottom right of hero */}
          <div className="absolute bottom-8 right-8">
            <img src="/logo (2).png" alt="Logo 2" className="w-24 h-24 object-contain opacity-80" />
          </div>
        </div>
      </div>

      {/* Programs Section */}
      <section className="relative z-10 py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl font-bold tracking-tight mb-6 text-balance text-gray-900">Ministry Programs</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto text-pretty">
              Discover opportunities to grow in faith, serve others, and build lasting relationships.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {programs.map((program, index) => {
              const IconComponent = program.icon
              return (
                <div key={index} className="rounded-2xl bg-gray-50 ring-1 ring-gray-200 p-8">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gray-100 ring-1 ring-gray-300 mb-6">
                    <IconComponent className="w-6 h-6 text-gray-700" />
                  </div>
                  <h3 className="text-2xl font-semibold mb-4 text-gray-900">{program.title}</h3>
                  <p className="text-gray-600 leading-relaxed mb-4">{program.description}</p>
                  <div className="space-y-2 text-sm text-gray-500">
                    <p><strong>Schedule:</strong> {program.schedule}</p>
                    <p><strong>Location:</strong> {program.location}</p>
                  </div>
                  <Button className="mt-6 bg-gray-900 text-white hover:bg-gray-800 rounded-full px-6">
                    Learn More
                  </Button>
                </div>
              )
            })}
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