import { BRAND, BRAND_COLORS } from '@/lib/brand'
import { cn } from '@/lib/utils'

type Tone = 'onDark' | 'onLight'

/** The Haven symbol (same as the app): an open Bible turned roof-wise, a gold light beneath, a ground line */
export function HavenMark({
  tone = 'onLight',
  className,
  title,
}: {
  tone?: Tone
  className?: string
  title?: string
}) {
  const ink = tone === 'onDark' ? '#ffffff' : BRAND_COLORS.navy

  return (
    <svg
      viewBox="0 1.25 64 64"
      className={cn('shrink-0', className)}
      role={title ? 'img' : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
    >
      <g fill="none" stroke={ink} strokeLinecap="round" strokeLinejoin="round">
        <path d="M32 13C24 16.5 15.5 24 8.5 41" strokeWidth={6} />
        <path d="M32 13C40 16.5 48.5 24 55.5 41" strokeWidth={6} />
        <path d="M32 23C27 25.5 21.5 30.5 17 40" strokeWidth={3.6} />
        <path d="M32 23C37 25.5 42.5 30.5 47 40" strokeWidth={3.6} />
        <path d="M14 53.5h36" strokeWidth={3.6} />
      </g>
      <circle cx={32} cy={44} r={6} fill={BRAND_COLORS.gold} />
    </svg>
  )
}

/** Text logo: gold italic "The" + bold serif "Haven" */
export function HavenWordmark({ tone = 'onLight', className }: { tone?: Tone; className?: string }) {
  return (
    <span className={cn('font-serif leading-none whitespace-nowrap', className)}>
      <span className="italic font-normal text-gold text-[0.66em]">The </span>
      <span className={cn('font-bold tracking-tight', tone === 'onDark' ? 'text-white' : 'text-navy')}>Haven</span>
    </span>
  )
}

/** Symbol + wordmark lockup */
export function HavenLogo({
  tone = 'onLight',
  showTagline = false,
  className,
  markClassName = 'h-9 w-9',
}: {
  tone?: Tone
  showTagline?: boolean
  className?: string
  markClassName?: string
}) {
  return (
    <span className={cn('inline-flex items-center gap-2.5 min-w-0', className)}>
      <HavenMark tone={tone} className={markClassName} />
      <span className="min-w-0">
        <HavenWordmark tone={tone} className="block text-[1.35em]" />
        {showTagline && (
          <span
            className={cn(
              'eyebrow block mt-1.5 !text-[9px] truncate',
              tone === 'onDark' ? 'text-white/50' : 'text-muted-foreground'
            )}
          >
            {BRAND.tagline}
          </span>
        )}
      </span>
    </span>
  )
}
