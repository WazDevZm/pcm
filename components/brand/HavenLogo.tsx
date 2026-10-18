import { BRAND, BRAND_COLORS } from '@/lib/brand'
import { cn } from '@/lib/utils'

type Tone = 'onDark' | 'onLight'

/** Shelter mark: gable roof, arched doorway, a light within, an open book at the threshold */
export function HavenMark({
  tone = 'onLight',
  className,
  title,
}: {
  tone?: Tone
  className?: string
  title?: string
}) {
  const body = tone === 'onDark' ? '#ffffff' : BRAND_COLORS.navy
  const door = tone === 'onDark' ? BRAND_COLORS.navy : BRAND_COLORS.light

  return (
    <svg
      viewBox="0 0 64 64"
      className={cn('shrink-0', className)}
      role={title ? 'img' : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
    >
      <path d="M32 5.5 58 25v28.5a5 5 0 0 1-5 5H11a5 5 0 0 1-5-5V25Z" fill={body} />
      <path d="M19 58.5V37a13 13 0 0 1 26 0v21.5Z" fill={door} />
      <path
        d="M32 26.5c3.6 3.4 5.4 6.3 5.4 9a5.4 5.4 0 0 1-10.8 0c0-2.7 1.8-5.6 5.4-9Z"
        fill={BRAND_COLORS.gold}
      />
      <path
        d="M20.5 51.5c4.2-1.6 8.1-1.2 11.5 1.4 3.4-2.6 7.3-3 11.5-1.4V56c-4.2-1.4-8.1-.9-11.5 1.6-3.4-2.5-7.3-3-11.5-1.6Z"
        fill={body}
      />
    </svg>
  )
}

/** Mark + wordmark lockup */
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
  const text = tone === 'onDark' ? 'text-white' : 'text-[#0B0F12]'
  const sub = tone === 'onDark' ? 'text-white/50' : 'text-gray-500'

  return (
    <span className={cn('inline-flex items-center gap-2.5 min-w-0', className)}>
      <HavenMark tone={tone} className={markClassName} />
      <span className="min-w-0 leading-none">
        <span className={cn('block font-semibold tracking-tight truncate', text)}>
          <span className="font-normal opacity-70">The </span>Haven
        </span>
        {showTagline && (
          <span className={cn('block text-[10px] mt-1 tracking-[0.18em] uppercase truncate', sub)}>
            {BRAND.tagline}
          </span>
        )}
      </span>
    </span>
  )
}
