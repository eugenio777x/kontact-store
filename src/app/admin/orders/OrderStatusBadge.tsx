import { cn } from '@/lib/utils'
import type { OrderStatus } from '@/types'

const config: Record<OrderStatus, { label: string; className: string }> = {
  pending:   { label: 'Pendiente',  className: 'text-[#f5c000] bg-[#f5c000]/10' },
  paid:      { label: 'Pagado',     className: 'text-green-400 bg-green-400/10'  },
  shipped:   { label: 'Enviado',    className: 'text-blue-400 bg-blue-400/10'    },
  delivered: { label: 'Entregado',  className: 'text-green-500 bg-green-500/10'  },
  cancelled: { label: 'Cancelado',  className: 'text-white/30 bg-white/5'        },
  refunded:  { label: 'Reembolsado',className: 'text-orange-400 bg-orange-400/10'},
}

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  const { label, className } = config[status] ?? config.pending
  return (
    <span className={cn('px-2 py-1 text-[10px] font-black tracking-[2px] uppercase', className)}>
      {label}
    </span>
  )
}
