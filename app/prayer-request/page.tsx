"use client"

import { Heart, Send, Shield, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import { useAuth } from "@/components/auth/AuthProvider"
import { friendlyError, submitPrayerRequest, type PrayerCategory } from "@/lib/data/forms"
import { MinistryPageShell } from "@/components/layout/MinistryPageShell"
import { MinistryContent } from "@/components/layout/MinistryContent"

export default function PrayerRequestPage() {
  const { user, profile } = useAuth()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    requestType: '',
    message: '',
    anonymous: false
  })

  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  // Prefill contact details for signed-in members
  useEffect(() => {
    if (!profile) return
    setFormData((f) => ({
      ...f,
      name: f.name || profile.name || '',
      email: f.email || profile.email || '',
    }))
  }, [profile])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')
    setSubmitted(false)
    try {
      const categoryMap: Record<string, PrayerCategory> = {
        health: 'health',
        academic: 'academic',
        family: 'family',
        spiritual: 'ministry',
        financial: 'personal',
        career: 'academic',
        other: 'personal',
      }
      await submitPrayerRequest({
        request: formData.message.trim(),
        category: categoryMap[formData.requestType] ?? 'personal',
        is_anonymous: formData.anonymous,
        requester_name: formData.name.trim() || null,
        requester_email: formData.email.trim() || null,
        user_id: user?.id ?? null,
      })
      setSubmitted(true)
      setFormData({
        name: profile?.name ?? '',
        email: profile?.email ?? '',
        requestType: '',
        message: '',
        anonymous: false,
      })
    } catch (err: unknown) {
      setError(friendlyError(err))
    } finally {
      setSubmitting(false)
    }
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
    <MinistryPageShell
      heroImage="/Features/KCM_0729.jpg"
      eyebrow="We pray with you"
      title="Prayer requests"
      subtitle="Submit your prayer requests and join our community in lifting each other up in prayer and faith."
    >
      <MinistryContent>
      <section id="prayer-content" className="py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4 text-balance text-ink">Submit Prayer Request</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
              Our prayer team is committed to praying for your needs. All requests are kept confidential.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            <div className="lg:col-span-2">
              <div className="rounded-2xl bg-white border border-border shadow-[0_4px_12px_rgba(11,15,18,0.04)] p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium mb-2 text-ink/80">
                        Name (Optional)
                      </label>
                      <input
                        type="text"
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        disabled={formData.anonymous}
                        className="w-full px-4 py-3 rounded-lg border border-border focus:ring-2 focus:ring-navy focus:border-transparent disabled:bg-muted disabled:text-[#8a93a3]"
                        placeholder="Your name"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium mb-2 text-ink/80">
                        Email (Optional)
                      </label>
                      <input
                        type="email"
                        id="email"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        disabled={formData.anonymous}
                        className="w-full px-4 py-3 rounded-lg border border-border focus:ring-2 focus:ring-navy focus:border-transparent disabled:bg-muted disabled:text-[#8a93a3]"
                        placeholder="your.email@example.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="requestType" className="block text-sm font-medium mb-2 text-ink/80">
                      Prayer Category
                    </label>
                    <select
                      id="requestType"
                      value={formData.requestType}
                      onChange={(e) => setFormData({...formData, requestType: e.target.value})}
                      required
                      className="w-full px-4 py-3 rounded-lg border border-border focus:ring-2 focus:ring-navy focus:border-transparent"
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
                    <label htmlFor="message" className="block text-sm font-medium mb-2 text-ink/80">
                      Prayer Request
                    </label>
                    <textarea
                      id="message"
                      rows={6}
                      value={formData.message}
                      onChange={(e) => setFormData({...formData, message: e.target.value})}
                      className="w-full px-4 py-3 rounded-lg border border-border focus:ring-2 focus:ring-navy focus:border-transparent resize-none"
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
                      className="w-4 h-4 text-navy border-border rounded focus:ring-navy"
                    />
                    <label htmlFor="anonymous" className="text-sm text-ink/80">
                      Submit this request anonymously (your name, email and account are not attached)
                    </label>
                  </div>

                  {submitted && (
                    <p role="status" className="rounded-lg bg-green-50 ring-1 ring-green-200 px-4 py-3 text-green-800 text-sm text-center">
                      Thank you. Your prayer request has been sent to our prayer team.
                    </p>
                  )}
                  {error && (
                    <p role="alert" className="rounded-lg bg-red-50 ring-1 ring-red-200 px-4 py-3 text-red-700 text-sm text-center">
                      {error}
                    </p>
                  )}
                  <Button type="submit" disabled={submitting} className="w-full bg-navy text-white hover:bg-navy/90 rounded-lg py-3 font-normal text-base">
                    <Send className="w-4 h-4 mr-2" />
                    {submitting ? 'Submitting...' : 'Submit Prayer Request'}
                  </Button>
                </form>
              </div>
            </div>

            <div className="space-y-6">
              <div className="rounded-2xl bg-white border border-border shadow-[0_4px_12px_rgba(11,15,18,0.04)] p-6">
                <h3 className="text-lg font-semibold mb-4 text-ink">Prayer Categories</h3>
                <div className="space-y-3">
                  {prayerCategories.map((category, index) => {
                    const IconComponent = category.icon
                    return (
                      <div key={index} className="flex items-center gap-3 text-ink/80">
                        <IconComponent className="w-5 h-5 text-navy" />
                        <span className="text-sm">{category.name}</span>
                      </div>
                    )
                  })}
                </div>
              </div>

              <div className="rounded-2xl bg-white border border-border shadow-[0_4px_12px_rgba(11,15,18,0.04)] p-6">
                <h3 className="text-lg font-semibold mb-4 text-ink">Prayer Promise</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  "Therefore I tell you, whatever you ask for in prayer, believe that you have received it, and it will be yours." - Mark 11:24
                </p>
              </div>

              <div className="rounded-2xl bg-white border border-border shadow-[0_4px_12px_rgba(11,15,18,0.04)] p-6">
                <h3 className="text-lg font-semibold mb-4 text-ink">Confidentiality</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  All prayer requests are kept strictly confidential and shared only with our prayer team.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      </MinistryContent>
    </MinistryPageShell>
  )
}