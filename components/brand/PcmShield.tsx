import Image from 'next/image'
import { BRAND } from '@/lib/brand'
import { cn } from '@/lib/utils'

/** The Copperbelt University Public Campus Ministries shield (transparent PNG, 295×363) */
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

/** Shield + "A ministry of / CBU PCM" */
export function PcmEndorsement({ tone = 'onDark', className }: { tone?: 'onDark' | 'onLight'; className?: string }) {
  return (
    <span className={cn('inline-flex items-center gap-3', className)}>
      <PcmShield className="h-12" />
      <span className="leading-tight">
        <span className={cn('block text-[10px] font-semibold uppercase tracking-[0.2em]', tone === 'onDark' ? 'text-white/45' : 'text-gray-500')}>
          A ministry of
        </span>
        <span className={cn('block text-sm font-semibold', tone === 'onDark' ? 'text-white/85' : 'text-[#0f2d6e]')}>
          {BRAND.ministryShort}
        </span>
      </span>
    </span>
  )
}
