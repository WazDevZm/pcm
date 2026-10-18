import type { ImageSource } from 'expo-image';

/** Local ministry photography bundled with the app */
const PHOTOS = {
  kcm_0549: require('@/assets/images/photos/kcm_0549.jpg'),
  kcm_0669: require('@/assets/images/photos/kcm_0669.jpg'),
  kcm_0681: require('@/assets/images/photos/kcm_0681.jpg'),
  kcm_0729: require('@/assets/images/photos/kcm_0729.jpg'),
  kcm_0741: require('@/assets/images/photos/kcm_0741.jpg'),
  kcm_0799: require('@/assets/images/photos/kcm_0799.jpg'),
  kcm_0822: require('@/assets/images/photos/kcm_0822.jpg'),
} as const;

export type PhotoKey = keyof typeof PHOTOS;

const ORDER: PhotoKey[] = ['kcm_0549', 'kcm_0669', 'kcm_0681', 'kcm_0799', 'kcm_0822', 'kcm_0729', 'kcm_0741'];

/** The big hero image (kept from the original site) followed by the rotation */
export const HERO_IMAGES = [PHOTOS.kcm_0549, PHOTOS.kcm_0799, PHOTOS.kcm_0822];

export function photo(key: PhotoKey) {
  return PHOTOS[key];
}

/** Stable photo for an index — used for cards without their own image */
export function ministryImage(index: number) {
  return PHOTOS[ORDER[Math.abs(index) % ORDER.length]];
}

/**
 * Resolve an image reference from data or the database:
 * - `local:kcm_0549` → bundled photo
 * - http(s) URL → remote image
 * - anything else / empty → fallback photo
 */
export function resolveImage(src: string | number | null | undefined, fallbackIndex = 0): ImageSource | number {
  if (typeof src === 'number') return src;
  if (src && src.startsWith('local:')) {
    const key = src.slice(6) as PhotoKey;
    if (key in PHOTOS) return PHOTOS[key];
  }
  if (src && /^https?:\/\//.test(src)) return { uri: src };
  return ministryImage(fallbackIndex);
}
