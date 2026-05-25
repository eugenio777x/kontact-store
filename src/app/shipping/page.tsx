import type { Metadata } from 'next'
import { Truck, RotateCcw, Clock, MapPin } from 'lucide-react'
import { formatPrice } from '@/lib/utils'
import { FREE_SHIPPING_THRESHOLD, SHIPPING_COST } from '@/lib/stripe'

export const metadata: Metadata = {
  title: 'Envíos y Devoluciones',
}

const FAQS = [
  { q: '¿Cuánto tarda mi pedido?', a: 'Enviamos en 24–48 horas hábiles. Entregas en Saltillo el mismo día o siguiente. Resto del país 2–5 días hábiles.' },
  { q: '¿Cómo rastreo mi pedido?', a: 'Recibirás un número de rastreo por WhatsApp una vez que tu pedido sea enviado.' },
  { q: '¿Puedo recoger en tienda?', a: 'Sí. Escríbenos al 844-340-3296 para coordinar la recogida en Saltillo.' },
  { q: '¿Qué pasa si mi producto llega dañado?', a: 'Escríbenos de inmediato con fotos al WhatsApp. Lo reemplazamos sin costo.' },
]

export default function ShippingPage() {
  return (
    <div className="min-h-screen pt-[68px]">
      <div className="max-w-[900px] mx-auto px-6 py-20 space-y-20">

        <div>
          <p className="section-tag mb-3">Políticas</p>
          <h1 className="section-title">ENVÍOS Y<br />DEVOLUCIONES</h1>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          {[
            { icon: Truck,      title: 'Envío gratis',       desc: `En pedidos mayores a ${formatPrice(FREE_SHIPPING_THRESHOLD)} MXN` },
            { icon: Clock,      title: 'Envío estándar',     desc: `${formatPrice(SHIPPING_COST)} MXN · 2–5 días hábiles` },
            { icon: MapPin,     title: 'Saltillo express',   desc: 'Entrega mismo día o siguiente' },
            { icon: RotateCcw,  title: 'Devoluciones',       desc: '30 días · producto sin usar' },
          ].map(item => (
            <div key={item.title} className="bg-[#0d0d0d] border border-white/7 p-6 flex gap-4">
              <item.icon size={20} className="text-brand-red flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-[14px] mb-1">{item.title}</p>
                <p className="text-[13px] text-white/40">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-6">
          <h2 className="font-display text-3xl tracking-widest">PREGUNTAS FRECUENTES</h2>
          <div className="divide-y divide-white/7">
            {FAQS.map(faq => (
              <div key={faq.q} className="py-6">
                <p className="font-bold text-[15px] mb-2">{faq.q}</p>
                <p className="text-[14px] text-white/50 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-brand-red/10 border border-brand-red/20 p-8 text-center">
          <p className="font-display text-2xl tracking-widest mb-3">¿TIENES DUDAS?</p>
          <p className="text-[14px] text-white/50 mb-6">Escríbenos directo por WhatsApp</p>
          <a
            href="https://wa.me/528443403296"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary gap-2"
          >
            Contactar WhatsApp
          </a>
        </div>
      </div>
    </div>
  )
}
