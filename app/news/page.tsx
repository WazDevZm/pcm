"use client"

import Image from "next/image"
import { Calendar, User, Tag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { MinistryPageShell } from "@/components/layout/MinistryPageShell"
import { MinistryContent } from "@/components/layout/MinistryContent"
import { ScrollToBottom } from "@/components/ui/scroll-to-bottom"
import { ministryImage } from "@/lib/site-images"

const newsArticlesBase = [
  {
    title: "Student Testimony: Finding Hope in Christ",
    excerpt:
      "Sarah Martinez shares her powerful testimony of overcoming depression and finding purpose through our campus ministry community.",
    date: "January 28, 2025",
    author: "Sarah Martinez",
    category: "Testimony",
    type: "testimony" as const,
  },
  {
    title: "Revival Week Transforms Campus",
    excerpt:
      "Over 300 students attended our recent Revival Week, with 25 baptisms and countless lives transformed by God's love.",
    date: "January 25, 2025",
    author: "Pastor Johnson",
    category: "Ministry News",
    type: "news" as const,
  },
  {
    title: "From Addiction to Freedom: Michael's Story",
    excerpt:
      "A powerful testimony of how God delivered Michael from substance abuse and gave him a new life through our recovery ministry.",
    date: "January 22, 2025",
    author: "Michael Thompson",
    category: "Testimony",
    type: "testimony" as const,
  },
  {
    title: "Community Service Reaches 1,000 Hours",
    excerpt:
      "Our students have now contributed over 1,000 volunteer hours this semester, serving local shelters, food banks, and community centers.",
    date: "January 20, 2025",
    author: "Outreach Team",
    category: "Community Impact",
    type: "news" as const,
  },
  {
    title: "International Student Finds Family in Faith",
    excerpt:
      "Chen Wei from China shares how our ministry became his spiritual family and helped him navigate life in America.",
    date: "January 18, 2025",
    author: "Chen Wei",
    category: "Testimony",
    type: "testimony" as const,
  },
  {
    title: "New Prayer Garden Dedicated on Campus",
    excerpt:
      "A beautiful prayer garden has been established near the student center, providing a peaceful space for meditation and prayer.",
    date: "January 15, 2025",
    author: "Campus Development",
    category: "Campus News",
    type: "news" as const,
  },
  {
    title: "Healing After Loss: Emma's Journey",
    excerpt:
      "Emma shares how our grief support group and pastoral care helped her find healing after losing her father.",
    date: "January 12, 2025",
    author: "Emma Rodriguez",
    category: "Testimony",
    type: "testimony" as const,
  },
  {
    title: "Bible Study Groups Double in Size",
    excerpt:
      "Growing spiritual hunger among students has led to the formation of six new Bible study groups across campus.",
    date: "January 10, 2025",
    author: "Bible Study Coordinator",
    category: "Ministry Growth",
    type: "news" as const,
  },
]

export default function NewsPage() {
  const newsArticles = newsArticlesBase.map((article, index) => ({
    ...article,
    image: ministryImage(index),
  }))

  return (
    <MinistryPageShell
      heroImage="/Slider/KCM_0822.jpg"
      title="Ministry News"
      subtitle="Read inspiring testimonies, ministry updates, and stories of God&apos;s transformative work in our campus community."
    >
      <ScrollToBottom targetId="news-content" label="Scroll" />
      <MinistryContent>
        <div id="news-content" className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Latest News</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Discover testimonies of transformation, ministry updates, and stories of God&apos;s work
              in our community.
            </p>
          </div>

          <div className="space-y-6">
            {newsArticles.map((article, index) => (
              <article
                key={index}
                className="rounded-2xl bg-gray-50 ring-1 ring-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="relative aspect-video bg-gray-200">
                  <Image
                    src={article.image}
                    alt=""
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                  {article.type === "testimony" && (
                    <div className="absolute top-4 left-4 px-3 py-1 bg-[#0f2d6e] text-white text-xs font-medium rounded-full">
                      Testimony
                    </div>
                  )}
                </div>

                <div className="p-6">
                  <div className="flex flex-wrap items-center gap-4 mb-3 text-sm text-gray-500">
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

                  <h3 className="text-xl font-semibold mb-3 text-gray-900">{article.title}</h3>
                  <p className="text-gray-600 leading-relaxed mb-4">{article.excerpt}</p>

                  <Button className="bg-[#0B0F12] text-white hover:bg-[#0B0F12]/90 rounded-full px-6">
                    {article.type === "testimony" ? "Read Testimony" : "Read Full Article"}
                  </Button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </MinistryContent>
    </MinistryPageShell>
  )
}
