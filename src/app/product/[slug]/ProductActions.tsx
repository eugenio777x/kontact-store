'use client'

import { useState } from 'react'
import { ShoppingBag, Zap } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useCartStore } from '@/store/cart'
import { getStockStatus, cn } from '@/lib/utils'
import { toast } from 'sonner'
import type { Product, ProductVariant } from '@/types'

interface Props { product: Product }

export function ProductActions({ product }: Props) {
  const variants = product.variants ?? []
  const sizes  = [...new Set(variants.map(v => v.size).filter(Boolean))]
  const colors = [...new Set(variants.map(v => v.color).filter(Boolean))]

  const [selectedSize,  setSelectedSize]  = useState<string | null>(sizes[0]  ?? null)
  const [selectedColor, setSelectedColor] = useState<string | null>(colors[0] ?? null)

  const selectedVariant = variants.find(v => {
    const sizeMatch  = !sizes.length  || v.size  === selectedSize
    const colorMatch = !colors.length || v.color === selectedColor
    return sizeMatch && colorMatch
  }) ?? variants[0]

  const stockStatus = selectedVariant ? getStockStatus(selectedVariant) : null
  const { addItem, openCart } = useCartStore()
  const router = useRouter()

  function handleAdd() {
    if (!selectedVariant || !stockStatus?.available) return
    addItem(product, selectedVariant)
    toast.success(`${product.name} agregado`, { description: 'Revisa tu bolsa' })
  }

  function handleBuyNow() {
    if (!selectedVariant || !stockStatus?.available) return
    addItem(product, selectedVariant)
    router.push('/checkout')
  }

  return (
    <div className="space-y-5">
      {/* Size selector */}
      {sizes.length > 0 && (
        <div>
          <p className="text-[10px] font-bold tracking-[3px] uppercase text-white/40 mb-3">
            Talla — <span className="text-white">{selectedSize}</span>
          </p>
          <div className="flex flex-wrap gap-2">
            {sizes.map(size => {
              const v = variants.find(x => x.size === size && (!selectedColor || x.color === selectedColor))
              const available = v ? getStockStatus(v).available : false
              return (
                <SizeButton
                  key={size}
                  label={size!}
                  selected={selectedSize === size}
                  available={available}
                  onClick={() => setSelectedSize(size)}
                />
              )
            })}
          </div>
        </div>
      )}

      {/* Color selector */}
      {colors.length > 0 && (
        <div>
          <p className="text-[10px] font-bold tracking-[3px] uppercase text-white/40 mb-3">
            Color — <span className="text-white">{selectedColor}</span>
          </p>
          <div className="flex flex-wrap gap-2">
            {colors.map(color => {
              const v = variants.find(x => x.color === color && (!selectedSize || x.size === selectedSize))
              const available = v ? getStockStatus(v).available : false
              const hex = variants.find(x => x.color === color)?.color_hex
              return (
                <ColorButton
                  key={color}
                  label={color!}
                  hex={hex ?? null}
                  selected={selectedColor === color}
                  available={available}
                  onClick={() => setSelectedColor(color)}
                />
              )
            })}
          </div>
        </div>
      )}

      {/* Stock badge */}
      {stockStatus && (
        <div className={cn(
          'inline-flex items-center gap-2 px-3 py-1.5 text-[10px] font-bold tracking-[2px] uppercase',
          stockStatus.variant === 'in_stock'    && 'bg-white/5 text-white/50',
          stockStatus.variant === 'low_stock'   && 'bg-[#f5c000]/10 text-[#f5c000]',
          stockStatus.variant === 'out_of_stock' && 'bg-white/5 text-white/30',
        )}>
          <span className={cn(
            'w-1.5 h-1.5 rounded-full',
            stockStatus.variant === 'in_stock'    && 'bg-green-500',
            stockStatus.variant === 'low_stock'   && 'bg-[#f5c000]',
            stockStatus.variant === 'out_of_stock' && 'bg-white/20',
          )} />
          {stockStatus.label}
        </div>
      )}

      {/* CTAs */}
      <div className="flex gap-3 pt-2">
        <button
          onClick={handleAdd}
          disabled={!stockStatus?.available}
          className="btn-primary flex-1 gap-2"
        >
          <ShoppingBag size={15} />
          Añadir al carrito
        </button>
        <button
          onClick={handleBuyNow}
          disabled={!stockStatus?.available}
          className="btn-ghost px-5"
          title="Comprar ahora"
        >
          <Zap size={15} />
        </button>
      </div>
    </div>
  )
}

function SizeButton({ label, selected, available, onClick }: {
  label: string; selected: boolean; available: boolean; onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      disabled={!available}
      className={cn(
        'min-w-[48px] h-10 px-3 text-[12px] font-bold tracking-wider uppercase border transition-all',
        selected  ? 'border-brand-red bg-brand-red/10 text-white' : 'border-white/15 text-white/60 hover:border-white/40 hover:text-white',
        !available && 'opacity-30 cursor-not-allowed line-through'
      )}
    >
      {label}
    </button>
  )
}

function ColorButton({ label, hex, selected, available, onClick }: {
  label: string; hex: string | null; selected: boolean; available: boolean; onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      disabled={!available}
      title={label}
      className={cn(
        'flex items-center gap-2 h-10 px-3 text-[12px] font-bold tracking-wider uppercase border transition-all',
        selected  ? 'border-brand-red bg-brand-red/10 text-white' : 'border-white/15 text-white/60 hover:border-white/40 hover:text-white',
        !available && 'opacity-30 cursor-not-allowed'
      )}
    >
      {hex && (
        <span className="w-3.5 h-3.5 rounded-full border border-white/20 flex-shrink-0" style={{ background: hex }} />
      )}
      {label}
    </button>
  )
}
