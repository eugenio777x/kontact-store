import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import type { ProductVariant, StockStatus } from '@/types'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(amount: number, currency = 'MXN') {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

export function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

export function getStockStatus(variant: ProductVariant): StockStatus {
  if (variant.stock <= 0)  return { available: false, label: 'Agotado',         variant: 'out_of_stock' }
  if (variant.stock <= 3)  return { available: true,  label: 'Últimas piezas',  variant: 'low_stock'    }
  return                          { available: true,  label: 'Disponible',      variant: 'in_stock'     }
}

export function variantLabel(v: ProductVariant) {
  const parts = [v.size, v.color].filter(Boolean)
  return parts.length ? parts.join(' / ') : null
}
