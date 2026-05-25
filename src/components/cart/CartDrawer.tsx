'use client'

import Image from 'next/image'
import Link from 'next/link'
import { X, Minus, Plus, ShoppingBag, Truck } from 'lucide-react'
import { useCartStore } from '@/store/cart'
import { formatPrice } from '@/lib/utils'
import { FREE_SHIPPING_THRESHOLD } from '@/lib/stripe'

export function CartDrawer() {
  const { isOpen, items, closeCart, removeItem, updateQty, subtotal, shippingCost, total } = useCartStore()
  const sub = subtotal()
  const ship = shippingCost()
  const remaining = FREE_SHIPPING_THRESHOLD - sub

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[90]"
          onClick={closeCart}
        />
      )}

      {/* Drawer */}
      <aside
        className={`fixed top-0 right-0 h-full w-full max-w-[440px] bg-[#0d0d0d] border-l border-white/7 z-[91] flex flex-col transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-7 py-5 border-b border-white/7">
          <h2 className="font-display text-2xl tracking-widest uppercase">Tu Bolsa</h2>
          <button onClick={closeCart} className="w-9 h-9 flex items-center justify-center text-white/50 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Free shipping progress */}
        {remaining > 0 && (
          <div className="px-7 py-4 bg-white/3 border-b border-white/7">
            <div className="flex items-center gap-2 text-[12px] text-white/60 mb-2">
              <Truck size={13} />
              <span>Agrega <strong className="text-white">{formatPrice(remaining)}</strong> más para envío gratis</span>
            </div>
            <div className="h-0.5 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-brand-red transition-all duration-500"
                style={{ width: `${Math.min((sub / FREE_SHIPPING_THRESHOLD) * 100, 100)}%` }}
              />
            </div>
          </div>
        )}
        {remaining <= 0 && (
          <div className="px-7 py-3 bg-brand-red/10 border-b border-brand-red/20 text-[12px] font-semibold text-brand-red flex items-center gap-2">
            <Truck size={13} /> ¡Envío gratis desbloqueado!
          </div>
        )}

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-7 py-5 space-y-4">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center gap-5 text-center">
              <ShoppingBag size={48} className="text-white/10" />
              <div>
                <p className="font-display text-2xl tracking-widest mb-1">VACÍO</p>
                <p className="text-[13px] text-white/40">Tu bolsa no tiene productos</p>
              </div>
              <Link href="/shop" onClick={closeCart} className="btn-primary text-xs px-6 py-3">
                Ver tienda
              </Link>
            </div>
          ) : (
            items.map(item => {
              const price = item.product.price + item.variant.price_mod
              const img = item.product.images[0] ?? null
              const varLabel = [item.variant.size, item.variant.color].filter(Boolean).join(' / ')
              return (
                <div key={item.variant.id} className="flex gap-4">
                  <div className="w-20 h-20 bg-white/5 flex-shrink-0 relative overflow-hidden">
                    {img ? (
                      <Image src={img} alt={item.product.name} fill className="object-cover" />
                    ) : (
                      <div className="w-full h-full bg-white/5" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-[14px] leading-tight truncate">{item.product.name}</p>
                    {varLabel && <p className="text-[11px] text-white/40 mt-0.5">{varLabel}</p>}
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center border border-white/10">
                        <button
                          onClick={() => updateQty(item.variant.id, item.quantity - 1)}
                          className="w-7 h-7 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/5 transition-colors"
                        >
                          <Minus size={11} />
                        </button>
                        <span className="w-8 text-center text-[13px] font-semibold">{item.quantity}</span>
                        <button
                          onClick={() => updateQty(item.variant.id, item.quantity + 1)}
                          disabled={item.quantity >= item.variant.stock}
                          className="w-7 h-7 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/5 transition-colors disabled:opacity-30"
                        >
                          <Plus size={11} />
                        </button>
                      </div>
                      <span className="font-bold text-[15px]">{formatPrice(price * item.quantity)}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => removeItem(item.variant.id)}
                    className="self-start text-white/30 hover:text-white/70 transition-colors mt-0.5"
                  >
                    <X size={14} />
                  </button>
                </div>
              )
            })
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="px-7 py-6 border-t border-white/7 space-y-4">
            <div className="space-y-2 text-[13px]">
              <div className="flex justify-between text-white/50">
                <span>Subtotal</span>
                <span>{formatPrice(sub)}</span>
              </div>
              <div className="flex justify-between text-white/50">
                <span>Envío</span>
                <span>{ship === 0 ? 'Gratis' : formatPrice(ship)}</span>
              </div>
              <div className="flex justify-between text-[15px] font-bold pt-2 border-t border-white/7">
                <span>Total</span>
                <span className="text-brand-red font-display text-xl tracking-wider">{formatPrice(total())}</span>
              </div>
            </div>
            <Link
              href="/checkout"
              onClick={closeCart}
              className="btn-primary w-full text-center"
            >
              Finalizar compra
            </Link>
            <button onClick={closeCart} className="w-full text-center text-[12px] text-white/40 hover:text-white/70 uppercase tracking-widest transition-colors">
              Seguir comprando
            </button>
          </div>
        )}
      </aside>
    </>
  )
}
