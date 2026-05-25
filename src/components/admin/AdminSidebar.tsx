'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Package, ShoppingBag, LogOut } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'

const LINKS = [
  { href: '/admin',          label: 'Dashboard',  icon: LayoutDashboard },
  { href: '/admin/products', label: 'Productos',  icon: Package         },
  { href: '/admin/orders',   label: 'Órdenes',    icon: ShoppingBag     },
]

export function AdminSidebar() {
  const pathname = usePathname()
  const router   = useRouter()

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/admin/login')
  }

  return (
    <aside className="w-[220px] flex-shrink-0 bg-[#0a0a0a] border-r border-white/7 flex flex-col min-h-screen">
      <div className="p-6 border-b border-white/7">
        <Image src="/logo.png" alt="KONTACT" width={100} height={30} />
        <p className="text-[9px] font-bold tracking-[3px] uppercase text-brand-red mt-2">Admin Panel</p>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {LINKS.map(l => (
          <Link
            key={l.href}
            href={l.href}
            className={cn(
              'flex items-center gap-3 px-3 py-2.5 text-[12px] font-semibold uppercase tracking-wider transition-all',
              pathname === l.href
                ? 'text-white bg-brand-red/10 border-l-2 border-brand-red'
                : 'text-white/40 hover:text-white hover:bg-white/3'
            )}
          >
            <l.icon size={15} />
            {l.label}
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t border-white/7">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 text-[12px] font-semibold uppercase tracking-wider text-white/30 hover:text-white w-full transition-colors"
        >
          <LogOut size={15} />
          Cerrar sesión
        </button>
      </div>
    </aside>
  )
}
