import Image from 'next/image'
import { BRAND } from '@/lib/brand'
import { cn } from '@/lib/utils'

/** The Copperbelt University SDA Public Campus Ministries shield (transparent PNG, 295×363) */
export function PcmShield({ className, priority }: { className?: string; priority?: boolean }) {
  return (
    <Image
      src="/pcm-shield.png"
      alt={BRAND.ministry}
      width={295}
      height={363}
      priority={priority}
      className={cn('h-10 w-auto shrink-0', className)}
    />
  )
}

/** Shield + "CBU SDA PCM" and, optionally, the full ministry name */
export function PcmEndorsement({
  tone = 'onDark',
  full = false,
  className,
}: {
  tone?: 'onDark' | 'onLight'
  full?: boolean
  className?: string
}) {
  return (
    <span className={cn('inline-flex items-center gap-3', className)}>
      <PcmShield className="h-12" />
      <span className="leading-tight">
        <span className={cn('block text-sm font-bold tracking-[0.08em]', tone === 'onDark' ? 'text-white' : 'text-navy')}>
          {BRAND.ministryShort}
        </span>
        {full && (
          <span className={cn('block text-xs mt-0.5', tone === 'onDark' ? 'text-white/60' : 'text-muted-foreground')}>
            {BRAND.ministry}
          </span>
        )}
      </span>
    </span>
  )
}
