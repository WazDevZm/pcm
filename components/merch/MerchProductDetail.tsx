'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, Check, Heart, Minus, Plus, ShoppingBag, Truck } from 'lucide-react'
import type { MerchProduct, MerchColor, MerchSize } from '@/lib/merch-data'
import {
  formatZmw,
  getRelatedProducts,
  FREE_DELIVERY_THRESHOLD_ZMW,
} from '@/lib/merch-data'
import { useMerchCart } from './MerchCartProvider'
import { MerchProductCard } from './MerchProductCard'
import { SiteNav } from '@/components/layout/SiteNav'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export function MerchProductDetail({ product }: { product: MerchProduct }) {
  const { addItem, toggleWishlist, isInWishlist } = useMerchCart()
  const images = product.images?.length ? product.images : [product.image]
  const [activeImage, setActiveImage] = useState(0)
  const [size, setSize] = useState<MerchSize>(product.sizes?.[0] ?? 'One Size')
  const [color, setColor] = useState<MerchColor | undefined>(product.colors?.[0])
  const [quantity, setQuantity] = useState(1)
  const [added, setAdded] = useState(false)

  const sizes = product.sizes
  const colors = product.colors
  const related = getRelatedProducts(product)
  const wished = isInWishlist(product.id)

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
    <div className="min-h-screen bg-[#f4f5f7]">
      <div className="bg-[#0B0F12] text-white">
        <SiteNav />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <nav className="flex items-center gap-2 text-sm text-gray-600 mb-6">
          <Link href="/merch" className="flex items-center gap-1 hover:text-[#0f2d6e]">
            <ArrowLeft className="w-4 h-4" />
            Store
          </Link>
          <span>/</span>
          <span className="text-gray-900 font-medium truncate">{product.name}</span>
        </nav>

        <div className="grid lg:grid-cols-2 gap-10 lg:gap-14">
          <div className="space-y-4">
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-white ring-1 ring-gray-200">
              <Image
                src={images[activeImage]}
                alt={product.name}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              {!product.inStock && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <span className="text-white font-semibold text-lg px-4 py-2 rounded-full bg-gray-900">
                    Sold out
                  </span>
                </div>
              )}
            </div>
            {images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-1">
                {images.map((src, i) => (
                  <button
                    key={src}
                    type="button"
                    onClick={() => setActiveImage(i)}
                    className={cn(
                      'relative shrink-0 w-20 h-20 rounded-lg overflow-hidden ring-2 transition-all',
                      activeImage === i ? 'ring-[#0f2d6e]' : 'ring-gray-200 opacity-70 hover:opacity-100'
                    )}
                  >
                    <Image src={src} alt="" fill className="object-cover" sizes="80px" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="lg:py-4">
            {product.badge && (
              <span className="inline-block text-xs font-semibold uppercase tracking-wider text-amber-700 bg-amber-100 px-2.5 py-1 rounded-full mb-3">
                {product.badge}
              </span>
            )}
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">{product.name}</h1>

            <div className="flex items-baseline gap-3 mt-4">
              <span className="text-3xl font-bold">{formatZmw(product.priceZmw)}</span>
              {product.compareAtPriceZmw && (
                <span className="text-xl text-gray-400 line-through">
                  {formatZmw(product.compareAtPriceZmw)}
                </span>
              )}
            </div>

            <p className="mt-4 text-gray-600 leading-relaxed">
              {product.longDescription ?? product.description}
            </p>

            <p className="mt-3 flex items-center gap-2 text-sm text-emerald-700">
              <Truck className="w-4 h-4" />
              Free delivery on orders over {formatZmw(FREE_DELIVERY_THRESHOLD_ZMW)}
            </p>

            {sizes && sizes.length > 0 && (
              <div className="mt-8">
                <p className="text-sm font-medium text-gray-900 mb-3">
                  Size: <span className="text-gray-600 font-normal">{size}</span>
                </p>
                <div className="flex flex-wrap gap-2">
                  {sizes.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setSize(s)}
                      disabled={!product.inStock}
                      className={cn(
                        'min-w-[3rem] h-11 px-3 rounded-lg text-sm font-medium border transition-colors',
                        size === s
                          ? 'border-[#0B0F12] bg-[#0B0F12] text-white'
                          : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                      )}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {colors && colors.length > 0 && (
              <div className="mt-6">
                <p className="text-sm font-medium text-gray-900 mb-3">
                  Colour: <span className="text-gray-600 font-normal">{color?.name}</span>
                </p>
                <div className="flex flex-wrap gap-3">
                  {colors.map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      title={c.name}
                      onClick={() => setColor(c)}
                      disabled={!product.inStock}
                      className={cn(
                        'w-10 h-10 rounded-full ring-2 ring-offset-2 ring-offset-[#f4f5f7]',
                        color?.id === c.id ? 'ring-[#0B0F12]' : 'ring-transparent hover:ring-gray-400'
                      )}
                      style={{ backgroundColor: c.hex }}
                    />
                  ))}
                </div>
              </div>
            )}

            <div className="mt-8">
              <p className="text-sm font-medium text-gray-900 mb-3">Quantity</p>
              <div className="inline-flex items-center rounded-xl border border-gray-300 bg-white">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="h-11 w-11 flex items-center justify-center hover:bg-gray-50 rounded-l-xl"
                  aria-label="Decrease"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-12 text-center font-semibold">{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => q + 1)}
                  className="h-11 w-11 flex items-center justify-center hover:bg-gray-50 rounded-r-xl"
                  aria-label="Increase"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 mt-8">
              <Button
                size="lg"
                disabled={!product.inStock}
                onClick={handleAddToCart}
                className={cn(
                  'flex-1 h-12 rounded-xl font-semibold',
                  added
                    ? 'bg-[#0B0F12] hover:bg-[#0B0F12]/90'
                    : 'bg-[#0B0F12] hover:bg-[#0B0F12]/90'
                )}
              >
                {added ? (
                  <>
                    <Check className="w-5 h-5 mr-2" />
                    Added to cart
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-5 h-5 mr-2" />
                    Add to cart · {formatZmw(product.priceZmw * quantity)}
                  </>
                )}
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => toggleWishlist(product.id)}
                className="h-12 rounded-xl border-gray-300"
              >
                <Heart className={cn('w-5 h-5', wished && 'fill-red-500 text-red-500')} />
              </Button>
            </div>
          </div>
        </div>

        {related.length > 0 && (
          <section className="mt-16 pt-12 border-t border-gray-200">
            <h2 className="text-2xl font-bold mb-8">You may also like</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {related.map((p) => (
                <MerchProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
