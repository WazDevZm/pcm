/** The Haven — single source of truth for brand copy */
export const BRAND = {
  name: 'The Haven',
  tagline: 'A place to belong',
  description:
    'A ministry of CBU PCM, The Copperbelt University Public Campus Ministries — a shelter for worship, Bible study, fellowship and service.',
  /** Parent organisation — shown with the PCM shield (assets/images/pcm-shield.png) */
  ministry: 'The Copperbelt University Public Campus Ministries',
  /** Short form for anything people see — the full name is too long next to other text */
  ministryShort: 'CBU PCM',
  location: 'Copperbelt University · Kitwe, Zambia',
  email: 'hello@thehaven.org',
} as const;

/** The website shares this app's Supabase backend; unset until it's deployed */
const webUrl = process.env.EXPO_PUBLIC_WEB_URL ?? '';
export const WEB_URL = webUrl && !webUrl.includes('your-site') ? webUrl : null;
