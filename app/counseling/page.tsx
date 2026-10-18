"use client"

import Image from "next/image"
import {
  Heart,
  Shield,
  Phone,
  Mail,
  User,
  Calendar,
  Send,
} from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/components/auth/AuthProvider"
import {
  friendlyError,
  submitCounselingRequest,
  type CounselingService,
} from "@/lib/data/forms"
import { MinistryPageShell } from "@/components/layout/MinistryPageShell"
import { MinistryContent } from "@/components/layout/MinistryContent"
import { ScrollToBottom } from "@/components/ui/scroll-to-bottom"

const inputClass =
  "w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#0f2d6e] focus:border-transparent"

const SERVICE_OPTIONS: { value: CounselingService; label: string }[] = [
  { value: "personal", label: "Personal Counseling" },
  { value: "relationship", label: "Relationship Counseling" },
  { value: "academic", label: "Academic Stress Support" },
  { value: "crisis", label: "Crisis Intervention" },
]

export default function CounselingPage() {
  const { user, profile } = useAuth()
  const formRef = useRef<HTMLElement>(null)
  const emptyForm = {
    name: "",
    email: "",
    phone: "",
    service_type: "" as CounselingService | "",
    preferred_counselor: "",
    message: "",
  }
  const [form, setForm] = useState(emptyForm)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState("")

  // Prefill contact details for signed-in members
  useEffect(() => {
    if (!profile) return
    setForm((f) => ({
      ...f,
      name: f.name || profile.name || "",
      email: f.email || profile.email || "",
      phone: f.phone || profile.phone || "",
    }))
  }, [profile])

  const openForm = (preset: Partial<typeof emptyForm> = {}) => {
    setForm((f) => ({ ...f, ...preset }))
    setSubmitted(false)
    setError("")
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.service_type) {
      setError("Please choose the kind of support you need.")
      return
    }
    setSubmitting(true)
    setError("")
    setSubmitted(false)
    try {
      await submitCounselingRequest({
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim() || null,
        service_type: form.service_type,
        preferred_counselor: form.preferred_counselor || null,
        message: form.message.trim(),
        user_id: user?.id ?? null,
      })
      setSubmitted(true)
      setForm({
        ...emptyForm,
        name: profile?.name ?? "",
        email: profile?.email ?? "",
        phone: profile?.phone ?? "",
      })
    } catch (err: unknown) {
      setError(friendlyError(err))
    } finally {
      setSubmitting(false)
    }
  }

  const counselingServices = [
    {
      title: "Personal Counseling",
      type: "personal" as CounselingService,
      icon: User,
      description:
        "One-on-one sessions addressing personal struggles, anxiety, depression, and life transitions.",
      duration: "50 minutes",
      availability: "Mon-Fri, 9 AM - 5 PM",
      approach: "Biblical counseling with professional care",
    },
    {
      title: "Relationship Counseling",
      type: "relationship" as CounselingService,
      icon: Heart,
      description:
        "Guidance for dating relationships, friendships, and family conflicts from a Christian perspective.",
      duration: "60 minutes",
      availability: "Tue, Thu, Sat",
      approach: "Scripture-based relationship principles",
    },
    {
      title: "Academic Stress Support",
      type: "academic" as CounselingService,
      icon: Shield,
      description:
        "Help managing academic pressure, study habits, and balancing faith with educational goals.",
      duration: "45 minutes",
      availability: "Mon-Wed-Fri",
      approach: "Practical strategies with spiritual foundation",
    },
    {
      title: "Crisis Intervention",
      type: "crisis" as CounselingService,
      icon: Phone,
      description:
        "Immediate support for students facing crisis situations or emergency mental health needs.",
      duration: "As needed",
      availability: "24/7 Emergency Line",
      approach: "Immediate care with follow-up support",
    },
  ]

  const counselors = [
    {
      name: "Dr. Sarah Johnson",
      title: "Licensed Professional Counselor",
      specialties: ["Anxiety & Depression", "Trauma Recovery", "Faith Integration"],
      experience: "12 years",
      education: "PhD in Clinical Psychology, MA in Biblical Counseling",
    },
    {
      name: "Pastor Michael Rodriguez",
      title: "Pastoral Counselor",
      specialties: ["Spiritual Direction", "Life Purpose", "Relationship Issues"],
      experience: "8 years",
      education: "MDiv, Certified Biblical Counselor",
    },
    {
      name: "Dr. Emily Chen",
      title: "Marriage & Family Therapist",
      specialties: ["Family Dynamics", "Dating Relationships", "Communication"],
      experience: "10 years",
      education: "PhD in Marriage & Family Therapy, MA in Counseling",
    },
  ]

  const supportGroups = [
    {
      name: "Anxiety & Depression Support",
      schedule: "Wednesdays 7:00 PM",
      description: "Peer support group for students dealing with anxiety and depression.",
      facilitator: "Dr. Sarah Johnson",
      type: "personal" as CounselingService,
    },
    {
      name: "Grief & Loss Support",
      schedule: "Thursdays 6:30 PM",
      description: "Support for students processing loss of loved ones or significant life changes.",
      facilitator: "Pastor Michael Rodriguez",
      type: "personal" as CounselingService,
    },
    {
      name: "Addiction Recovery",
      schedule: "Fridays 7:00 PM",
      description: "Christ-centered recovery support for various addictions and dependencies.",
      facilitator: "Dr. Emily Chen",
      type: "personal" as CounselingService,
    },
    {
      name: "Academic Stress Management",
      schedule: "Tuesdays 5:00 PM",
      description: "Strategies for managing academic pressure and maintaining mental health.",
      facilitator: "Dr. Sarah Johnson",
      type: "academic" as CounselingService,
    },
  ]

  return (
    <MinistryPageShell
      heroImage="/Slider/KCM_0681.jpg"
      title="Counseling Services"
      subtitle="Professional counseling and spiritual guidance for students seeking support, healing, and personal growth in a safe, confidential environment."
    >
      <ScrollToBottom targetId="counseling-content" label="Scroll" />
      <MinistryContent>
        <div className="max-w-4xl mx-auto mb-12 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-50 ring-1 ring-red-200 text-red-800 text-sm font-medium">
            <Phone className="w-4 h-4" />
            In immediate danger? Contact campus security or local emergency services right away.
          </div>
        </div>

        <section id="counseling-content" className="max-w-4xl mx-auto py-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-[#0B0F12]">Our Services</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Comprehensive counseling services addressing the whole person — mind, body, and spirit.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {counselingServices.map((service, index) => {
              const Icon = service.icon
              return (
                <div key={index} className="rounded-2xl bg-white ring-1 ring-gray-200 p-8 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-start gap-4 mb-6">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-[#0f2d6e]/10 flex-shrink-0">
                      <Icon className="w-6 h-6 text-[#0f2d6e]" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold mb-2 text-[#0B0F12]">{service.title}</h3>
                      <p className="text-gray-600 leading-relaxed">{service.description}</p>
                    </div>
                  </div>
                  <dl className="space-y-2 mb-6 text-sm">
                    <div className="flex justify-between gap-4">
                      <dt className="text-gray-500">Session Length</dt>
                      <dd className="text-gray-800">{service.duration}</dd>
                    </div>
                    <div className="flex justify-between gap-4">
                      <dt className="text-gray-500">Availability</dt>
                      <dd className="text-gray-800">{service.availability}</dd>
                    </div>
                    <div className="flex justify-between gap-4">
                      <dt className="text-gray-500">Approach</dt>
                      <dd className="text-gray-800 text-right">{service.approach}</dd>
                    </div>
                  </dl>
                  <Button
                    type="button"
                    onClick={() => openForm({ service_type: service.type })}
                    className="w-full bg-[#0f2d6e] text-white hover:bg-[#0f2d6e]/90 rounded-full"
                  >
                    Schedule Appointment
                  </Button>
                </div>
              )
            })}
          </div>
        </section>

        <section className="max-w-4xl mx-auto py-12 border-t border-gray-200">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-[#0B0F12]">Our Counselors</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Licensed professionals committed to integrating faith and mental health care.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {counselors.map((counselor, index) => (
              <div key={index} className="rounded-2xl bg-white ring-1 ring-gray-200 p-8 text-center shadow-sm hover:shadow-md transition-shadow">
                <div className="relative h-24 w-24 rounded-full overflow-hidden bg-[#0f2d6e]/10 mx-auto mb-4 ring-2 ring-gray-200">
                  <Image src="/placeholder-user.svg" alt="" fill className="object-cover" />
                </div>
                <h3 className="text-xl font-semibold text-[#0B0F12]">{counselor.name}</h3>
                <p className="text-gray-500 text-sm mb-4">{counselor.title}</p>
                <div className="flex flex-wrap gap-2 justify-center mb-4">
                  {counselor.specialties.map((s) => (
                    <span
                      key={s}
                      className="px-3 py-1 bg-[#0f2d6e]/10 text-[#0f2d6e] rounded-full text-xs"
                    >
                      {s}
                    </span>
                  ))}
                </div>
                <p className="text-sm text-gray-600 mb-4">{counselor.education}</p>
                <Button
                  type="button"
                  onClick={() => openForm({ preferred_counselor: counselor.name })}
                  className="w-full bg-[#0f2d6e] text-white hover:bg-[#0f2d6e]/90 rounded-full"
                >
                  Book with {counselor.name.split(" ")[1]}
                </Button>
              </div>
            ))}
          </div>
        </section>

        <section className="max-w-4xl mx-auto py-12 border-t border-gray-200">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-[#0B0F12]">Support Groups</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Connect with others facing similar challenges in a supportive, faith-based environment.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {supportGroups.map((group, index) => (
              <div key={index} className="rounded-2xl bg-white ring-1 ring-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
                <h3 className="text-lg font-semibold mb-2 text-[#0B0F12]">{group.name}</h3>
                <p className="text-gray-600 text-sm mb-4">{group.description}</p>
                <dl className="space-y-2 mb-4 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-gray-500">Schedule</dt>
                    <dd className="text-gray-800">{group.schedule}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-gray-500">Facilitator</dt>
                    <dd className="text-gray-800">{group.facilitator}</dd>
                  </div>
                </dl>
                <Button
                  type="button"
                  onClick={() =>
                    openForm({
                      service_type: group.type,
                      preferred_counselor: group.facilitator,
                      message: `I'd like to join the ${group.name} group (${group.schedule}).`,
                    })
                  }
                  className="w-full bg-[#0f2d6e] text-white hover:bg-[#0f2d6e]/90 rounded-full"
                >
                  Join Group
                </Button>
              </div>
            ))}
          </div>
        </section>

        <section
          ref={formRef}
          id="request-form"
          className="max-w-4xl mx-auto py-12 border-t border-gray-200 scroll-mt-24"
        >
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-[#0B0F12]">Request a Session</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Tell us a little about what you need. A counselor will contact you to arrange a time.
              Your request is seen only by our counseling team.
            </p>
          </div>
          <div className="rounded-2xl bg-gray-50 ring-1 ring-gray-200 p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="c-name" className="block text-sm font-medium mb-2 text-gray-700">Name</label>
                  <input
                    id="c-name"
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className={inputClass}
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label htmlFor="c-email" className="block text-sm font-medium mb-2 text-gray-700">Email</label>
                  <input
                    id="c-email"
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className={inputClass}
                    placeholder="your.email@example.com"
                  />
                </div>
                <div>
                  <label htmlFor="c-phone" className="block text-sm font-medium mb-2 text-gray-700">Phone (Optional)</label>
                  <input
                    id="c-phone"
                    type="tel"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className={inputClass}
                    placeholder="+260 ..."
                  />
                </div>
                <div>
                  <label htmlFor="c-service" className="block text-sm font-medium mb-2 text-gray-700">Type of Support</label>
                  <select
                    id="c-service"
                    required
                    value={form.service_type}
                    onChange={(e) => setForm({ ...form, service_type: e.target.value as CounselingService | "" })}
                    className={inputClass}
                  >
                    <option value="">Select a service</option>
                    {SERVICE_OPTIONS.map((o) => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label htmlFor="c-counselor" className="block text-sm font-medium mb-2 text-gray-700">
                  Preferred Counselor (Optional)
                </label>
                <select
                  id="c-counselor"
                  value={form.preferred_counselor}
                  onChange={(e) => setForm({ ...form, preferred_counselor: e.target.value })}
                  className={inputClass}
                >
                  <option value="">No preference</option>
                  {counselors.map((c) => (
                    <option key={c.name} value={c.name}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="c-message" className="block text-sm font-medium mb-2 text-gray-700">How can we help?</label>
                <textarea
                  id="c-message"
                  rows={5}
                  required
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className={`${inputClass} resize-none`}
                  placeholder="Share as much or as little as you're comfortable with..."
                />
              </div>
              {form.service_type === "crisis" && (
                <p className="rounded-lg bg-red-50 ring-1 ring-red-200 px-4 py-3 text-red-800 text-sm">
                  If you are in immediate danger, please call the crisis line now rather than waiting for a reply.
                </p>
              )}
              {submitted && (
                <p role="status" className="rounded-lg bg-green-50 ring-1 ring-green-200 px-4 py-3 text-green-800 text-sm text-center">
                  Thank you. Your request has been received — our counseling team will be in touch soon.
                </p>
              )}
              {error && (
                <p role="alert" className="rounded-lg bg-red-50 ring-1 ring-red-200 px-4 py-3 text-red-700 text-sm text-center">
                  {error}
                </p>
              )}
              <Button
                type="submit"
                disabled={submitting}
                className="w-full bg-[#0f2d6e] text-white hover:bg-[#0f2d6e]/90 rounded-lg py-3 font-normal text-base"
              >
                <Send className="w-4 h-4 mr-2" />
                {submitting ? "Sending..." : "Send Request"}
              </Button>
            </form>
          </div>
        </section>

        <section className="max-w-4xl mx-auto py-12 border-t border-gray-200">
          <div className="rounded-3xl bg-gradient-to-br from-[#0f2d6e] to-[#1a3a7a] p-10 md:p-12 text-white text-center shadow-xl">
            <Shield className="w-12 h-12 mx-auto mb-6 opacity-90" />
            <h2 className="text-2xl md:text-3xl font-bold mb-6">Confidential, faith-integrated care</h2>
            <p className="text-white/85 leading-relaxed max-w-2xl mx-auto">
              All sessions are confidential. We integrate biblical principles with evidence-based
              therapeutic approaches for mind, body, and spirit.
            </p>
          </div>
        </section>

        <section className="max-w-4xl mx-auto py-12 border-t border-gray-200">
          <div className="rounded-2xl bg-white ring-1 ring-gray-200 p-10 md:p-12 text-center shadow-sm">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-[#0B0F12]">Get Help Today</h2>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              Taking the first step toward healing and growth is courageous. We&apos;re here to support you.
            </p>
            <div className="grid grid-cols-1 max-w-xs mx-auto gap-4 mb-8">
              {[
                { icon: Mail, label: "Email", value: "counseling@cbusda.org" },
              ].map((item) => (
                <div key={item.label} className="p-4 rounded-xl bg-[#fafbfc] ring-1 ring-gray-200">
                  <item.icon className="w-7 h-7 text-[#0f2d6e] mx-auto mb-2" />
                  <p className="font-medium text-[#0B0F12]">{item.label}</p>
                  <p className="text-sm text-gray-600">{item.value}</p>
                </div>
              ))}
            </div>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                size="lg"
                type="button"
                onClick={() => openForm()}
                className="bg-[#0f2d6e] text-white hover:bg-[#0f2d6e]/90 rounded-full px-8 font-semibold"
              >
                <Calendar className="w-4 h-4 mr-2" />
                Schedule Appointment
              </Button>
              <Button
                size="lg"
                type="button"
                variant="outline"
                onClick={() =>
                  document.getElementById("counseling-content")?.scrollIntoView({ behavior: "smooth" })
                }
                className="rounded-full px-8 border-gray-300"
              >
                Learn More
              </Button>
            </div>
          </div>
        </section>
      </MinistryContent>
    </MinistryPageShell>
  )
}
