'use client'

import { useState } from 'react'
import { useCartStore } from '@/store/cart'
import { formatPrice } from '@/lib/utils'
import { FREE_SHIPPING_THRESHOLD } from '@/lib/stripe'
import { Truck, Lock } from 'lucide-react'
import { toast } from 'sonner'
import Image from 'next/image'

export default function CheckoutPage() {
  const { items, subtotal, shippingCost, total, clearCart } = useCartStore()
  const [loading, setLoading] = useState(false)
  const sub = subtotal()

  async function handleCheckout() {
    if (items.length === 0) return
    setLoading(true)
    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map(i => ({
            productId:   i.product.id,
            variantId:   i.variant.id,
            name:        i.product.name,
            variantLabel: [i.variant.size, i.variant.color].filter(Boolean).join(' / '),
            price:       i.product.price + i.variant.price_mod,
            quantity:    i.quantity,
            image:       i.product.images[0] ?? null,
          })),
          subtotal: sub,
          shipping: shippingCost(),
        }),
      })

      const { url, error } = await res.json()
      if (error) throw new Error(error)
      window.location.href = url
    } catch (err) {
      toast.error('Error al procesar el pago. Intenta de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen pt-[68px] flex items-center justify-center">
        <div className="text-center">
          <p className="font-display text-5xl tracking-widest text-white/10 mb-4">CARRITO VACÍO</p>
          <a href="/shop" className="btn-primary">Ver tienda</a>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-[68px] bg-[#060606]">
      <div className="max-w-[1100px] mx-auto px-6 py-16">
        <h1 className="font-display text-5xl tracking-widest mb-12">CHECKOUT</h1>

        <div className="grid lg:grid-cols-[1fr_400px] gap-12">
          {/* Order summary */}
          <div className="space-y-6">
            <h2 className="text-[11px] font-bold tracking-[3px] uppercase text-white/40 pb-3 border-b border-white/7">
              Tu pedido
            </h2>
            <div className="space-y-4">
              {items.map(item => {
                const price = item.product.price + item.variant.price_mod
                const varLabel = [item.variant.size, item.variant.color].filter(Boolean).join(' / ')
                return (
                  <div key={item.variant.id} className="flex gap-5 py-4 border-b border-white/5">
                    <div className="relative w-20 h-24 bg-white/5 flex-shrink-0 overflow-hidden">
                      {item.product.images[0] && (
                        <Image src={item.product.images[0]} alt={item.product.name} fill className="object-cover" />
                      )}
                      <span className="absolute top-1 right-1 w-5 h-5 bg-brand-red text-white text-[10px] font-black rounded-full flex items-center justify-center">
                        {item.quantity}
                      </span>
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-[15px]">{item.product.name}</p>
                      {varLabel && <p className="text-[12px] text-white/40 mt-1">{varLabel}</p>}
                    </div>
                    <p className="font-bold text-[15px]">{formatPrice(price * item.quantity)}</p>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Summary + CTA */}
          <div className="bg-[#0d0d0d] border border-white/7 p-7 h-fit space-y-5">
            <h2 className="font-display text-xl tracking-widest mb-6">RESUMEN</h2>

            <div className="space-y-3 text-[13px]">
              <div className="flex justify-between text-white/50">
                <span>Subtotal</span>
                <span>{formatPrice(sub)}</span>
              </div>
              <div className="flex justify-between text-white/50">
                <span>Envío</span>
                <span className={shippingCost() === 0 ? 'text-green-400 font-semibold' : ''}>
                  {shippingCost() === 0 ? 'Gratis' : formatPrice(shippingCost())}
                </span>
              </div>
              {sub < FREE_SHIPPING_THRESHOLD && (
                <p className="text-[11px] text-white/30 flex items-center gap-1.5">
                  <Truck size={11} />
                  Agrega {formatPrice(FREE_SHIPPING_THRESHOLD - sub)} más para envío gratis
                </p>
              )}
            </div>

            <div className="h-px bg-white/7" />

            <div className="flex justify-between items-baseline">
              <span className="font-bold text-[15px]">Total</span>
              <span className="font-display text-3xl tracking-widest text-brand-red">{formatPrice(total())}</span>
            </div>

            <button
              onClick={handleCheckout}
              disabled={loading}
              className="btn-primary w-full gap-2"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25"/><path d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" fill="currentColor" className="opacity-75"/></svg>
                  Procesando...
                </span>
              ) : (
                <>
                  <Lock size={14} />
                  Pagar con Stripe
                </>
              )}
            </button>

            <p className="text-[10px] text-white/30 text-center tracking-wider">
              Pago 100% seguro · SSL cifrado
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
