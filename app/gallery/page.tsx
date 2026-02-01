"use client"

import { Camera, Play, Calendar, Users, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useState } from "react"

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

  const galleryItems = [
    {
      id: 1,
      type: "image",
      category: "worship",
      title: "Sabbath Worship Service",
      date: "January 18, 2025",
      location: "Campus Chapel",
      attendees: 85,
      image: "/KCM_0549.jpg",
      description: "Weekly Sabbath worship with inspiring music and biblical teaching."
    },
    {
      id: 2,
      type: "video",
      category: "events",
      title: "Prophecy Seminar Series",
      date: "January 15, 2025",
      location: "Student Center",
      attendees: 120,
      image: "/placeholder.jpg",
      description: "Three-night evangelistic series on Bible prophecy and end-time events."
    },
    {
      id: 3,
      type: "image",
      category: "outreach",
      title: "Community Food Drive",
      date: "January 12, 2025",
      location: "Local Food Bank",
      attendees: 45,
      image: "/placeholder.jpg",
      description: "Students volunteering at the local food bank to serve the community."
    },
    {
      id: 4,
      type: "image",
      category: "fellowship",
      title: "New Student Welcome",
      date: "January 10, 2025",
      location: "Ministry Center",
      attendees: 60,
      image: "/placeholder.jpg",
      description: "Welcome event for new students with games, food, and fellowship."
    },
    {
      id: 5,
      type: "video",
      category: "baptisms",
      title: "Baptism Ceremony",
      date: "January 8, 2025",
      location: "Campus Pool",
      attendees: 150,
      image: "/placeholder.jpg",
      description: "Celebration of faith as five students were baptized into Christ."
    },
    {
      id: 6,
      type: "image",
      category: "worship",
      title: "Youth Praise Night",
      date: "January 5, 2025",
      location: "Campus Chapel",
      attendees: 95,
      image: "/placeholder.jpg",
      description: "Special praise and worship night led by student musicians."
    },
    {
      id: 7,
      type: "image",
      category: "events",
      title: "Bible Study Marathon",
      date: "January 3, 2025",
      location: "Library Conference Room",
      attendees: 35,
      image: "/placeholder.jpg",
      description: "Intensive Bible study session covering the book of Revelation."
    },
    {
      id: 8,
      type: "video",
      category: "outreach",
      title: "Campus Literature Distribution",
      date: "December 28, 2024",
      location: "Campus Quad",
      attendees: 25,
      image: "/placeholder.jpg",
      description: "Students sharing inspirational literature with fellow students."
    }
  ]

  const filteredItems = selectedCategory === "all" 
    ? galleryItems 
    : galleryItems.filter(item => item.category === selectedCategory)

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
            <span className="text-sm font-medium">Visual Stories</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">Gallery</h1>
          <p className="text-xl text-white/90 max-w-3xl mx-auto mb-12">
            Witness God's work through our ministry activities, events, and community outreach captured in photos and videos.
          </p>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-8 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-6 py-3 rounded-full transition-colors ${
                  selectedCategory === category.id
                    ? "bg-white text-black"
                    : "bg-black/40 ring-1 ring-white/20 backdrop-blur text-white hover:bg-black/50"
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredItems.map((item) => (
              <div key={item.id} className="group rounded-2xl bg-white/5 ring-1 ring-white/10 backdrop-blur overflow-hidden hover:bg-white/10 transition-colors">
                <div className="relative aspect-square overflow-hidden">
                  <img 
                    src={item.image} 
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
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
                      <div className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        <span>{item.attendees}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="p-4">
                  <div className="flex items-center gap-2 text-sm text-white/70 mb-3">
                    <MapPin className="w-3 h-3" />
                    <span>{item.location}</span>
                  </div>
                  <p className="text-white/80 text-sm leading-relaxed">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="rounded-3xl bg-white/5 ring-1 ring-white/10 backdrop-blur p-12">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">Ministry Impact</h2>
              <p className="text-xl text-white/80 max-w-2xl mx-auto">
                See the numbers behind our ministry activities and community engagement.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold mb-2">150+</div>
                <div className="text-white/70">Photos Captured</div>
              </div>
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold mb-2">25+</div>
                <div className="text-white/70">Video Testimonies</div>
              </div>
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold mb-2">50+</div>
                <div className="text-white/70">Events Documented</div>
              </div>
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold mb-2">500+</div>
                <div className="text-white/70">Lives Touched</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Submit Content */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="rounded-3xl bg-white/5 ring-1 ring-white/10 backdrop-blur p-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/10 ring-1 ring-white/20 mb-6">
              <Camera className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Share Your Photos</h2>
            <p className="text-xl text-white/80 mb-8">
              Have photos or videos from our ministry events? Share them with us to be featured in our gallery.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-black hover:bg-white/90 rounded-full px-8">
                Submit Content
              </Button>
              <Button size="lg" variant="outline" className="bg-black/40 ring-1 ring-white/20 backdrop-blur border-0 text-white hover:bg-black/50 rounded-full px-8">
                View Guidelines
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}