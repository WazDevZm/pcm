/** The Haven — single source of truth for brand copy */
export const BRAND = {
  name: 'The Haven',
  shortName: 'Haven',
  tagline: 'A place to belong',
  description:
    'The Haven is a home for worship, Bible study, fellowship and service at the Copperbelt University — The Copperbelt University SDA Public Campus Ministries (CBU SDA PCM).',
  /** Parent organisation — shown with the PCM shield (public/pcm-shield.png) */
  ministry: 'The Copperbelt University SDA Public Campus Ministries',
  /** Short form for anything people see — the full name is too long next to other text */
  ministryShort: 'CBU SDA PCM',
  location: 'Copperbelt University · Kitwe, Zambia',
  email: 'hello@thehaven.org',
} as const

/** Brand palette (matches lib/site-theme.ts) */
export const BRAND_COLORS = {
  navy: '#0f2d6e',
  navyDeep: '#0a1f4d',
  dark: '#0B0F12',
  light: '#fafbfc',
  gold: '#d9a441',
} as const

/** Leadership offices (public.users.office) */
export const OFFICE_LABEL: Record<string, string> = {
  developer: 'Developer',
  chairperson: 'PCM Chairperson',
  vice_chairperson: 'PCM Vice Chairperson',
}
