"use client"

import { Book, Users, Heart, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { MinistryPageShell } from "@/components/layout/MinistryPageShell"
import { MinistryContent } from "@/components/layout/MinistryContent"
import { ScrollToBottom } from "@/components/ui/scroll-to-bottom"

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
    <MinistryPageShell
      heroImage="/Features/KCM_0729.jpg"
      title="Our Programs"
      subtitle="Join our ministry programs designed to strengthen your faith and build community with fellow believers."
    >
      <ScrollToBottom targetId="programs-content" label="Scroll" />
      <MinistryContent>
        <div id="programs-content" className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4 text-balance text-gray-900">Ministry Programs</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto text-pretty">
              Discover opportunities to grow in faith, serve others, and build lasting relationships.
            </p>
          </div>

          <div className="space-y-6">
            {programs.map((program, index) => {
              const IconComponent = program.icon
              return (
                <div key={index} className="rounded-2xl bg-gray-50 ring-1 ring-gray-200 p-8">
                  <div className="flex items-start gap-4">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-[#0f2d6e]/10 flex-shrink-0">
                      <IconComponent className="w-6 h-6 text-[#0f2d6e]" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-semibold mb-2 text-gray-900">{program.title}</h3>
                      <p className="text-gray-600 leading-relaxed mb-4">{program.description}</p>
                      <div className="space-y-2 text-sm text-gray-500">
                        <p><strong>Schedule:</strong> {program.schedule}</p>
                        <p><strong>Location:</strong> {program.location}</p>
                      </div>
                    </div>
                  </div>
                  <Button className="mt-6 bg-[#0f2d6e] text-white hover:bg-[#0f2d6e]/90 rounded-full px-6">
                    Learn More
                  </Button>
                </div>
              )
            })}
          </div>
        </div>
      </MinistryContent>
    </MinistryPageShell>
  )
}