import type { Metadata } from 'next'
import { MapPin, Phone, Clock, Instagram } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Contacto',
}

export default function ContactPage() {
  return (
    <div className="min-h-screen pt-[68px]">
      <div className="max-w-[900px] mx-auto px-6 py-20 space-y-16">

        <div>
          <p className="section-tag mb-3">Contacto</p>
          <h1 className="section-title">HABLEMOS</h1>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          {[
            { icon: Phone,     label: 'WhatsApp',  value: '844-340-3296',          href: 'https://wa.me/528443403296' },
            { icon: Instagram, label: 'Instagram', value: '@kontact_mx',            href: 'https://instagram.com/kontact_mx' },
            { icon: MapPin,    label: 'Ubicación', value: 'Saltillo, Coahuila',     href: null },
            { icon: Clock,     label: 'Horario',   value: 'Lun–Sáb 10am – 7pm',    href: null },
          ].map(item => (
            <div key={item.label} className="bg-[#0d0d0d] border border-white/7 p-6 flex gap-4">
              <item.icon size={18} className="text-brand-red flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-[10px] font-bold tracking-[3px] uppercase text-white/30 mb-1">{item.label}</p>
                {item.href ? (
                  <a href={item.href} target="_blank" rel="noopener noreferrer" className="font-semibold text-[14px] hover:text-brand-red transition-colors">
                    {item.value}
                  </a>
                ) : (
                  <p className="font-semibold text-[14px]">{item.value}</p>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="bg-brand-red p-10 text-center space-y-5">
          <p className="font-display text-4xl tracking-widest">¿LISTO PARA ENTRENAR?</p>
          <p className="text-[14px] text-white/70">La forma más rápida es por WhatsApp. Respondemos en minutos.</p>
          <a
            href="https://wa.me/528443403296?text=Hola%20KONTACT%2C%20quiero%20información%20sobre%20sus%20productos"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-white text-brand-red font-bold uppercase tracking-widest text-sm px-8 py-4 hover:bg-white/90 transition-colors"
          >
            <Phone size={15} />
            Escribir ahora
          </a>
        </div>
      </div>
    </div>
  )
}
