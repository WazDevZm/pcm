"use client"

import { Users, Music, BookOpen, Heart, Globe, Mic } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function CommitteesPage() {
  const committees = [
    {
      name: "Worship Committee",
      icon: Music,
      description: "Leading praise and worship services, organizing music ministry, and coordinating special musical events.",
      focus: "Music Ministry & Worship",
      activities: ["Weekly worship services", "Special music events", "Choir coordination", "Instrument training"],
      leader: "Music Director",
      meetingTime: "Sundays 2:00 PM"
    },
    {
      name: "Bible Study Committee",
      icon: BookOpen,
      description: "Organizing Bible study groups, developing curriculum, and facilitating small group discussions.",
      focus: "Biblical Education & Growth",
      activities: ["Weekly Bible studies", "Curriculum development", "Small group facilitation", "Scripture memorization"],
      leader: "Bible Study Coordinator",
      meetingTime: "Wednesdays 7:00 PM"
    },
    {
      name: "Evangelism Committee",
      icon: Globe,
      description: "Campus outreach, community service projects, and sharing the gospel with fellow students.",
      focus: "Outreach & Mission",
      activities: ["Campus evangelism", "Community service", "Mission trips", "Literature distribution"],
      leader: "Evangelism Director",
      meetingTime: "Fridays 6:00 PM"
    },
    {
      name: "Fellowship Committee",
      icon: Users,
      description: "Building community through social events, welcoming new members, and fostering relationships.",
      focus: "Community & Relationships",
      activities: ["Social events", "New member orientation", "Game nights", "Potluck dinners"],
      leader: "Fellowship Coordinator",
      meetingTime: "Saturdays 4:00 PM"
    },
    {
      name: "Prayer Ministry",
      icon: Heart,
      description: "Coordinating prayer groups, maintaining prayer chains, and providing spiritual support.",
      focus: "Prayer & Spiritual Support",
      activities: ["Prayer meetings", "Prayer chains", "Intercessory prayer", "Spiritual counseling"],
      leader: "Prayer Coordinator",
      meetingTime: "Daily 6:00 AM"
    },
    {
      name: "Media Committee",
      icon: Mic,
      description: "Managing digital content, live streaming services, and maintaining online presence.",
      focus: "Digital Ministry & Communication",
      activities: ["Live streaming", "Social media management", "Website updates", "Audio/visual support"],
      leader: "Media Director",
      meetingTime: "Thursdays 5:00 PM"
    }
  ]

  return (
    <div className="min-h-screen bg-[#0B0F12] text-white">
      {/* Navigation */}
      <nav className="flex items-center justify-between p-6">
        <Link href="/" className="flex items-center gap-4 px-6 py-3 bg-black/60 ring-1 ring-white/30 backdrop-blur rounded-full">
          <img src="/logo (2).png" alt="Logo" className="w-12 h-12 object-contain" />
        </Link>
        <Button asChild className="bg-white text-black hover:bg-white/90 rounded-full px-6">
          <Link href="/">Back to Home</Link>
        </Button>
      </nav>

      {/* Hero Section */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <div className="mb-6 px-4 py-2 bg-black/40 ring-1 ring-white/20 backdrop-blur rounded-full inline-block">
            <span className="text-sm font-medium">Ministry Teams</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">Committees & Bands</h1>
          <p className="text-xl text-white/90 max-w-3xl mx-auto mb-12">
            Join one of our ministry committees and use your gifts to serve God and build His kingdom on campus.
          </p>
        </div>
      </section>

      {/* Committees Grid */}
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {committees.map((committee, index) => {
              const IconComponent = committee.icon
              return (
                <div key={index} className="rounded-2xl bg-white/5 ring-1 ring-white/10 backdrop-blur p-8 hover:bg-white/10 transition-colors">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-white/10 ring-1 ring-white/20 mb-6">
                    <IconComponent className="w-6 h-6 text-white" />
                  </div>
                  
                  <h3 className="text-2xl font-semibold mb-4">{committee.name}</h3>
                  <p className="text-white/80 mb-6 leading-relaxed">{committee.description}</p>
                  
                  <div className="space-y-4 mb-6">
                    <div>
                      <h4 className="font-semibold text-white/90 mb-2">Focus Area:</h4>
                      <p className="text-white/70 text-sm">{committee.focus}</p>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-white/90 mb-2">Activities:</h4>
                      <ul className="text-white/70 text-sm space-y-1">
                        {committee.activities.map((activity, idx) => (
                          <li key={idx}>• {activity}</li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="flex justify-between text-sm">
                      <div>
                        <span className="text-white/60">Leader: </span>
                        <span className="text-white/90">{committee.leader}</span>
                      </div>
                      <div>
                        <span className="text-white/60">Meets: </span>
                        <span className="text-white/90">{committee.meetingTime}</span>
                      </div>
                    </div>
                  </div>
                  
                  <Button className="w-full bg-white text-black hover:bg-white/90 rounded-full">
                    Join Committee
                  </Button>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="rounded-3xl bg-white/5 ring-1 ring-white/10 backdrop-blur p-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to Serve?</h2>
            <p className="text-xl text-white/80 mb-8">
              Every member has unique gifts that can contribute to our ministry. Find your place and make a difference.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-black hover:bg-white/90 rounded-full px-8">
                Contact Leadership
              </Button>
              <Button size="lg" variant="outline" className="bg-black/40 ring-1 ring-white/20 backdrop-blur border-0 text-white hover:bg-black/50 rounded-full px-8">
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}