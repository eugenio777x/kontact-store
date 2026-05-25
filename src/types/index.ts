export interface Category {
  id: string
  name: string
  slug: string
  description: string | null
  image_url: string | null
  sort_order: number
  created_at: string
}

export interface ProductVariant {
  id: string
  product_id: string
  size: string | null
  color: string | null
  color_hex: string | null
  sku: string | null
  stock: number
  price_mod: number
  created_at: string
}

export interface Product {
  id: string
  category_id: string | null
  name: string
  slug: string
  description: string | null
  price: number
  compare_price: number | null
  images: string[]
  is_active: boolean
  is_featured: boolean
  metadata: Record<string, unknown>
  created_at: string
  updated_at: string
  category?: Category
  variants?: ProductVariant[]
}

export interface CartItem {
  product: Product
  variant: ProductVariant
  quantity: number
}

export interface ShippingAddress {
  full_name: string
  email: string
  phone: string
  line1: string
  line2?: string
  city: string
  state: string
  zip: string
  country: string
}

export interface Order {
  id: string
  user_id: string | null
  stripe_session_id: string | null
  stripe_payment_id: string | null
  status: OrderStatus
  subtotal: number
  shipping_cost: number
  total: number
  currency: string
  customer_email: string
  customer_name: string | null
  customer_phone: string | null
  shipping_address: ShippingAddress | null
  notes: string | null
  tracking_number: string | null
  created_at: string
  updated_at: string
  items?: OrderItem[]
}

export type OrderStatus = 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled' | 'refunded'

export interface OrderItem {
  id: string
  order_id: string
  product_id: string | null
  variant_id: string | null
  name: string
  variant_label: string | null
  price: number
  quantity: number
  image_url: string | null
}

export interface StockStatus {
  available: boolean
  label: string
  variant: 'in_stock' | 'low_stock' | 'out_of_stock'
}
