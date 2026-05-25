'use server'

import { createServiceClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import type { Order, OrderStatus } from '@/types'

export async function getOrders(opts?: { status?: OrderStatus; limit?: number }) {
  const supabase = await createServiceClient()
  let query = supabase
    .from('orders')
    .select('*, items:order_items(*)')
    .order('created_at', { ascending: false })

  if (opts?.status) query = query.eq('status', opts.status)
  if (opts?.limit)  query = query.limit(opts.limit)

  const { data, error } = await query
  if (error) throw new Error(error.message)
  return (data ?? []) as Order[]
}

export async function getOrderById(id: string) {
  const supabase = await createServiceClient()
  const { data, error } = await supabase
    .from('orders')
    .select('*, items:order_items(*)')
    .eq('id', id)
    .single()

  if (error) return null
  return data as Order
}

export async function getOrderBySessionId(sessionId: string) {
  const supabase = await createServiceClient()
  const { data, error } = await supabase
    .from('orders')
    .select('*, items:order_items(*)')
    .eq('stripe_session_id', sessionId)
    .single()

  if (error) return null
  return data as Order
}

export async function updateOrderStatus(id: string, status: OrderStatus, trackingNumber?: string) {
  const supabase = await createServiceClient()
  const { error } = await supabase
    .from('orders')
    .update({ status, ...(trackingNumber ? { tracking_number: trackingNumber } : {}) })
    .eq('id', id)

  if (error) throw new Error(error.message)
  revalidatePath('/admin/orders')
  revalidatePath(`/admin/orders/${id}`)
}
