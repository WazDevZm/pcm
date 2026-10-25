'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { ArrowRight, Banknote, PackageCheck, Search, ShoppingBag, Smartphone, Truck, X } from 'lucide-react'
import { MinistryPageShell } from '@/components/layout/MinistryPageShell'
import { MinistryContent } from '@/components/layout/MinistryContent'
import { MerchProductCard } from '@/components/merch/MerchProductCard'
import { ProductArt } from '@/components/merch/ProductArt'
import { EmptyState, IconTile, SectionHeader } from '@/components/ui/haven'
import {
  MERCH_PRODUCTS,
  MERCH_CATEGORIES,
  MERCH_HERO_IMAGE,
  formatZmw,
  productArt,
  FREE_DELIVERY_THRESHOLD_ZMW,
  type MerchCategory,
  type MerchProduct,
} from '@/lib/merch-data'
import { cn } from '@/lib/utils'

type SortOption = 'featured' | 'price-asc' | 'price-desc' | 'name'

const PERKS = [
  { icon: Smartphone, label: 'Mobile Money' },
  { icon: Banknote, label: 'Cash on pickup' },
  { icon: Truck, label: `Free campus delivery over ${formatZmw(FREE_DELIVERY_THRESHOLD_ZMW)}` },
]

const STEPS = [
  { icon: ShoppingBag, title: 'Choose', text: 'Pick a size, colour and quantity on the product page.' },
  { icon: PackageCheck, title: 'Order', text: 'Check out with your details. Code PCM10 takes 10% off.' },
  { icon: Smartphone, title: 'Pay', text: 'Pay by Mobile Money or cash when you collect.' },
  { icon: Truck, title: 'Collect', text: 'We confirm your order, then you pick it up on campus.' },
]

function FeaturedCard({ product }: { product: MerchProduct }) {
  const art = productArt(product)
  return (
    <Link href={`/merch/${product.slug}`} className="group relative block overflow-hidden rounded-3xl">
      <div className="aspect-[4/3] transition-transform duration-500 group-hover:scale-[1.03]">
        <ProductArt kind={art.kind} color={art.color} rounded={false} />
      </div>
      <div className="absolute inset-x-3 bottom-3 flex items-center justify-between gap-3 rounded-2xl bg-white/90 px-4 py-3 backdrop-blur">
        <div className="min-w-0">
          <p className="truncate font-bold text-ink">{product.name}</p>
          <p className="text-sm font-semibold text-navy">{formatZmw(product.priceZmw)}</p>
        </div>
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-navy text-white transition-transform group-hover:translate-x-0.5">
          <ArrowRight className="h-4 w-4" />
        </span>
      </div>
    </Link>
  )
}

export function MerchStore() {
  const [category, setCategory] = useState<MerchCategory | 'all'>('all')
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState<SortOption>('featured')
  const [inStockOnly, setInStockOnly] = useState(false)

  const featured = MERCH_PRODUCTS.filter((p) => p.featured && p.inStock).slice(0, 3)
  const filtering = category !== 'all' || search.trim() !== '' || inStockOnly

  const filtered = useMemo(() => {
    let list: MerchProduct[] = [...MERCH_PRODUCTS]
    if (category !== 'all') list = list.filter((p) => p.category === category)
    if (inStockOnly) list = list.filter((p) => p.inStock)
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter((p) => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q) || p.category.includes(q))
    }
    switch (sort) {
      case 'price-asc':
        list.sort((a, b) => a.priceZmw - b.priceZmw)
        break
      case 'price-desc':
        list.sort((a, b) => b.priceZmw - a.priceZmw)
        break
      case 'name':
        list.sort((a, b) => a.name.localeCompare(b.name))
        break
      default:
        list.sort((a, b) => Number(Boolean(b.featured)) - Number(Boolean(a.featured)) || Number(b.inStock) - Number(a.inStock))
    }
    return list
  }, [category, search, sort, inStockOnly])

  const clear = () => {
    setSearch('')
    setCategory('all')
    setInStockOnly(false)
  }

  return (
    <MinistryPageShell
      heroImage={MERCH_HERO_IMAGE}
      eyebrow="PCM official store"
      title="Merch store"
      subtitle="Wear the message. Apparel, drinkware, stationery and gifts — priced in Kwacha and collected on campus."
      heroExtra={
        <div className="mt-7 flex flex-wrap gap-2">
          {PERKS.map(({ icon: Icon, label }) => (
            <span key={label} className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3.5 py-2 text-sm font-medium text-white backdrop-blur">
              <Icon className="h-4 w-4 text-gold" /> {label}
            </span>
          ))}
        </div>
      }
    >
      <MinistryContent>
        <div className="max-w-6xl mx-auto">
          {featured.length > 0 && !filtering && (
            <section className="mb-14">
              <SectionHeader eyebrow="Best sellers" title="Student favourites" className="!mb-6" />
              <div className="grid gap-4 sm:grid-cols-3">
                {featured.map((p) => (
                  <FeaturedCard key={p.id} product={p} />
                ))}
              </div>
            </section>
          )}

          {/* Toolbar */}
          <div className="sticky top-[4.5rem] z-30 -mx-5 sm:-mx-6 mb-8 bg-canvas/90 px-5 sm:px-6 py-4 backdrop-blur-lg">
            <div className="flex flex-col gap-3 md:flex-row md:items-center">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8a93a3]" />
                <input
                  type="search"
                  placeholder="Search merch…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="h-11 w-full rounded-full border border-border bg-white pl-11 pr-4 text-sm focus:border-navy focus:outline-none focus:ring-[3px] focus:ring-navy/15"
                />
              </div>
              <div className="flex gap-2">
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value as SortOption)}
                  className="h-11 min-w-[150px] rounded-full border border-border bg-white px-4 text-sm font-medium"
                  aria-label="Sort products"
                >
                  <option value="featured">Featured</option>
                  <option value="price-asc">Price: low to high</option>
                  <option value="price-desc">Price: high to low</option>
                  <option value="name">Name A–Z</option>
                </select>
                <button
                  type="button"
                  onClick={() => setInStockOnly((v) => !v)}
                  aria-pressed={inStockOnly}
                  className={cn(
                    'h-11 whitespace-nowrap rounded-full border px-4 text-sm font-semibold transition-colors',
                    inStockOnly ? 'border-navy bg-navy text-white' : 'border-border bg-white text-ink hover:border-navy/30'
                  )}
                >
                  In stock
                </button>
              </div>
            </div>
            <div className="mt-3 flex gap-2 overflow-x-auto pb-0.5">
              {MERCH_CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setCategory(cat.id)}
                  className={cn(
                    'shrink-0 rounded-full border px-4 py-2 text-sm font-semibold transition-colors',
                    category === cat.id ? 'border-navy bg-navy text-white' : 'border-border bg-white text-ink hover:border-navy/30'
                  )}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-5 flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              <b className="text-ink">{filtered.length}</b> {filtered.length === 1 ? 'item' : 'items'}
            </p>
            {filtering && (
              <button type="button" onClick={clear} className="inline-flex items-center gap-1 text-sm font-semibold text-navy hover:underline">
                <X className="h-4 w-4" /> Clear filters
              </button>
            )}
          </div>

          {filtered.length === 0 ? (
            <EmptyState
              icon={Search}
              title="Nothing matches"
              body="Try another word or category."
              action={
                <button type="button" onClick={clear} className="text-sm font-semibold text-navy hover:underline">
                  Clear filters
                </button>
              }
            />
          ) : (
            <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 lg:grid-cols-4 md:gap-x-6">
              {filtered.map((product) => (
                <MerchProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          <section className="mt-20 rounded-[2rem] bg-white border border-border p-6 md:p-10">
            <SectionHeader eyebrow="How it works" title="Order online, collect on campus" className="!mb-8" />
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {STEPS.map((s, i) => (
                <div key={s.title}>
                  <div className="flex items-center gap-3">
                    <IconTile icon={s.icon} />
                    <span className="font-serif text-2xl text-navy-soft">0{i + 1}</span>
                  </div>
                  <h3 className="mt-4 font-bold text-ink">{s.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{s.text}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </MinistryContent>
    </MinistryPageShell>
  )
}
