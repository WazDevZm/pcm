"use client"

import { useState, useEffect, useRef } from "react"
import { MapPin, Calendar, Menu, X, Flame, ChevronDown, Lock } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

const navLinks = [
  { name: "Committees", href: "/committees" },
  { name: "Events", href: "/events" },
  { name: "Resources", href: "/resources" },
  { name: "News", href: "/news" },
  { name: "Support", href: "/support" },
  { name: "Gallery", href: "/gallery" },
  { name: "Counseling", href: "/counseling" },
  { name: "Impact CBU", href: "/impact" },
]

const TARGET_DATE = new Date("2026-04-12T00:00:00")

function useCountdown(target: Date) {
  const calc = () => {
    const diff = target.getTime() - Date.now()
    if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 }
    return {
      days: Math.floor(diff / (1000 * 60 * 60 * 24)),
      hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((diff / (1000 * 60)) % 60),
      seconds: Math.floor((diff / 1000) % 60),
    }
  }
  const [time, setTime] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })
  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    setMounted(true)
    setTime(calc())
    const id = setInterval(() => setTime(calc()), 1000)
    return () => clearInterval(id)
  }, [])
  return { time, mounted }
}

function StarField() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let animId: number

    const resize = () => {
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }
    resize()
    window.addEventListener("resize", resize)

    const STAR_COUNT = 180
    const stars = Array.from({ length: STAR_COUNT }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.4 + 0.3,
      speed: Math.random() * 0.25 + 0.05,
      opacity: Math.random() * 0.7 + 0.3,
      twinkleSpeed: Math.random() * 0.02 + 0.005,
      twinkleOffset: Math.random() * Math.PI * 2,
    }))

    let t = 0
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      t += 1
      for (const s of stars) {
        s.y += s.speed
        if (s.y > canvas.height) {
          s.y = 0
          s.x = Math.random() * canvas.width
        }
        const alpha = s.opacity * (0.5 + 0.5 * Math.sin(t * s.twinkleSpeed + s.twinkleOffset))
        ctx.beginPath()
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(186, 230, 253, ${alpha})`
        ctx.fill()
      }
      animId = requestAnimationFrame(draw)
    }
    draw()

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener("resize", resize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 0 }}
    />
  )
}

const socials = [
  {
    name: "Facebook",
    href: "https://facebook.com",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
      </svg>
    ),
  },
  {
    name: "Instagram",
    href: "https://instagram.com",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    name: "YouTube",
    href: "https://youtube.com",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" />
        <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="white" />
      </svg>
    ),
  },
  {
    name: "WhatsApp",
    href: "https://wa.me",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
        <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.554 4.118 1.528 5.855L.057 23.215a.75.75 0 0 0 .916.927l5.356-1.471A11.943 11.943 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.885 0-3.65-.52-5.16-1.427l-.37-.217-3.882 1.065 1.065-3.882-.217-.374A9.953 9.953 0 0 1 2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" />
      </svg>
    ),
  },
  {
    name: "X / Twitter",
    href: "https://x.com",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
]

export default function ImpactPage() {
  const [menuOpen, setMenuOpen] = useState(false)
  const { time, mounted } = useCountdown(TARGET_DATE)
  const { days, hours, minutes, seconds } = time
  const pad = (n: number) => String(n).padStart(2, "0")

  return (
    <div className="min-h-screen bg-[#0a1628] text-white">

      {/* NAV */}
      <nav className="relative z-10 flex items-center justify-between p-4 md:p-6">
        <div className="flex items-center gap-3 px-4 py-2 md:px-6 md:py-3 bg-black/60 ring-1 ring-white/30 backdrop-blur rounded-full">
          <img src="/logo (2).png" alt="Logo" className="w-10 h-10 md:w-12 md:h-12 object-contain" />
        </div>

        <div className="hidden md:flex items-center gap-1 flex-wrap justify-center">
          {navLinks.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`px-4 py-2 backdrop-blur rounded-full transition-colors text-sm ${
                item.name === "Impact CBU"
                  ? "bg-[#0f2d6e] text-white hover:bg-[#1a3a8f] font-semibold ring-1 ring-sky-400/30"
                  : "bg-black/40 ring-1 ring-white/20 hover:bg-black/50"
              }`}
            >
              {item.name}
            </Link>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          <a href="#" className="px-4 py-2 bg-black/40 ring-1 ring-white/20 backdrop-blur rounded-full hover:bg-black/50 transition-colors text-sm">
            Member Login
          </a>
          <Button asChild className="bg-white text-black hover:bg-white/90 rounded-full px-6">
            <Link href="/support">Get Involved</Link>
          </Button>
        </div>

        <button
          className="md:hidden p-2 bg-black/60 ring-1 ring-white/30 backdrop-blur rounded-full text-white"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="fixed inset-0 z-50 bg-black/95 flex flex-col pt-24 pb-8 px-6 md:hidden">
          <div className="flex flex-col gap-3 flex-1">
            {navLinks.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className={`px-6 py-4 rounded-xl text-white text-lg font-medium transition-colors ${
                  item.name === "Impact CBU"
                    ? "bg-[#0f2d6e] ring-1 ring-sky-400/30 hover:bg-[#1a3a8f]"
                    : "bg-white/10 ring-1 ring-white/20 hover:bg-white/20"
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>
          <div className="flex flex-col gap-3 mt-6">
            <a href="#" className="px-6 py-4 rounded-xl bg-white/10 ring-1 ring-white/20 text-white text-center text-lg font-medium">
              Member Login
            </a>
            <Button asChild className="bg-white text-black hover:bg-white/90 rounded-xl py-4 text-lg">
              <Link href="/support" onClick={() => setMenuOpen(false)}>Get Involved</Link>
            </Button>
          </div>
        </div>
      )}

      {/* HERO with star field */}
      <section className="relative min-h-[calc(100vh-88px)] flex flex-col items-center justify-center px-6 pb-16 overflow-hidden">

        <StarField />

        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-[#0f2d6e]/40 rounded-full blur-3xl pointer-events-none" style={{ zIndex: 1 }} />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#0f2d6e]/30 rounded-full blur-3xl pointer-events-none" style={{ zIndex: 1 }} />
        <div className="absolute top-0 right-0 w-72 h-72 bg-sky-900/20 rounded-full blur-3xl pointer-events-none" style={{ zIndex: 1 }} />

        <div className="relative text-center max-w-4xl mx-auto w-full" style={{ zIndex: 2 }}>

          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#0f2d6e]/50 ring-1 ring-sky-400/30 rounded-full mb-8">
            <Flame className="w-4 h-4 text-sky-300" />
            <span className="text-sky-300 text-sm font-semibold tracking-widest uppercase">CBU SDA Public Campus Ministries</span>
          </div>

          <h1 className="text-5xl sm:text-7xl md:text-8xl font-black tracking-tight mb-4 leading-none">
            <span className="text-white">IMPACT </span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-300 to-white">CBU</span>
          </h1>
          <p className="text-3xl sm:text-4xl md:text-5xl font-black text-white/80 mb-8">2026</p>

          <div className="mb-8 px-6 py-5 bg-[#0f2d6e]/30 ring-1 ring-sky-400/20 rounded-2xl max-w-2xl mx-auto">
            <p className="text-lg md:text-xl text-white/90 italic leading-relaxed">
              &ldquo;Arise, shine; for your light has come!&rdquo;
            </p>
            <p className="text-sky-300 font-bold mt-2 text-base">– Isaiah 60:1</p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-6">
            <div className="flex items-center gap-2 px-5 py-3 bg-[#0f2d6e]/30 ring-1 ring-sky-400/20 rounded-full text-white/80">
              <MapPin className="w-4 h-4 text-sky-300 shrink-0" />
              <span className="text-sm md:text-base">Copperbelt University, The Copperbelt</span>
            </div>
            <div className="flex items-center gap-2 px-5 py-3 bg-[#0f2d6e]/30 ring-1 ring-sky-400/20 rounded-full text-white/80">
              <Calendar className="w-4 h-4 text-sky-300 shrink-0" />
              <span className="text-sm md:text-base">12th – 19th April 2026</span>
            </div>
          </div>

          <p className="text-lg md:text-xl text-white/60 mb-10 leading-relaxed">
            Come and experience a life-changing encounter. Don&apos;t miss out! 🙌
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-14">
            <Button size="lg" className="bg-[#0f2d6e] hover:bg-[#1a3a8f] text-white rounded-full px-10 text-lg font-semibold ring-1 ring-sky-400/30 shadow-lg shadow-[#0f2d6e]/50" asChild>
              <a href="https://forms.gle/F8CZ42LMRQG4LyC86" target="_blank" rel="noopener noreferrer">
                Register Now
              </a>
            </Button>
            <Button size="lg" className="bg-white/5 border-white/20 text-white hover:bg-white/10 rounded-full px-10 text-lg border" asChild>
              <Link href="/impact/schedule">
                Program Schedule
              </Link>
            </Button>
          </div>

          {/* Countdown */}
          <div className="bg-[#0f2d6e]/20 ring-1 ring-sky-400/15 rounded-3xl p-6 md:p-10 max-w-2xl mx-auto">
            <p className="text-sky-300/60 text-xs uppercase tracking-widest mb-6 font-semibold">Event Starts In</p>
            <div className="grid grid-cols-4 gap-3 md:gap-5">
              {[
                { value: mounted ? pad(days) : "--", label: "Days" },
                { value: mounted ? pad(hours) : "--", label: "Hours" },
                { value: mounted ? pad(minutes) : "--", label: "Mins" },
                { value: mounted ? pad(seconds) : "--", label: "Secs" },
              ].map(({ value, label }) => (
                <div key={label} className="flex flex-col items-center gap-2">
                  <div className="w-full aspect-square flex items-center justify-center bg-[#0f2d6e]/60 ring-1 ring-sky-400/25 rounded-2xl">
                    <span className="text-2xl sm:text-4xl md:text-5xl font-black tabular-nums text-white">{value}</span>
                  </div>
                  <span className="text-sky-300/60 text-xs uppercase tracking-wider">{label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Social links */}
          <div className="mt-10 flex items-center justify-center gap-3 flex-wrap">
            <span className="text-white/40 text-sm">Follow us:</span>
            {socials.map((s) => (
              <a
                key={s.name}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.name}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-[#0f2d6e]/50 ring-1 ring-sky-400/25 text-sky-300 hover:bg-[#1a3a8f] hover:text-white hover:ring-sky-400/50 transition-all duration-200"
              >
                {s.icon}
              </a>
            ))}
          </div>
        </div>

        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/20 animate-bounce" style={{ zIndex: 2 }}>
          <ChevronDown className="w-5 h-5" />
        </div>
      </section>

      {/* ABOUT (white section) */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">What is Impact CBU?</h2>
          <p className="text-gray-600 text-lg md:text-xl leading-relaxed max-w-3xl mx-auto mb-12">
            Impact CBU is a week-long evangelistic and spiritual revival series hosted by CBU SDA Public Campus Ministries at Copperbelt University. Through powerful preaching, worship, prayer, and fellowship, we believe God will move mightily across campus.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { title: "7 Nights", sub: "of powerful messages and worship" },
              { title: "One Campus", sub: "united in faith and purpose" },
              { title: "One Mission", sub: "to arise and shine for Christ" },
            ].map((item, i) => (
              <div key={i} className="rounded-2xl bg-[#0f2d6e]/5 ring-1 ring-[#0f2d6e]/15 p-8">
                <div className="text-3xl font-black text-[#0f2d6e] mb-2">{item.title}</div>
                <p className="text-gray-600">{item.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA STRIP */}
      <section className="py-20 px-6 text-white text-center" style={{ background: "linear-gradient(135deg, #0f2d6e 0%, #0a1628 100%)" }}>
        <div className="max-w-3xl mx-auto">
          <Flame className="w-12 h-12 text-sky-300 mx-auto mb-6" />
          <h2 className="text-3xl md:text-5xl font-black mb-4">Your Light Has Come.</h2>
          <p className="text-sky-300/80 text-lg mb-8">April 12–19, 2026 · Copperbelt University</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-[#0f2d6e] hover:bg-sky-50 rounded-full px-12 text-lg font-bold shadow-xl">
              Register for Free
            </Button>
            <Button 
              size="lg" 
              className="bg-[#0f2d6e] hover:bg-[#1a3a8f] text-white rounded-full px-12 text-lg font-bold shadow-xl ring-1 ring-sky-400/30" asChild
            >
              <Link href="/impact/schedule">
                Program Schedule
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="relative z-10 py-16 px-6 bg-black">
        <div className="max-w-7xl mx-auto">
          <div className="rounded-3xl bg-black ring-1 ring-gray-800 p-8 md:p-12">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 md:gap-12 mb-12">

              {/* Brand column */}
              <div className="lg:col-span-2">
                <div className="flex items-center gap-3 mb-6">
                  <img src="/logo (1).png" alt="Logo 1" className="w-8 h-8 object-contain" />
                  <img src="/logo (2).png" alt="Logo 2" className="w-8 h-8 object-contain" />
                  <span className="text-lg font-semibold text-white">CBU SDA Public Campus Ministries</span>
                </div>
                <p className="text-gray-300 leading-relaxed text-sm mb-6">
                  Proclaiming the everlasting gospel and preparing students for Christ&apos;s second coming through biblical education and Christian fellowship.
                </p>
                <div className="mb-6 px-4 py-3 bg-[#0f2d6e]/40 ring-1 ring-sky-400/20 rounded-xl inline-block">
                  <p className="text-sky-300 text-sm font-semibold">🔥 Impact CBU 2026</p>
                  <p className="text-sky-300/60 text-xs mt-0.5">12–19 April · Copperbelt University</p>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  {socials.map((s) => (
                    <a
                      key={s.name}
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={s.name}
                      className="w-9 h-9 flex items-center justify-center rounded-full bg-white/5 ring-1 ring-white/10 text-gray-400 hover:bg-[#0f2d6e]/60 hover:text-sky-300 hover:ring-sky-400/30 transition-all duration-200"
                    >
                      {s.icon}
                    </a>
                  ))}
                </div>
              </div>

              {/* Ministries */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider mb-5 text-white">MINISTRIES</h3>
                <ul className="space-y-3">
                  {["Bible Studies", "Worship Services", "Prayer Groups", "Evangelism"].map((item) => (
                    <li key={item}>
                      <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">{item}</a>
                    </li>
                  ))}
                </ul>
              </div>

              {/* About */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider mb-5 text-white">ABOUT</h3>
                <ul className="space-y-3">
                  {["Our Mission", "Pastoral Team", "SDA Beliefs", "Campus Events"].map((item) => (
                    <li key={item}>
                      <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">{item}</a>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Resources */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider mb-5 text-white">RESOURCES</h3>
                <ul className="space-y-3">
                  {["Prayer Requests", "Bible Studies", "Baptism Info", "Contact Pastor"].map((item) => (
                    <li key={item}>
                      <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">{item}</a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Newsletter */}
            <div className="border-t border-gray-800 pt-10 mb-10">
              <div className="max-w-md">
                <h3 className="text-base font-semibold mb-4 text-white">Ministry Updates</h3>
                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="flex-1 px-4 py-3 rounded-lg bg-gray-900 ring-1 ring-gray-700 border-0 text-white placeholder:text-gray-500 focus:ring-2 focus:ring-sky-400 focus:outline-none text-sm"
                  />
                  <Button className="bg-[#0f2d6e] text-white hover:bg-[#1a3a8f] rounded-lg px-6 h-[46px] shrink-0 ring-1 ring-sky-400/20">
                    Subscribe
                  </Button>
                </div>
              </div>
            </div>

            {/* Copyright */}
            <div className="border-t border-gray-800 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-gray-500 text-sm">© 2025 CBU SDA Public Campus Ministries</p>
              <div className="flex items-center gap-2 text-gray-500 text-sm">
                <Lock className="w-3 h-3" />
                <span>Rooted in Faith &amp; Scripture</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
