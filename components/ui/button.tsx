import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

/** Pill buttons matching the app (mobile/src/components/ui.tsx → Button) */
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-semibold transition-all active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-ring/40 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground shadow-sm shadow-navy/20 hover:bg-navy-deep',
        gold: 'bg-gold text-ink shadow-sm shadow-gold/30 hover:bg-[#cf9a36]',
        destructive: 'bg-danger-soft text-destructive hover:bg-destructive hover:text-white',
        outline: 'border border-border bg-white text-navy hover:bg-navy-soft hover:border-navy/20',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-navy/15',
        light: 'border border-white/25 bg-white/10 text-white backdrop-blur hover:bg-white/20',
        ghost: 'text-navy hover:bg-accent hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-10 px-5 has-[>svg]:px-4',
        sm: 'h-8 gap-1.5 px-3.5 text-[13px] has-[>svg]:px-3',
        lg: 'h-12 px-7 text-[15px] has-[>svg]:px-6',
        icon: 'size-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : 'button'

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
