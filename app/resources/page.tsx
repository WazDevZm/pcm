"use client"

import { BookOpen, Play, Download, FileText, Headphones, Video } from "lucide-react"
import { Button } from "@/components/ui/button"
import { MinistryPageShell } from "@/components/layout/MinistryPageShell"
import { MinistryContent } from "@/components/layout/MinistryContent"
import { ScrollToBottom } from "@/components/ui/scroll-to-bottom"

export default function ResourcesPage() {
  const bibleStudies = [
    {
      title: "Prophecies of Daniel",
      description: "A comprehensive study of the prophetic book of Daniel and its relevance for today.",
      lessons: 12,
      duration: "45 min each",
      level: "Intermediate",
    },
    {
      title: "The Sanctuary Service",
      description: "Understanding God's plan of salvation through the Old Testament sanctuary.",
      lessons: 8,
      duration: "60 min each",
      level: "Advanced",
    },
    {
      title: "Steps to Christ",
      description: "A foundational study for new believers based on Ellen White's classic book.",
      lessons: 10,
      duration: "30 min each",
      level: "Beginner",
    },
    {
      title: "Revelation Unveiled",
      description: "Exploring the prophetic messages of Revelation for the end times.",
      lessons: 15,
      duration: "50 min each",
      level: "Advanced",
    },
  ]

  const sermons = [
    {
      title: "The Second Coming of Christ",
      speaker: "Pastor Johnson",
      date: "January 15, 2025",
      duration: "42 min",
      series: "End Time Events",
    },
    {
      title: "Living by Faith",
      speaker: "Elder Martinez",
      date: "January 8, 2025",
      duration: "38 min",
      series: "Christian Living",
    },
    {
      title: "The Sabbath Rest",
      speaker: "Pastor Johnson",
      date: "January 1, 2025",
      duration: "45 min",
      series: "God's Law",
    },
    {
      title: "Prayer and Fasting",
      speaker: "Elder Smith",
      date: "December 25, 2024",
      duration: "35 min",
      series: "Spiritual Disciplines",
    },
  ]

  const devotionals = [
    {
      title: "Morning Watch",
      description: "Daily devotional readings for spiritual growth and reflection.",
      frequency: "Daily",
      type: "Text & Audio",
    },
    {
      title: "Youth Devotions",
      description: "Specially crafted devotionals addressing college-age challenges.",
      frequency: "Weekly",
      type: "Interactive",
    },
    {
      title: "Sabbath Reflections",
      description: "Deep spiritual thoughts for Sabbath meditation and worship.",
      frequency: "Weekly",
      type: "Text",
    },
  ]

  const ministryMaterials = [
    {
      title: "Evangelism Training Manual",
      description: "Complete guide for personal evangelism and witnessing.",
      pages: 120,
      format: "PDF",
    },
    {
      title: "Small Group Leader's Guide",
      description: "Resources for leading effective Bible study groups.",
      pages: 85,
      format: "PDF",
    },
    {
      title: "Campus Ministry Handbook",
      description: "Guidelines and best practices for campus outreach.",
      pages: 95,
      format: "PDF",
    },
    {
      title: "Prayer Ministry Resources",
      description: "Tools and guides for effective prayer ministry.",
      pages: 60,
      format: "PDF",
    },
  ]

  function SectionHeader({ icon: Icon, title }: { icon: typeof BookOpen; title: string }) {
    return (
      <div className="flex items-center gap-4 mb-10">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-[#0f2d6e]/10 shrink-0">
          <Icon className="w-6 h-6 text-[#0f2d6e]" />
        </div>
        <h2 className="text-3xl md:text-4xl font-bold text-[#0B0F12]">{title}</h2>
      </div>
    )
  }

  return (
    <MinistryPageShell
      heroImage="/Slider/KCM_0822.jpg"
      title="Resources"
      subtitle="Deepen your faith with our collection of Bible studies, sermons, devotionals, and ministry materials."
    >
      <ScrollToBottom targetId="resources-content" label="Scroll" />
      <MinistryContent>
        <section id="resources-content" className="max-w-4xl mx-auto py-8">
          <SectionHeader icon={BookOpen} title="Bible Studies" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {bibleStudies.map((study, index) => (
              <div key={index} className="rounded-2xl bg-white ring-1 ring-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
                <h3 className="text-lg font-semibold mb-2 text-[#0B0F12]">{study.title}</h3>
                <p className="text-gray-600 text-sm mb-4">{study.description}</p>
                <dl className="space-y-1 mb-6 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-gray-500">Lessons</dt>
                    <dd>{study.lessons}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-gray-500">Duration</dt>
                    <dd>{study.duration}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-gray-500">Level</dt>
                    <dd>{study.level}</dd>
                  </div>
                </dl>
                <div className="flex gap-2">
                  <Button size="sm" className="flex-1 bg-[#0f2d6e] text-white hover:bg-[#0f2d6e]/90 rounded-full">
                    <Download className="w-4 h-4 mr-1" />
                    Download
                  </Button>
                  <Button size="sm" variant="outline" className="rounded-full border-gray-300">
                    <Play className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="max-w-4xl mx-auto py-12 border-t border-gray-200">
          <SectionHeader icon={Headphones} title="Recent Sermons" />
          <div className="space-y-6">
            {sermons.map((sermon, index) => (
              <div key={index} className="rounded-2xl bg-white ring-1 ring-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex justify-between gap-4 mb-3">
                  <div>
                    <h3 className="text-lg font-semibold text-[#0B0F12]">{sermon.title}</h3>
                    <p className="text-gray-500 text-sm">
                      {sermon.speaker} · {sermon.date} · {sermon.duration}
                    </p>
                  </div>
                  <span className="shrink-0 px-3 py-1 h-fit bg-[#0f2d6e]/10 text-[#0f2d6e] rounded-full text-xs">
                    {sermon.series}
                  </span>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" className="flex-1 bg-[#0f2d6e] text-white hover:bg-[#0f2d6e]/90 rounded-full">
                    <Play className="w-4 h-4 mr-1" />
                    Listen
                  </Button>
                  <Button size="sm" variant="outline" className="rounded-full border-gray-300">
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="max-w-4xl mx-auto py-12 border-t border-gray-200">
          <SectionHeader icon={FileText} title="Devotionals" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {devotionals.map((devotional, index) => (
              <div key={index} className="rounded-2xl bg-white ring-1 ring-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
                <h3 className="text-lg font-semibold mb-2 text-[#0B0F12]">{devotional.title}</h3>
                <p className="text-gray-600 text-sm mb-4">{devotional.description}</p>
                <dl className="space-y-1 mb-6 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-gray-500">Frequency</dt>
                    <dd>{devotional.frequency}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-gray-500">Type</dt>
                    <dd>{devotional.type}</dd>
                  </div>
                </dl>
                <Button className="w-full bg-[#0f2d6e] text-white hover:bg-[#0f2d6e]/90 rounded-full">Access Devotional</Button>
              </div>
            ))}
          </div>
        </section>

        <section className="max-w-4xl mx-auto py-12 border-t border-gray-200">
          <SectionHeader icon={Video} title="Ministry Materials" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {ministryMaterials.map((material, index) => (
              <div key={index} className="rounded-2xl bg-white ring-1 ring-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
                <h3 className="text-lg font-semibold mb-2 text-[#0B0F12]">{material.title}</h3>
                <p className="text-gray-600 text-sm mb-4">{material.description}</p>
                <dl className="space-y-1 mb-6 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-gray-500">Pages</dt>
                    <dd>{material.pages}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-gray-500">Format</dt>
                    <dd>{material.format}</dd>
                  </div>
                </dl>
                <Button size="sm" className="w-full bg-[#0f2d6e] text-white hover:bg-[#0f2d6e]/90 rounded-full">
                  <Download className="w-4 h-4 mr-1" />
                  Download
                </Button>
              </div>
            ))}
          </div>
        </section>

        <section className="max-w-4xl mx-auto py-12 border-t border-gray-200 text-center">
          <div className="rounded-2xl bg-white ring-1 ring-gray-200 p-10 shadow-sm">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-[#0B0F12]">Need More Resources?</h2>
            <p className="text-lg text-gray-600 mb-8">
              Contact our ministry team for additional materials and personalized study guides.
            </p>
            <Button size="lg" className="bg-[#0f2d6e] text-white hover:bg-[#0f2d6e]/90 rounded-full px-8 font-semibold">
              Request Resources
            </Button>
          </div>
        </section>
      </MinistryContent>
    </MinistryPageShell>
  )
}
