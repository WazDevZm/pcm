"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { Calendar, Newspaper, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { MinistryPageShell } from "@/components/layout/MinistryPageShell"
import { MinistryContent } from "@/components/layout/MinistryContent"
import { ministryImage } from "@/lib/site-images"
import { Badge, EmptyState, cardClass } from "@/components/ui/haven"
import { cn } from "@/lib/utils"
import type { Post } from "@/lib/supabase"
import { formatDate, getPosts, isLocalImage } from "@/lib/data/content"

type PostCategory = Post["category"]

type Article = {
  id: string
  title: string
  excerpt: string
  content?: string
  date: string
  author: string
  category: string
  type: PostCategory
  image: string
}

const CATEGORY_LABELS: Record<PostCategory, string> = {
  testimony: "Testimony",
  news: "Ministry News",
  announcement: "Announcement",
  ministry: "Ministry",
}

const FILTERS: { id: "all" | PostCategory; name: string }[] = [
  { id: "all", name: "All" },
  { id: "testimony", name: "Testimonies" },
  { id: "news", name: "News" },
  { id: "announcement", name: "Announcements" },
  { id: "ministry", name: "Ministry" },
]

const FALLBACK_BASE = [
  {
    title: "Student Testimony: Finding Hope in Christ",
    excerpt:
      "Sarah Martinez shares her powerful testimony of overcoming depression and finding purpose through our campus ministry community.",
    date: "January 28, 2025",
    author: "Sarah Martinez",
    category: "Testimony",
    type: "testimony" as PostCategory,
  },
  {
    title: "Revival Week Transforms Campus",
    excerpt:
      "Over 300 students attended our recent Revival Week, with 25 baptisms and countless lives transformed by God's love.",
    date: "January 25, 2025",
    author: "Pastor Johnson",
    category: "Ministry News",
    type: "news" as PostCategory,
  },
  {
    title: "From Addiction to Freedom: Michael's Story",
    excerpt:
      "A powerful testimony of how God delivered Michael from substance abuse and gave him a new life through our recovery ministry.",
    date: "January 22, 2025",
    author: "Michael Thompson",
    category: "Testimony",
    type: "testimony" as PostCategory,
  },
  {
    title: "Community Service Reaches 1,000 Hours",
    excerpt:
      "Our students have now contributed over 1,000 volunteer hours this semester, serving local shelters, food banks, and community centers.",
    date: "January 20, 2025",
    author: "Outreach Team",
    category: "Community Impact",
    type: "news" as PostCategory,
  },
  {
    title: "International Student Finds Family in Faith",
    excerpt:
      "Chen Wei from China shares how our ministry became his spiritual family and helped him navigate life in America.",
    date: "January 18, 2025",
    author: "Chen Wei",
    category: "Testimony",
    type: "testimony" as PostCategory,
  },
  {
    title: "New Prayer Garden Dedicated on Campus",
    excerpt:
      "A beautiful prayer garden has been established near the student center, providing a peaceful space for meditation and prayer.",
    date: "January 15, 2025",
    author: "Campus Development",
    category: "Campus News",
    type: "news" as PostCategory,
  },
  {
    title: "Healing After Loss: Emma's Journey",
    excerpt:
      "Emma shares how our grief support group and pastoral care helped her find healing after losing her father.",
    date: "January 12, 2025",
    author: "Emma Rodriguez",
    category: "Testimony",
    type: "testimony" as PostCategory,
  },
  {
    title: "Bible Study Groups Double in Size",
    excerpt:
      "Growing spiritual hunger among students has led to the formation of six new Bible study groups across campus.",
    date: "January 10, 2025",
    author: "Bible Study Coordinator",
    category: "Ministry Growth",
    type: "news" as PostCategory,
  },
]


const FALLBACK: Article[] = FALLBACK_BASE.map((article, index) => ({
  ...article,
  id: `fallback-${index}`,
  image: ministryImage(index),
}))

function toArticle(post: Post, index: number): Article {
  return {
    id: post.id,
    title: post.title,
    excerpt: post.excerpt,
    content: post.content,
    date: formatDate(post.published_at ?? post.created_at),
    author: post.author?.name ?? "The Haven",
    category: CATEGORY_LABELS[post.category] ?? post.category,
    type: post.category,
    image: post.image_url || ministryImage(index),
  }
}

export default function NewsPage() {
  const [articles, setArticles] = useState<Article[] | null>(null)
  const [filter, setFilter] = useState<"all" | PostCategory>("all")
  const [expanded, setExpanded] = useState<string | null>(null)

  useEffect(() => {
    let active = true
    getPosts().then((rows) => {
      if (active) setArticles(rows ? rows.map(toArticle) : FALLBACK)
    })
    return () => {
      active = false
    }
  }, [])

  const newsArticles = (articles ?? []).filter((a) => filter === "all" || a.type === filter)

  return (
    <MinistryPageShell
      heroImage="/Slider/KCM_0822.jpg"
      eyebrow="Stories"
      title="News & testimonies"
      subtitle="Read inspiring testimonies, ministry updates, and stories of God&apos;s transformative work in our campus community."
    >
      <MinistryContent>
        <div id="news-content" className="max-w-6xl mx-auto">
          <div className="-mx-5 px-5 sm:mx-0 sm:px-0 flex gap-2 overflow-x-auto pb-1 mb-8" role="tablist" aria-label="Filter posts">
            {FILTERS.map((f) => (
              <button
                key={f.id}
                role="tab"
                aria-selected={filter === f.id}
                onClick={() => setFilter(f.id)}
                className={cn(
                  "shrink-0 rounded-full border px-4 py-2 text-sm font-semibold transition-colors",
                  filter === f.id ? "border-navy bg-navy text-white" : "border-border bg-white text-ink hover:border-navy/30"
                )}
              >
                {f.name}
              </button>
            ))}
          </div>

          {!articles && (
            <div className="grid md:grid-cols-2 gap-5">
              {[0, 1].map((i) => (
                <div key={i} className={cn(cardClass, "h-96 animate-pulse")} />
              ))}
            </div>
          )}
          {articles && newsArticles.length === 0 && (
            <EmptyState icon={Newspaper} title="Nothing here yet" body="No posts in this category yet — check back soon." />
          )}

          <div className="grid md:grid-cols-2 gap-5">
            {newsArticles.map((article, i) => {
              const featured = i === 0 && filter === "all"
              const open = expanded === article.id
              return (
                <article
                  key={article.id}
                  className={cn(cardClass, "overflow-hidden flex flex-col", featured && "md:col-span-2 md:flex-row")}
                >
                  <div className={cn("relative aspect-[16/10] bg-navy-soft shrink-0", featured && "md:aspect-auto md:w-1/2 md:min-h-[340px]")}>
                    <Image
                      src={article.image}
                      alt=""
                      fill
                      className="object-cover"
                      sizes={featured ? "(max-width: 768px) 100vw, 50vw" : "(max-width: 768px) 100vw, 33vw"}
                      unoptimized={!isLocalImage(article.image)}
                    />
                    <Badge tone={article.type === "testimony" ? "gold" : "navy"} className="absolute top-4 left-4 shadow-sm">
                      {article.category}
                    </Badge>
                  </div>

                  <div className={cn("p-6 flex flex-col flex-1", featured && "md:p-10 md:justify-center")}>
                    <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[13px] font-semibold text-navy">
                      <span className="flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5" />{article.date}</span>
                      <span className="flex items-center gap-1.5 text-muted-foreground font-medium"><User className="h-3.5 w-3.5" />{article.author}</span>
                    </p>

                    <h3 className={cn("mt-3 font-serif text-ink leading-tight", featured ? "text-3xl md:text-4xl" : "text-2xl")}>{article.title}</h3>
                    <p className="mt-3 text-muted-foreground leading-relaxed">{article.excerpt}</p>

                    {article.content && open && (
                      <div className="mt-4 text-ink/85 leading-relaxed whitespace-pre-line">{article.content}</div>
                    )}

                    {article.content && (
                      <Button
                        variant={open ? "outline" : "default"}
                        className="mt-6 self-start"
                        onClick={() => setExpanded(open ? null : article.id)}
                      >
                        {open ? "Show less" : article.type === "testimony" ? "Read testimony" : "Read more"}
                      </Button>
                    )}
                  </div>
                </article>
              )
            })}
          </div>
        </div>
      </MinistryContent>
    </MinistryPageShell>
  )
}
