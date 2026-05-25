'use server'

import { createClient, createServiceClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { slugify } from '@/lib/utils'
import type { Product } from '@/types'

// ── Queries ──

export async function getProducts(opts?: {
  categorySlug?: string
  featured?: boolean
  limit?: number
}) {
  const supabase = await createClient()
  let query = supabase
    .from('products')
    .select('*, category:categories(*), variants:product_variants(*)')
    .eq('is_active', true)
    .order('created_at', { ascending: false })

  if (opts?.categorySlug) {
    query = query.eq('categories.slug', opts.categorySlug)
  }
  if (opts?.featured) {
    query = query.eq('is_featured', true)
  }
  if (opts?.limit) {
    query = query.limit(opts.limit)
  }

  const { data, error } = await query
  if (error) throw new Error(error.message)
  return (data ?? []) as Product[]
}

export async function getProductBySlug(slug: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('products')
    .select('*, category:categories(*), variants:product_variants(*)')
    .eq('slug', slug)
    .eq('is_active', true)
    .single()

  if (error) return null
  return data as Product
}

export async function getAllProductsAdmin() {
  const supabase = await createServiceClient()
  const { data, error } = await supabase
    .from('products')
    .select('*, category:categories(*), variants:product_variants(*)')
    .order('created_at', { ascending: false })

  if (error) throw new Error(error.message)
  return (data ?? []) as Product[]
}

// ── Mutations ──

const ProductSchema = z.object({
  name:          z.string().min(2),
  description:   z.string().optional(),
  price:         z.coerce.number().positive(),
  compare_price: z.coerce.number().optional().nullable(),
  category_id:   z.string().uuid().optional().nullable(),
  is_active:     z.coerce.boolean().default(true),
  is_featured:   z.coerce.boolean().default(false),
  images:        z.array(z.string().url()).default([]),
})

export async function createProduct(formData: FormData) {
  const supabase = await createServiceClient()
  const raw = Object.fromEntries(formData)
  const parsed = ProductSchema.parse({
    ...raw,
    images: formData.getAll('images'),
  })

  const slug = slugify(parsed.name)

  const { data, error } = await supabase
    .from('products')
    .insert({ ...parsed, slug })
    .select()
    .single()

  if (error) throw new Error(error.message)
  revalidatePath('/shop')
  revalidatePath('/admin/products')
  return data as Product
}

export async function updateProduct(id: string, formData: FormData) {
  const supabase = await createServiceClient()
  const raw = Object.fromEntries(formData)
  const parsed = ProductSchema.partial().parse({
    ...raw,
    images: formData.getAll('images'),
  })

  const { data, error } = await supabase
    .from('products')
    .update(parsed)
    .eq('id', id)
    .select()
    .single()

  if (error) throw new Error(error.message)
  revalidatePath('/shop')
  revalidatePath(`/product/${data.slug}`)
  revalidatePath('/admin/products')
  return data as Product
}

export async function deleteProduct(id: string) {
  const supabase = await createServiceClient()
  const { error } = await supabase.from('products').delete().eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/shop')
  revalidatePath('/admin/products')
}

export async function updateVariantStock(variantId: string, stock: number) {
  const supabase = await createServiceClient()
  const { error } = await supabase
    .from('product_variants')
    .update({ stock })
    .eq('id', variantId)

  if (error) throw new Error(error.message)
  revalidatePath('/admin/products')
}
