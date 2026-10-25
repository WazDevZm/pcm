import { BRAND } from '@/lib/brand'
import { cn } from '@/lib/utils'

type Tone = 'onDark' | 'onLight'

/**
 * The Haven logo is text only (brand-kit/logo): gold italic "the", Fraunces Bold "Haven",
 * and a gold full stop — the light. Set in live Fraunces so it stays crisp at every size.
 */
export function HavenWordmark({
  tone = 'onLight',
  stacked = false,
  className,
}: {
  tone?: Tone
  stacked?: boolean
  className?: string
}) {
  const haven = tone === 'onDark' ? 'text-white' : 'text-navy'
  if (stacked) {
    return (
      <span className={cn('inline-flex flex-col items-start font-serif leading-none', className)} aria-label={BRAND.name}>
        <span className="italic font-normal text-gold text-[0.46em] ml-[0.04em] mb-[0.04em]" aria-hidden>
          the
        </span>
        <span className={cn('font-bold tracking-[-0.015em]', haven)} aria-hidden>
          Haven<span className="text-gold">.</span>
        </span>
      </span>
    )
  }
  return (
    <span className={cn('inline-flex items-baseline font-serif leading-none whitespace-nowrap', className)} aria-label={BRAND.name}>
      <span className="italic font-normal text-gold text-[0.58em] mr-[0.15em]" aria-hidden>
        the
      </span>
      <span className={cn('font-bold tracking-[-0.015em]', haven)} aria-hidden>
        Haven<span className="text-gold">.</span>
      </span>
    </span>
  )
}

/** "H." monogram tile — app icon and favicon (brand-kit/app-icon) */
export function HavenMonogram({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex shrink-0 items-center justify-center rounded-[28%] bg-navy font-serif font-bold leading-none text-white',
        'h-10 w-10 text-[1.35rem]',
        className
      )}
      aria-label={BRAND.name}
    >
      <span aria-hidden>
        H<span className="text-gold">.</span>
      </span>
    </span>
  )
}

/** Wordmark with an optional tagline underneath */
export function HavenLogo({
  tone = 'onLight',
  showTagline = false,
  className,
}: {
  tone?: Tone
  showTagline?: boolean
  className?: string
}) {
  return (
    <span className={cn('inline-flex flex-col items-start gap-2', className)}>
      <HavenWordmark tone={tone} className="text-[1.9em]" />
      {showTagline && (
        <span className={cn('eyebrow !text-[10px]', tone === 'onDark' ? 'text-white/55' : 'text-muted-foreground')}>
          {BRAND.tagline}
        </span>
      )}
    </span>
  )
}
