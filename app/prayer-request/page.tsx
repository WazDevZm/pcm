"use client"

import { ArrowLeft, Heart, Send, Shield, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useState } from "react"

export default function PrayerRequestPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    requestType: '',
    message: '',
    anonymous: false
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission
    console.log('Prayer request submitted:', formData)
  }

  const prayerCategories = [
    { name: "Health & Healing", icon: Heart },
    { name: "Academic Success", icon: Shield },
    { name: "Family & Relationships", icon: Users },
    { name: "Spiritual Growth", icon: Heart },
    { name: "Financial Needs", icon: Shield },
    { name: "Career & Future", icon: Users }
  ]

  return (
    <div className="min-h-screen bg-[#0B0F12] text-white">
      <div className="relative min-h-screen">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url(/Features/KCM_0729.jpg)" }}
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
            <span className="text-sm font-medium">Prayer Ministry</span>
          </div>

          <h1 className="text-6xl md:text-8xl font-bold tracking-tight mb-6 text-balance"><strong>Prayer Requests</strong></h1>

          <p className="text-xl md:text-2xl text-white/90 max-w-4xl mb-12 leading-relaxed text-pretty">
            Submit your prayer requests and join our community in lifting each other up in prayer and faith.
          </p>

          {/* Logo 2 in bottom right of hero */}
          <div className="absolute bottom-8 right-8">
            <img src="/logo (2).png" alt="Logo 2" className="w-24 h-24 object-contain opacity-80" />
          </div>
        </div>
      </div>

      {/* Prayer Request Form Section */}
      <section className="relative z-10 py-24 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl font-bold tracking-tight mb-6 text-balance text-gray-900">Submit Prayer Request</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto text-pretty">
              Our prayer team is committed to praying for your needs. All requests are kept confidential.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            <div className="lg:col-span-2">
              <div className="rounded-2xl bg-gray-50 ring-1 ring-gray-200 p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium mb-2 text-gray-700">
                        Name (Optional)
                      </label>
                      <input
                        type="text"
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Your name"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium mb-2 text-gray-700">
                        Email (Optional)
                      </label>
                      <input
                        type="email"
                        id="email"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="your.email@example.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="requestType" className="block text-sm font-medium mb-2 text-gray-700">
                      Prayer Category
                    </label>
                    <select
                      id="requestType"
                      value={formData.requestType}
                      onChange={(e) => setFormData({...formData, requestType: e.target.value})}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select a category</option>
                      <option value="health">Health & Healing</option>
                      <option value="academic">Academic Success</option>
                      <option value="family">Family & Relationships</option>
                      <option value="spiritual">Spiritual Growth</option>
                      <option value="financial">Financial Needs</option>
                      <option value="career">Career & Future</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium mb-2 text-gray-700">
                      Prayer Request
                    </label>
                    <textarea
                      id="message"
                      rows={6}
                      value={formData.message}
                      onChange={(e) => setFormData({...formData, message: e.target.value})}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                      placeholder="Please share your prayer request..."
                      required
                    />
                  </div>

                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="anonymous"
                      checked={formData.anonymous}
                      onChange={(e) => setFormData({...formData, anonymous: e.target.checked})}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label htmlFor="anonymous" className="text-sm text-gray-700">
                      Submit this request anonymously
                    </label>
                  </div>

                  <Button type="submit" className="w-full bg-gray-900 text-white hover:bg-gray-800 rounded-lg py-3 font-normal text-base">
                    <Send className="w-4 h-4 mr-2" />
                    Submit Prayer Request
                  </Button>
                </form>
              </div>
            </div>

            <div className="space-y-6">
              <div className="rounded-2xl bg-gray-50 ring-1 ring-gray-200 p-6">
                <h3 className="text-lg font-semibold mb-4 text-gray-900">Prayer Categories</h3>
                <div className="space-y-3">
                  {prayerCategories.map((category, index) => {
                    const IconComponent = category.icon
                    return (
                      <div key={index} className="flex items-center gap-3 text-gray-700">
                        <IconComponent className="w-5 h-5" />
                        <span className="text-sm">{category.name}</span>
                      </div>
                    )
                  })}
                </div>
              </div>

              <div className="rounded-2xl bg-gray-50 ring-1 ring-gray-200 p-6">
                <h3 className="text-lg font-semibold mb-4 text-gray-900">Prayer Promise</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  "Therefore I tell you, whatever you ask for in prayer, believe that you have received it, and it will be yours." - Mark 11:24
                </p>
              </div>

              <div className="rounded-2xl bg-gray-50 ring-1 ring-gray-200 p-6">
                <h3 className="text-lg font-semibold mb-4 text-gray-900">Confidentiality</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  All prayer requests are kept strictly confidential and shared only with our prayer team.
                </p>
              </div>
            </div>
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