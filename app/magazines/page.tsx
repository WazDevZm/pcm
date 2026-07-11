"use client"

import Image from "next/image"
import { BookOpen, Download, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { MinistryPageShell } from "@/components/layout/MinistryPageShell"
import { MinistryContent } from "@/components/layout/MinistryContent"
import { ScrollToBottom } from "@/components/ui/scroll-to-bottom"
import { ministryImage } from "@/lib/site-images"

const magazinesBase = [
  {
    title: "Adventist Review",
    description: "The official magazine of the Seventh-day Adventist Church worldwide.",
    issue: "February 2025 Issue",
    topics: ["Prophecy", "Health", "Mission Stories"],
  },
  {
    title: "Ministry Magazine",
    description: "Resources and insights for pastoral ministry and church leadership.",
    issue: "January 2025 Issue",
    topics: ["Preaching", "Leadership", "Evangelism"],
  },
  {
    title: "Signs of the Times",
    description: "Sharing hope and biblical truth with the world.",
    issue: "Current Issue",
    topics: ["Bible Study", "Prophecy", "Christian Living"],
  },
  {
    title: "Liberty Magazine",
    description: "Defending religious freedom and human rights worldwide.",
    issue: "Winter 2025",
    topics: ["Religious Freedom", "Human Rights", "Legal Issues"],
  },
  {
    title: "Campus Ministry Quarterly",
    description: "Resources specifically for college and university ministry.",
    issue: "Q1 2025",
    topics: ["Student Life", "Campus Evangelism", "Youth Ministry"],
  },
  {
    title: "Sabbath School Quarterly",
    description: "Bible study guides for deeper spiritual growth.",
    issue: "Current Quarter",
    topics: ["Bible Study", "Spiritual Growth", "Scripture"],
  },
]

export default function MagazinesPage() {
  const magazines = magazinesBase.map((mag, index) => ({
    ...mag,
    cover: ministryImage(index + 2),
  }))

  return (
    <MinistryPageShell
      heroImage="/Slider/KCM_0799.jpg"
      title="Magazines & Resources"
      subtitle="Spiritual publications and study materials for your faith journey."
    >
      <ScrollToBottom targetId="magazines-content" label="Scroll" />
      <MinistryContent>
        <div id="magazines-content" className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {magazines.map((magazine, index) => (
              <div
                key={index}
                className="rounded-2xl bg-white ring-1 ring-gray-200 overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="relative aspect-[3/4] bg-gray-100">
                  <Image
                    src={magazine.cover}
                    alt={magazine.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <BookOpen className="w-5 h-5 text-[#0f2d6e]" />
                    <span className="text-sm text-gray-500">{magazine.issue}</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-[#0B0F12]">{magazine.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed mb-4">{magazine.description}</p>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {magazine.topics.map((topic) => (
                      <span
                        key={topic}
                        className="px-2 py-1 bg-[#0f2d6e]/10 rounded-full text-xs text-[#0f2d6e]"
                      >
                        {topic}
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      className="flex-1 bg-[#0f2d6e] text-white hover:bg-[#0f2d6e]/90 rounded-full"
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      Read
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="rounded-full border-gray-300"
                    >
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </MinistryContent>
    </MinistryPageShell>
  )
}
