"use client"

import Image from "next/image"
import { Camera, Play, Calendar, Users, MapPin } from "lucide-react"
import { useEffect, useState } from "react"
import { MinistryPageShell } from "@/components/layout/MinistryPageShell"
import { MinistryContent } from "@/components/layout/MinistryContent"
import { ministryImage } from "@/lib/site-images"
import type { GalleryItem } from "@/lib/supabase"
import { formatDate, getGalleryItems, isLocalImage } from "@/lib/data/content"

type GalleryCard = {
  id: string
  type: "image" | "video"
  category: string
  title: string
  date: string
  location: string
  attendees?: number | null
  description: string
  image: string
}

const FALLBACK: GalleryCard[] = ([
  {
    id: 1,
    type: "image",
    category: "worship",
    title: "Sabbath Worship Service",
    date: "January 18, 2025",
    location: "Campus Chapel",
    attendees: 85,
    description: "Weekly Sabbath worship with inspiring music and biblical teaching.",
  },
  {
    id: 2,
    type: "video",
    category: "events",
    title: "Prophecy Seminar Series",
    date: "January 15, 2025",
    location: "Student Center",
    attendees: 120,
    description: "Three-night evangelistic series on Bible prophecy and end-time events.",
  },
  {
    id: 3,
    type: "image",
    category: "outreach",
    title: "Community Food Drive",
    date: "January 12, 2025",
    location: "Local Food Bank",
    attendees: 45,
    description: "Students volunteering at the local food bank to serve the community.",
  },
  {
    id: 4,
    type: "image",
    category: "fellowship",
    title: "New Student Welcome",
    date: "January 10, 2025",
    location: "Ministry Center",
    attendees: 60,
    description: "Welcome event for new students with games, food, and fellowship.",
  },
  {
    id: 5,
    type: "video",
    category: "baptisms",
    title: "Baptism Ceremony",
    date: "January 8, 2025",
    location: "Campus Pool",
    attendees: 150,
    description: "Celebration of faith as five students were baptized into Christ.",
  },
  {
    id: 6,
    type: "image",
    category: "worship",
    title: "Youth Praise Night",
    date: "January 5, 2025",
    location: "Campus Chapel",
    attendees: 95,
    description: "Special praise and worship night led by student musicians.",
  },
  {
    id: 7,
    type: "image",
    category: "events",
    title: "Bible Study Marathon",
    date: "January 3, 2025",
    location: "Library Conference Room",
    attendees: 35,
    description: "Intensive Bible study session covering the book of Revelation.",
  },
  {
    id: 8,
    type: "video",
    category: "outreach",
    title: "Campus Literature Distribution",
    date: "December 28, 2024",
    location: "Campus Quad",
    attendees: 25,
    description: "Students sharing inspirational literature with fellow students.",
  },
] as (Omit<GalleryCard, "id" | "image"> & { id: number })[]).map((item) => ({
  ...item,
  id: String(item.id),
  image: ministryImage(item.id),
}))

function toCard(item: GalleryItem): GalleryCard {
  return {
    id: item.id,
    type: "image",
    category: item.category,
    title: item.title,
    date: formatDate(item.event_date),
    location: item.location,
    attendees: item.attendees,
    description: item.description ?? "",
    image: item.image_url,
  }
}

export default function GalleryPage() {
  const [selectedCategory, setSelectedCategory] = useState("all")

  const categories = [
    { id: "all", name: "All Media" },
    { id: "worship", name: "Worship Services" },
    { id: "events", name: "Campus Events" },
    { id: "outreach", name: "Community Outreach" },
    { id: "fellowship", name: "Fellowship" },
    { id: "baptisms", name: "Baptisms" }
  ]

  const [galleryItems, setGalleryItems] = useState<GalleryCard[] | null>(null)

  useEffect(() => {
    let active = true
    getGalleryItems().then((rows) => {
      if (active) setGalleryItems(rows ? rows.map(toCard) : FALLBACK)
    })
    return () => {
      active = false
    }
  }, [])

  const allItems = galleryItems ?? []
  const filteredItems = selectedCategory === "all"
    ? allItems
    : allItems.filter(item => item.category === selectedCategory)

  return (
    <MinistryPageShell
      heroImage="/Slider/KCM_0669.jpg"
      eyebrow="Moments"
      title="Gallery"
      subtitle="Witness God's work through our ministry activities, events, and community outreach."
    >
      <MinistryContent>
      {/* Category Filter */}
      <section className="py-8 max-w-4xl mx-auto">
        <div className="flex flex-wrap justify-center gap-3">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-6 py-3 rounded-full transition-colors ${
                selectedCategory === category.id
                  ? "bg-ink text-white"
                  : "bg-white border border-border text-ink/80 hover:bg-canvas"
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </section>

      {/* Gallery Grid */}
      <section id="gallery-content" className="py-12 max-w-4xl mx-auto">
          {!galleryItems && <p className="text-center text-muted-foreground">Loading gallery...</p>}
          {galleryItems && filteredItems.length === 0 && (
            <p className="text-center text-muted-foreground">No media in this category yet.</p>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredItems.map((item) => (
              <div key={item.id} className="group rounded-2xl bg-white border border-border overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <div className="relative aspect-square overflow-hidden">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    unoptimized={!isLocalImage(item.image)}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  
                  {/* Media Type Indicator */}
                  <div className="absolute top-4 right-4">
                    <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-black/60 ring-1 ring-white/30 backdrop-blur">
                      {item.type === "video" ? (
                        <Play className="w-4 h-4 text-white" />
                      ) : (
                        <Camera className="w-4 h-4 text-white" />
                      )}
                    </div>
                  </div>
                  
                  {/* Category Badge */}
                  <div className="absolute top-4 left-4">
                    <div className="px-3 py-1 bg-black/60 ring-1 ring-white/30 backdrop-blur rounded-full text-xs text-white capitalize">
                      {item.category}
                    </div>
                  </div>
                  
                  {/* Overlay Info */}
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h3 className="text-lg font-semibold mb-2 text-white">{item.title}</h3>
                    <div className="flex items-center gap-4 text-sm text-white/80">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        <span>{item.date}</span>
                      </div>
                      {item.attendees != null && (
                        <div className="flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          <span>{item.attendees}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="p-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                    <MapPin className="w-3 h-3" />
                    <span>{item.location}</span>
                  </div>
                  <p className="text-muted-foreground text-sm leading-relaxed">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
      </section>

      {/* Submit Content */}
      <section className="py-12 max-w-4xl mx-auto text-center border-t border-border">
          <div className="rounded-3xl bg-white border border-border p-12 shadow-sm">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-navy/10 mb-6">
              <Camera className="w-8 h-8 text-navy" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-ink">Share Your Photos</h2>
            <p className="text-lg text-muted-foreground">
              Have photos or videos from our ministry events? Share them with a ministry leader to be featured in our gallery.
            </p>
          </div>
      </section>

      </MinistryContent>
    </MinistryPageShell>
  )
}