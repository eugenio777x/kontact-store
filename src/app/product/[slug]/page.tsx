import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getProductBySlug, getProducts } from '@/lib/actions/products'
import { ProductGallery } from './ProductGallery'
import { ProductActions } from './ProductActions'
import { ProductCard } from '@/components/product/ProductCard'
import { formatPrice } from '@/lib/utils'
import { FREE_SHIPPING_THRESHOLD } from '@/lib/stripe'
import { Truck, RotateCcw, Shield } from 'lucide-react'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const product = await getProductBySlug(slug)
  if (!product) return {}
  return {
    title: product.name,
    description: product.description ?? undefined,
    openGraph: {
      images: product.images[0] ? [{ url: product.images[0] }] : [],
    },
  }
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params
  const [product, related] = await Promise.all([
    getProductBySlug(slug),
    getProducts({ limit: 4 }),
  ])

  if (!product) notFound()

  const relatedProducts = related.filter(p => p.id !== product.id).slice(0, 4)

  return (
    <div className="min-h-screen pt-[68px]">
      <div className="max-w-[1400px] mx-auto px-6 py-16">
        <div className="grid lg:grid-cols-2 gap-16 xl:gap-24">
          {/* Gallery */}
          <ProductGallery images={product.images} name={product.name} />

          {/* Info */}
          <div className="flex flex-col gap-7">
            {product.category && (
              <p className="section-tag">{product.category.name}</p>
            )}
            <h1 className="font-display text-5xl md:text-6xl tracking-wider leading-none">
              {product.name}
            </h1>

            {/* Price */}
            <div className="flex items-baseline gap-4">
              <span className="font-display text-4xl tracking-wider">{formatPrice(product.price)}</span>
              {product.compare_price && product.compare_price > product.price && (
                <span className="text-xl text-white/30 line-through">{formatPrice(product.compare_price)}</span>
              )}
            </div>

            <div className="h-px bg-white/7" />

            {/* Variant selector + Add to cart */}
            <ProductActions product={product} />

            <div className="h-px bg-white/7" />

            {/* Description */}
            {product.description && (
              <p className="text-[14px] text-white/60 leading-relaxed">{product.description}</p>
            )}

            {/* Perks */}
            <div className="grid grid-cols-1 gap-3 pt-2">
              <div className="flex items-center gap-3 text-[12px] text-white/50">
                <Truck size={14} className="text-brand-red flex-shrink-0" />
                Envío gratis en pedidos mayores a {formatPrice(FREE_SHIPPING_THRESHOLD)}
              </div>
              <div className="flex items-center gap-3 text-[12px] text-white/50">
                <RotateCcw size={14} className="text-brand-red flex-shrink-0" />
                Devoluciones en 30 días
              </div>
              <div className="flex items-center gap-3 text-[12px] text-white/50">
                <Shield size={14} className="text-brand-red flex-shrink-0" />
                Garantía de calidad KONTACT
              </div>
            </div>
          </div>
        </div>

        {/* Related products */}
        {relatedProducts.length > 0 && (
          <div className="mt-28">
            <div className="mb-10">
              <p className="section-tag mb-2">Descubre más</p>
              <h2 className="section-title">TAMBIÉN TE<br />PUEDE GUSTAR</h2>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-white/5">
              {relatedProducts.map(p => (
                <div key={p.id} className="bg-[#060606]">
                  <ProductCard product={p} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
