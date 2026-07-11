'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { HERO_SLIDER_IMAGES } from '@/lib/site-images'
import { cn } from '@/lib/utils'

export function HeroSlider({ className }: { className?: string }) {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDER_IMAGES.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [mounted])

  // Only render current and next slide for performance
  const slidesToRender = mounted 
    ? [currentSlide, (currentSlide + 1) % HERO_SLIDER_IMAGES.length]
    : [0]

  return (
    <div className={cn('absolute inset-0 pointer-events-none', className)} aria-hidden>
      {HERO_SLIDER_IMAGES.map((src, index) => {
        if (!slidesToRender.includes(index)) return null
        const isCurrent = index === currentSlide
        const isNext = index === (currentSlide + 1) % HERO_SLIDER_IMAGES.length
        
        return (
          <div
            key={src}
            className={cn(
              'absolute inset-0 transition-opacity duration-1000 ease-in-out',
              isCurrent ? 'opacity-100' : 'opacity-0'
            )}
          >
            <Image
              src={src}
              alt=""
              fill
              priority={index === 0}
              loading={isCurrent || isNext ? 'eager' : 'lazy'}
              sizes="100vw"
              quality={85}
              className="object-cover object-center"
            />
          </div>
        )
      })}
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-black/80" />
    </div>
  )
}
