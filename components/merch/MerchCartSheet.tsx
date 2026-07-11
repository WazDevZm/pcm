'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
  Minus,
  Plus,
  Trash2,
  ShoppingBag,
  Copy,
  Check,
  Tag,
} from 'lucide-react'
import { useMerchCart } from './MerchCartProvider'
import type { PlacedOrder } from './MerchCartProvider'
import {
  formatZmw,
  FREE_DELIVERY_THRESHOLD_ZMW,
} from '@/lib/merch-data'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'

export function MerchCartSheet() {
  const {
    items,
    itemCount,
    subtotalZmw,
    subtotalFormatted,
    deliveryZmw,
    discountZmw,
    totalZmw,
    totalFormatted,
    promoCode,
    setPromoCode,
    applyPromo,
    promoMessage,
    updateQuantity,
    removeItem,
    cartOpen,
    setCartOpen,
    placeOrder,
  } = useMerchCart()

  const [step, setStep] = useState<'cart' | 'checkout' | 'done'>('cart')
  const [lastOrder, setLastOrder] = useState<PlacedOrder | null>(null)
  const [copied, setCopied] = useState(false)
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    campus: 'CBU Main Campus',
    notes: '',
    payment: 'mobile-money' as 'mobile-money' | 'cash-on-collection',
  })

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault()
    const order = placeOrder({
      name: form.name,
      phone: form.phone,
      email: form.email || undefined,
      campus: form.campus,
      payment: form.payment === 'mobile-money' ? 'Mobile Money (Airtel/MTN)' : 'Cash on collection',
      notes: form.notes || undefined,
    })
    setLastOrder(order)
    setStep('done')
  }

  const handleOpenChange = (open: boolean) => {
    setCartOpen(open)
    if (!open) {
      setStep('cart')
      setCopied(false)
    }
  }

  const copyOrderId = () => {
    if (lastOrder) {
      navigator.clipboard.writeText(lastOrder.orderId)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <Sheet open={cartOpen} onOpenChange={handleOpenChange}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-lg bg-white border-gray-200 text-gray-900 flex flex-col p-0"
      >
        <SheetHeader className="p-5 border-b border-gray-200 shrink-0">
          <SheetTitle className="flex items-center gap-2 text-gray-900">
            <ShoppingBag className="w-5 h-5" />
            {step === 'done' ? 'Order confirmed' : `Shopping cart (${itemCount})`}
          </SheetTitle>
        </SheetHeader>

        {step === 'done' && lastOrder ? (
          <div className="flex-1 overflow-y-auto p-6">
            <div className="text-center mb-8">
              <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
                <Check className="w-8 h-8 text-emerald-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">Thank you for your order!</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Our merch team will contact you at <strong>{lastOrder.customer.phone}</strong> to
                confirm payment and campus pickup.
              </p>
            </div>

            <div className="rounded-xl bg-gray-50 ring-1 ring-gray-200 p-4 mb-6">
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Order ID</p>
              <div className="flex items-center justify-between gap-2">
                <code className="text-lg font-bold text-[#0f2d6e]">{lastOrder.orderId}</code>
                <button
                  type="button"
                  onClick={copyOrderId}
                  className="p-2 rounded-lg hover:bg-gray-200 transition-colors"
                  aria-label="Copy order ID"
                >
                  {copied ? (
                    <Check className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <Copy className="w-4 h-4 text-gray-500" />
                  )}
                </button>
              </div>
              <p className="text-2xl font-bold mt-3">{formatZmw(lastOrder.totalZmw)}</p>
              <p className="text-sm text-gray-500 mt-1">{lastOrder.customer.payment}</p>
            </div>

            <ul className="space-y-2 text-sm mb-6">
              {lastOrder.items.map((item) => (
                <li key={item.lineId} className="flex justify-between text-gray-600">
                  <span>
                    {item.productName} × {item.quantity}
                  </span>
                  <span>{formatZmw(item.priceZmw * item.quantity)}</span>
                </li>
              ))}
            </ul>

            <Button
              onClick={() => {
                setStep('cart')
                setCartOpen(false)
              }}
              className="w-full rounded-xl bg-[#0B0F12] hover:bg-[#0B0F12]/90 h-12"
            >
              Continue shopping
            </Button>
          </div>
        ) : step === 'checkout' ? (
          <form onSubmit={handlePlaceOrder} className="flex-1 overflow-y-auto p-5 space-y-4">
            <button
              type="button"
              onClick={() => setStep('cart')}
              className="text-sm text-gray-500 hover:text-gray-900"
            >
              ← Back to cart
            </button>

            <Input
              placeholder="Full name *"
              required
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            />
            <Input
              placeholder="Phone number *"
              required
              type="tel"
              value={form.phone}
              onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
            />
            <Input
              placeholder="Email (optional)"
              type="email"
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            />
            <select
              value={form.campus}
              onChange={(e) => setForm((f) => ({ ...f, campus: e.target.value }))}
              className="w-full h-10 rounded-md border border-gray-300 px-3 text-sm"
            >
              <option value="CBU Main Campus">CBU Main Campus</option>
              <option value="Riverside Campus">Riverside Campus</option>
              <option value="Other arrangement">Other / delivery arrangement</option>
            </select>

            <div>
              <p className="text-xs font-medium text-gray-700 mb-2">Payment method</p>
              <div className="space-y-2">
                {[
                  { id: 'mobile-money' as const, label: 'Mobile Money (Airtel / MTN)' },
                  { id: 'cash-on-collection' as const, label: 'Cash on collection' },
                ].map((opt) => (
                  <label
                    key={opt.id}
                    className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 cursor-pointer has-[:checked]:border-[#0f2d6e] has-[:checked]:bg-blue-50"
                  >
                    <input
                      type="radio"
                      name="payment"
                      checked={form.payment === opt.id}
                      onChange={() => setForm((f) => ({ ...f, payment: opt.id }))}
                    />
                    <span className="text-sm">{opt.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <Textarea
              placeholder="Order notes (optional)"
              value={form.notes}
              onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
              className="min-h-[72px]"
            />

            <OrderSummary
              subtotal={subtotalFormatted}
              delivery={deliveryZmw}
              discount={discountZmw}
              total={totalFormatted}
            />

            <Button
              type="submit"
              className="w-full h-12 rounded-xl bg-[#0B0F12] hover:bg-[#0B0F12]/90 text-white font-semibold"
            >
              Place order · {totalFormatted}
            </Button>
          </form>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {items.length === 0 ? (
                <div className="text-center py-16">
                  <ShoppingBag className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">Your cart is empty</p>
                  <Button asChild variant="outline" onClick={() => setCartOpen(false)}>
                    <Link href="/merch">Browse products</Link>
                  </Button>
                </div>
              ) : (
                items.map((item) => (
                  <div
                    key={item.lineId}
                    className="flex gap-3 rounded-xl border border-gray-200 p-3 bg-gray-50/50"
                  >
                    <Link
                      href={`/merch/${item.productSlug}`}
                      className="relative w-20 h-20 rounded-lg overflow-hidden shrink-0 bg-gray-100"
                      onClick={() => setCartOpen(false)}
                    >
                      <Image src={item.image} alt="" fill className="object-cover" sizes="80px" />
                    </Link>
                    <div className="flex-1 min-w-0">
                      <Link
                        href={`/merch/${item.productSlug}`}
                        className="font-medium text-sm hover:text-[#0f2d6e] line-clamp-2"
                        onClick={() => setCartOpen(false)}
                      >
                        {item.productName}
                      </Link>
                      {(item.size || item.color) && (
                        <p className="text-xs text-gray-500 mt-0.5">
                          {[item.size, item.color?.name].filter(Boolean).join(' · ')}
                        </p>
                      )}
                      <p className="text-sm font-semibold mt-1">
                        {formatZmw(item.priceZmw * item.quantity)}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.lineId, item.quantity - 1)}
                          className="w-8 h-8 rounded-md border border-gray-300 flex items-center justify-center hover:bg-white"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-sm w-6 text-center">{item.quantity}</span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.lineId, item.quantity + 1)}
                          className="w-8 h-8 rounded-md border border-gray-300 flex items-center justify-center hover:bg-white"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                        <button
                          type="button"
                          onClick={() => removeItem(item.lineId)}
                          className="ml-auto p-1.5 text-red-500 hover:bg-red-50 rounded-md"
                          aria-label="Remove"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {items.length > 0 && (
              <div className="p-4 border-t border-gray-200 space-y-4 shrink-0 bg-white">
                <div className="flex gap-2">
                  <Input
                    placeholder="Promo code"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    className="flex-1 h-10"
                  />
                  <Button type="button" variant="outline" onClick={applyPromo} className="shrink-0">
                    <Tag className="w-4 h-4 mr-1" />
                    Apply
                  </Button>
                </div>
                {promoMessage && (
                  <p
                    className={`text-xs ${promoMessage.includes('Invalid') ? 'text-red-600' : 'text-emerald-600'}`}
                  >
                    {promoMessage}
                  </p>
                )}
                <p className="text-xs text-gray-500">Try: PCM10 (10% off) or WELCOME (5% off)</p>

                {subtotalZmw < FREE_DELIVERY_THRESHOLD_ZMW && (
                  <p className="text-xs text-gray-600">
                    Add {formatZmw(FREE_DELIVERY_THRESHOLD_ZMW - subtotalZmw)} more for free delivery
                  </p>
                )}

                <OrderSummary
                  subtotal={subtotalFormatted}
                  delivery={deliveryZmw}
                  discount={discountZmw}
                  total={totalFormatted}
                />

                <Button
                  onClick={() => setStep('checkout')}
                  className="w-full h-12 rounded-xl bg-[#0B0F12] hover:bg-[#0B0F12]/90 font-semibold"
                >
                  Checkout · {totalFormatted}
                </Button>
              </div>
            )}
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}

function OrderSummary({
  subtotal,
  delivery,
  discount,
  total,
}: {
  subtotal: string
  delivery: number
  discount: number
  total: string
}) {
  return (
    <div className="rounded-xl bg-gray-50 p-4 space-y-2 text-sm">
      <div className="flex justify-between text-gray-600">
        <span>Subtotal</span>
        <span>{subtotal}</span>
      </div>
      {discount > 0 && (
        <div className="flex justify-between text-emerald-600">
          <span>Discount</span>
          <span>-{formatZmw(discount)}</span>
        </div>
      )}
      <div className="flex justify-between text-gray-600">
        <span>Delivery</span>
        <span>{delivery === 0 ? 'Free' : formatZmw(delivery)}</span>
      </div>
      <div className="flex justify-between font-bold text-base pt-2 border-t border-gray-200">
        <span>Total</span>
        <span>{total}</span>
      </div>
    </div>
  )
}

export function MerchCartButton({ className }: { className?: string }) {
  const { itemCount, setCartOpen } = useMerchCart()

  return (
    <button
      type="button"
      onClick={() => setCartOpen(true)}
      className={className}
      aria-label={`Open cart, ${itemCount} items`}
    >
      <ShoppingBag className="w-5 h-5" />
      {itemCount > 0 && (
        <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] flex items-center justify-center rounded-full bg-[#0f2d6e] text-[10px] font-bold text-white px-1">
          {itemCount > 99 ? '99+' : itemCount}
        </span>
      )}
    </button>
  )
}
