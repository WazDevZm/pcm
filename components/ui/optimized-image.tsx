'use client'

import Image from 'next/image'
import { useState } from 'react'
import { cn } from '@/lib/utils'

const BLUR =
  'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMTIxNjE5Ii8+PC9zdmc+'

type OptimizedImageProps = {
  src: string
  alt: string
  width?: number
  height?: number
  fill?: boolean
  className?: string
  priority?: boolean
  sizes?: string
  objectFit?: 'cover' | 'contain'
}

export function OptimizedImage({
  src,
  alt,
  width,
  height,
  fill,
  className,
  priority = false,
  sizes = '(max-width: 768px) 100vw, 50vw',
  objectFit = 'cover',
}: OptimizedImageProps) {
  const [error, setError] = useState(false)
  const resolved =
    error || !src
      ? '/placeholder.svg'
      : src.startsWith('http') || src.startsWith('/')
        ? src
        : `/${src}`

  const fitClass = objectFit === 'contain' ? 'object-contain' : 'object-cover'

  if (fill) {
    return (
      <Image
        src={resolved}
        alt={alt}
        fill
        className={cn(fitClass, className)}
        sizes={sizes}
        priority={priority}
        placeholder="blur"
        blurDataURL={BLUR}
        onError={() => setError(true)}
      />
    )
  }

  return (
    <Image
      src={resolved}
      alt={alt}
      width={width ?? 800}
      height={height ?? 600}
      className={cn(fitClass, className)}
      sizes={sizes}
      priority={priority}
      placeholder="blur"
      blurDataURL={BLUR}
      onError={() => setError(true)}
    />
  )
}
