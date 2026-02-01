"use client"

import { ArrowLeft, Calendar, User, Tag } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function NewsPage() {
  const newsArticles = [
    {
      title: "Student Testimony: Finding Hope in Christ",
      excerpt: "Sarah Martinez shares her powerful testimony of overcoming depression and finding purpose through our campus ministry community.",
      date: "January 28, 2025",
      author: "Sarah Martinez",
      category: "Testimony",
      image: "/placeholder.jpg",
      type: "testimony"
    },
    {
      title: "Revival Week Transforms Campus",
      excerpt: "Over 300 students attended our recent Revival Week, with 25 baptisms and countless lives transformed by God's love.",
      date: "January 25, 2025",
      author: "Pastor Johnson",
      category: "Ministry News",
      image: "/placeholder.jpg",
      type: "news"
    },
    {
      title: "From Addiction to Freedom: Michael's Story",
      excerpt: "A powerful testimony of how God delivered Michael from substance abuse and gave him a new life through our recovery ministry.",
      date: "January 22, 2025",
      author: "Michael Thompson",
      category: "Testimony",
      image: "/placeholder.jpg",
      type: "testimony"
    },
    {
      title: "Community Service Reaches 1,000 Hours",
      excerpt: "Our students have now contributed over 1,000 volunteer hours this semester, serving local shelters, food banks, and community centers.",
      date: "January 20, 2025",
      author: "Outreach Team",
      category: "Community Impact",
      image: "/placeholder.jpg",
      type: "news"
    },
    {
      title: "International Student Finds Family in Faith",
      excerpt: "Chen Wei from China shares how our ministry became his spiritual family and helped him navigate life in America.",
      date: "January 18, 2025",
      author: "Chen Wei",
      category: "Testimony",
      image: "/placeholder.jpg",
      type: "testimony"
    },
    {
      title: "New Prayer Garden Dedicated on Campus",
      excerpt: "A beautiful prayer garden has been established near the student center, providing a peaceful space for meditation and prayer.",
      date: "January 15, 2025",
      author: "Campus Development",
      category: "Campus News",
      image: "/placeholder.jpg",
      type: "news"
    },
    {
      title: "Healing After Loss: Emma's Journey",
      excerpt: "Emma shares how our grief support group and pastoral care helped her find healing after losing her father.",
      date: "January 12, 2025",
      author: "Emma Rodriguez",
      category: "Testimony",
      image: "/placeholder.jpg",
      type: "testimony"
    },
    {
      title: "Bible Study Groups Double in Size",
      excerpt: "Growing spiritual hunger among students has led to the formation of six new Bible study groups across campus.",
      date: "January 10, 2025",
      author: "Bible Study Coordinator",
      category: "Ministry Growth",
      image: "/placeholder.jpg",
      type: "news"
    }
  ]

  return (
    <div className="min-h-screen bg-[#0B0F12] text-white">
      <div className="relative min-h-screen">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url(/Slider/KCM_0822.jpg)" }}
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
            <span className="text-sm font-medium">Ministry Updates</span>
          </div>

          <h1 className="text-6xl md:text-8xl font-bold tracking-tight mb-6 text-balance"><strong>Ministry News</strong></h1>

          <p className="text-xl md:text-2xl text-white/90 max-w-4xl mb-12 leading-relaxed text-pretty">
            Read inspiring testimonies, ministry updates, and stories of God's transformative work in our campus community.
          </p>

          {/* Logo 2 in bottom right of hero */}
          <div className="absolute bottom-8 right-8">
            <img src="/logo (2).png" alt="Logo 2" className="w-24 h-24 object-contain opacity-80" />
          </div>
        </div>
      </div>

      {/* News Section */}
      <section className="relative z-10 py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl font-bold tracking-tight mb-6 text-balance text-gray-900">Latest News</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto text-pretty">
              Discover testimonies of transformation, ministry updates, and stories of God's work in our community.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {newsArticles.map((article, index) => (
              <div key={index} className="rounded-2xl bg-gray-50 ring-1 ring-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
                <div className="aspect-video bg-gray-200 flex items-center justify-center relative">
                  <span className="text-gray-400">News Image</span>
                  {article.type === "testimony" && (
                    <div className="absolute top-4 left-4 px-3 py-1 bg-blue-600 text-white text-xs font-medium rounded-full">
                      Testimony
                    </div>
                  )}
                </div>
                
                <div className="p-6">
                  <div className="flex items-center gap-4 mb-3 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>{article.date}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <User className="w-4 h-4" />
                      <span>{article.author}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Tag className="w-4 h-4" />
                      <span>{article.category}</span>
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-semibold mb-3 text-gray-900 hover:text-blue-600 transition-colors">{article.title}</h3>
                  <p className="text-gray-600 leading-relaxed mb-4">{article.excerpt}</p>
                  
                  <Button className="bg-gray-900 text-white hover:bg-gray-800 rounded-full px-6">
                    {article.type === "testimony" ? "Read Testimony" : "Read Full Article"}
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