'use client'

import { useState } from 'react'
import { Trash2 } from 'lucide-react'
import { deleteProduct } from '@/lib/actions/products'
import { toast } from 'sonner'

interface Props { id: string; name: string }

export function DeleteProductButton({ id, name }: Props) {
  const [confirming, setConfirming] = useState(false)

  async function handleDelete() {
    if (!confirming) { setConfirming(true); return }
    try {
      await deleteProduct(id)
      toast.success(`"${name}" eliminado`)
    } catch {
      toast.error('Error al eliminar el producto')
    } finally {
      setConfirming(false)
    }
  }

  return (
    <button
      onClick={handleDelete}
      onBlur={() => setConfirming(false)}
      className={`transition-colors ${confirming ? 'text-brand-red' : 'text-white/30 hover:text-brand-red'}`}
      title={confirming ? 'Click de nuevo para confirmar' : 'Eliminar'}
    >
      <Trash2 size={15} />
    </button>
  )
}
