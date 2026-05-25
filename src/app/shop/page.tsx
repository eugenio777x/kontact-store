import type { Metadata } from 'next'
import { Suspense } from 'react'
import { getProducts } from '@/lib/actions/products'
import { createClient } from '@/lib/supabase/server'
import { ProductCard, ProductCardSkeleton } from '@/components/product/ProductCard'
import { ShopFilters } from './ShopFilters'

export const metadata: Metadata = {
  title: 'Tienda',
  description: 'Equipo de box y gym profesional. Guantes, cascos, vendas y más.',
}

interface PageProps {
  searchParams: Promise<{ cat?: string; sort?: string }>
}

export default async function ShopPage({ searchParams }: PageProps) {
  const { cat, sort } = await searchParams

  const supabase = await createClient()
  const { data: categories } = await supabase.from('categories').select('*').order('sort_order')

  const products = await getProducts(cat ? { categorySlug: cat } : undefined)

  const sorted = [...products].sort((a, b) => {
    if (sort === 'price_asc')  return a.price - b.price
    if (sort === 'price_desc') return b.price - a.price
    return 0
  })

  return (
    <div className="min-h-screen pt-[68px]">
      {/* Header */}
      <div className="max-w-[1400px] mx-auto px-6 pt-16 pb-10">
        <p className="section-tag mb-3">Catálogo</p>
        <h1 className="section-title">TODOS LOS<br />PRODUCTOS</h1>
      </div>

      {/* Ticker */}
      <div className="border-y border-white/7 overflow-hidden py-3 mb-10">
        <div className="flex animate-ticker whitespace-nowrap">
          {Array.from({ length: 4 }).map((_, i) => (
            <span key={i} className="font-display text-lg tracking-[4px] text-white/20 px-10">
              GUANTES · CASCOS · VENDAS · SHORTS · SACOS · PROTECCIÓN · ENTRENAMIENTO ·
            </span>
          ))}
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-6 pb-24">
        {/* Filters */}
        <ShopFilters categories={categories ?? []} activecat={cat} activesort={sort} />

        {/* Grid */}
        <Suspense fallback={<ProductGridSkeleton />}>
          {sorted.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-px bg-white/5">
              {sorted.map((product, i) => (
                <div key={product.id} className="bg-[#060606]">
                  <ProductCard product={product} priority={i < 4} />
                </div>
              ))}
            </div>
          )}
        </Suspense>
      </div>
    </div>
  )
}

function ProductGridSkeleton() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-px bg-white/5">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="bg-[#060606]"><ProductCardSkeleton /></div>
      ))}
    </div>
  )
}

function EmptyState() {
  return (
    <div className="py-32 text-center">
      <p className="font-display text-4xl tracking-widest text-white/10 mb-4">SIN RESULTADOS</p>
      <p className="text-white/40 text-sm">No hay productos en esta categoría todavía.</p>
    </div>
  )
}
