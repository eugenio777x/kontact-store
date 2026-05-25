import Link from 'next/link'
import Image from 'next/image'
import { getProducts } from '@/lib/actions/products'
import { ProductCard } from '@/components/product/ProductCard'
import { formatPrice } from '@/lib/utils'
import { FREE_SHIPPING_THRESHOLD } from '@/lib/stripe'
import { ArrowRight, Truck, RotateCcw, Shield, Zap } from 'lucide-react'

export default async function HomePage() {
  const [featured, latest] = await Promise.all([
    getProducts({ featured: true, limit: 1 }),
    getProducts({ limit: 4 }),
  ])
  const hero = featured[0] ?? latest[0]

  const PERKS = [
    { icon: Truck,     label: 'Envío gratis',    sub: `+${formatPrice(FREE_SHIPPING_THRESHOLD)}` },
    { icon: RotateCcw, label: 'Devoluciones',    sub: '30 días'   },
    { icon: Shield,    label: 'Garantía',         sub: 'KONTACT'   },
    { icon: Zap,       label: 'Envío express',    sub: '24-48 hrs' },
  ]

  const TICKER = 'CALIDAD PRO · UNA CASA PARA LA GENTE QUE ENTRENA · GUANTES · CASCOS · VENDAS · SALTILLO MX · '

  return (
    <>
      {/* HERO */}
      <section className="relative min-h-screen flex items-end overflow-hidden">
        {/* BG */}
        {hero?.images[0] ? (
          <Image
            src={hero.images[0]}
            alt={hero.name}
            fill
            priority
            className="object-cover object-center"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-[#0a0a0a] via-[#111] to-[#060606]" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#060606] via-[#060606]/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#060606]/80 via-transparent to-transparent" />

        {/* Giant BG text */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
          <span className="font-display text-[20vw] text-white/3 tracking-widest leading-none whitespace-nowrap">
            KONTACT
          </span>
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-[1400px] mx-auto px-6 pb-20 pt-32 w-full">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-brand-red/15 border border-brand-red/25 px-4 py-2 mb-8">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-red animate-pulse" />
              <span className="text-[11px] font-bold tracking-[3px] uppercase text-brand-red">
                Saltillo, Coahuila · Envíos a todo México
              </span>
            </div>

            <h1 className="font-display leading-none mb-6">
              <span className="block text-[clamp(56px,9vw,130px)] tracking-wider text-white">EQUIPADOS</span>
              <span className="block text-[clamp(56px,9vw,130px)] tracking-wider text-brand-red">PARA PEGAR</span>
            </h1>

            <p className="text-[16px] text-white/50 leading-relaxed mb-10 max-w-[460px]">
              Una casa para la gente que entrena — no para la que mira. Equipo de box y gym profesional.
            </p>

            <div className="flex items-center gap-4 flex-wrap">
              <Link href="/shop" className="btn-primary gap-2">
                Ver tienda completa
                <ArrowRight size={15} />
              </Link>
              {hero && (
                <Link href={`/product/${hero.slug}`} className="btn-ghost">
                  Producto destacado
                </Link>
              )}
            </div>
          </div>

          {/* Hero stats */}
          <div className="absolute bottom-20 right-6 hidden lg:flex gap-10">
            {[['8+', 'Productos'], ['#1', 'En Saltillo'], ['100%', 'Calidad']].map(([v, l]) => (
              <div key={l} className="text-right">
                <p className="font-display text-4xl tracking-widest text-white leading-none">{v}</p>
                <p className="text-[10px] font-bold tracking-[3px] uppercase text-white/30 mt-1">{l}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TICKER */}
      <div className="border-y border-white/7 bg-[#0a0a0a] py-3 overflow-hidden">
        <div className="flex animate-ticker whitespace-nowrap">
          {Array.from({ length: 4 }).map((_, i) => (
            <span key={i} className="font-display text-lg tracking-[4px] text-white/15 px-8">
              {TICKER}
            </span>
          ))}
        </div>
      </div>

      {/* FEATURED PRODUCT */}
      {hero && (
        <section className="max-w-[1400px] mx-auto px-6 py-24">
          <div className="grid lg:grid-cols-2 gap-16 xl:gap-24 items-center">
            <div className="order-2 lg:order-1">
              <p className="section-tag mb-4">Producto estrella</p>
              <h2 className="font-display text-[clamp(40px,6vw,80px)] tracking-wider leading-none mb-6">
                {hero.name}
              </h2>
              {hero.description && (
                <p className="text-[15px] text-white/50 leading-relaxed mb-8 max-w-md">{hero.description}</p>
              )}
              <div className="flex items-baseline gap-5 mb-10">
                <span className="font-display text-4xl tracking-wider">{formatPrice(hero.price)}</span>
                {hero.compare_price && hero.compare_price > hero.price && (
                  <span className="text-xl text-white/25 line-through">{formatPrice(hero.compare_price)}</span>
                )}
              </div>
              <Link href={`/product/${hero.slug}`} className="btn-primary gap-2">
                Ver producto
                <ArrowRight size={15} />
              </Link>
            </div>
            <div className="order-1 lg:order-2 relative aspect-[4/5] overflow-hidden">
              {hero.images[0] ? (
                <Image src={hero.images[0]} alt={hero.name} fill className="object-cover" priority />
              ) : (
                <div className="w-full h-full bg-white/5 flex items-center justify-center">
                  <span className="font-display text-4xl tracking-widest text-white/10">KONTACT</span>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* LATEST PRODUCTS */}
      <section className="max-w-[1400px] mx-auto px-6 pb-24">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="section-tag mb-2">Catálogo</p>
            <h2 className="section-title">NUEVOS<br />PRODUCTOS</h2>
          </div>
          <Link href="/shop" className="text-[12px] font-bold uppercase tracking-widest text-white/40 hover:text-white transition-colors hidden sm:flex items-center gap-2">
            Ver todos <ArrowRight size={13} />
          </Link>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-white/5">
          {latest.map((product, i) => (
            <div key={product.id} className="bg-[#060606]">
              <ProductCard product={product} priority={i < 2} />
            </div>
          ))}
        </div>

        <div className="mt-10 text-center sm:hidden">
          <Link href="/shop" className="btn-ghost gap-2">Ver todos <ArrowRight size={13} /></Link>
        </div>
      </section>

      {/* PERKS */}
      <div className="border-t border-white/7 bg-[#0a0a0a]">
        <div className="max-w-[1400px] mx-auto px-6 py-16 grid grid-cols-2 lg:grid-cols-4 gap-8">
          {PERKS.map(p => (
            <div key={p.label} className="flex items-center gap-4">
              <p.icon size={22} className="text-brand-red flex-shrink-0" />
              <div>
                <p className="font-bold text-[14px] leading-tight">{p.label}</p>
                <p className="text-[12px] text-white/40 mt-0.5">{p.sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FOOTER */}
      <footer className="border-t border-white/7 px-6 py-12">
        <div className="max-w-[1400px] mx-auto flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
          <div>
            <Image src="/logo.png" alt="KONTACT" width={120} height={36} />
            <p className="text-[12px] text-white/30 mt-3 max-w-xs leading-relaxed">
              Equipo de box y gym profesional.<br />Saltillo, Coahuila · México
            </p>
          </div>
          <div className="grid grid-cols-2 gap-x-16 gap-y-2">
            {[['Tienda', '/shop'], ['Envíos', '/shipping'], ['Contacto', '/contact']].map(([l, h]) => (
              <Link key={h} href={h} className="text-[12px] text-white/30 hover:text-white uppercase tracking-widest transition-colors">
                {l}
              </Link>
            ))}
          </div>
          <p className="text-[11px] text-white/20 tracking-wider">© 2025 KONTACT · Saltillo, MX</p>
        </div>
      </footer>
    </>
  )
}
