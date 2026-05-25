import { getOrders } from '@/lib/actions/orders'
import { formatPrice } from '@/lib/utils'
import { OrderStatusBadge } from './OrderStatusBadge'
import { UpdateOrderStatus } from './UpdateOrderStatus'
import type { OrderStatus } from '@/types'

const STATUS_OPTIONS: OrderStatus[] = ['pending', 'paid', 'shipped', 'delivered', 'cancelled', 'refunded']

interface Props {
  searchParams: Promise<{ status?: string }>
}

export default async function AdminOrdersPage({ searchParams }: Props) {
  const { status } = await searchParams
  const orders = await getOrders(status ? { status: status as OrderStatus } : undefined)

  return (
    <div className="p-8 space-y-8">
      <div>
        <p className="section-tag mb-2">Gestión</p>
        <h1 className="font-display text-5xl tracking-widest">ÓRDENES</h1>
      </div>

      {/* Status filter */}
      <div className="flex flex-wrap gap-2">
        <a href="/admin/orders" className={`px-4 py-2 text-[11px] font-bold tracking-[2px] uppercase border transition-all ${!status ? 'border-brand-red text-white bg-brand-red/10' : 'border-white/10 text-white/50 hover:border-white/30 hover:text-white'}`}>
          Todas
        </a>
        {STATUS_OPTIONS.map(s => (
          <a key={s} href={`/admin/orders?status=${s}`}
            className={`px-4 py-2 text-[11px] font-bold tracking-[2px] uppercase border transition-all ${status === s ? 'border-brand-red text-white bg-brand-red/10' : 'border-white/10 text-white/50 hover:border-white/30 hover:text-white'}`}
          >
            {s}
          </a>
        ))}
      </div>

      <div className="border border-white/7 overflow-x-auto">
        <table className="w-full text-[13px] min-w-[800px]">
          <thead className="bg-white/3 border-b border-white/7">
            <tr>
              {['ID', 'Cliente', 'Email', 'Total', 'Estado', 'Fecha', 'Acciones'].map(h => (
                <th key={h} className="text-left px-5 py-3 text-[10px] font-bold tracking-[2px] uppercase text-white/40">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order.id} className="border-b border-white/5 hover:bg-white/2 transition-colors">
                <td className="px-5 py-4 font-mono text-[11px] text-white/40">{order.id.slice(0, 8)}…</td>
                <td className="px-5 py-4 font-semibold">{order.customer_name ?? '—'}</td>
                <td className="px-5 py-4 text-white/50">{order.customer_email}</td>
                <td className="px-5 py-4 font-bold">{formatPrice(order.total)}</td>
                <td className="px-5 py-4">
                  <OrderStatusBadge status={order.status} />
                </td>
                <td className="px-5 py-4 text-white/40 text-[12px]">
                  {new Date(order.created_at).toLocaleDateString('es-MX')}
                </td>
                <td className="px-5 py-4">
                  <UpdateOrderStatus orderId={order.id} currentStatus={order.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {orders.length === 0 && (
          <p className="text-center py-12 text-white/20 text-[13px]">Sin órdenes</p>
        )}
      </div>
    </div>
  )
}
