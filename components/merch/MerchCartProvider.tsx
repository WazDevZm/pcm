'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import type { MerchColor, MerchSize } from '@/lib/merch-data'
import {
  formatZmw,
  generateOrderId,
  DELIVERY_FEE_ZMW,
  FREE_DELIVERY_THRESHOLD_ZMW,
} from '@/lib/merch-data'

export type CartLine = {
  lineId: string
  productId: string
  productSlug: string
  productName: string
  priceZmw: number
  quantity: number
  size?: MerchSize
  color?: MerchColor
  image: string
}

export type PlacedOrder = {
  orderId: string
  items: CartLine[]
  subtotalZmw: number
  deliveryZmw: number
  discountZmw: number
  totalZmw: number
  customer: {
    name: string
    phone: string
    email?: string
    campus: string
    payment: string
    notes?: string
  }
  placedAt: string
}

type MerchCartContextValue = {
  items: CartLine[]
  itemCount: number
  subtotalZmw: number
  subtotalFormatted: string
  deliveryZmw: number
  discountZmw: number
  totalZmw: number
  totalFormatted: string
  promoCode: string
  setPromoCode: (code: string) => void
  applyPromo: () => boolean
  promoMessage: string | null
  addItem: (item: Omit<CartLine, 'lineId'>) => void
  updateQuantity: (lineId: string, quantity: number) => void
  removeItem: (lineId: string) => void
  clearCart: () => void
  cartOpen: boolean
  setCartOpen: (open: boolean) => void
  placeOrder: (customer: PlacedOrder['customer']) => PlacedOrder
  orders: PlacedOrder[]
  wishlist: string[]
  toggleWishlist: (productId: string) => void
  isInWishlist: (productId: string) => boolean
}

const CART_KEY = 'pcm-merch-cart'
const ORDERS_KEY = 'pcm-merch-orders'
const WISHLIST_KEY = 'pcm-merch-wishlist'
const PROMO_CODES: Record<string, number> = {
  PCM10: 0.1,
  WELCOME: 0.05,
}

const MerchCartContext = createContext<MerchCartContextValue | null>(null)

function loadJson<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}

export function MerchCartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartLine[]>([])
  const [orders, setOrders] = useState<PlacedOrder[]>([])
  const [wishlist, setWishlist] = useState<string[]>([])
  const [cartOpen, setCartOpen] = useState(false)
  const [hydrated, setHydrated] = useState(false)
  const [promoCode, setPromoCode] = useState('')
  const [appliedPromo, setAppliedPromo] = useState<string | null>(null)
  const [promoMessage, setPromoMessage] = useState<string | null>(null)

  useEffect(() => {
    setItems(loadJson(CART_KEY, []))
    setOrders(loadJson(ORDERS_KEY, []))
    setWishlist(loadJson(WISHLIST_KEY, []))
    setHydrated(true)
  }, [])

  useEffect(() => {
    if (!hydrated) return
    localStorage.setItem(CART_KEY, JSON.stringify(items))
  }, [items, hydrated])

  useEffect(() => {
    if (!hydrated) return
    localStorage.setItem(ORDERS_KEY, JSON.stringify(orders))
  }, [orders, hydrated])

  useEffect(() => {
    if (!hydrated) return
    localStorage.setItem(WISHLIST_KEY, JSON.stringify(wishlist))
  }, [wishlist, hydrated])

  const subtotalZmw = useMemo(
    () => items.reduce((sum, i) => sum + i.priceZmw * i.quantity, 0),
    [items]
  )

  const discountZmw = useMemo(() => {
    if (!appliedPromo || !PROMO_CODES[appliedPromo]) return 0
    return Math.round(subtotalZmw * PROMO_CODES[appliedPromo])
  }, [subtotalZmw, appliedPromo])

  const deliveryZmw = useMemo(() => {
    if (items.length === 0) return 0
    if (subtotalZmw - discountZmw >= FREE_DELIVERY_THRESHOLD_ZMW) return 0
    return DELIVERY_FEE_ZMW
  }, [items.length, subtotalZmw, discountZmw])

  const totalZmw = Math.max(0, subtotalZmw - discountZmw + deliveryZmw)

  const applyPromo = useCallback(() => {
    const code = promoCode.trim().toUpperCase()
    if (!code) {
      setPromoMessage('Enter a promo code')
      return false
    }
    if (!PROMO_CODES[code]) {
      setAppliedPromo(null)
      setPromoMessage('Invalid promo code')
      return false
    }
    setAppliedPromo(code)
    setPromoMessage(`${code} applied — ${PROMO_CODES[code] * 100}% off`)
    return true
  }, [promoCode])

  const addItem = useCallback((item: Omit<CartLine, 'lineId'>) => {
    setItems((prev) => {
      const existing = prev.find(
        (i) =>
          i.productId === item.productId &&
          i.size === item.size &&
          i.color?.id === item.color?.id
      )
      if (existing) {
        return prev.map((i) =>
          i.lineId === existing.lineId
            ? { ...i, quantity: i.quantity + item.quantity }
            : i
        )
      }
      return [
        ...prev,
        {
          ...item,
          lineId: `${item.productId}-${item.size ?? 'na'}-${item.color?.id ?? 'na'}-${Date.now()}`,
        },
      ]
    })
    setCartOpen(true)
  }, [])

  const updateQuantity = useCallback((lineId: string, quantity: number) => {
    if (quantity < 1) {
      setItems((prev) => prev.filter((i) => i.lineId !== lineId))
      return
    }
    setItems((prev) =>
      prev.map((i) => (i.lineId === lineId ? { ...i, quantity } : i))
    )
  }, [])

  const removeItem = useCallback((lineId: string) => {
    setItems((prev) => prev.filter((i) => i.lineId !== lineId))
  }, [])

  const clearCart = useCallback(() => setItems([]), [])

  const toggleWishlist = useCallback((productId: string) => {
    setWishlist((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    )
  }, [])

  const isInWishlist = useCallback(
    (productId: string) => wishlist.includes(productId),
    [wishlist]
  )

  const placeOrder = useCallback(
    (customer: PlacedOrder['customer']): PlacedOrder => {
      const order: PlacedOrder = {
        orderId: generateOrderId(),
        items: [...items],
        subtotalZmw,
        deliveryZmw,
        discountZmw,
        totalZmw,
        customer,
        placedAt: new Date().toISOString(),
      }
      setOrders((prev) => [order, ...prev])
      clearCart()
      setAppliedPromo(null)
      setPromoCode('')
      setPromoMessage(null)
      return order
    },
    [items, subtotalZmw, deliveryZmw, discountZmw, totalZmw, clearCart]
  )

  const itemCount = useMemo(
    () => items.reduce((sum, i) => sum + i.quantity, 0),
    [items]
  )

  const value: MerchCartContextValue = {
    items,
    itemCount,
    subtotalZmw,
    subtotalFormatted: formatZmw(subtotalZmw),
    deliveryZmw,
    discountZmw,
    totalZmw,
    totalFormatted: formatZmw(totalZmw),
    promoCode,
    setPromoCode,
    applyPromo,
    promoMessage,
    addItem,
    updateQuantity,
    removeItem,
    clearCart,
    cartOpen,
    setCartOpen,
    placeOrder,
    orders,
    wishlist,
    toggleWishlist,
    isInWishlist,
  }

  return <MerchCartContext.Provider value={value}>{children}</MerchCartContext.Provider>
}

export function useMerchCart() {
  const ctx = useContext(MerchCartContext)
  if (!ctx) throw new Error('useMerchCart must be used within MerchCartProvider')
  return ctx
}
