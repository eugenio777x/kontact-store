import { createClient } from '@/lib/supabase/server'
import { ProductForm } from '@/components/admin/ProductForm'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default async function NewProductPage() {
  const supabase = await createClient()
  const { data: categories } = await supabase.from('categories').select('*').order('sort_order')

  return (
    <div className="p-8 space-y-8">
      <div>
        <Link href="/admin/products" className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-white/30 hover:text-white transition-colors mb-6">
          <ArrowLeft size={13} /> Productos
        </Link>
        <p className="section-tag mb-2">Nuevo</p>
        <h1 className="font-display text-5xl tracking-widest">CREAR PRODUCTO</h1>
      </div>
      <ProductForm categories={categories ?? []} />
    </div>
  )
}
