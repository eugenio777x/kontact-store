import Link from 'next/link'
import { getAllProductsAdmin } from '@/lib/actions/products'
import { formatPrice } from '@/lib/utils'
import { Plus, Edit } from 'lucide-react'
import { DeleteProductButton } from './DeleteProductButton'
import Image from 'next/image'

export default async function AdminProductsPage() {
  const products = await getAllProductsAdmin()

  return (
    <div className="p-8 space-y-8">
      <div className="flex items-end justify-between">
        <div>
          <p className="section-tag mb-2">Inventario</p>
          <h1 className="font-display text-5xl tracking-widest">PRODUCTOS</h1>
        </div>
        <Link href="/admin/products/new" className="btn-primary gap-2">
          <Plus size={15} />
          Nuevo producto
        </Link>
      </div>

      <div className="border border-white/7 overflow-hidden">
        <table className="w-full text-[13px]">
          <thead className="bg-white/3 border-b border-white/7">
            <tr>
              {['', 'Producto', 'Precio', 'Stock total', 'Estado', 'Acciones'].map(h => (
                <th key={h} className="text-left px-5 py-3 text-[10px] font-bold tracking-[2px] uppercase text-white/40">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {products.map(product => {
              const totalStock = product.variants?.reduce((s, v) => s + v.stock, 0) ?? 0
              const img = product.images[0]
              return (
                <tr key={product.id} className="border-b border-white/5 hover:bg-white/2 transition-colors">
                  <td className="px-5 py-4 w-16">
                    <div className="w-12 h-12 relative bg-white/5 overflow-hidden">
                      {img && <Image src={img} alt={product.name} fill className="object-cover" />}
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <p className="font-semibold">{product.name}</p>
                    <p className="text-[11px] text-white/30 mt-0.5">{product.slug}</p>
                  </td>
                  <td className="px-5 py-4 font-bold">{formatPrice(product.price)}</td>
                  <td className="px-5 py-4">
                    <span className={totalStock === 0 ? 'text-brand-red' : totalStock <= 5 ? 'text-[#f5c000]' : 'text-white/60'}>
                      {totalStock} uds
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`text-[10px] font-bold uppercase tracking-widest ${product.is_active ? 'text-green-400' : 'text-white/30'}`}>
                      {product.is_active ? 'Activo' : 'Oculto'}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <Link href={`/admin/products/${product.id}`} className="text-white/40 hover:text-white transition-colors">
                        <Edit size={15} />
                      </Link>
                      <DeleteProductButton id={product.id} name={product.name} />
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
        {products.length === 0 && (
          <p className="text-center py-12 text-white/20 text-[13px]">Sin productos. Crea el primero.</p>
        )}
      </div>
    </div>
  )
}
