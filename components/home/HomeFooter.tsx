import Link from 'next/link'
import Image from 'next/image'

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
    { label: 'PCM Merch', href: '/merch' },
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
            <Link href="/" className="inline-flex items-center gap-3 mb-6">
              <Image src="/icon.svg" alt="" width={40} height={40} className="w-10 h-10" />
              <span className="font-semibold text-lg leading-tight">
                CBU SDA
                <br />
                <span className="text-white/60 font-normal text-sm">Public Campus Ministries</span>
              </span>
            </Link>
            <p className="text-white/55 text-sm leading-relaxed max-w-sm">
              Proclaiming the everlasting gospel and preparing students for Christ&apos;s return
              through worship, study, fellowship, and service on campus.
            </p>
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
          <p className="text-white/40 text-sm">© {new Date().getFullYear()} CBU SDA Public Campus Ministries</p>
          <p className="text-white/40 text-xs">Copperbelt University · Kitwe, Zambia</p>
        </div>
      </div>
    </footer>
  )
}
