import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft } from 'lucide-react'
import { HavenMark, HavenWordmark } from '@/components/brand/HavenLogo'
import { PcmEndorsement } from '@/components/brand/PcmShield'

/** Split auth screen: ministry photo on wide screens, the app's sign-in layout on the right */
export function AuthLayout({ children, subtitle }: { children: React.ReactNode; subtitle?: string }) {
  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-canvas">
      <aside className="relative hidden lg:flex flex-col justify-end overflow-hidden bg-navy-deep p-12 text-white">
        <Image src="/Slider/KCM_0549.jpg" alt="" fill priority sizes="50vw" className="object-cover" />
        <div className="absolute inset-0 photo-overlay" />
        <div className="relative max-w-md">
          <p className="eyebrow text-gold">A place to belong</p>
          <p className="mt-3 font-serif text-4xl leading-tight">
            One account for the website and <span className="italic font-normal text-gold">The Haven</span> app.
          </p>
          <p className="mt-4 text-white/75">RSVP to events, join a band, send prayer requests and track your orders.</p>
        </div>
      </aside>

      <main className="flex flex-col px-5 sm:px-6 py-6">
        <Link href="/" className="inline-flex items-center gap-1.5 self-start text-sm font-semibold text-navy hover:text-navy-deep">
          <ArrowLeft className="h-4 w-4" /> Home
        </Link>
        <div className="flex-1 flex items-center justify-center py-10">
          <div className="w-full max-w-sm">
            <div className="flex flex-col items-center text-center">
              <span className="flex h-20 w-20 items-center justify-center rounded-3xl bg-navy shadow-lg shadow-navy/25">
                <HavenMark tone="onDark" className="h-11 w-11" />
              </span>
              <HavenWordmark className="mt-5 text-4xl" />
              <PcmEndorsement tone="onLight" className="mt-4 flex-col !gap-2 text-center" />
              {subtitle && <p className="mt-5 text-muted-foreground">{subtitle}</p>}
            </div>
            <div className="mt-8">{children}</div>
          </div>
        </div>
      </main>
    </div>
  )
}
