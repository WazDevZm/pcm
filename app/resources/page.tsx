"use client"

import { BookOpen, Play, Download, FileText, Headphones, Video } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function ResourcesPage() {
  const bibleStudies = [
    {
      title: "Prophecies of Daniel",
      description: "A comprehensive study of the prophetic book of Daniel and its relevance for today.",
      lessons: 12,
      duration: "45 min each",
      level: "Intermediate"
    },
    {
      title: "The Sanctuary Service",
      description: "Understanding God's plan of salvation through the Old Testament sanctuary.",
      lessons: 8,
      duration: "60 min each",
      level: "Advanced"
    },
    {
      title: "Steps to Christ",
      description: "A foundational study for new believers based on Ellen White's classic book.",
      lessons: 10,
      duration: "30 min each",
      level: "Beginner"
    },
    {
      title: "Revelation Unveiled",
      description: "Exploring the prophetic messages of Revelation for the end times.",
      lessons: 15,
      duration: "50 min each",
      level: "Advanced"
    }
  ]

  const sermons = [
    {
      title: "The Second Coming of Christ",
      speaker: "Pastor Johnson",
      date: "January 15, 2025",
      duration: "42 min",
      series: "End Time Events"
    },
    {
      title: "Living by Faith",
      speaker: "Elder Martinez",
      date: "January 8, 2025",
      duration: "38 min",
      series: "Christian Living"
    },
    {
      title: "The Sabbath Rest",
      speaker: "Pastor Johnson",
      date: "January 1, 2025",
      duration: "45 min",
      series: "God's Law"
    },
    {
      title: "Prayer and Fasting",
      speaker: "Elder Smith",
      date: "December 25, 2024",
      duration: "35 min",
      series: "Spiritual Disciplines"
    }
  ]

  const devotionals = [
    {
      title: "Morning Watch",
      description: "Daily devotional readings for spiritual growth and reflection.",
      frequency: "Daily",
      type: "Text & Audio"
    },
    {
      title: "Youth Devotions",
      description: "Specially crafted devotionals addressing college-age challenges.",
      frequency: "Weekly",
      type: "Interactive"
    },
    {
      title: "Sabbath Reflections",
      description: "Deep spiritual thoughts for Sabbath meditation and worship.",
      frequency: "Weekly",
      type: "Text"
    }
  ]

  const ministryMaterials = [
    {
      title: "Evangelism Training Manual",
      description: "Complete guide for personal evangelism and witnessing.",
      pages: 120,
      format: "PDF"
    },
    {
      title: "Small Group Leader's Guide",
      description: "Resources for leading effective Bible study groups.",
      pages: 85,
      format: "PDF"
    },
    {
      title: "Campus Ministry Handbook",
      description: "Guidelines and best practices for campus outreach.",
      pages: 95,
      format: "PDF"
    },
    {
      title: "Prayer Ministry Resources",
      description: "Tools and guides for effective prayer ministry.",
      pages: 60,
      format: "PDF"
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
            <span className="text-sm font-medium">Spiritual Growth</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">Resources</h1>
          <p className="text-xl text-white/90 max-w-3xl mx-auto mb-12">
            Deepen your faith with our collection of Bible studies, sermons, devotionals, and ministry materials.
          </p>
        </div>
      </section>

      {/* Bible Studies Section */}
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-4 mb-12">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-white/10 ring-1 ring-white/20">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-4xl font-bold">Bible Studies</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {bibleStudies.map((study, index) => (
              <div key={index} className="rounded-2xl bg-white/5 ring-1 ring-white/10 backdrop-blur p-6 hover:bg-white/10 transition-colors">
                <h3 className="text-xl font-semibold mb-3">{study.title}</h3>
                <p className="text-white/80 text-sm mb-4 leading-relaxed">{study.description}</p>
                
                <div className="space-y-2 mb-6 text-sm">
                  <div className="flex justify-between">
                    <span className="text-white/60">Lessons:</span>
                    <span className="text-white/90">{study.lessons}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/60">Duration:</span>
                    <span className="text-white/90">{study.duration}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/60">Level:</span>
                    <span className="text-white/90">{study.level}</span>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button size="sm" className="flex-1 bg-white text-black hover:bg-white/90 rounded-full">
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                  <Button size="sm" variant="outline" className="bg-black/40 ring-1 ring-white/20 backdrop-blur border-0 text-white hover:bg-black/50 rounded-full">
                    <Play className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sermons Section */}
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-4 mb-12">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-white/10 ring-1 ring-white/20">
              <Headphones className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-4xl font-bold">Recent Sermons</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {sermons.map((sermon, index) => (
              <div key={index} className="rounded-2xl bg-white/5 ring-1 ring-white/10 backdrop-blur p-6 hover:bg-white/10 transition-colors">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold mb-2">{sermon.title}</h3>
                    <p className="text-white/70 text-sm mb-1">by {sermon.speaker}</p>
                    <p className="text-white/60 text-sm">{sermon.date} • {sermon.duration}</p>
                  </div>
                  <div className="px-3 py-1 bg-white/10 ring-1 ring-white/20 rounded-full text-xs text-white/80">
                    {sermon.series}
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button size="sm" className="flex-1 bg-white text-black hover:bg-white/90 rounded-full">
                    <Play className="w-4 h-4 mr-2" />
                    Listen
                  </Button>
                  <Button size="sm" variant="outline" className="bg-black/40 ring-1 ring-white/20 backdrop-blur border-0 text-white hover:bg-black/50 rounded-full">
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Devotionals Section */}
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-4 mb-12">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-white/10 ring-1 ring-white/20">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-4xl font-bold">Devotionals</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {devotionals.map((devotional, index) => (
              <div key={index} className="rounded-2xl bg-white/5 ring-1 ring-white/10 backdrop-blur p-6 hover:bg-white/10 transition-colors">
                <h3 className="text-xl font-semibold mb-3">{devotional.title}</h3>
                <p className="text-white/80 text-sm mb-4 leading-relaxed">{devotional.description}</p>
                
                <div className="space-y-2 mb-6 text-sm">
                  <div className="flex justify-between">
                    <span className="text-white/60">Frequency:</span>
                    <span className="text-white/90">{devotional.frequency}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/60">Type:</span>
                    <span className="text-white/90">{devotional.type}</span>
                  </div>
                </div>
                
                <Button className="w-full bg-white text-black hover:bg-white/90 rounded-full">
                  Access Devotional
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Ministry Materials Section */}
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-4 mb-12">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-white/10 ring-1 ring-white/20">
              <Video className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-4xl font-bold">Ministry Materials</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {ministryMaterials.map((material, index) => (
              <div key={index} className="rounded-2xl bg-white/5 ring-1 ring-white/10 backdrop-blur p-6 hover:bg-white/10 transition-colors">
                <h3 className="text-lg font-semibold mb-3">{material.title}</h3>
                <p className="text-white/80 text-sm mb-4 leading-relaxed">{material.description}</p>
                
                <div className="space-y-2 mb-6 text-sm">
                  <div className="flex justify-between">
                    <span className="text-white/60">Pages:</span>
                    <span className="text-white/90">{material.pages}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/60">Format:</span>
                    <span className="text-white/90">{material.format}</span>
                  </div>
                </div>
                
                <Button size="sm" className="w-full bg-white text-black hover:bg-white/90 rounded-full">
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="rounded-3xl bg-white/5 ring-1 ring-white/10 backdrop-blur p-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Need More Resources?</h2>
            <p className="text-xl text-white/80 mb-8">
              Can't find what you're looking for? Contact our ministry team for additional materials and personalized study guides.
            </p>
            <Button size="lg" className="bg-white text-black hover:bg-white/90 rounded-full px-8">
              Request Resources
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}