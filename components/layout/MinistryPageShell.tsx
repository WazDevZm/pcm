'use client'

import Image from 'next/image'
import { SiteNav } from '@/components/layout/SiteNav'
import { cn } from '@/lib/utils'

type MinistryPageShellProps = {
  children: React.ReactNode
  heroImage?: string
  title?: string
  subtitle?: string
  className?: string
  contentClassName?: string
}

export function MinistryPageShell({
  children,
  heroImage = '/Slider/KCM_0822.jpg',
  title,
  subtitle,
  className,
  contentClassName,
}: MinistryPageShellProps) {
  return (
    <div className={cn('min-h-screen bg-[#0B0F12] text-white', className)}>
      <header className="relative isolate">
        <div className="absolute inset-0 min-h-[280px] md:min-h-[340px] -z-10 pointer-events-none overflow-hidden">
          <Image
            src={heroImage}
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/45 to-[#0B0F12]" />
        </div>

        <div className="relative z-20">
          <SiteNav />
          {(title || subtitle) && (
            <div className="max-w-4xl mx-auto px-6 pb-14 md:pb-20 pt-4 text-center">
              {title && (
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-4 text-balance">
                  {title}
                </h1>
              )}
              {subtitle && (
                <p className="text-lg text-white/80 leading-relaxed max-w-2xl mx-auto text-pretty">
                  {subtitle}
                </p>
              )}
            </div>
          )}
        </div>
      </header>

      <main className={cn('relative z-10', contentClassName)}>{children}</main>
    </div>
  )
}
