'use client'

import Image from 'next/image'
import { SiteNav } from '@/components/layout/SiteNav'
import { cn } from '@/lib/utils'

type MinistryPageShellProps = {
  children: React.ReactNode
  heroImage?: string
  eyebrow?: string
  title?: string
  subtitle?: string
  /** Extra content under the title (buttons, meta) */
  heroExtra?: React.ReactNode
  className?: string
  contentClassName?: string
}

/** Photo header with a navy fade and serif title (app: PhotoHeader), then a light content panel */
export function MinistryPageShell({
  children,
  heroImage = '/Slider/KCM_0822.jpg',
  eyebrow,
  title,
  subtitle,
  heroExtra,
  className,
  contentClassName,
}: MinistryPageShellProps) {
  return (
    <div className={cn('min-h-screen bg-canvas text-ink', className)}>
      <header className="relative isolate overflow-hidden bg-navy-deep text-white">
        <div className="absolute inset-0 -z-10 pointer-events-none">
          <Image src={heroImage} alt="" fill priority sizes="100vw" className="object-cover object-center" />
          <div className="absolute inset-0 photo-overlay" />
        </div>

        <SiteNav />
        {(title || subtitle) && (
          <div className="max-w-6xl mx-auto px-5 sm:px-6 pt-16 pb-20 md:pt-24 md:pb-28">
            <div className="max-w-2xl animate-in fade-in slide-in-from-bottom-2 duration-500">
              {eyebrow && <p className="eyebrow text-gold mb-3">{eyebrow}</p>}
              {title && <h1 className="text-4xl sm:text-5xl md:text-6xl leading-[1.05] text-balance">{title}</h1>}
              {subtitle && (
                <p className="mt-5 text-base md:text-lg text-white/80 leading-relaxed text-pretty">{subtitle}</p>
              )}
              {heroExtra}
            </div>
          </div>
        )}
      </header>

      <main className={cn('relative z-10', contentClassName)}>{children}</main>
    </div>
  )
}
