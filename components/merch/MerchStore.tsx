'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Search, SlidersHorizontal, Truck, Smartphone, Banknote } from 'lucide-react'
import { SiteNav } from '@/components/layout/SiteNav'
import { MerchProductCard } from '@/components/merch/MerchProductCard'
import {
  MERCH_PRODUCTS,
  MERCH_CATEGORIES,
  MERCH_HERO_IMAGE,
  formatZmw,
  FREE_DELIVERY_THRESHOLD_ZMW,
  type MerchCategory,
  type MerchProduct,
} from '@/lib/merch-data'
import { cn } from '@/lib/utils'

type SortOption = 'featured' | 'price-asc' | 'price-desc' | 'name'

export function MerchStore() {
  const [category, setCategory] = useState<MerchCategory | 'all'>('all')
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState<SortOption>('featured')
  const [inStockOnly, setInStockOnly] = useState(false)

  const featured = MERCH_PRODUCTS.filter((p) => p.featured && p.inStock).slice(0, 4)

  const filtered = useMemo(() => {
    let list: MerchProduct[] = [...MERCH_PRODUCTS]

    if (category !== 'all') list = list.filter((p) => p.category === category)
    if (inStockOnly) list = list.filter((p) => p.inStock)
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.category.includes(q)
      )
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
        list.sort((a, b) => {
          if (a.featured && !b.featured) return -1
          if (!a.featured && b.featured) return 1
          return 0
        })
    }
    return list
  }, [category, search, sort, inStockOnly])

  return (
    <div className="min-h-screen bg-[#f4f5f7] text-[#0B0F12]">
      <header className="relative min-h-[min(520px,70vh)] border-b border-white/10 text-white isolate">
        <div className="absolute inset-0 -z-10 pointer-events-none overflow-hidden">
          <Image
            src={MERCH_HERO_IMAGE}
            alt=""
            fill
            priority
            className="object-cover object-center"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0B0F12]/95 via-[#0B0F12]/75 to-[#0B0F12]/55" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F12] via-transparent to-[#0B0F12]/40" />
          <div className="absolute inset-0 bg-[url('/merch/pattern.svg')] opacity-[0.08]" aria-hidden />
        </div>

        <div className="relative z-20">
          <SiteNav />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-14 md:pb-20 pt-2 md:pt-4">
            <div className="max-w-2xl">
              <p className="text-sky-300 text-sm font-semibold uppercase tracking-wider mb-3">
                PCM Official Store
              </p>
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4 text-balance">
                Ministry Merch Shop
              </h1>
              <p className="text-lg text-white/80 leading-relaxed max-w-xl text-pretty">
                Apparel, drinkware, stationery, bags, and gifts — all priced in{' '}
                <strong className="text-white font-semibold">Zambian Kwacha</strong>. Free campus
                delivery on orders over {formatZmw(FREE_DELIVERY_THRESHOLD_ZMW)}.
              </p>
              <div className="flex flex-wrap gap-3 mt-8">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 ring-1 ring-white/15 text-sm text-white/90 backdrop-blur-sm">
                  <Smartphone className="w-4 h-4 text-sky-300 shrink-0" />
                  Mobile Money
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 ring-1 ring-white/15 text-sm text-white/90 backdrop-blur-sm">
                  <Banknote className="w-4 h-4 text-sky-300 shrink-0" />
                  Cash on pickup
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 ring-1 ring-white/15 text-sm text-white/90 backdrop-blur-sm">
                  <Truck className="w-4 h-4 text-sky-300 shrink-0" />
                  CBU delivery
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {featured.length > 0 && (
        <section className="relative z-20 -mt-10 max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {featured.map((p) => (
              <Link
                key={p.id}
                href={`/merch/${p.slug}`}
                className="relative aspect-[4/3] rounded-xl overflow-hidden ring-1 ring-gray-200 shadow-lg bg-white group"
              >
                <Image
                  src={p.image}
                  alt={p.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F12]/80 via-[#0B0F12]/20 to-transparent" />
                <span className="absolute bottom-3 left-3 right-3 text-sm font-semibold text-white truncate">
                  {p.name}
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}

      <div
        className={cn(
          'sticky top-16 z-30 bg-[#f4f5f7]/95 backdrop-blur-lg border-b border-gray-200',
          featured.length > 0 && 'mt-8'
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 space-y-4">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="search"
                placeholder="Search products..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full h-11 pl-10 pr-4 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#0f2d6e]/20 focus:border-[#0f2d6e]"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as SortOption)}
                className="h-11 px-3 rounded-xl border border-gray-200 bg-white text-sm min-w-[140px]"
                aria-label="Sort products"
              >
                <option value="featured">Featured</option>
                <option value="price-asc">Price: low to high</option>
                <option value="price-desc">Price: high to low</option>
                <option value="name">Name A–Z</option>
              </select>
              <label className="flex items-center gap-2 h-11 px-3 rounded-xl border border-gray-200 bg-white text-sm cursor-pointer whitespace-nowrap">
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                  className="rounded border-gray-300"
                />
                In stock
              </label>
            </div>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {MERCH_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setCategory(cat.id)}
                className={cn(
                  'shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors',
                  category === cat.id
                    ? 'bg-[#0B0F12] text-white'
                    : 'bg-white text-gray-600 ring-1 ring-gray-200 hover:bg-gray-50'
                )}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-gray-600">
            <SlidersHorizontal className="w-4 h-4 inline mr-1.5 -mt-0.5" />
            {filtered.length} product{filtered.length !== 1 ? 's' : ''}
          </p>
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-20 rounded-2xl bg-white ring-1 ring-gray-200">
            <p className="text-gray-600 mb-4">No products match your filters.</p>
            <button
              type="button"
              onClick={() => {
                setSearch('')
                setCategory('all')
                setInStockOnly(false)
              }}
              className="text-[#0f2d6e] font-medium hover:underline"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 md:gap-6">
            {filtered.map((product) => (
              <MerchProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </main>

      <section className="bg-white border-t border-gray-200 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl font-bold text-center mb-10">How checkout works</h2>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { step: '1', title: 'Browse & customize', text: 'Pick size, colour, and quantity on each product page.' },
              { step: '2', title: 'Cart & promo', text: 'Review your cart. Try code PCM10 for 10% off.' },
              { step: '3', title: 'Checkout', text: 'Enter details and choose Mobile Money or cash on collection.' },
              { step: '4', title: 'Pickup', text: 'Receive your order ID. Collect on campus after confirmation.' },
            ].map((item) => (
              <div key={item.step} className="text-center p-6 rounded-2xl bg-[#f4f5f7]">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#0f2d6e]/10 text-[#0f2d6e] font-bold text-sm mb-3">
                  {item.step}
                </span>
                <h3 className="font-semibold mb-2">{item.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
