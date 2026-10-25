"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import {
  ArrowRight,
  BookOpen,
  CalendarDays,
  ChevronDown,
  Gift,
  HandHeart,
  Heart,
  Image as ImageIcon,
  Mail,
  MapPin,
  MessagesSquare,
  Newspaper,
  Sun,
  Users,
  type LucideIcon,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { SiteNav } from "@/components/layout/SiteNav"
import { HomeFooter } from "@/components/home/HomeFooter"
import { HeroSlider } from "@/components/home/HeroSlider"
import { PcmShield } from "@/components/brand/PcmShield"
import { Card, IconTile, Notice, SectionHeader, cardClass, cardHoverClass, fieldClass, labelClass } from "@/components/ui/haven"
import { useAuth } from "@/components/auth/AuthProvider"
import { POSTERS } from "@/lib/posters"
import { BRAND } from "@/lib/brand"
import { getPosts, getUpcomingEvents, formatDate, formatTime } from "@/lib/data/content"
import type { Event, Post } from "@/lib/supabase"
import { ministryImage } from "@/lib/site-images"
import { cn } from "@/lib/utils"

const quickLinks: { icon: LucideIcon; label: string; href: string }[] = [
  { icon: Heart, label: "Prayer", href: "/prayer-request" },
  { icon: MessagesSquare, label: "Counseling", href: "/counseling" },
  { icon: Newspaper, label: "News", href: "/news" },
  { icon: ImageIcon, label: "Gallery", href: "/gallery" },
  { icon: BookOpen, label: "Resources", href: "/resources" },
  { icon: HandHeart, label: "Get involved", href: "/support" },
]

const features: { icon: LucideIcon; title: string; body: string }[] = [
  { icon: BookOpen, title: "Biblical teaching", body: "Weekly Scripture study and discipleship led by experienced leaders." },
  { icon: Users, title: "A welcoming family", body: "A Christ-centred home for students from every background on campus." },
  { icon: Gift, title: "Always free", body: "Worship, Bible study and fellowship — open to every student." },
  { icon: Sun, title: "Campus outreach", body: "Carry God's love through service, evangelism and practical care." },
]

const journey = [
  { step: "01", title: "Worship", body: "Sabbath worship and praise together.", href: "/events" },
  { step: "02", title: "Study", body: "Go deeper in God's Word in small groups.", href: "/bands/bible-study-band" },
  { step: "03", title: "Belong", body: "Build friendships that last beyond campus.", href: "/programs" },
  { step: "04", title: "Serve", body: "Find your place in a ministry band.", href: "/bands" },
]

const stats = [
  { value: "5", label: "Ministry bands" },
  { value: "Weekly", label: "Worship & study" },
  { value: "Free", label: "For every student" },
]

const faqs = [
  {
    q: "What does The Haven offer?",
    a: "Sabbath worship, Bible studies, prayer ministry, evangelism training, counseling, and five ministry bands: Bible Study, Welfare, Health, Witnessing and Publicity.",
  },
  {
    q: "How do I join?",
    a: "Come to any weekly gathering, or open a band on the Bands page and choose “Join this band”. Your account works in The Haven app too.",
  },
  {
    q: "Is counseling confidential?",
    a: "Yes. Our pastoral team offers confidential spiritual guidance for academic, personal and faith concerns.",
  },
  {
    q: "How do I get baptised?",
    a: "Talk to a leader after worship or send us a message — we'll walk with you through Bible study and preparation.",
  },
]

function EventDate({ iso }: { iso: string }) {
  const d = new Date(iso)
  return (
    <div className="flex h-16 w-16 shrink-0 flex-col items-center justify-center rounded-2xl bg-navy text-white">
      <span className="eyebrow !text-[10px] text-gold">{d.toLocaleDateString("en-GB", { month: "short" })}</span>
      <span className="font-serif text-2xl leading-none mt-0.5">{d.getDate()}</span>
    </div>
  )
}

export default function HomePage() {
  const { profile } = useAuth()
  const [openFaq, setOpenFaq] = useState<number | null>(0)
  const [events, setEvents] = useState<Event[] | null | undefined>(undefined)
  const [posts, setPosts] = useState<Post[] | null>(null)

  const [contactSent, setContactSent] = useState(false)
  const [contactError, setContactError] = useState("")
  const [contactSending, setContactSending] = useState(false)

  useEffect(() => {
    let active = true
    getUpcomingEvents().then((rows) => active && setEvents(rows))
    getPosts().then((rows) => active && setPosts(rows))
    return () => {
      active = false
    }
  }, [])

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
    <div className="min-h-screen bg-canvas text-ink">
      {/* ——— Hero ——— */}
      <header className="relative isolate flex min-h-[640px] h-[92svh] flex-col overflow-hidden bg-navy-deep text-white">
        <div className="absolute inset-0 -z-10">
          <HeroSlider />
        </div>

        <SiteNav />

        <div className="flex-1 flex flex-col justify-end max-w-6xl mx-auto w-full px-5 sm:px-6 pb-24 md:pb-32">
          <div className="max-w-3xl animate-in fade-in slide-in-from-bottom-3 duration-700">
            <p className="eyebrow text-gold mb-4">
              {profile ? `Welcome back, ${profile.name.split(" ")[0]}` : BRAND.tagline}
            </p>
            <h1 className="text-[2.75rem] leading-[1.05] sm:text-6xl md:text-7xl text-balance">
              Find your place at <span className="italic font-normal text-gold">The Haven</span>
            </h1>
            <p className="mt-6 text-base md:text-xl text-white/80 leading-relaxed max-w-2xl text-pretty">
              A shelter on campus for worship, Bible study, real friendship and service that carries Christ&apos;s
              light beyond the classroom.
            </p>

            <div className="mt-9 flex flex-col sm:flex-row gap-3">
              <Button asChild size="lg" variant="gold">
                <Link href="/bands">
                  Join a band <ArrowRight />
                </Link>
              </Button>
              <Button asChild size="lg" variant="light">
                <Link href="/events">This week</Link>
              </Button>
            </div>

            <dl className="mt-10 pt-6 border-t border-white/20 grid grid-cols-3 gap-6 max-w-lg">
              {stats.map((s) => (
                <div key={s.label}>
                  <dt className="sr-only">{s.label}</dt>
                  <dd className="text-xl md:text-2xl font-extrabold tracking-tight">{s.value}</dd>
                  <dd className="text-xs md:text-sm text-white/60 mt-0.5">{s.label}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>

        <PcmShield className="hidden md:block absolute bottom-28 right-8 lg:right-12 h-24 drop-shadow-2xl" />
      </header>

      {/* ——— Quick links (overlaps hero, like the app) ——— */}
      <nav aria-label="Quick links" className="relative z-10 -mt-12 px-5 sm:px-6">
        <div className={cn(cardClass, "max-w-4xl mx-auto grid grid-cols-3 md:grid-cols-6 py-3 rounded-3xl shadow-[0_20px_50px_rgba(10,31,77,0.12)]")}>
          {quickLinks.map((q) => (
            <Link
              key={q.href}
              href={q.href}
              className="group flex flex-col items-center gap-2 rounded-2xl py-4 transition-colors hover:bg-canvas"
            >
              <IconTile icon={q.icon} className="transition-transform group-hover:-translate-y-0.5" />
              <span className="text-[13px] font-semibold text-ink">{q.label}</span>
            </Link>
          ))}
        </div>
      </nav>

      {/* ——— Upcoming events (live) ——— */}
      <section className="py-20 md:py-24 px-5 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <SectionHeader
            eyebrow="Coming up"
            title="Upcoming events"
            description="RSVP on the website or in the app — your seat is saved in both."
            action={{ label: "All events", href: "/events" }}
          />

          {events === undefined ? (
            <div className="grid gap-4 md:grid-cols-3">
              {[0, 1, 2].map((i) => (
                <div key={i} className={cn(cardClass, "h-[132px] animate-pulse bg-white/60")} />
              ))}
            </div>
          ) : events && events.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-3">
              {events.slice(0, 3).map((e) => (
                <Link key={e.id} href="/events" className={cn(cardClass, cardHoverClass, "flex gap-4 p-5")}>
                  <EventDate iso={e.date} />
                  <div className="min-w-0">
                    <p className="text-[13px] font-bold text-navy">
                      {new Date(e.date).toLocaleDateString("en-GB", { weekday: "long" })} · {formatTime(e.date)}
                    </p>
                    <h3 className="mt-1 font-bold text-ink leading-snug line-clamp-2">{e.title}</h3>
                    <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground truncate">
                      <MapPin className="h-3.5 w-3.5 shrink-0" /> {e.location}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <Card className="flex items-center gap-4">
              <IconTile icon={CalendarDays} />
              <p className="text-muted-foreground">
                New events are posted every week. Check back soon, or join a band to hear first.
              </p>
            </Card>
          )}
        </div>
      </section>

      {/* ——— Latest news (live, managed by the Publicity Committee) ——— */}
      {posts && posts.length > 0 && (
        <section className="pb-20 md:pb-24 px-5 sm:px-6">
          <div className="max-w-6xl mx-auto">
            <SectionHeader eyebrow="Stories" title="Latest news" action={{ label: "All news", href: "/news" }} />
            <div className="grid gap-5 md:grid-cols-3">
              {posts.slice(0, 3).map((p, i) => (
                <Link key={p.id} href="/news" className={cn(cardClass, cardHoverClass, "group overflow-hidden flex flex-col")}>
                  <div className="relative aspect-[16/10] bg-navy-soft">
                    <Image
                      src={p.image_url || ministryImage(i + 3)}
                      alt=""
                      fill
                      sizes="(min-width: 768px) 33vw, 100vw"
                      unoptimized={Boolean(p.image_url && !p.image_url.startsWith("/"))}
                      className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                    />
                  </div>
                  <div className="p-5 flex-1 flex flex-col">
                    <p className="text-[13px] font-semibold text-navy capitalize">
                      {p.category} · {formatDate(p.published_at || p.created_at)}
                    </p>
                    <h3 className="mt-2 font-serif text-xl leading-snug text-ink">{p.title}</h3>
                    <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{p.excerpt}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ——— Why join ——— */}
      <section className="pb-20 md:pb-28 px-5 sm:px-6">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-[1fr_1.1fr] gap-10 lg:gap-14 items-center">
          <div className="relative aspect-[4/5] sm:aspect-[16/11] lg:aspect-[4/5] overflow-hidden rounded-[2rem]">
            <Image
              src="/Features/KCM_0729.jpg"
              alt="Students studying the Bible together at The Haven"
              fill
              sizes="(min-width: 1024px) 45vw, 100vw"
              className="object-cover"
            />
            <div className="absolute inset-0 photo-overlay opacity-70" />
            <div className="absolute bottom-0 inset-x-0 p-6 md:p-8 text-white">
              <p className="font-serif text-2xl md:text-3xl leading-tight">
                “Come to me, all you who are weary…”
              </p>
              <p className="mt-2 text-sm text-white/70">Matthew 11:28</p>
            </div>
          </div>

          <div>
            <SectionHeader
              eyebrow="Why join us"
              title="Grow in Christ on campus"
              description="Rooted in Scripture and the Adventist message — shaped for university life."
              className="!mb-8"
            />
            <div className="grid sm:grid-cols-2 gap-4">
              {features.map((f) => (
                <Card key={f.title} className="space-y-3">
                  <IconTile icon={f.icon} />
                  <h3 className="font-bold text-ink">{f.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{f.body}</p>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ——— What's on (posters) ——— */}
      <section className="py-20 md:py-28 px-5 sm:px-6 bg-ink text-white">
        <div className="max-w-6xl mx-auto">
          <SectionHeader dark eyebrow="What's on" title="Every week at The Haven" action={{ label: "All posters", href: "/posters" }} />
          <div className="-mx-5 px-5 sm:mx-0 sm:px-0 flex sm:grid sm:grid-cols-3 gap-4 md:gap-6 overflow-x-auto snap-x snap-mandatory pb-2 sm:pb-0">
            {POSTERS.slice(0, 3).map((poster) => (
              <Link
                key={poster.slug}
                href="/posters"
                className="group relative block w-[72%] sm:w-auto shrink-0 snap-start overflow-hidden rounded-2xl aspect-[4/5]"
              >
                <Image
                  src={poster.image}
                  alt={poster.title}
                  fill
                  sizes="(min-width: 640px) 33vw, 72vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ——— Journey ——— */}
      <section className="py-20 md:py-28 px-5 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <SectionHeader eyebrow="Your path" title="Your faith journey" />
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {journey.map((j) => (
              <Link key={j.step} href={j.href} className={cn(cardClass, cardHoverClass, "group flex flex-col p-6 min-h-[200px]")}>
                <span className="font-serif text-4xl text-navy-soft transition-colors group-hover:text-gold">{j.step}</span>
                <h3 className="mt-6 text-lg font-bold text-ink">{j.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground leading-relaxed flex-1">{j.body}</p>
                <ArrowRight className="mt-4 h-5 w-5 text-navy transition-transform group-hover:translate-x-1" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ——— CTA ——— */}
      <section className="px-5 sm:px-6">
        <div className="relative max-w-6xl mx-auto overflow-hidden rounded-[2rem] bg-navy px-6 py-14 md:px-16 md:py-20 text-center text-white">
          <div className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-gold/15 blur-3xl" aria-hidden />
          <div className="pointer-events-none absolute -bottom-32 -right-16 h-80 w-80 rounded-full bg-white/10 blur-3xl" aria-hidden />
          <div className="relative">
            <p className="eyebrow text-gold">Rooted in Scripture</p>
            <h2 className="mt-3 text-3xl md:text-5xl text-balance">Ready to take the next step?</h2>
            <p className="mt-4 text-white/80 max-w-lg mx-auto">
              New to faith or growing deeper — there&apos;s a place for you here.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
              <Button asChild size="lg" variant="gold">
                <Link href={profile ? "/member-dashboard" : "/login"}>{profile ? "Your dashboard" : "Create your account"}</Link>
              </Button>
              <Button asChild size="lg" variant="light">
                <Link href="/bands">Explore bands</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ——— FAQ + Contact ——— */}
      <section id="contact" className="py-20 md:py-28 px-5 sm:px-6 scroll-mt-20">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 lg:gap-16">
          <div>
            <SectionHeader eyebrow="FAQ" title="Common questions" className="!mb-8" />
            <div className="space-y-3">
              {faqs.map((f, i) => {
                const open = openFaq === i
                return (
                  <div key={f.q} className={cn(cardClass, "overflow-hidden transition-colors", open && "border-navy/20")}>
                    <button
                      type="button"
                      onClick={() => setOpenFaq(open ? null : i)}
                      aria-expanded={open}
                      className="w-full flex items-center gap-4 px-5 py-4 text-left"
                    >
                      <span className="flex-1 font-bold text-ink">{f.q}</span>
                      <ChevronDown className={cn("h-5 w-5 shrink-0 text-navy transition-transform", open && "rotate-180")} />
                    </button>
                    <div className={cn("grid transition-all duration-200", open ? "grid-rows-[1fr]" : "grid-rows-[0fr]")}>
                      <div className="overflow-hidden">
                        <p className="px-5 pb-5 text-muted-foreground leading-relaxed">{f.a}</p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          <div>
            <SectionHeader eyebrow="Contact" title="Connect with us" className="!mb-8" />
            <div className={cn(cardClass, "p-6 md:p-8")}>
              {contactSent ? (
                <div className="py-10 text-center">
                  <span className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-success-soft text-success">
                    <Mail className="h-7 w-7" />
                  </span>
                  <h3 className="font-serif text-2xl text-ink">Message received</h3>
                  <p className="mt-2 text-muted-foreground">Thank you! Our team will get back to you soon.</p>
                </div>
              ) : (
                <form onSubmit={handleContact} className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="name" className={labelClass}>Name</label>
                      <input id="name" name="name" required className={fieldClass} placeholder="Your full name" />
                    </div>
                    <div>
                      <label htmlFor="email" className={labelClass}>Email</label>
                      <input id="email" name="email" type="email" required className={fieldClass} placeholder="you@example.com" />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="message" className={labelClass}>Message</label>
                    <textarea
                      id="message"
                      name="message"
                      required
                      rows={5}
                      className={cn(fieldClass, "py-3 resize-none")}
                      placeholder="How can we help?"
                    />
                  </div>
                  {contactError && <Notice tone="error">{contactError}</Notice>}
                  <Button type="submit" size="lg" disabled={contactSending} className="w-full">
                    <Mail />
                    {contactSending ? "Sending…" : "Send message"}
                  </Button>
                  <p className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
                    <MapPin className="h-3.5 w-3.5" /> {BRAND.location}
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      <HomeFooter />
    </div>
  )
}
