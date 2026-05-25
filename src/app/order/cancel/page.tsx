import { XCircle } from 'lucide-react'
import Link from 'next/link'

export default function CancelPage() {
  return (
    <div className="min-h-screen pt-[68px] flex items-center justify-center px-6">
      <div className="max-w-md w-full text-center space-y-8">
        <XCircle size={72} className="text-white/20 mx-auto" strokeWidth={1.5} />
        <div>
          <h1 className="font-display text-5xl tracking-widest mb-3">CANCELADO</h1>
          <p className="text-white/40 text-[14px]">El pago fue cancelado. Tu carrito sigue guardado.</p>
        </div>
        <div className="flex flex-col gap-3">
          <Link href="/checkout" className="btn-primary">Volver al checkout</Link>
          <Link href="/shop" className="btn-ghost">Ver tienda</Link>
        </div>
      </div>
    </div>
  )
}
