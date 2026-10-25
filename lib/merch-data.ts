import { ministryImage } from './site-images'
import type { ArtKind } from '@/components/merch/ProductArt'

export type MerchCategory =
  | 'apparel'
  | 'drinkware'
  | 'stationery'
  | 'accessories'
  | 'bags'
  | 'gifts'

export type MerchSize = 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL' | 'One Size'

export type MerchColor = {
  id: string
  name: string
  hex: string
}

export type MerchProduct = {
  id: string
  slug: string
  name: string
  description: string
  longDescription?: string
  category: MerchCategory
  priceZmw: number
  compareAtPriceZmw?: number
  image: string
  images?: string[]
  sizes?: MerchSize[]
  colors?: MerchColor[]
  badge?: string
  inStock: boolean
  featured?: boolean
}

export const APPAREL_SIZES: MerchSize[] = ['XS', 'S', 'M', 'L', 'XL', 'XXL']

export const APPAREL_COLORS: MerchColor[] = [
  { id: 'navy', name: 'Navy Blue', hex: '#0f2d6e' },
  { id: 'white', name: 'White', hex: '#f8fafc' },
  { id: 'black', name: 'Black', hex: '#0B0F12' },
  { id: 'maroon', name: 'Maroon', hex: '#7f1d1d' },
]

/** Store hero — local ministry photography (no external CDN) */
export const MERCH_HERO_IMAGE = '/Slider/KCM_0799.jpg'

export const MERCH_PRODUCTS: MerchProduct[] = [
  {
    id: 'pcm-tee-classic',
    slug: 'pcm-classic-tee',
    name: 'PCM Classic T-Shirt',
    description: 'Soft cotton tee with embroidered PCM logo. Everyday campus wear.',
    longDescription:
      'Our best-selling ministry tee is made from breathable cotton with a durable PCM logo print. Perfect for Sabbath, Bible study, and casual campus days. Machine washable.',
    category: 'apparel',
    priceZmw: 250,
    compareAtPriceZmw: 300,
    image: ministryImage(0),
    images: [ministryImage(0), ministryImage(1), ministryImage(2)],
    sizes: APPAREL_SIZES,
    colors: APPAREL_COLORS,
    badge: 'Best seller',
    inStock: true,
    featured: true,
  },
  {
    id: 'pcm-hoodie',
    slug: 'pcm-hoodie',
    name: 'PCM Hoodie',
    description: 'Fleece-lined hoodie with front logo and kangaroo pocket.',
    longDescription:
      'Stay warm on cool Kitwe evenings with our premium hoodie. Features ribbed cuffs, adjustable drawstring, and bold PCM branding.',
    category: 'apparel',
    priceZmw: 450,
    image: ministryImage(3),
    images: [ministryImage(3), ministryImage(4)],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: [
      { id: 'navy', name: 'Navy', hex: '#0f2d6e' },
      { id: 'black', name: 'Black', hex: '#0B0F12' },
    ],
    inStock: true,
    featured: true,
  },
  {
    id: 'pcm-polo',
    slug: 'pcm-polo-shirt',
    name: 'PCM Polo Shirt',
    description: 'Smart polo for outreach events and formal ministry occasions.',
    category: 'apparel',
    priceZmw: 320,
    image: ministryImage(5),
    sizes: APPAREL_SIZES,
    colors: [
      { id: 'navy', name: 'Navy', hex: '#0f2d6e' },
      { id: 'white', name: 'White', hex: '#f8fafc' },
    ],
    inStock: true,
  },
  {
    id: 'pcm-cap',
    slug: 'pcm-cap',
    name: 'PCM Embroidered Cap',
    description: 'Adjustable cap with embroidered logo. One size.',
    category: 'apparel',
    priceZmw: 180,
    image: ministryImage(6),
    sizes: ['One Size'],
    colors: [
      { id: 'navy', name: 'Navy', hex: '#0f2d6e' },
      { id: 'black', name: 'Black', hex: '#0B0F12' },
    ],
    inStock: true,
  },
  {
    id: 'pcm-sweatshirt',
    slug: 'pcm-crew-sweatshirt',
    name: 'PCM Crew Sweatshirt',
    description: 'Mid-weight crew neck sweatshirt for cool season ministry.',
    category: 'apparel',
    priceZmw: 380,
    image: ministryImage(7),
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    inStock: true,
  },
  {
    id: 'water-bottle',
    slug: 'branded-water-bottle',
    name: 'Insulated Water Bottle',
    description: '750ml stainless bottle with PCM logo. Keeps drinks cold for hours.',
    category: 'drinkware',
    priceZmw: 145,
    image: ministryImage(0),
    images: [ministryImage(0), ministryImage(1)],
    inStock: true,
    featured: true,
  },
  {
    id: 'travel-mug',
    slug: 'pcm-travel-mug',
    name: 'PCM Travel Mug',
    description: 'Ceramic-lined travel mug with spill-resistant lid.',
    category: 'drinkware',
    priceZmw: 165,
    image: ministryImage(2),
    inStock: true,
  },
  {
    id: 'tote-bag',
    slug: 'canvas-tote-bag',
    name: 'Canvas Tote Bag',
    description: 'Heavy-duty tote for books, Bibles, and outreach materials.',
    category: 'bags',
    priceZmw: 150,
    image: ministryImage(4),
    inStock: true,
    featured: true,
  },
  {
    id: 'drawstring-bag',
    slug: 'drawstring-gym-bag',
    name: 'Drawstring Sport Bag',
    description: 'Lightweight bag for events, sports ministry, and giveaways.',
    category: 'bags',
    priceZmw: 95,
    image: ministryImage(5),
    inStock: true,
  },
  {
    id: 'pen-set',
    slug: 'branded-pen-set',
    name: 'Branded Pen Set (3-pack)',
    description: 'Smooth-writing ballpoints with PCM logo barrel.',
    category: 'stationery',
    priceZmw: 45,
    image: ministryImage(6),
    inStock: true,
  },
  {
    id: 'notebook',
    slug: 'ministry-notebook',
    name: 'Ministry Notebook A5',
    description: 'Lined 160-page notebook with matte PCM cover.',
    category: 'stationery',
    priceZmw: 85,
    image: ministryImage(7),
    inStock: true,
  },
  {
    id: 'journal',
    slug: 'prayer-journal',
    name: 'Prayer & Study Journal',
    description: 'Guided sections for prayers, sermon notes, and reflections.',
    category: 'stationery',
    priceZmw: 120,
    image: ministryImage(0),
    inStock: true,
  },
  {
    id: 'sticker-pack',
    slug: 'sticker-pack',
    name: 'PCM Sticker Pack',
    description: '12 vinyl stickers — logos, verses, and campus ministry themes.',
    category: 'gifts',
    priceZmw: 35,
    image: ministryImage(1),
    sizes: ['One Size'],
    inStock: true,
  },
  {
    id: 'wristband',
    slug: 'silicone-wristbands',
    name: 'Silicone Wristbands (5-pack)',
    description: 'Embossed PCM motto wristbands for outreach tables.',
    category: 'accessories',
    priceZmw: 40,
    image: ministryImage(2),
    inStock: true,
  },
  {
    id: 'lanyard',
    slug: 'pcm-lanyard',
    name: 'PCM Lanyard + Card Holder',
    description: 'Breakaway lanyard with clear ID pouch. Event staff essential.',
    category: 'accessories',
    priceZmw: 55,
    image: ministryImage(3),
    inStock: true,
  },
  {
    id: 'pin-badge',
    slug: 'enamel-pin-badge',
    name: 'Enamel Pin Badge',
    description: 'Collectible enamel pin with PCM crest design.',
    category: 'gifts',
    priceZmw: 65,
    image: ministryImage(4),
    inStock: true,
  },
  {
    id: 'scarf',
    slug: 'ministry-scarf',
    name: 'Ministry Scarf',
    description: 'Soft woven scarf with subtle PCM stripe. Limited winter stock.',
    category: 'apparel',
    priceZmw: 220,
    compareAtPriceZmw: 280,
    image: ministryImage(5),
    sizes: ['One Size'],
    inStock: true,
  },
  {
    id: 'usb-drive',
    slug: 'branded-usb-drive',
    name: 'Branded USB Drive (32GB)',
    description: 'Pre-loaded with PCM resources, sermons folder, and event media kit.',
    category: 'gifts',
    priceZmw: 175,
    image: ministryImage(6),
    inStock: false,
  },
]

export const MERCH_CATEGORIES: { id: MerchCategory | 'all'; label: string }[] = [
  { id: 'all', label: 'All products' },
  { id: 'apparel', label: 'Apparel' },
  { id: 'drinkware', label: 'Drinkware' },
  { id: 'bags', label: 'Bags' },
  { id: 'stationery', label: 'Stationery' },
  { id: 'accessories', label: 'Accessories' },
  { id: 'gifts', label: 'Gifts' },
]

export const DELIVERY_FEE_ZMW = 50
export const FREE_DELIVERY_THRESHOLD_ZMW = 500

export function formatZmw(amount: number): string {
  return `K${Math.round(amount).toLocaleString('en-ZM')}`
}

export function getProductById(id: string): MerchProduct | undefined {
  return MERCH_PRODUCTS.find((p) => p.id === id)
}

/** Illustration kind and default colour for each product (components/merch/ProductArt) */
const PRODUCT_ART: Record<string, { kind: ArtKind; color: string }> = {
  'pcm-classic-tee': { kind: 'tee', color: '#0f2d6e' },
  'pcm-hoodie': { kind: 'hoodie', color: '#0f2d6e' },
  'pcm-polo-shirt': { kind: 'polo', color: '#0f2d6e' },
  'pcm-cap': { kind: 'cap', color: '#0f2d6e' },
  'pcm-crew-sweatshirt': { kind: 'sweatshirt', color: '#5b6472' },
  'branded-water-bottle': { kind: 'bottle', color: '#0f2d6e' },
  'pcm-travel-mug': { kind: 'mug', color: '#0B0F12' },
  'canvas-tote-bag': { kind: 'tote', color: '#e9dcc3' },
  'drawstring-gym-bag': { kind: 'drawstring', color: '#0B0F12' },
  'branded-pen-set': { kind: 'pens', color: '#0f2d6e' },
  'ministry-notebook': { kind: 'notebook', color: '#0f2d6e' },
  'prayer-journal': { kind: 'journal', color: '#7f1d1d' },
  'sticker-pack': { kind: 'stickers', color: '#0f2d6e' },
  'silicone-wristbands': { kind: 'wristbands', color: '#ffffff' },
  'pcm-lanyard': { kind: 'lanyard', color: '#0f2d6e' },
  'enamel-pin-badge': { kind: 'pin', color: '#0f2d6e' },
  'ministry-scarf': { kind: 'scarf', color: '#7f1d1d' },
  'branded-usb-drive': { kind: 'usb', color: '#0f2d6e' },
}

/** Illustration for a product, in the chosen colour when there is one */
export function productArt(product: Pick<MerchProduct, 'slug' | 'colors'>, colorHex?: string) {
  const art = PRODUCT_ART[product.slug] ?? { kind: 'tee' as ArtKind, color: '#0f2d6e' }
  return { kind: art.kind, color: colorHex ?? product.colors?.[0]?.hex ?? art.color }
}

export function getProductBySlug(slug: string): MerchProduct | undefined {
  return MERCH_PRODUCTS.find((p) => p.slug === slug)
}

export function getRelatedProducts(product: MerchProduct, limit = 4): MerchProduct[] {
  return MERCH_PRODUCTS.filter(
    (p) => p.category === product.category && p.id !== product.id && p.inStock
  ).slice(0, limit)
}

export function generateOrderId(): string {
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, '')
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase()
  return `PCM-${date}-${rand}`
}
