"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import {
  ArrowRight,
  BookOpen,
  Calendar,
  ChevronDown,
  Heart,
  MapPin,
  ShoppingBag,
  Sparkles,
  Users,
  Shield,
  HandHeart,
  Mail,
  CheckCircle2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { SiteNav } from "@/components/layout/SiteNav"
import { HomeFooter } from "@/components/home/HomeFooter"
import { HeroSlider } from "@/components/home/HeroSlider"
import { ScrollToBottom } from "@/components/ui/scroll-to-bottom"
import { cn } from "@/lib/utils"
import { PcmShield } from "@/components/brand/PcmShield"
import { PosterCard } from "@/components/posters/PosterCard"
import { POSTERS } from "@/lib/posters"
import { BRAND } from "@/lib/brand"

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-block text-xs font-semibold uppercase tracking-[0.2em] text-[#0f2d6e] mb-3">
      {children}
    </span>
  )
}

const features = [
  {
    icon: BookOpen,
    title: "Biblical Teaching",
    description: "Weekly Scripture studies and discipleship led by experienced ministry leaders.",
    color: "from-blue-500/20 to-blue-600/5",
  },
  {
    icon: Users,
    title: "Welcoming Community",
    description: "A Christ-centered family for students from every background on campus.",
    color: "from-violet-500/20 to-violet-600/5",
  },
  {
    icon: HandHeart,
    title: "Free Programs",
    description: "Worship, Bible study, and fellowship — open to all students at no cost.",
    color: "from-emerald-500/20 to-emerald-600/5",
  },
  {
    icon: Heart,
    title: "Campus Outreach",
    description: "Share God's love through service, evangelism, and practical care.",
    color: "from-rose-500/20 to-rose-600/5",
  },
]

const journeySteps = [
  { step: "01", title: "Worship", text: "Weekly Sabbath worship and praise gatherings.", href: "/events" },
  { step: "02", title: "Study", text: "Deep dive into God's Word in small groups.", href: "/bands/bible-study-band" },
  { step: "03", title: "Fellowship", text: "Build lasting friendships with fellow believers.", href: "/programs" },
  { step: "04", title: "Serve", text: "Ministry bands and outreach on campus.", href: "/bands" },
]

const quickLinks = [
  { href: "/bands", label: "Bands", icon: Users },
  { href: "/events", label: "Events", icon: Calendar },
  { href: "/merch", label: "Merch Store", icon: ShoppingBag, accent: true },
  { href: "/news", label: "News", icon: Sparkles },
]

const stats = [
  { value: "5+", label: "Ministry bands" },
  { value: "Weekly", label: "Worship & study" },
  { value: "100%", label: "Open to students" },
]

const faqs = [
  {
    question: "What ministries does The Haven offer?",
    answer:
      "We offer Sabbath worship, Bible studies, prayer ministry, evangelism training, counseling, and specialized bands including Bible Study, Welfare, Health, Witnessing, and Publicity.",
  },
  {
    question: "How can I join the ministry?",
    answer:
      "Attend any weekly meeting, visit our Bands page to find a team that fits your gifts, or contact leadership through the form below.",
  },
  {
    question: "Do you offer spiritual counseling?",
    answer:
      "Yes. Our pastoral team provides confidential spiritual guidance and support for academic, personal, and faith-related concerns.",
  },
  {
    question: "How do I get baptized?",
    answer:
      "Speak with a ministry leader after worship or submit an inquiry. We'll walk with you through Bible study preparation and baptism planning.",
  },
]

export default function HomePage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0)
  const [contactSent, setContactSent] = useState(false)
  const [heroReady, setHeroReady] = useState(true)

  const [contactError, setContactError] = useState("")
  const [contactSending, setContactSending] = useState(false)

  const handleContact = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = new FormData(e.currentTarget)
    setContactSending(true)
    setContactError("")
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.get("name"),
          email: form.get("email"),
          message: form.get("message"),
        }),
      })
      const json = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(json.error || "Could not send your message")
      setContactSent(true)
    } catch (err) {
      setContactError(err instanceof Error ? err.message : "Could not send your message")
    } finally {
      setContactSending(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#fafbfc] text-[#0B0F12] antialiased">
      {/* ——— Hero ——— */}
      <header className="relative h-screen flex flex-col bg-[#0B0F12] text-white isolate overflow-hidden">
        <div className="absolute inset-0 -z-10 pointer-events-none overflow-hidden">
          <HeroSlider />
        </div>

        <div className="relative z-20 shrink-0">
          <SiteNav />
        </div>

        <div className="relative z-10 flex-1 flex flex-col justify-center max-w-7xl mx-auto w-full px-6 pb-20 pt-4 md:pt-6 pointer-events-auto">
          <div
            className={cn(
              "max-w-3xl transition-all duration-700 ease-out",
              heroReady ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            )}
          >
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.08] text-balance mb-6">
              Find your place at{" "}
              <span className="bg-gradient-to-r from-white via-white to-white/60 bg-clip-text text-transparent">
                The Haven
              </span>
            </h1>

            <p className="text-lg md:text-xl text-white/75 leading-relaxed max-w-2xl mb-10 text-pretty">
              A shelter on campus for worship, Bible study, real friendship,
              and service that carries Christ&apos;s light beyond the classroom.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 mb-14">
              <Button
                asChild
                size="lg"
                className="h-12 rounded-full bg-white text-[#0B0F12] hover:bg-white/90 font-semibold px-8 shadow-lg shadow-black/20"
              >
                <Link href="/support">
                  Join our ministry
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="h-12 rounded-full border-white/25 bg-white/5 text-white hover:bg-white/10 backdrop-blur px-8"
              >
                <Link href="/programs">Explore programs</Link>
              </Button>
            </div>

            <div className="flex flex-wrap gap-8 md:gap-12 pt-6 border-t border-white/10">
              {stats.map((stat) => (
                <div key={stat.label}>
                  <p className="text-2xl md:text-3xl font-bold tracking-tight">{stat.value}</p>
                  <p className="text-sm text-white/50 mt-0.5">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <ScrollToBottom targetId="features" />

        <div className="absolute bottom-6 right-6 md:bottom-8 md:right-8 z-10 pointer-events-none">
          <PcmShield className="h-16 md:h-24 drop-shadow-lg" />
        </div>
      </header>


      {/* ——— Features ——— */}
      <section id="features" className="py-20 md:py-28 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <SectionLabel>Why join us</SectionLabel>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-balance mb-4">
              Everything you need to grow in Christ on campus
            </h2>
            <p className="text-gray-600 leading-relaxed">
              Rooted in Scripture and the Adventist message — designed for university life.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-5">
            {features.map((feature) => {
              const Icon = feature.icon
              return (
                <div
                  key={feature.title}
                  className="group relative rounded-2xl bg-white p-6 md:p-8 ring-1 ring-gray-200/80 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
                >
                  <div
                    className={cn(
                      "inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br mb-5 text-[#0f2d6e]",
                      feature.color
                    )}
                  >
                    <Icon className="w-6 h-6" strokeWidth={1.75} />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ——— Faith journey ——— */}
      <section className="py-20 md:py-28 px-6 bg-white border-y border-gray-200/80">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <SectionLabel>Your path</SectionLabel>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-balance mb-4">
              Your faith journey in four steps
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            {journeySteps.map((item, i) => (
              <Link
                key={item.step}
                href={item.href}
                className="group relative rounded-2xl bg-[#fafbfc] p-6 md:p-8 ring-1 ring-gray-200/80 hover:bg-[#0f2d6e] hover:ring-[#0f2d6e] transition-colors duration-300 min-h-[200px] flex flex-col"
              >
                <span className="text-4xl font-bold text-gray-200 group-hover:text-white/20 transition-colors">
                  {item.step}
                </span>
                <h3 className="text-xl font-semibold mt-4 mb-2 group-hover:text-white transition-colors">
                  {item.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed flex-1 group-hover:text-white/75 transition-colors">
                  {item.text}
                </p>
                <span className="inline-flex items-center gap-1 text-sm font-medium text-[#0f2d6e] group-hover:text-white mt-4 transition-colors">
                  Learn more
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ——— Trust banner ——— */}
      <section className="px-6 py-16">
        <div className="max-w-4xl mx-auto rounded-3xl bg-gradient-to-br from-[#0f2d6e] to-[#1a3a7a] px-8 py-12 md:px-14 md:py-16 text-white overflow-hidden relative shadow-xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
          <div className="relative text-center">
            <div className="flex items-center justify-center gap-2 text-sky-200 text-sm font-medium mb-3">
              <Shield className="w-4 h-4" />
              Rooted in faith & Scripture
            </div>
            <h2 className="text-2xl md:text-3xl font-bold mb-3">Ready to take the next step?</h2>
            <p className="text-white/80 leading-relaxed mb-8 max-w-lg mx-auto">
              Whether you&apos;re new to faith or deepening your walk with God, there&apos;s a place
              for you in our ministry family.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button asChild size="lg" className="rounded-full bg-white text-[#0f2d6e] hover:bg-white/90 font-semibold shadow-lg">
                <Link href="/login">Join Our Ministry</Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="rounded-full border-2 border-white/40 text-white hover:bg-white/15 hover:border-white/60 font-semibold"
              >
                <Link href="/bands">Explore Bands</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ——— What's on (posters) ——— */}
      <section className="py-20 md:py-28 px-6 bg-[#0B0F12] text-white">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
            <div className="max-w-xl">
              <span className="inline-block text-xs font-semibold uppercase tracking-[0.2em] text-[#d9a441] mb-3">
                What&apos;s on
              </span>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-balance">
                Every week at The Haven
              </h2>
            </div>
            <Button
              asChild
              variant="outline"
              className="self-start md:self-auto rounded-full border-white/25 bg-white/5 text-white hover:bg-white/10"
            >
              <Link href="/posters">
                All posters
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {POSTERS.slice(0, 3).map((poster) => (
              <Link key={poster.slug} href="/posters" className="block group">
                <PosterCard poster={poster} className="transition-transform duration-300 group-hover:-translate-y-1" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ——— FAQ ——— */}
      <section className="py-20 md:py-28 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <SectionLabel>FAQ</SectionLabel>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-balance mb-4">
              Common questions
            </h2>
            <p className="text-gray-600 leading-relaxed">
              Everything you need to know about The Haven.
            </p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className={cn(
                  "rounded-2xl bg-white ring-1 transition-all duration-200 overflow-hidden",
                  openFaq === index ? "ring-[#0f2d6e]/30 shadow-md" : "ring-gray-200/80"
                )}
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full px-6 py-5 text-left flex items-start justify-between gap-4 hover:bg-gray-50/80 transition-colors"
                >
                  <span className="font-semibold text-[15px] leading-snug pr-2">{faq.question}</span>
                  <ChevronDown
                    className={cn(
                      "w-5 h-5 shrink-0 text-gray-400 transition-transform duration-200 mt-0.5",
                      openFaq === index && "rotate-180 text-[#0f2d6e]"
                    )}
                  />
                </button>
                <div
                  className={cn(
                    "grid transition-all duration-200 ease-out",
                    openFaq === index ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                  )}
                >
                  <div className="overflow-hidden">
                    <p className="px-6 pb-5 text-gray-600 text-sm leading-relaxed">{faq.answer}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ——— Contact ——— */}
      <section className="py-20 md:py-28 px-6 bg-white border-t border-gray-200/80">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <SectionLabel>Contact</SectionLabel>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-balance mb-4">
              Connect with us
            </h2>
            <p className="text-gray-600 leading-relaxed">
              Have questions about our ministry? Reach out — we&apos;re here to support your
              spiritual journey.
            </p>
          </div>

          <div className="rounded-2xl bg-[#fafbfc] ring-1 ring-gray-200/80 p-6 md:p-8 mb-8 flex items-center gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#0f2d6e]/10">
              <PcmShield className="h-11" />
            </div>
            <div>
              <h4 className="font-semibold">Ministry Leadership Team</h4>
              <p className="text-xs font-medium text-[#0f2d6e]">{BRAND.ministryShort}</p>
              <p className="text-sm text-gray-600 mb-2">Pastoral care & guidance</p>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <MapPin className="w-4 h-4 shrink-0" />
                {BRAND.location}
              </div>
            </div>
          </div>

          <div className="rounded-2xl bg-white ring-1 ring-gray-200/80 shadow-xl shadow-gray-200/50 p-6 md:p-8">
            {contactSent ? (
              <div className="py-12 text-center">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Message received</h3>
                <p className="text-gray-600 text-sm">
                  Thank you! Our team will get back to you soon.
                </p>
              </div>
            ) : (
              <>
                <h3 className="text-xl font-semibold mb-6 text-center">Send an inquiry</h3>
                <form onSubmit={handleContact} className="space-y-5">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1.5">
                      Name
                    </label>
                    <input
                      id="name"
                      name="name"
                      required
                      className="w-full h-11 px-4 rounded-xl border border-gray-200 bg-[#fafbfc] text-sm focus:outline-none focus:ring-2 focus:ring-[#0f2d6e]/20 focus:border-[#0f2d6e]"
                      placeholder="Your full name"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">
                      Email
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      className="w-full h-11 px-4 rounded-xl border border-gray-200 bg-[#fafbfc] text-sm focus:outline-none focus:ring-2 focus:ring-[#0f2d6e]/20 focus:border-[#0f2d6e]"
                      placeholder="your@email.com"
                    />
                  </div>
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1.5">
                      Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      required
                      rows={4}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-[#fafbfc] text-sm focus:outline-none focus:ring-2 focus:ring-[#0f2d6e]/20 focus:border-[#0f2d6e] resize-none"
                      placeholder="How can we help you?"
                    />
                  </div>
                  {contactError && (
                    <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700 ring-1 ring-red-200">
                      {contactError}
                    </p>
                  )}
                  <Button
                    type="submit"
                    disabled={contactSending}
                    className="w-full bg-[#0f2d6e] text-white hover:bg-[#0f2d6e]/90 rounded-xl py-3 font-semibold shadow-md"
                  >
                    <Mail className="w-4 h-4 mr-2" />
                    {contactSending ? "Sending..." : "Send message"}
                  </Button>
                </form>
              </>
            )}
          </div>
        </div>
      </section>

      <HomeFooter />
    </div>
  )
}
