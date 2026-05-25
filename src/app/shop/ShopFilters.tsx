'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { cn } from '@/lib/utils'
import type { Category } from '@/types'

interface Props {
  categories: Category[]
  activecat?: string
  activesort?: string
}

export function ShopFilters({ categories, activecat, activesort }: Props) {
  const router = useRouter()
  const sp = useSearchParams()

  function setFilter(key: string, value: string | null) {
    const params = new URLSearchParams(sp.toString())
    if (value) params.set(key, value)
    else params.delete(key)
    router.push(`/shop?${params.toString()}`)
  }

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
      {/* Category tabs */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setFilter('cat', null)}
          className={cn(
            'px-4 py-2 text-[11px] font-bold tracking-[2px] uppercase border transition-all',
            !activecat
              ? 'border-brand-red text-white bg-brand-red/10'
              : 'border-white/10 text-white/50 hover:border-white/30 hover:text-white'
          )}
        >
          Todos
        </button>
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setFilter('cat', cat.slug)}
            className={cn(
              'px-4 py-2 text-[11px] font-bold tracking-[2px] uppercase border transition-all',
              activecat === cat.slug
                ? 'border-brand-red text-white bg-brand-red/10'
                : 'border-white/10 text-white/50 hover:border-white/30 hover:text-white'
            )}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Sort */}
      <select
        value={activesort ?? ''}
        onChange={e => setFilter('sort', e.target.value || null)}
        className="bg-transparent border border-white/10 text-white/60 text-[11px] font-bold tracking-[2px] uppercase px-4 py-2 outline-none hover:border-white/30 cursor-pointer"
      >
        <option value="">Ordenar</option>
        <option value="price_asc">Menor precio</option>
        <option value="price_desc">Mayor precio</option>
      </select>
    </div>
  )
}
