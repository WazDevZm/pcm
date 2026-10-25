'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Banknote, Check, Heart, Minus, Plus, ShoppingBag, Smartphone, Truck } from 'lucide-react'
import type { MerchProduct, MerchColor, MerchSize } from '@/lib/merch-data'
import { formatZmw, getRelatedProducts, productArt, FREE_DELIVERY_THRESHOLD_ZMW } from '@/lib/merch-data'
import { useMerchCart } from './MerchCartProvider'
import { MerchProductCard } from './MerchProductCard'
import { ProductArt } from './ProductArt'
import { SiteNav } from '@/components/layout/SiteNav'
import { HomeFooter } from '@/components/home/HomeFooter'
import { Button } from '@/components/ui/button'
import { SectionHeader } from '@/components/ui/haven'
import { cn } from '@/lib/utils'

export function MerchProductDetail({ product }: { product: MerchProduct }) {
  const { addItem, toggleWishlist, isInWishlist } = useMerchCart()
  const [size, setSize] = useState<MerchSize>(product.sizes?.[0] ?? 'One Size')
  const [color, setColor] = useState<MerchColor | undefined>(product.colors?.[0])
  const [quantity, setQuantity] = useState(1)
  const [added, setAdded] = useState(false)

  const sizes = product.sizes
  const colors = product.colors
  const related = getRelatedProducts(product)
  const wished = isInWishlist(product.id)
  const art = productArt(product, color?.hex)

  const handleAddToCart = () => {
    if (!product.inStock) return
    addItem({
      productId: product.id,
      productSlug: product.slug,
      productName: product.name,
      priceZmw: product.priceZmw,
      quantity,
      size: sizes ? size : undefined,
      color: colors ? color : undefined,
      image: product.image,
    })
    setAdded(true)
    setTimeout(() => setAdded(false), 2500)
  }

  return (
    <div className="min-h-screen bg-canvas text-ink">
      <div className="bg-navy-deep">
        <SiteNav />
      </div>

      <main className="max-w-6xl mx-auto px-5 sm:px-6 py-8 md:py-12">
        <Link href="/merch" className="inline-flex items-center gap-1.5 text-sm font-semibold text-navy hover:text-navy-deep mb-6">
          <ArrowLeft className="h-4 w-4" /> Merch store
        </Link>

        <div className="grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-14">
          {/* Gallery */}
          <div>
            <div className="relative aspect-square overflow-hidden rounded-[2rem]">
              <ProductArt kind={art.kind} color={art.color} rounded={false} />
              {!product.inStock && (
                <span className="absolute top-5 left-5 rounded-full bg-ink/85 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-white">Sold out</span>
              )}
              {product.badge && product.inStock && (
                <span className="absolute top-5 left-5 rounded-full bg-gold px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-ink">{product.badge}</span>
              )}
            </div>
            {colors && colors.length > 1 && (
              <div className="mt-4 grid grid-cols-4 gap-3 sm:grid-cols-5">
                {colors.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setColor(c)}
                    aria-label={`Show in ${c.name}`}
                    className={cn('aspect-square overflow-hidden rounded-2xl ring-2 ring-offset-2 ring-offset-canvas transition', color?.id === c.id ? 'ring-navy' : 'ring-transparent opacity-80 hover:opacity-100')}
                  >
                    <ProductArt kind={art.kind} color={c.hex} rounded={false} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div className="lg:pt-2">
            <p className="eyebrow text-navy capitalize">{product.category}</p>
            <h1 className="mt-2 text-4xl md:text-5xl leading-[1.05] text-ink">{product.name}</h1>
            <div className="mt-4 flex items-baseline gap-3">
              <span className="text-3xl font-extrabold">{formatZmw(product.priceZmw)}</span>
              {product.compareAtPriceZmw && (
                <>
                  <span className="text-lg text-[#8a93a3] line-through">{formatZmw(product.compareAtPriceZmw)}</span>
                  <span className="rounded-full bg-success-soft px-2.5 py-0.5 text-xs font-bold text-success">
                    Save {formatZmw(product.compareAtPriceZmw - product.priceZmw)}
                  </span>
                </>
              )}
            </div>
            <p className="mt-5 leading-relaxed text-muted-foreground">{product.longDescription ?? product.description}</p>

            {colors && colors.length > 0 && (
              <div className="mt-8">
                <p className="mb-3 text-sm font-bold text-ink">
                  Colour <span className="ml-1 font-normal text-muted-foreground">{color?.name}</span>
                </p>
                <div className="flex flex-wrap gap-3">
                  {colors.map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      title={c.name}
                      onClick={() => setColor(c)}
                      disabled={!product.inStock}
                      className={cn('h-10 w-10 rounded-full border border-black/10 ring-2 ring-offset-2 ring-offset-canvas transition', color?.id === c.id ? 'ring-navy' : 'ring-transparent hover:ring-border')}
                      style={{ backgroundColor: c.hex }}
                    />
                  ))}
                </div>
              </div>
            )}

            {sizes && sizes.length > 0 && (
              <div className="mt-7">
                <p className="mb-3 text-sm font-bold text-ink">
                  Size <span className="ml-1 font-normal text-muted-foreground">{size}</span>
                </p>
                <div className="flex flex-wrap gap-2">
                  {sizes.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setSize(s)}
                      disabled={!product.inStock}
                      className={cn(
                        'h-11 min-w-[3.25rem] rounded-full border px-4 text-sm font-semibold transition-colors',
                        size === s ? 'border-navy bg-navy text-white' : 'border-border bg-white text-ink hover:border-navy/40'
                      )}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <div className="inline-flex h-12 items-center rounded-full border border-border bg-white">
                <button type="button" onClick={() => setQuantity((q) => Math.max(1, q - 1))} className="flex h-12 w-12 items-center justify-center rounded-l-full hover:bg-canvas" aria-label="Decrease quantity">
                  <Minus className="h-4 w-4" />
                </button>
                <span className="w-8 text-center font-bold" aria-live="polite">{quantity}</span>
                <button type="button" onClick={() => setQuantity((q) => q + 1)} className="flex h-12 w-12 items-center justify-center rounded-r-full hover:bg-canvas" aria-label="Increase quantity">
                  <Plus className="h-4 w-4" />
                </button>
              </div>
              <Button size="lg" disabled={!product.inStock} onClick={handleAddToCart} className={cn('flex-1 min-w-[220px]', added && 'bg-success hover:bg-success')}>
                {added ? <Check /> : <ShoppingBag />}
                {!product.inStock ? 'Sold out' : added ? 'Added to cart' : `Add to cart · ${formatZmw(product.priceZmw * quantity)}`}
              </Button>
              <Button size="icon" variant="outline" onClick={() => toggleWishlist(product.id)} className="h-12 w-12" aria-label={wished ? 'Remove from wishlist' : 'Save to wishlist'}>
                <Heart className={cn('h-5 w-5', wished && 'fill-red-500 text-red-500')} />
              </Button>
            </div>

            <ul className="mt-8 divide-y divide-border rounded-2xl border border-border bg-white text-sm">
              <li className="flex items-center gap-3 px-4 py-3"><Truck className="h-4 w-4 text-navy" /> Free campus delivery on orders over {formatZmw(FREE_DELIVERY_THRESHOLD_ZMW)}</li>
              <li className="flex items-center gap-3 px-4 py-3"><Smartphone className="h-4 w-4 text-navy" /> Pay with Mobile Money</li>
              <li className="flex items-center gap-3 px-4 py-3"><Banknote className="h-4 w-4 text-navy" /> Or pay cash when you collect</li>
            </ul>
          </div>
        </div>

        {related.length > 0 && (
          <section className="mt-20">
            <SectionHeader eyebrow="More from the store" title="You may also like" action={{ label: 'All merch', href: '/merch' }} className="!mb-8" />
            <div className="grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-4 md:gap-x-6">
              {related.map((p) => (
                <MerchProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}
      </main>
      <HomeFooter />
    </div>
  )
}
