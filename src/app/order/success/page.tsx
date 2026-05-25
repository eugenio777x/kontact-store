import { CheckCircle, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { getOrderBySessionId } from '@/lib/actions/orders'
import { formatPrice } from '@/lib/utils'

interface Props {
  searchParams: Promise<{ session_id?: string }>
}

export default async function SuccessPage({ searchParams }: Props) {
  const { session_id } = await searchParams
  const order = session_id ? await getOrderBySessionId(session_id) : null

  return (
    <div className="min-h-screen pt-[68px] flex items-center justify-center px-6">
      <div className="max-w-md w-full text-center space-y-8">
        <div className="flex justify-center">
          <CheckCircle size={72} className="text-brand-red" strokeWidth={1.5} />
        </div>

        <div>
          <h1 className="font-display text-5xl tracking-widest mb-3">¡LISTO!</h1>
          <p className="text-white/50 text-[14px] leading-relaxed">
            Tu pedido fue confirmado. Te contactaremos pronto para coordinar el envío.
          </p>
        </div>

        {order && (
          <div className="bg-[#0d0d0d] border border-white/7 p-6 text-left space-y-3">
            <p className="text-[10px] font-bold tracking-[3px] uppercase text-white/30">Resumen del pedido</p>
            <div className="space-y-2">
              {order.items?.map(item => (
                <div key={item.id} className="flex justify-between text-[13px]">
                  <span className="text-white/60">{item.name} x{item.quantity}</span>
                  <span>{formatPrice(item.price * item.quantity)}</span>
                </div>
              ))}
            </div>
            <div className="h-px bg-white/7 pt-2" />
            <div className="flex justify-between font-bold">
              <span>Total</span>
              <span className="text-brand-red font-display text-xl tracking-wider">{formatPrice(order.total)}</span>
            </div>
          </div>
        )}

        <div className="flex flex-col gap-3">
          <Link href="/shop" className="btn-primary gap-2">
            Seguir comprando
            <ArrowRight size={15} />
          </Link>
          <Link href="/" className="text-[12px] text-white/30 hover:text-white/60 uppercase tracking-widest transition-colors">
            Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  )
}
