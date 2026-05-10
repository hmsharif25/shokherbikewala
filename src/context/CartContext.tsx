import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { Product } from '@/types'

export interface CartItem {
  /** Product id (string — Supabase uuid or demo id). */
  id: string
  name: string
  slug: string
  image: string
  /** Effective unit price (discount_price ?? price). */
  price: number
  /** Original price before discount, for display. */
  original_price: number
  qty: number
  /** Whether the customer wants this line in their next checkout. */
  selected: boolean
}

interface CartContextValue {
  items: CartItem[]
  /** Total quantity across all items (for header badge). */
  totalQty: number
  /** Quantity of items currently selected for checkout. */
  selectedQty: number
  selectedItems: CartItem[]
  /** Total of selected items only. */
  selectedTotal: number
  addItem: (product: Product, qty?: number) => void
  /** Increment quantity of an existing line by 1. */
  incrementQty: (id: string) => void
  decrementQty: (id: string) => void
  updateQty: (id: string, qty: number) => void
  removeItem: (id: string) => void
  toggleSelected: (id: string) => void
  setAllSelected: (selected: boolean) => void
  clearCart: () => void
  /** Remove only the selected items (called after a successful order). */
  clearSelected: () => void
}

const STORAGE_KEY = 'sbw_cart_v1'

const CartContext = createContext<CartContextValue | null>(null)

function readInitial(): CartItem[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as unknown
    if (!Array.isArray(parsed)) return []
    return parsed
      .filter(
        (it): it is CartItem =>
          !!it &&
          typeof (it as CartItem).id === 'string' &&
          typeof (it as CartItem).qty === 'number',
      )
      .map((it) => ({
        ...it,
        // Default missing flags so older entries still work.
        selected: it.selected !== false,
      }))
  } catch {
    return []
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => readInitial())

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
    } catch {
      // ignore storage errors (private mode, quota)
    }
  }, [items])

  const addItem = useCallback((product: Product, qty: number = 1) => {
    if (qty < 1) return
    setItems((prev) => {
      const existing = prev.find((i) => i.id === product.id)
      const unit = product.discount_price ?? product.price
      if (existing) {
        return prev.map((i) =>
          i.id === product.id
            ? { ...i, qty: Math.min(99, i.qty + qty), selected: true }
            : i,
        )
      }
      return [
        ...prev,
        {
          id: product.id,
          name: product.name,
          slug: product.slug,
          image: product.images[0] ?? '',
          price: unit,
          original_price: product.price,
          qty: Math.min(99, qty),
          selected: true,
        },
      ]
    })
  }, [])

  const updateQty = useCallback((id: string, qty: number) => {
    setItems((prev) =>
      prev
        .map((i) =>
          i.id === id
            ? { ...i, qty: Math.max(1, Math.min(99, Math.floor(qty || 1))) }
            : i,
        )
        .filter((i) => i.qty > 0),
    )
  }, [])

  const incrementQty = useCallback((id: string) => {
    setItems((prev) =>
      prev.map((i) =>
        i.id === id ? { ...i, qty: Math.min(99, i.qty + 1) } : i,
      ),
    )
  }, [])

  const decrementQty = useCallback((id: string) => {
    setItems((prev) =>
      prev.map((i) =>
        i.id === id ? { ...i, qty: Math.max(1, i.qty - 1) } : i,
      ),
    )
  }, [])

  const removeItem = useCallback((id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id))
  }, [])

  const toggleSelected = useCallback((id: string) => {
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, selected: !i.selected } : i)),
    )
  }, [])

  const setAllSelected = useCallback((selected: boolean) => {
    setItems((prev) => prev.map((i) => ({ ...i, selected })))
  }, [])

  const clearCart = useCallback(() => setItems([]), [])

  const clearSelected = useCallback(() => {
    setItems((prev) => prev.filter((i) => !i.selected))
  }, [])

  const totalQty = useMemo(
    () => items.reduce((sum, i) => sum + i.qty, 0),
    [items],
  )
  const selectedItems = useMemo(
    () => items.filter((i) => i.selected),
    [items],
  )
  const selectedQty = useMemo(
    () => selectedItems.reduce((sum, i) => sum + i.qty, 0),
    [selectedItems],
  )
  const selectedTotal = useMemo(
    () => selectedItems.reduce((sum, i) => sum + i.qty * i.price, 0),
    [selectedItems],
  )

  return (
    <CartContext.Provider
      value={{
        items,
        totalQty,
        selectedQty,
        selectedItems,
        selectedTotal,
        addItem,
        incrementQty,
        decrementQty,
        updateQty,
        removeItem,
        toggleSelected,
        setAllSelected,
        clearCart,
        clearSelected,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within a CartProvider')
  return ctx
}
