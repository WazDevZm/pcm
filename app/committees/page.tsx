import Link from "next/link"
import { Users, BookOpen, Heart, Megaphone, Activity, Music, Globe, Mic } from "lucide-react"
import { Button } from "@/components/ui/button"
import { MinistryPageShell } from "@/components/layout/MinistryPageShell"
import { MinistryContent } from "@/components/layout/MinistryContent"
import { ScrollToBottom } from "@/components/ui/scroll-to-bottom"
import { getBands } from "@/lib/bands"

const iconMap: Record<string, typeof Users> = {
  "bible-study-band": BookOpen,
  "publicity-committee": Megaphone,
  "welfare-band": Heart,
  "health-band": Activity,
  "witnessing-band": Users,
}

export const metadata = {
  title: "Committees & Bands | FaithLink",
  description: "Explore ministry committees and bands at FaithLink.",
}

export default async function CommitteesPage() {
  const bands = await getBands()
  const legacyCommittees = [
    {
      name: "Worship Committee",
      icon: Music,
      description:
        "Leading praise and worship services, organizing music ministry, and coordinating special musical events.",
      focus: "Music Ministry & Worship",
      activities: ["Weekly worship services", "Special music events", "Choir coordination"],
      leader: "Music Director",
      meetingTime: "Sundays 2:00 PM",
    },
    {
      name: "Bible Study Committee",
      icon: BookOpen,
      description:
        "Organizing Bible study groups, developing curriculum, and facilitating small group discussions.",
      focus: "Biblical Education & Growth",
      activities: ["Weekly Bible studies", "Curriculum development", "Small group facilitation"],
      leader: "Bible Study Coordinator",
      meetingTime: "Wednesdays 7:00 PM",
    },
    {
      name: "Evangelism Committee",
      icon: Globe,
      description:
        "Campus outreach, community service projects, and sharing the gospel with fellow students.",
      focus: "Outreach & Mission",
      activities: ["Campus evangelism", "Community service", "Mission trips"],
      leader: "Evangelism Director",
      meetingTime: "Fridays 6:00 PM",
    },
    {
      name: "Fellowship Committee",
      icon: Users,
      description:
        "Building community through social events, welcoming new members, and fostering relationships.",
      focus: "Community & Relationships",
      activities: ["Social events", "New member orientation", "Game nights"],
      leader: "Fellowship Coordinator",
      meetingTime: "Saturdays 4:00 PM",
    },
    {
      name: "Prayer Ministry",
      icon: Heart,
      description:
        "Coordinating prayer groups, maintaining prayer chains, and providing spiritual support.",
      focus: "Prayer & Spiritual Support",
      activities: ["Prayer meetings", "Prayer chains", "Intercessory prayer"],
      leader: "Prayer Coordinator",
      meetingTime: "Daily 6:00 AM",
    },
    {
      name: "Media Committee",
      icon: Mic,
      description:
        "Managing digital content, live streaming services, and maintaining online presence.",
      focus: "Digital Ministry & Communication",
      activities: ["Live streaming", "Social media management", "Website updates"],
      leader: "Media Director",
      meetingTime: "Thursdays 5:00 PM",
    },
  ]

  return (
    <MinistryPageShell
      heroImage="/Slider/KCM_0669.jpg"
      title="Committees & Bands"
      subtitle="Join one of our ministry teams and use your gifts to serve God and build His kingdom on campus."
    >
      <ScrollToBottom targetId="committees-content" label="Scroll" />
      <MinistryContent>
        <section id="committees-content" className="max-w-4xl mx-auto py-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-8 text-[#0B0F12]">Ministry Bands</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
            {bands.map((band) => {
              const Icon = iconMap[band.slug ?? ""] ?? Users
              return (
                <Link
                  key={band.id}
                  href={`/bands/${band.slug}`}
                  className="rounded-2xl bg-white ring-1 ring-gray-200 p-8 block hover:ring-[#0f2d6e]/30 hover:shadow-md transition-shadow"
                >
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-[#0f2d6e]/10">
                    <Icon className="w-6 h-6 text-[#0f2d6e]" />
                  </div>
                  <h3 className="text-xl font-semibold mt-6 mb-3 text-[#0B0F12]">{band.name}</h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">{band.description}</p>
                  <span className="text-sm font-medium text-[#0f2d6e]">View band page →</span>
                </Link>
              )
            })}
          </div>

          <h2 className="text-3xl md:text-4xl font-bold text-center mb-8 text-[#0B0F12]">Other Committees</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {legacyCommittees.map((committee, index) => {
              const Icon = committee.icon
              return (
                <div key={index} className="rounded-2xl bg-white ring-1 ring-gray-200 p-8 shadow-sm hover:shadow-md transition-shadow">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-[#0f2d6e]/10">
                    <Icon className="w-6 h-6 text-[#0f2d6e]" />
                  </div>
                  <h3 className="text-xl font-semibold mt-6 mb-3 text-[#0B0F12]">{committee.name}</h3>
                  <p className="text-gray-600 text-sm mb-4">{committee.description}</p>
                  <p className="text-sm text-gray-500 mb-2">
                    <span className="font-medium text-gray-700">Focus:</span> {committee.focus}
                  </p>
                  <ul className="text-sm text-gray-600 space-y-1 mb-4">
                    {committee.activities.map((a) => (
                      <li key={a}>• {a}</li>
                    ))}
                  </ul>
                  <p className="text-sm text-gray-500 mb-6">
                    {committee.leader} · {committee.meetingTime}
                  </p>
                  <Button className="w-full bg-[#0f2d6e] text-white hover:bg-[#0f2d6e]/90 rounded-full">Join Committee</Button>
                </div>
              )
            })}
          </div>
        </section>

        <section className="max-w-4xl mx-auto py-12 border-t border-gray-200 text-center">
          <div className="rounded-2xl bg-white ring-1 ring-gray-200 p-10 shadow-sm">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-[#0B0F12]">Ready to Serve?</h2>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              Every member has unique gifts that can contribute to our ministry. Find your place and
              make a difference.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button size="lg" className="bg-[#0f2d6e] text-white hover:bg-[#0f2d6e]/90 rounded-full px-8 font-semibold" asChild>
                <Link href="/support">Contact Leadership</Link>
              </Button>
              <Button size="lg" variant="outline" className="rounded-full px-8 border-gray-300" asChild>
                <Link href="/bands">View All Bands</Link>
              </Button>
            </div>
          </div>
        </section>
      </MinistryContent>
    </MinistryPageShell>
  )
}
