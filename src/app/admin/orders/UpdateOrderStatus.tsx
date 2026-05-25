'use client'

import { useState } from 'react'
import { updateOrderStatus } from '@/lib/actions/orders'
import { toast } from 'sonner'
import type { OrderStatus } from '@/types'

const OPTIONS: OrderStatus[] = ['pending', 'paid', 'shipped', 'delivered', 'cancelled', 'refunded']

interface Props { orderId: string; currentStatus: OrderStatus }

export function UpdateOrderStatus({ orderId, currentStatus }: Props) {
  const [status, setStatus] = useState<OrderStatus>(currentStatus)
  const [loading, setLoading] = useState(false)

  async function handleChange(newStatus: OrderStatus) {
    setLoading(true)
    try {
      await updateOrderStatus(orderId, newStatus)
      setStatus(newStatus)
      toast.success('Estado actualizado')
    } catch {
      toast.error('Error al actualizar estado')
    } finally {
      setLoading(false)
    }
  }

  return (
    <select
      value={status}
      onChange={e => handleChange(e.target.value as OrderStatus)}
      disabled={loading}
      className="bg-transparent border border-white/10 text-white/70 text-[11px] font-bold tracking-widest uppercase px-3 py-1.5 outline-none hover:border-white/30 cursor-pointer disabled:opacity-50"
    >
      {OPTIONS.map(o => (
        <option key={o} value={o} className="bg-[#0d0d0d] text-white">{o}</option>
      ))}
    </select>
  )
}
