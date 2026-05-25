'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ShoppingBag } from 'lucide-react'
import { useCartStore } from '@/store/cart'
import { formatPrice, getStockStatus, cn } from '@/lib/utils'
import type { Product } from '@/types'
import { toast } from 'sonner'

interface Props {
  product: Product
  priority?: boolean
}

export function ProductCard({ product, priority = false }: Props) {
  const { addItem, openCart } = useCartStore()
  const defaultVariant = product.variants?.[0]
  const stockStatus = defaultVariant ? getStockStatus(defaultVariant) : null
  const img = product.images[0] ?? null
  const hasDiscount = product.compare_price && product.compare_price > product.price

  function handleAddToCart(e: React.MouseEvent) {
    e.preventDefault()
    if (!defaultVariant || !stockStatus?.available) return
    addItem(product, defaultVariant)
    toast.success(`${product.name} agregado`, { description: 'Revisa tu bolsa' })
  }

  return (
    <Link href={`/product/${product.slug}`} className="group block">
      <div className={cn('border border-white/7 bg-[#0d0d0d] product-card-hover transition-all duration-300', 'relative')}>
        {/* Image */}
        <div className="relative aspect-[3/4] overflow-hidden bg-white/3">
          {img ? (
            <Image
              src={img}
              alt={product.name}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              priority={priority}
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-white/10">
              <ShoppingBag size={48} />
            </div>
          )}

          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#060606]/80 via-transparent to-transparent" />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            {product.is_featured && (
              <span className="px-2 py-1 bg-brand-red text-white text-[9px] font-black tracking-[2px] uppercase">
                Destacado
              </span>
            )}
            {hasDiscount && (
              <span className="px-2 py-1 bg-[#f5c000] text-black text-[9px] font-black tracking-[2px] uppercase">
                Oferta
              </span>
            )}
          </div>

          {/* Stock status */}
          {stockStatus && stockStatus.variant !== 'in_stock' && (
            <div className={cn(
              'absolute bottom-3 left-3 px-2 py-1 text-[9px] font-black tracking-[2px] uppercase',
              stockStatus.variant === 'out_of_stock' ? 'bg-white/20 text-white' : 'bg-[#f5c000] text-black'
            )}>
              {stockStatus.label}
            </div>
          )}

          {/* Quick add */}
          <button
            onClick={handleAddToCart}
            disabled={!stockStatus?.available}
            className={cn(
              'absolute bottom-3 right-3',
              'w-10 h-10 flex items-center justify-center',
              'bg-brand-red text-white',
              'opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0',
              'transition-all duration-300',
              'disabled:opacity-30 disabled:cursor-not-allowed',
              'hover:bg-brand-red-dark'
            )}
            aria-label="Agregar al carrito"
          >
            <ShoppingBag size={15} />
          </button>
        </div>

        {/* Info */}
        <div className="px-4 py-4">
          {product.category && (
            <p className="text-[9px] font-bold tracking-[3px] text-white/40 uppercase mb-1.5">
              {product.category.name}
            </p>
          )}
          <h3 className="font-display text-xl tracking-wider leading-none mb-3 group-hover:text-brand-red transition-colors">
            {product.name}
          </h3>
          <div className="flex items-center gap-2.5">
            <span className="font-bold text-[15px]">{formatPrice(product.price)}</span>
            {hasDiscount && (
              <span className="text-[13px] text-white/30 line-through">{formatPrice(product.compare_price!)}</span>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}

// Loading skeleton
export function ProductCardSkeleton() {
  return (
    <div className="border border-white/5">
      <div className="aspect-[3/4] skeleton" />
      <div className="p-4 space-y-2">
        <div className="skeleton h-3 w-16 rounded" />
        <div className="skeleton h-5 w-3/4 rounded" />
        <div className="skeleton h-4 w-1/3 rounded" />
      </div>
    </div>
  )
}
