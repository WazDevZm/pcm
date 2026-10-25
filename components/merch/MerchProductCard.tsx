'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Heart, ShoppingBag } from 'lucide-react'
import type { MerchProduct } from '@/lib/merch-data'
import { formatZmw } from '@/lib/merch-data'
import { useMerchCart } from './MerchCartProvider'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export function MerchProductCard({ product }: { product: MerchProduct }) {
  const { toggleWishlist, isInWishlist } = useMerchCart()
  const wished = isInWishlist(product.id)

  return (
    <article className="group flex flex-col rounded-2xl bg-white border border-border overflow-hidden shadow-sm hover:shadow-xl hover:ring-gray-300 transition-all duration-300">
      <Link href={`/merch/${product.slug}`} className="relative block aspect-square overflow-hidden bg-muted">
        {!product.inStock && (
          <span className="absolute top-3 left-3 z-10 text-xs font-semibold uppercase px-2.5 py-1 rounded-full bg-gray-900/80 text-white">
            Sold out
          </span>
        )}
        {product.badge && product.inStock && (
          <span className="absolute top-3 left-3 z-10 text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full bg-amber-500 text-black">
            {product.badge}
          </span>
        )}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault()
            toggleWishlist(product.id)
          }}
          className={cn(
            'absolute top-3 right-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 shadow-md transition-colors',
            wished ? 'text-red-500' : 'text-muted-foreground hover:text-red-500'
          )}
          aria-label={wished ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart className={cn('h-4 w-4', wished && 'fill-current')} />
        </button>
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
      </Link>

      <div className="flex flex-col flex-1 p-4 md:p-5">
        <Link href={`/merch/${product.slug}`} className="flex-1">
          <h3 className="font-semibold text-ink group-hover:text-navy transition-colors line-clamp-1">
            {product.name}
          </h3>
          <p className="text-sm text-muted-foreground mt-1 line-clamp-2 leading-relaxed">{product.description}</p>
        </Link>

        <div className="flex items-baseline gap-2 mt-3">
          <span className="text-lg font-bold text-ink">{formatZmw(product.priceZmw)}</span>
          {product.compareAtPriceZmw && (
            <span className="text-sm text-[#8a93a3] line-through">
              {formatZmw(product.compareAtPriceZmw)}
            </span>
          )}
        </div>

        <div className="flex gap-2 mt-4">
          <Button
            asChild
            variant="outline"
            size="sm"
            className="flex-1 rounded-lg border-border"
            disabled={!product.inStock}
          >
            <Link href={`/merch/${product.slug}`}>View</Link>
          </Button>
          <Button
            asChild
            size="sm"
            className="flex-1 rounded-lg bg-navy hover:bg-navy-deep text-white"
            disabled={!product.inStock}
          >
            {product.inStock ? (
              <Link href={`/merch/${product.slug}`}>
                <ShoppingBag className="w-4 h-4 mr-1" />
                Shop
              </Link>
            ) : (
              <span>Sold out</span>
            )}
          </Button>
        </div>
      </div>
    </article>
  )
}
