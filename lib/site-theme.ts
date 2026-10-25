/** Shared PCM site design tokens (mirror mobile/src/theme.ts; CSS variables live in app/globals.css) */
export const PCM = {
  navy: '#0f2d6e',
  dark: '#0B0F12',
  light: '#fafbfc',
  text: '#0B0F12',
} as const

/** Light content panel that overlaps the photo header (used on most inner pages) */
export const contentSectionClass =
  'relative py-14 md:py-20 px-5 sm:px-6 bg-canvas text-ink -mt-6 rounded-t-[2rem]'

/** Dark inner section on ministry pages */
export const darkSectionClass = 'py-16 md:py-24 px-6'

export const pageHeading = 'text-3xl md:text-4xl text-ink'
export const pageSubheading = 'text-lg text-muted-foreground'
export const cardClass =
  'rounded-2xl bg-white border border-border shadow-[0_4px_12px_rgba(11,15,18,0.04)] hover:shadow-[0_10px_30px_rgba(15,45,110,0.10)] transition-shadow'
export const iconBoxClass =
  'inline-flex items-center justify-center w-11 h-11 rounded-xl bg-navy-soft text-navy shrink-0'
export const btnPrimaryClass = 'bg-navy text-white hover:bg-navy-deep rounded-full'
export const btnOutlineClass = 'rounded-full border-border'
