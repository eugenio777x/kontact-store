'use client'

import Image from 'next/image'
import { useState } from 'react'
import { cn } from '@/lib/utils'

interface Props {
  images: string[]
  name: string
}

export function ProductGallery({ images, name }: Props) {
  const [active, setActive] = useState(0)
  const imgs = images.length > 0 ? images : [null]

  return (
    <div className="flex flex-col-reverse lg:flex-row gap-4">
      {/* Thumbnails */}
      {imgs.length > 1 && (
        <div className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-y-auto">
          {imgs.map((img, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={cn(
                'relative flex-shrink-0 w-16 h-20 lg:w-20 lg:h-24 bg-white/5 overflow-hidden border transition-all',
                active === i ? 'border-brand-red' : 'border-white/10 hover:border-white/30'
              )}
            >
              {img && (
                <Image src={img} alt={`${name} ${i + 1}`} fill className="object-cover" />
              )}
            </button>
          ))}
        </div>
      )}

      {/* Main image */}
      <div className="flex-1 relative aspect-[3/4] bg-white/3 overflow-hidden">
        {imgs[active] ? (
          <Image
            src={imgs[active]!}
            alt={name}
            fill
            className="object-cover"
            priority
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-white/10">
            <span className="font-display text-5xl tracking-widest">KONTACT</span>
          </div>
        )}
      </div>
    </div>
  )
}
