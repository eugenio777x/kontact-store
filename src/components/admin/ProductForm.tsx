'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { createProduct, updateProduct } from '@/lib/actions/products'
import { toast } from 'sonner'
import { Plus, Trash2, Upload, X } from 'lucide-react'
import Image from 'next/image'
import type { Product, ProductVariant, Category } from '@/types'

interface Props {
  product?: Product
  categories: Category[]
}

interface VariantDraft {
  id?: string
  size: string
  color: string
  color_hex: string
  sku: string
  stock: number
  price_mod: number
}

export function ProductForm({ product, categories }: Props) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [uploading, setUploading] = useState(false)
  const [images, setImages] = useState<string[]>(product?.images ?? [])
  const [variants, setVariants] = useState<VariantDraft[]>(
    product?.variants?.map(v => ({
      id:        v.id,
      size:      v.size ?? '',
      color:     v.color ?? '',
      color_hex: v.color_hex ?? '',
      sku:       v.sku ?? '',
      stock:     v.stock,
      price_mod: v.price_mod,
    })) ?? [{ size: '', color: '', color_hex: '', sku: '', stock: 0, price_mod: 0 }]
  )

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files
    if (!files || files.length === 0) return
    setUploading(true)

    const supabase = createClient()
    const uploaded: string[] = []

    for (const file of Array.from(files)) {
      const ext  = file.name.split('.').pop()
      const path = `products/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
      const { error } = await supabase.storage.from('products').upload(path, file, { upsert: true })
      if (error) { toast.error(`Error subiendo ${file.name}`); continue }
      const { data: { publicUrl } } = supabase.storage.from('products').getPublicUrl(path)
      uploaded.push(publicUrl)
    }

    setImages(prev => [...prev, ...uploaded])
    setUploading(false)
    e.target.value = ''
  }

  function removeImage(url: string) {
    setImages(prev => prev.filter(i => i !== url))
  }

  function addVariant() {
    setVariants(prev => [...prev, { size: '', color: '', color_hex: '', sku: '', stock: 0, price_mod: 0 }])
  }

  function removeVariant(idx: number) {
    setVariants(prev => prev.filter((_, i) => i !== idx))
  }

  function updateVariant(idx: number, field: keyof VariantDraft, value: string | number) {
    setVariants(prev => prev.map((v, i) => i === idx ? { ...v, [field]: value } : v))
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const formData = new FormData(form)
    images.forEach(url => formData.append('images', url))

    startTransition(async () => {
      try {
        const supabase = createClient()

        if (product) {
          await updateProduct(product.id, formData)
          // Upsert variants
          for (const v of variants) {
            if (v.id) {
              await supabase.from('product_variants').update({
                size: v.size || null, color: v.color || null, color_hex: v.color_hex || null,
                sku: v.sku || null, stock: v.stock, price_mod: v.price_mod,
              }).eq('id', v.id)
            } else {
              await supabase.from('product_variants').insert({
                product_id: product.id,
                size: v.size || null, color: v.color || null, color_hex: v.color_hex || null,
                sku: v.sku || null, stock: v.stock, price_mod: v.price_mod,
              })
            }
          }
          toast.success('Producto actualizado')
        } else {
          const created = await createProduct(formData)
          if (variants.length > 0) {
            await supabase.from('product_variants').insert(
              variants.map(v => ({
                product_id: created.id,
                size: v.size || null, color: v.color || null, color_hex: v.color_hex || null,
                sku: v.sku || null, stock: v.stock, price_mod: v.price_mod,
              }))
            )
          }
          toast.success('Producto creado')
        }
        router.push('/admin/products')
      } catch (err: unknown) {
        toast.error(err instanceof Error ? err.message : 'Error al guardar')
      }
    })
  }

  const inputCls = 'w-full bg-white/4 border border-white/10 focus:border-brand-red text-white px-4 py-3 outline-none text-[14px] transition-colors placeholder:text-white/20'
  const labelCls = 'block text-[10px] font-bold tracking-[3px] uppercase text-white/40 mb-2'

  return (
    <form onSubmit={handleSubmit} className="space-y-10 max-w-3xl">

      {/* Basic info */}
      <div className="space-y-5">
        <h2 className="text-[11px] font-bold tracking-[3px] uppercase text-white/30 pb-3 border-b border-white/7">
          Información básica
        </h2>

        <div className="grid grid-cols-2 gap-5">
          <div className="col-span-2">
            <label className={labelCls}>Nombre del producto *</label>
            <input name="name" defaultValue={product?.name} required className={inputCls} placeholder="Guantes Pro Series" />
          </div>
          <div>
            <label className={labelCls}>Precio (MXN) *</label>
            <input name="price" type="number" step="0.01" defaultValue={product?.price} required className={inputCls} placeholder="850" />
          </div>
          <div>
            <label className={labelCls}>Precio anterior</label>
            <input name="compare_price" type="number" step="0.01" defaultValue={product?.compare_price ?? ''} className={inputCls} placeholder="1200" />
          </div>
          <div>
            <label className={labelCls}>Categoría</label>
            <select name="category_id" defaultValue={product?.category_id ?? ''} className={`${inputCls} cursor-pointer`}>
              <option value="">Sin categoría</option>
              {categories.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          <div className="flex items-end gap-6 pb-1">
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" name="is_active" defaultChecked={product?.is_active ?? true} className="w-4 h-4 accent-brand-red" />
              <span className="text-[12px] font-semibold text-white/60 uppercase tracking-wider">Activo</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" name="is_featured" defaultChecked={product?.is_featured ?? false} className="w-4 h-4 accent-brand-red" />
              <span className="text-[12px] font-semibold text-white/60 uppercase tracking-wider">Destacado</span>
            </label>
          </div>
        </div>

        <div>
          <label className={labelCls}>Descripción</label>
          <textarea
            name="description"
            defaultValue={product?.description ?? ''}
            rows={4}
            className={`${inputCls} resize-none`}
            placeholder="Describe el producto..."
          />
        </div>
      </div>

      {/* Images */}
      <div className="space-y-4">
        <h2 className="text-[11px] font-bold tracking-[3px] uppercase text-white/30 pb-3 border-b border-white/7">
          Imágenes
        </h2>
        <div className="flex flex-wrap gap-3">
          {images.map(url => (
            <div key={url} className="relative w-24 h-28 bg-white/5 overflow-hidden group">
              <Image src={url} alt="" fill className="object-cover" />
              <button
                type="button"
                onClick={() => removeImage(url)}
                className="absolute top-1 right-1 w-6 h-6 bg-black/70 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X size={12} />
              </button>
            </div>
          ))}
          <label className="w-24 h-28 border-2 border-dashed border-white/15 hover:border-brand-red/50 flex flex-col items-center justify-center gap-1 cursor-pointer transition-colors">
            {uploading ? (
              <span className="text-[10px] text-white/40">Subiendo...</span>
            ) : (
              <>
                <Upload size={18} className="text-white/30" />
                <span className="text-[10px] text-white/30 uppercase tracking-wider">Subir</span>
              </>
            )}
            <input type="file" accept="image/*" multiple className="hidden" onChange={handleImageUpload} disabled={uploading} />
          </label>
        </div>
      </div>

      {/* Variants */}
      <div className="space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-white/7">
          <h2 className="text-[11px] font-bold tracking-[3px] uppercase text-white/30">Variantes (talla / color / stock)</h2>
          <button type="button" onClick={addVariant} className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-brand-red hover:text-white transition-colors">
            <Plus size={13} /> Agregar
          </button>
        </div>

        <div className="space-y-3">
          {variants.map((v, i) => (
            <div key={i} className="grid grid-cols-6 gap-3 items-end">
              <div>
                <label className={labelCls}>Talla</label>
                <input value={v.size} onChange={e => updateVariant(i, 'size', e.target.value)} className={inputCls} placeholder="12oz" />
              </div>
              <div>
                <label className={labelCls}>Color</label>
                <input value={v.color} onChange={e => updateVariant(i, 'color', e.target.value)} className={inputCls} placeholder="Rojo" />
              </div>
              <div>
                <label className={labelCls}>Hex</label>
                <input value={v.color_hex} onChange={e => updateVariant(i, 'color_hex', e.target.value)} className={inputCls} placeholder="#e8002d" />
              </div>
              <div>
                <label className={labelCls}>Stock</label>
                <input type="number" min="0" value={v.stock} onChange={e => updateVariant(i, 'stock', Number(e.target.value))} className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>+Precio</label>
                <input type="number" step="0.01" value={v.price_mod} onChange={e => updateVariant(i, 'price_mod', Number(e.target.value))} className={inputCls} placeholder="0" />
              </div>
              <button type="button" onClick={() => removeVariant(i)} className="h-[46px] flex items-center justify-center text-white/20 hover:text-brand-red transition-colors border border-white/7 hover:border-brand-red/30">
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Submit */}
      <div className="flex gap-4 pt-4">
        <button type="submit" disabled={isPending || uploading} className="btn-primary gap-2">
          {isPending ? 'Guardando...' : product ? 'Actualizar producto' : 'Crear producto'}
        </button>
        <button type="button" onClick={() => router.back()} className="btn-ghost">
          Cancelar
        </button>
      </div>
    </form>
  )
}
