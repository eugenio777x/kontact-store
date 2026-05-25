import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { CartItem, Product, ProductVariant } from '@/types'
import { FREE_SHIPPING_THRESHOLD, SHIPPING_COST } from '@/lib/stripe'

interface CartStore {
  items: CartItem[]
  isOpen: boolean

  addItem:    (product: Product, variant: ProductVariant, quantity?: number) => void
  removeItem: (variantId: string) => void
  updateQty:  (variantId: string, quantity: number) => void
  clearCart:  () => void
  openCart:   () => void
  closeCart:  () => void

  subtotal:      () => number
  shippingCost:  () => number
  total:         () => number
  itemCount:     () => number
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      addItem(product, variant, quantity = 1) {
        set(state => {
          const existing = state.items.find(i => i.variant.id === variant.id)
          if (existing) {
            return {
              items: state.items.map(i =>
                i.variant.id === variant.id
                  ? { ...i, quantity: Math.min(i.quantity + quantity, variant.stock) }
                  : i
              ),
              isOpen: true,
            }
          }
          return {
            items: [...state.items, { product, variant, quantity }],
            isOpen: true,
          }
        })
      },

      removeItem(variantId) {
        set(state => ({ items: state.items.filter(i => i.variant.id !== variantId) }))
      },

      updateQty(variantId, quantity) {
        if (quantity <= 0) { get().removeItem(variantId); return }
        set(state => ({
          items: state.items.map(i =>
            i.variant.id === variantId
              ? { ...i, quantity: Math.min(quantity, i.variant.stock) }
              : i
          ),
        }))
      },

      clearCart() { set({ items: [] }) },
      openCart()  { set({ isOpen: true }) },
      closeCart() { set({ isOpen: false }) },

      subtotal() {
        return get().items.reduce(
          (sum, i) => sum + (i.product.price + i.variant.price_mod) * i.quantity,
          0
        )
      },

      shippingCost() {
        const sub = get().subtotal()
        return sub >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST
      },

      total() { return get().subtotal() + get().shippingCost() },

      itemCount() {
        return get().items.reduce((sum, i) => sum + i.quantity, 0)
      },
    }),
    { name: 'kontact-cart', version: 1 }
  )
)
