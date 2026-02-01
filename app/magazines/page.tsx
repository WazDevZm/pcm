"use client"

import { ArrowLeft, BookOpen, Download, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function MagazinesPage() {
  const magazines = [
    {
      title: "Adventist Review",
      description: "The official magazine of the Seventh-day Adventist Church worldwide.",
      issue: "February 2025 Issue",
      cover: "/placeholder.jpg",
      topics: ["Prophecy", "Health", "Mission Stories"]
    },
    {
      title: "Ministry Magazine",
      description: "Resources and insights for pastoral ministry and church leadership.",
      issue: "January 2025 Issue",
      cover: "/placeholder.jpg",
      topics: ["Preaching", "Leadership", "Evangelism"]
    },
    {
      title: "Signs of the Times",
      description: "Sharing hope and biblical truth with the world.",
      issue: "Current Issue",
      cover: "/placeholder.jpg",
      topics: ["Bible Study", "Prophecy", "Christian Living"]
    },
    {
      title: "Liberty Magazine",
      description: "Defending religious freedom and human rights worldwide.",
      issue: "Winter 2025",
      cover: "/placeholder.jpg",
      topics: ["Religious Freedom", "Human Rights", "Legal Issues"]
    },
    {
      title: "Campus Ministry Quarterly",
      description: "Resources specifically for college and university ministry.",
      issue: "Q1 2025",
      cover: "/placeholder.jpg",
      topics: ["Student Life", "Campus Evangelism", "Youth Ministry"]
    },
    {
      title: "Sabbath School Quarterly",
      description: "Bible study guides for deeper spiritual growth.",
      issue: "Current Quarter",
      cover: "/placeholder.jpg",
      topics: ["Bible Study", "Spiritual Growth", "Scripture"]
    }
  ]

  return (
    <div className="min-h-screen bg-[#0B0F12] text-white">
      <div className="relative min-h-screen">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url(/Slider/KCM_0799.jpg)" }}
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
            <span className="text-sm font-medium">Spiritual Resources</span>
          </div>

          <h1 className="text-6xl md:text-8xl font-bold tracking-tight mb-6 text-balance"><strong>Magazines & Publications</strong></h1>

          <p className="text-xl md:text-2xl text-white/90 max-w-4xl mb-12 leading-relaxed text-pretty">
            Access inspiring magazines and publications that strengthen faith and provide spiritual insights.
          </p>

          {/* Logo 2 in bottom right of hero */}
          <div className="absolute bottom-8 right-8">
            <img src="/logo (2).png" alt="Logo 2" className="w-24 h-24 object-contain opacity-80" />
          </div>
        </div>
      </div>

      {/* Magazines Section */}
      <section className="relative z-10 py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl font-bold tracking-tight mb-6 text-balance text-gray-900">Available Publications</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto text-pretty">
              Explore our collection of spiritual magazines and resources for personal growth and ministry.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {magazines.map((magazine, index) => (
              <div key={index} className="rounded-2xl bg-gray-50 ring-1 ring-gray-200 p-6">
                <div className="aspect-[3/4] bg-gray-200 rounded-lg mb-4 flex items-center justify-center">
                  <BookOpen className="w-12 h-12 text-gray-400" />
                </div>
                
                <h3 className="text-xl font-semibold mb-2 text-gray-900">{magazine.title}</h3>
                <p className="text-sm text-gray-500 mb-3">{magazine.issue}</p>
                <p className="text-gray-600 leading-relaxed mb-4">{magazine.description}</p>
                
                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">Topics:</p>
                  <div className="flex flex-wrap gap-2">
                    {magazine.topics.map((topic, topicIndex) => (
                      <span key={topicIndex} className="px-2 py-1 bg-gray-200 text-gray-700 text-xs rounded-full">
                        {topic}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button className="flex-1 bg-gray-900 text-white hover:bg-gray-800 rounded-full text-sm">
                    <Eye className="w-4 h-4 mr-2" />
                    Read Online
                  </Button>
                  <Button variant="outline" className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50 rounded-full text-sm">
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                </div>
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