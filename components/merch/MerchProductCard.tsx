'use client'

import Link from 'next/link'
import { Check, Heart, Plus } from 'lucide-react'
import { useState } from 'react'
import type { MerchProduct } from '@/lib/merch-data'
import { formatZmw, productArt } from '@/lib/merch-data'
import { useMerchCart } from './MerchCartProvider'
import { ProductArt } from './ProductArt'
import { cn } from '@/lib/utils'

export function MerchProductCard({ product }: { product: MerchProduct }) {
  const { addItem, toggleWishlist, isInWishlist } = useMerchCart()
  const [added, setAdded] = useState(false)
  const wished = isInWishlist(product.id)
  const art = productArt(product)
  // Items with sizes or colours need the product page; the rest add straight to the cart
  const needsOptions = Boolean(product.sizes?.length || (product.colors?.length ?? 0) > 1)

  const quickAdd = () => {
    addItem({
      productId: product.id,
      productSlug: product.slug,
      productName: product.name,
      priceZmw: product.priceZmw,
      quantity: 1,
      color: product.colors?.[0],
      image: product.image,
    })
    setAdded(true)
    setTimeout(() => setAdded(false), 1800)
  }

  return (
    <article className="group relative flex flex-col">
      <Link href={`/merch/${product.slug}`} className="relative block aspect-square overflow-hidden rounded-2xl">
        <div className="h-full w-full transition-transform duration-500 group-hover:scale-[1.04]">
          <ProductArt kind={art.kind} color={art.color} rounded={false} />
        </div>
        {!product.inStock ? (
          <span className="absolute top-3 left-3 rounded-full bg-ink/85 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-white">Sold out</span>
        ) : product.badge ? (
          <span className="absolute top-3 left-3 rounded-full bg-gold px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-ink">{product.badge}</span>
        ) : null}
      </Link>

      <button
        type="button"
        onClick={() => toggleWishlist(product.id)}
        className={cn(
          'absolute top-3 right-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 shadow-sm backdrop-blur transition-colors',
          wished ? 'text-red-500' : 'text-muted-foreground hover:text-red-500'
        )}
        aria-label={wished ? 'Remove from wishlist' : 'Add to wishlist'}
      >
        <Heart className={cn('h-4 w-4', wished && 'fill-current')} />
      </button>

      <div className="flex flex-1 flex-col px-1 pt-4">
        <div className="flex items-start justify-between gap-3">
          <Link href={`/merch/${product.slug}`} className="min-w-0">
            <h3 className="font-bold text-ink leading-snug group-hover:text-navy transition-colors line-clamp-1">{product.name}</h3>
            <p className="mt-0.5 text-sm text-muted-foreground line-clamp-1">{product.description}</p>
          </Link>
        </div>

        <div className="mt-3 flex items-center justify-between gap-3">
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-extrabold text-ink">{formatZmw(product.priceZmw)}</span>
            {product.compareAtPriceZmw && (
              <span className="text-sm text-[#8a93a3] line-through">{formatZmw(product.compareAtPriceZmw)}</span>
            )}
          </div>
          {product.colors && product.colors.length > 1 && (
            <div className="flex -space-x-1" aria-label={`${product.colors.length} colours`}>
              {product.colors.map((c) => (
                <span key={c.id} title={c.name} className="h-4 w-4 rounded-full ring-2 ring-white border border-black/10" style={{ background: c.hex }} />
              ))}
            </div>
          )}
        </div>

        {product.inStock ? (
          needsOptions ? (
            <Link
              href={`/merch/${product.slug}`}
              className="mt-4 inline-flex h-10 items-center justify-center rounded-full border border-border bg-white text-sm font-semibold text-navy transition-colors hover:border-navy hover:bg-navy hover:text-white"
            >
              Choose options
            </Link>
          ) : (
            <button
              type="button"
              onClick={quickAdd}
              className={cn(
                'mt-4 inline-flex h-10 items-center justify-center gap-1.5 rounded-full text-sm font-semibold transition-colors',
                added ? 'bg-success-soft text-success' : 'bg-navy text-white hover:bg-navy-deep'
              )}
            >
              {added ? <Check className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
              {added ? 'Added' : 'Add to cart'}
            </button>
          )
        ) : (
          <span className="mt-4 inline-flex h-10 items-center justify-center rounded-full bg-muted text-sm font-semibold text-muted-foreground">Sold out</span>
        )}
      </div>
    </article>
  )
}
