/** Shared PCM site design tokens */
export const PCM = {
  navy: '#0f2d6e',
  dark: '#0B0F12',
  light: '#fafbfc',
  text: '#0B0F12',
} as const

/** White content panel below dark hero (used on most inner pages) */
export const contentSectionClass =
  'py-16 md:py-24 px-6 bg-[#fafbfc] text-[#0B0F12] -mt-8 rounded-t-3xl'

/** Dark inner section on ministry pages */
export const darkSectionClass = 'py-16 md:py-24 px-6'

export const pageHeading = 'text-3xl md:text-4xl font-bold text-[#0B0F12]'
export const pageSubheading = 'text-lg text-gray-600'
export const cardClass =
  'rounded-2xl bg-white ring-1 ring-gray-200 shadow-sm hover:shadow-md transition-shadow'
export const iconBoxClass =
  'inline-flex items-center justify-center w-12 h-12 rounded-xl bg-[#0f2d6e]/10 shrink-0'
export const btnPrimaryClass = 'bg-[#0B0F12] text-white hover:bg-[#0B0F12]/90 rounded-full'
export const btnOutlineClass = 'rounded-full border-gray-300'
