import Link from 'next/link'
import { HavenLogo } from '@/components/brand/HavenLogo'
import { PcmEndorsement } from '@/components/brand/PcmShield'
import { BRAND } from '@/lib/brand'

const footerLinks = {
  ministries: [
    { label: 'Bands & Committees', href: '/bands' },
    { label: 'Events', href: '/events' },
    { label: 'Programs', href: '/programs' },
  ],
  resources: [
    { label: 'Prayer Request', href: '/prayer-request' },
    { label: 'Bible Resources', href: '/resources' },
    { label: 'Counseling', href: '/counseling' },
    { label: 'Gallery', href: '/gallery' },
  ],
  connect: [
    { label: 'Haven Merch', href: '/merch' },
    { label: 'Posters', href: '/posters' },
    { label: 'Get Involved', href: '/support' },
    { label: 'News', href: '/news' },
    { label: 'Committees', href: '/committees' },
  ],
}

export function HomeFooter() {
  return (
    <footer className="bg-[#06080a] text-white border-t border-white/10">
      <div className="max-w-7xl mx-auto px-6 py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8">
          <div className="lg:col-span-5">
            <Link href="/" className="inline-flex items-center mb-6">
              <HavenLogo tone="onDark" showTagline markClassName="h-10 w-10" className="text-lg" />
            </Link>
            <p className="text-white/55 text-sm leading-relaxed max-w-sm">
              A shelter for every student — proclaiming the everlasting gospel through
              worship, study, fellowship, and service on campus.
            </p>
            <PcmEndorsement className="mt-6" />
          </div>

          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title} className="lg:col-span-2">
              <h3 className="text-xs font-semibold uppercase tracking-widest text-white/40 mb-4">
                {title}
              </h3>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-white/70 hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 pt-8 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-white/40 text-sm text-center sm:text-left">
            © {new Date().getFullYear()} {BRAND.name} · {BRAND.ministryShort}
          </p>
          <p className="text-white/40 text-xs">{BRAND.location}</p>
        </div>
      </div>
    </footer>
  )
}
