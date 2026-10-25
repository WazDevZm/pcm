/** Local ministry photography — hero slider & page imagery */

export const HERO_SLIDER_IMAGES = [
  '/Slider/KCM_0549.jpg',
  '/Slider/KCM_0799.jpg',
  '/Slider/KCM_0822.jpg',
] as const

export const MINISTRY_IMAGES = [
  '/Slider/KCM_0549.jpg',
  '/Slider/KCM_0669.jpg',
  '/Slider/KCM_0681.jpg',
  '/Slider/KCM_0799.jpg',
  '/Slider/KCM_0822.jpg',
  '/Features/KCM_0729.jpg',
  '/Features/KCM_0741.jpg',
] as const

export function ministryImage(index: number): string {
  return MINISTRY_IMAGES[index % MINISTRY_IMAGES.length]
}

const LOCAL_PHOTOS: Record<string, string> = {
  kcm_0549: '/Slider/KCM_0549.jpg',
  kcm_0669: '/Slider/KCM_0669.jpg',
  kcm_0681: '/Slider/KCM_0681.jpg',
  kcm_0729: '/Features/KCM_0729.jpg',
  kcm_0741: '/Features/KCM_0741.jpg',
  kcm_0799: '/Slider/KCM_0799.jpg',
  kcm_0822: '/Slider/KCM_0822.jpg',
}

/**
 * Resolve an image reference the same way the app does (mobile/src/data/images.ts):
 * `local:kcm_0549` → bundled photo, http(s) URL → as is, a local photo path → as is,
 * anything else (empty, placeholder SVG artwork) → a stable ministry photo.
 */
export function resolveImage(src: string | null | undefined, fallbackIndex = 0): string {
  if (src?.startsWith('local:') && LOCAL_PHOTOS[src.slice(6)]) return LOCAL_PHOTOS[src.slice(6)]
  if (src && /^https?:\/\//.test(src)) return src
  if (src?.startsWith('/') && !src.endsWith('.svg')) return src
  return ministryImage(fallbackIndex)
}
