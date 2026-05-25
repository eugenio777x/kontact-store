import { notFound } from 'next/navigation'
import { createServiceClient } from '@/lib/supabase/server'
import { ProductForm } from '@/components/admin/ProductForm'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import type { Product } from '@/types'

interface Props {
  params: Promise<{ id: string }>
}

export default async function EditProductPage({ params }: Props) {
  const { id } = await params
  const supabase = await createServiceClient()

  const [{ data: product }, { data: categories }] = await Promise.all([
    supabase.from('products').select('*, category:categories(*), variants:product_variants(*)').eq('id', id).single(),
    supabase.from('categories').select('*').order('sort_order'),
  ])

  if (!product) notFound()

  return (
    <div className="p-8 space-y-8">
      <div>
        <Link href="/admin/products" className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-white/30 hover:text-white transition-colors mb-6">
          <ArrowLeft size={13} /> Productos
        </Link>
        <p className="section-tag mb-2">Editar</p>
        <h1 className="font-display text-5xl tracking-widest">{product.name}</h1>
      </div>
      <ProductForm product={product as Product} categories={categories ?? []} />
    </div>
  )
}
