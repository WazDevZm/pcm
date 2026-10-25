import Link from 'next/link'
import { Mail, MapPin } from 'lucide-react'
import { HavenLogo } from '@/components/brand/HavenLogo'
import { PcmEndorsement } from '@/components/brand/PcmShield'
import { BRAND } from '@/lib/brand'

const footerLinks = {
  Ministry: [
    { label: 'Bands', href: '/bands' },
    { label: 'Events', href: '/events' },
    { label: 'Programs', href: '/programs' },
    { label: 'Committees', href: '/committees' },
  ],
  Care: [
    { label: 'Prayer request', href: '/prayer-request' },
    { label: 'Counseling', href: '/counseling' },
    { label: 'Get involved', href: '/support' },
  ],
  Discover: [
    { label: 'News & testimonies', href: '/news' },
    { label: 'Gallery', href: '/gallery' },
    { label: 'Resources', href: '/resources' },
    { label: 'Magazines', href: '/magazines' },
    { label: 'Posters', href: '/posters' },
    { label: 'Merch store', href: '/merch' },
  ],
}

export function HomeFooter() {
  return (
    <footer className="relative overflow-hidden bg-navy-deep text-white">
      <div
        className="pointer-events-none absolute -top-40 -right-32 h-96 w-96 rounded-full bg-gold/10 blur-3xl"
        aria-hidden
      />
      <div className="relative max-w-6xl mx-auto px-5 sm:px-6 pt-16 pb-10 md:pt-20">
        <div className="grid grid-cols-2 md:grid-cols-12 gap-10 md:gap-8">
          <div className="col-span-2 md:col-span-5">
            <Link href="/" className="inline-flex mb-5" aria-label={`${BRAND.name} home`}>
              <HavenLogo tone="onDark" showTagline markClassName="h-11 w-11" className="text-lg" />
            </Link>
            <p className="text-white/65 text-sm leading-relaxed max-w-sm">
              A shelter on campus for worship, Bible study, real friendship and service that carries
              Christ&apos;s light beyond the classroom.
            </p>
            <ul className="mt-6 space-y-2 text-sm text-white/65">
              <li className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-gold" /> {BRAND.location}
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-gold" />
                <a href={`mailto:${BRAND.email}`} className="hover:text-white transition-colors">
                  {BRAND.email}
                </a>
              </li>
            </ul>
          </div>

          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title} className="md:col-span-2 last:col-span-2 md:last:col-span-3">
              <h3 className="eyebrow text-gold mb-4">{title}</h3>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-sm text-white/70 hover:text-white transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 pt-8 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-6">
          <PcmEndorsement />
          <p className="text-white/45 text-xs text-center sm:text-right">
            © {new Date().getFullYear()} {BRAND.name} · {BRAND.ministry}
          </p>
        </div>
      </div>
    </footer>
  )
}
