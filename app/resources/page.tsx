"use client"

import { useEffect, useState } from "react"
import { BookOpen, Play, Download, FileText, Headphones, Video } from "lucide-react"
import { Button } from "@/components/ui/button"
import { MinistryPageShell } from "@/components/layout/MinistryPageShell"
import { MinistryContent } from "@/components/layout/MinistryContent"
import type { Resource } from "@/lib/supabase"
import { formatDate, getResources } from "@/lib/data/content"

type Meta = [label: string, value: string | number]
type StudyCard = { key: string; title: string; description: string; meta: Meta[]; url?: string }
type SermonCard = { key: string; title: string; subtitle: string; badge: string; url?: string }
type Grouped = { studies: StudyCard[]; sermons: SermonCard[]; devotionals: StudyCard[]; materials: StudyCard[] }

const FALLBACK_bibleStudies = [
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

const FALLBACK_sermons = [
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

const FALLBACK_devotionals = [
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

const FALLBACK_ministryMaterials = [
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

const FALLBACK: Grouped = {
  studies: FALLBACK_bibleStudies.map((s) => ({
    key: s.title,
    title: s.title,
    description: s.description,
    meta: [["Lessons", s.lessons], ["Duration", s.duration], ["Level", s.level]],
  })),
  sermons: FALLBACK_sermons.map((s) => ({
    key: s.title,
    title: s.title,
    subtitle: `${s.speaker} · ${s.date} · ${s.duration}`,
    badge: s.series,
  })),
  devotionals: FALLBACK_devotionals.map((d) => ({
    key: d.title,
    title: d.title,
    description: d.description,
    meta: [["Frequency", d.frequency], ["Type", d.type]],
  })),
  materials: FALLBACK_ministryMaterials.map((m) => ({
    key: m.title,
    title: m.title,
    description: m.description,
    meta: [["Pages", m.pages], ["Format", m.format]],
  })),
}

const capitalize = (v: string) => v.charAt(0).toUpperCase() + v.slice(1)

function resourceUrl(r: Resource): string | undefined {
  return r.download_url || r.file_url || undefined
}

function studyMeta(r: Resource): Meta[] {
  const meta: Meta[] = []
  if (r.lessons) meta.push(["Lessons", r.lessons])
  if (r.duration) meta.push(["Duration", r.duration])
  if (r.category) meta.push(["Category", r.category])
  if (r.level) meta.push(["Level", capitalize(r.level)])
  if (r.author) meta.push(["Author", r.author])
  return meta
}

function groupResources(rows: Resource[]): Grouped {
  const toStudy = (r: Resource): StudyCard => ({
    key: r.id,
    title: r.title,
    description: r.description,
    meta: studyMeta(r),
    url: resourceUrl(r),
  })
  return {
    studies: rows.filter((r) => r.type === "bible_study").map(toStudy),
    sermons: rows
      .filter((r) => r.type === "sermon")
      .map((r) => ({
        key: r.id,
        title: r.title,
        subtitle: [r.author, formatDate(r.created_at), r.duration].filter(Boolean).join(" · "),
        badge: r.category,
        url: resourceUrl(r),
      })),
    devotionals: rows.filter((r) => r.type === "devotional").map(toStudy),
    materials: rows.filter((r) => r.type === "manual").map(toStudy),
  }
}

function MetaList({ meta }: { meta: Meta[] }) {
  return (
    <dl className="space-y-1 mb-6 text-sm">
      {meta.map(([label, value]) => (
        <div key={label} className="flex justify-between">
          <dt className="text-muted-foreground">{label}</dt>
          <dd>{value}</dd>
        </div>
      ))}
    </dl>
  )
}

export default function ResourcesPage() {
  const [groups, setGroups] = useState<Grouped | null>(null)

  useEffect(() => {
    let active = true
    getResources().then((rows) => {
      if (active) setGroups(rows ? groupResources(rows) : FALLBACK)
    })
    return () => {
      active = false
    }
  }, [])

  function SectionHeader({ icon: Icon, title }: { icon: typeof BookOpen; title: string }) {
    return (
      <div className="flex items-center gap-4 mb-10">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-navy/10 shrink-0">
          <Icon className="w-6 h-6 text-navy" />
        </div>
        <h2 className="text-3xl md:text-4xl font-bold text-ink">{title}</h2>
      </div>
    )
  }

  return (
    <MinistryPageShell
      heroImage="/Slider/KCM_0822.jpg"
      eyebrow="Grow deeper"
      title="Resources"
      subtitle="Deepen your faith with our collection of Bible studies, sermons, devotionals, and ministry materials."
    >
      <MinistryContent>
        <div id="resources-content">
          {!groups && <p className="max-w-4xl mx-auto py-8 text-center text-muted-foreground">Loading resources...</p>}
        </div>

        {groups && groups.studies.length > 0 && (
        <section className="max-w-4xl mx-auto py-8">
          <SectionHeader icon={BookOpen} title="Bible Studies" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {groups.studies.map((study) => (
              <div key={study.key} className="rounded-2xl bg-white border border-border p-6 shadow-sm hover:shadow-md transition-shadow">
                <h3 className="text-lg font-semibold mb-2 text-ink">{study.title}</h3>
                <p className="text-muted-foreground text-sm mb-4">{study.description}</p>
                <MetaList meta={study.meta} />
                {study.url && (
                  <Button size="sm" className="w-full bg-navy text-white hover:bg-navy/90 rounded-full" asChild>
                    <a href={study.url} target="_blank" rel="noopener noreferrer">
                      <Download className="w-4 h-4 mr-1" />
                      Open Study
                    </a>
                  </Button>
                )}
              </div>
            ))}
          </div>
        </section>
        )}

        {groups && groups.sermons.length > 0 && (
        <section className="max-w-4xl mx-auto py-12 border-t border-border">
          <SectionHeader icon={Headphones} title="Recent Sermons" />
          <div className="space-y-6">
            {groups.sermons.map((sermon) => (
              <div key={sermon.key} className="rounded-2xl bg-white border border-border p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex justify-between gap-4 mb-3">
                  <div>
                    <h3 className="text-lg font-semibold text-ink">{sermon.title}</h3>
                    <p className="text-muted-foreground text-sm">{sermon.subtitle}</p>
                  </div>
                  {sermon.badge && (
                    <span className="shrink-0 px-3 py-1 h-fit bg-navy/10 text-navy rounded-full text-xs">
                      {sermon.badge}
                    </span>
                  )}
                </div>
                {sermon.url && (
                  <Button size="sm" className="w-full bg-navy text-white hover:bg-navy/90 rounded-full" asChild>
                    <a href={sermon.url} target="_blank" rel="noopener noreferrer">
                      <Play className="w-4 h-4 mr-1" />
                      Listen
                    </a>
                  </Button>
                )}
              </div>
            ))}
          </div>
        </section>
        )}

        {groups && groups.devotionals.length > 0 && (
        <section className="max-w-4xl mx-auto py-12 border-t border-border">
          <SectionHeader icon={FileText} title="Devotionals" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {groups.devotionals.map((devotional) => (
              <div key={devotional.key} className="rounded-2xl bg-white border border-border p-6 shadow-sm hover:shadow-md transition-shadow">
                <h3 className="text-lg font-semibold mb-2 text-ink">{devotional.title}</h3>
                <p className="text-muted-foreground text-sm mb-4">{devotional.description}</p>
                <MetaList meta={devotional.meta} />
                {devotional.url && (
                  <Button className="w-full bg-navy text-white hover:bg-navy/90 rounded-full" asChild>
                    <a href={devotional.url} target="_blank" rel="noopener noreferrer">Access Devotional</a>
                  </Button>
                )}
              </div>
            ))}
          </div>
        </section>
        )}

        {groups && groups.materials.length > 0 && (
        <section className="max-w-4xl mx-auto py-12 border-t border-border">
          <SectionHeader icon={Video} title="Ministry Materials" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {groups.materials.map((material) => (
              <div key={material.key} className="rounded-2xl bg-white border border-border p-6 shadow-sm hover:shadow-md transition-shadow">
                <h3 className="text-lg font-semibold mb-2 text-ink">{material.title}</h3>
                <p className="text-muted-foreground text-sm mb-4">{material.description}</p>
                <MetaList meta={material.meta} />
                {material.url && (
                  <Button size="sm" className="w-full bg-navy text-white hover:bg-navy/90 rounded-full" asChild>
                    <a href={material.url} target="_blank" rel="noopener noreferrer">
                      <Download className="w-4 h-4 mr-1" />
                      Download
                    </a>
                  </Button>
                )}
              </div>
            ))}
          </div>
        </section>
        )}

        <section className="max-w-4xl mx-auto py-12 border-t border-border text-center">
          <div className="rounded-2xl bg-white border border-border p-10 shadow-sm">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-ink">Need More Resources?</h2>
            <p className="text-lg text-muted-foreground">
              Contact our ministry team for additional materials and personalized study guides.
            </p>
          </div>
        </section>
      </MinistryContent>
    </MinistryPageShell>
  )
}
