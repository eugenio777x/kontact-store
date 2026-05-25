'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { ShoppingBag, Search, Menu, X } from 'lucide-react'
import { useCartStore } from '@/store/cart'
import { cn } from '@/lib/utils'

const NAV_LINKS = [
  { label: 'Tienda',       href: '/shop' },
  { label: 'Personaliza',  href: '/shop?cat=personaliza' },
  { label: 'Económicos',   href: '/shop?cat=economicos' },
  { label: 'NBNL',         href: '/shop?cat=ropa' },
  { label: 'Envíos',       href: '/shipping' },
  { label: 'Contacto',     href: '/contact' },
]

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const { openCart, itemCount } = useCartStore()
  const count = itemCount()

  useEffect(() => {
    const handle = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', handle, { passive: true })
    return () => window.removeEventListener('scroll', handle)
  }, [])

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        scrolled
          ? 'bg-[#060606]/97 backdrop-blur-md border-b border-white/7'
          : 'bg-transparent'
      )}
    >
      <div className="max-w-[1400px] mx-auto px-6 h-[68px] flex items-center justify-between gap-8">
        {/* Logo */}
        <Link href="/" className="flex-shrink-0">
          <Image src="/logo.png" alt="KONTACT" width={120} height={36} priority />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-7">
          {NAV_LINKS.map(l => (
            <Link
              key={l.href}
              href={l.href}
              className="text-[13px] font-semibold uppercase tracking-widest text-white/60 hover:text-white transition-colors"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <Link
            href="/shop"
            className="hidden sm:flex items-center justify-center w-10 h-10 text-white/60 hover:text-white transition-colors"
            aria-label="Buscar"
          >
            <Search size={18} />
          </Link>

          <button
            onClick={openCart}
            className="relative flex items-center justify-center w-10 h-10 text-white/60 hover:text-white transition-colors"
            aria-label="Carrito"
          >
            <ShoppingBag size={18} />
            {count > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-brand-red text-white text-[10px] font-black rounded-full flex items-center justify-center leading-none">
                {count > 9 ? '9+' : count}
              </span>
            )}
          </button>

          <button
            className="lg:hidden flex items-center justify-center w-10 h-10 text-white/60 hover:text-white transition-colors"
            onClick={() => setMenuOpen(v => !v)}
            aria-label="Menú"
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="lg:hidden bg-[#0a0a0a] border-t border-white/7 px-6 py-6 flex flex-col gap-5">
          {NAV_LINKS.map(l => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setMenuOpen(false)}
              className="text-[15px] font-semibold uppercase tracking-widest text-white/70 hover:text-white transition-colors"
            >
              {l.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  )
}
