import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="text-center space-y-6">
        <p className="font-display text-[120px] leading-none text-white/5 select-none">404</p>
        <div className="-mt-8">
          <h1 className="font-display text-4xl tracking-widest mb-3">PÁGINA NO ENCONTRADA</h1>
          <p className="text-[14px] text-white/40">La página que buscas no existe o fue movida.</p>
        </div>
        <div className="flex gap-4 justify-center">
          <Link href="/" className="btn-primary">Volver al inicio</Link>
          <Link href="/shop" className="btn-ghost">Ver tienda</Link>
        </div>
      </div>
    </div>
  )
}
