import { getOrders } from '@/lib/actions/orders'
import { getAllProductsAdmin } from '@/lib/actions/products'
import { formatPrice } from '@/lib/utils'
import { ShoppingBag, Package, DollarSign, TrendingUp } from 'lucide-react'

export default async function AdminDashboard() {
  const [orders, products] = await Promise.all([
    getOrders({ limit: 5 }),
    getAllProductsAdmin(),
  ])

  const paidOrders  = orders.filter(o => o.status === 'paid' || o.status === 'shipped' || o.status === 'delivered')
  const totalRevenue = paidOrders.reduce((s, o) => s + o.total, 0)
  const totalOrders  = orders.length

  const stats = [
    { label: 'Ingresos',   value: formatPrice(totalRevenue),     icon: DollarSign,  },
    { label: 'Órdenes',    value: totalOrders,                   icon: ShoppingBag, },
    { label: 'Productos',  value: products.length,               icon: Package,     },
    { label: 'Tasa pago',  value: `${Math.round((paidOrders.length / Math.max(totalOrders, 1)) * 100)}%`, icon: TrendingUp },
  ]

  const statusColor: Record<string, string> = {
    pending:   'text-[#f5c000]',
    paid:      'text-green-400',
    shipped:   'text-blue-400',
    delivered: 'text-green-500',
    cancelled: 'text-white/30',
    refunded:  'text-orange-400',
  }

  return (
    <div className="p-8 space-y-10">
      <div>
        <p className="section-tag mb-2">Admin</p>
        <h1 className="font-display text-5xl tracking-widest">DASHBOARD</h1>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(s => (
          <div key={s.label} className="bg-[#0d0d0d] border border-white/7 p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] font-bold tracking-[3px] uppercase text-white/40">{s.label}</span>
              <s.icon size={16} className="text-brand-red" />
            </div>
            <p className="font-display text-3xl tracking-wider">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Recent orders */}
      <div>
        <h2 className="text-[11px] font-bold tracking-[3px] uppercase text-white/40 mb-5">Órdenes recientes</h2>
        <div className="border border-white/7 overflow-hidden">
          <table className="w-full text-[13px]">
            <thead className="bg-white/3 border-b border-white/7">
              <tr>
                {['ID', 'Cliente', 'Total', 'Estado', 'Fecha'].map(h => (
                  <th key={h} className="text-left px-5 py-3 text-[10px] font-bold tracking-[2px] uppercase text-white/40">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {orders.map(order => (
                <tr key={order.id} className="border-b border-white/5 hover:bg-white/2 transition-colors">
                  <td className="px-5 py-4 font-mono text-[12px] text-white/40">{order.id.slice(0, 8)}…</td>
                  <td className="px-5 py-4">{order.customer_name ?? order.customer_email}</td>
                  <td className="px-5 py-4 font-bold">{formatPrice(order.total)}</td>
                  <td className="px-5 py-4">
                    <span className={`text-[10px] font-bold uppercase tracking-widest ${statusColor[order.status] ?? ''}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-white/40">
                    {new Date(order.created_at).toLocaleDateString('es-MX')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {orders.length === 0 && (
            <p className="text-center py-12 text-white/20 text-[13px]">Sin órdenes todavía</p>
          )}
        </div>
      </div>
    </div>
  )
}
