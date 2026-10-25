import Link from 'next/link'
import type { LucideIcon } from 'lucide-react'
import { AlertCircle, ArrowRight, CheckCircle2, Info, Leaf } from 'lucide-react'
import { cn } from '@/lib/utils'

/**
 * Web counterparts of the app's building blocks (mobile/src/components/ui.tsx),
 * so both read as one product.
 */

/** Small uppercase eyebrow + serif title, optional action link on the right */
export function SectionHeader({
  eyebrow,
  title,
  description,
  action,
  dark,
  center,
  className,
}: {
  eyebrow?: string
  title: string
  description?: string
  action?: { label: string; href: string }
  dark?: boolean
  center?: boolean
  className?: string
}) {
  return (
    <div
      className={cn(
        'flex flex-col gap-4 md:flex-row md:items-end md:justify-between mb-10 md:mb-12',
        center && 'md:flex-col md:items-center text-center',
        className
      )}
    >
      <div className={cn('max-w-2xl', center && 'mx-auto')}>
        {eyebrow && <p className={cn('eyebrow mb-3', dark ? 'text-gold' : 'text-navy')}>{eyebrow}</p>}
        <h2 className={cn('text-3xl md:text-4xl leading-[1.1] text-balance', dark ? 'text-white' : 'text-ink')}>
          {title}
        </h2>
        {description && (
          <p className={cn('mt-4 text-[15px] md:text-base leading-relaxed text-pretty', dark ? 'text-white/70' : 'text-muted-foreground')}>
            {description}
          </p>
        )}
      </div>
      {action && (
        <Link
          href={action.href}
          className={cn(
            'group inline-flex items-center gap-1.5 text-sm font-semibold shrink-0',
            dark ? 'text-gold hover:text-gold/80' : 'text-navy hover:text-navy-deep'
          )}
        >
          {action.label}
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
      )}
    </div>
  )
}

/** Rounded navy-tinted square holding an icon */
export function IconTile({
  icon: Icon,
  dark,
  size = 'md',
  className,
}: {
  icon: LucideIcon
  dark?: boolean
  size?: 'md' | 'lg'
  className?: string
}) {
  return (
    <span
      className={cn(
        'inline-flex shrink-0 items-center justify-center',
        size === 'lg' ? 'h-14 w-14 rounded-2xl' : 'h-11 w-11 rounded-xl',
        dark ? 'bg-white/10 text-gold' : 'bg-navy-soft text-navy',
        className
      )}
    >
      <Icon className={size === 'lg' ? 'h-6 w-6' : 'h-5 w-5'} strokeWidth={1.75} />
    </span>
  )
}

export const cardClass =
  'rounded-2xl bg-white border border-border shadow-[0_4px_12px_rgba(11,15,18,0.04)]'
export const cardHoverClass =
  'transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_10px_30px_rgba(15,45,110,0.10)] hover:border-navy/15'

export function Card({
  children,
  className,
  hover,
}: {
  children: React.ReactNode
  className?: string
  hover?: boolean
}) {
  return <div className={cn(cardClass, 'p-6', hover && cardHoverClass, className)}>{children}</div>
}

type Tone = 'navy' | 'gold' | 'success' | 'danger' | 'muted'
const badgeTones: Record<Tone, string> = {
  navy: 'bg-navy-soft text-navy',
  gold: 'bg-gold-soft text-gold-ink',
  success: 'bg-success-soft text-success',
  danger: 'bg-danger-soft text-destructive',
  muted: 'bg-muted text-muted-foreground',
}

export function Badge({ children, tone = 'navy', className }: { children: React.ReactNode; tone?: Tone; className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold capitalize',
        badgeTones[tone],
        className
      )}
    >
      {children}
    </span>
  )
}

export function EmptyState({
  icon = Leaf,
  title,
  body,
  action,
  className,
}: {
  icon?: LucideIcon
  title: string
  body?: string
  action?: React.ReactNode
  className?: string
}) {
  return (
    <div className={cn('flex flex-col items-center gap-3 py-14 px-6 text-center', className)}>
      <IconTile icon={icon} size="lg" />
      <h3 className="text-lg font-bold text-ink">{title}</h3>
      {body && <p className="max-w-md text-sm text-muted-foreground leading-relaxed">{body}</p>}
      {action}
    </div>
  )
}

export function Notice({
  tone = 'info',
  children,
  className,
}: {
  tone?: 'info' | 'error' | 'success'
  children: React.ReactNode
  className?: string
}) {
  const t = {
    info: ['bg-gold-soft text-gold-ink', Info],
    error: ['bg-danger-soft text-destructive', AlertCircle],
    success: ['bg-success-soft text-success', CheckCircle2],
  }[tone] as [string, LucideIcon]
  const Icon = t[1]
  return (
    <div role={tone === 'error' ? 'alert' : 'status'} className={cn('flex items-start gap-2.5 rounded-xl px-4 py-3 text-sm', t[0], className)}>
      <Icon className="mt-0.5 h-4 w-4 shrink-0" />
      <div className="flex-1">{children}</div>
    </div>
  )
}

/** Shared input styling (app: styles.input) */
export const fieldClass =
  'w-full min-h-12 rounded-xl border border-input bg-white px-4 text-[15px] text-ink placeholder:text-[#8a93a3] transition-colors focus:outline-none focus:border-navy focus:ring-[3px] focus:ring-navy/15 disabled:opacity-60'
export const labelClass = 'block text-sm font-semibold text-ink mb-1.5'
