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
  '/KCM_0549.jpg',
] as const

export function ministryImage(index: number): string {
  return MINISTRY_IMAGES[index % MINISTRY_IMAGES.length]
}
