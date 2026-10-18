import 'expo-sqlite/localStorage/install';
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

import { getProductBySlug, type MerchColor, type MerchSize } from '@/data/merch';

export type CartLine = {
  lineId: string;
  productSlug: string;
  quantity: number;
  size?: MerchSize;
  color?: MerchColor;
};

type CartState = {
  lines: CartLine[];
  itemCount: number;
  subtotalZmw: number;
  add: (line: Omit<CartLine, 'lineId'>) => void;
  setQuantity: (lineId: string, quantity: number) => void;
  remove: (lineId: string) => void;
  clear: () => void;
  wishlist: string[];
  toggleWishlist: (slug: string) => void;
};

const CART_KEY = 'haven.cart';
const WISHLIST_KEY = 'haven.wishlist';

function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function save(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Persisting the cart is a convenience; ignore storage failures
  }
}

const CartContext = createContext<CartState | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>(() => load(CART_KEY, []));
  const [wishlist, setWishlist] = useState<string[]>(() => load(WISHLIST_KEY, []));

  useEffect(() => save(CART_KEY, lines), [lines]);
  useEffect(() => save(WISHLIST_KEY, wishlist), [wishlist]);

  const value = useMemo<CartState>(() => {
    const valid = lines.filter((l) => getProductBySlug(l.productSlug));
    return {
      lines: valid,
      itemCount: valid.reduce((n, l) => n + l.quantity, 0),
      subtotalZmw: valid.reduce((sum, l) => sum + (getProductBySlug(l.productSlug)?.priceZmw ?? 0) * l.quantity, 0),
      add: (line) =>
        setLines((prev) => {
          const same = prev.find(
            (l) => l.productSlug === line.productSlug && l.size === line.size && l.color?.id === line.color?.id
          );
          if (same) {
            return prev.map((l) =>
              l.lineId === same.lineId ? { ...l, quantity: Math.min(20, l.quantity + line.quantity) } : l
            );
          }
          return [...prev, { ...line, lineId: `${Date.now()}-${Math.random().toString(36).slice(2, 6)}` }];
        }),
      setQuantity: (lineId, quantity) =>
        setLines((prev) =>
          quantity <= 0
            ? prev.filter((l) => l.lineId !== lineId)
            : prev.map((l) => (l.lineId === lineId ? { ...l, quantity: Math.min(20, quantity) } : l))
        ),
      remove: (lineId) => setLines((prev) => prev.filter((l) => l.lineId !== lineId)),
      clear: () => setLines([]),
      wishlist,
      toggleWishlist: (slug) =>
        setWishlist((prev) => (prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug])),
    };
  }, [lines, wishlist]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside CartProvider');
  return ctx;
}
