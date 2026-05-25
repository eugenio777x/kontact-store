import { NextResponse } from 'next/server'
import { stripe, SHIPPING_COST, FREE_SHIPPING_THRESHOLD } from '@/lib/stripe'
import { createServiceClient } from '@/lib/supabase/server'
import { z } from 'zod'

const ItemSchema = z.object({
  productId:    z.string().uuid(),
  variantId:    z.string().uuid(),
  name:         z.string(),
  variantLabel: z.string().optional(),
  price:        z.number().positive(),
  quantity:     z.number().int().positive(),
  image:        z.string().url().optional().nullable(),
})

const BodySchema = z.object({
  items:    z.array(ItemSchema).min(1),
  subtotal: z.number(),
  shipping: z.number(),
})

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { items, subtotal } = BodySchema.parse(body)

    // Validate stock in DB before creating session
    const supabase = await createServiceClient()
    for (const item of items) {
      const { data: variant } = await supabase
        .from('product_variants')
        .select('stock')
        .eq('id', item.variantId)
        .single()

      if (!variant || variant.stock < item.quantity) {
        return NextResponse.json({ error: `Sin stock suficiente para ${item.name}` }, { status: 409 })
      }
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'
    const shippingCost = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST

    const lineItems: import('stripe').Stripe.Checkout.SessionCreateParams.LineItem[] = items.map(item => ({
      price_data: {
        currency: 'mxn',
        product_data: {
          name: item.variantLabel ? `${item.name} — ${item.variantLabel}` : item.name,
          images: item.image ? [item.image] : [],
          metadata: { productId: item.productId, variantId: item.variantId },
        },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.quantity,
    }))

    if (shippingCost > 0) {
      lineItems.push({
        price_data: {
          currency: 'mxn',
          product_data: { name: 'Envío estándar' },
          unit_amount: shippingCost * 100,
        },
        quantity: 1,
      })
    }

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: lineItems,
      currency: 'mxn',
      success_url: `${appUrl}/order/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url:  `${appUrl}/order/cancel`,
      billing_address_collection: 'required',
      phone_number_collection: { enabled: true },
      metadata: {
        items: JSON.stringify(items.map(i => ({
          productId: i.productId,
          variantId: i.variantId,
          name:      i.name,
          variantLabel: i.variantLabel ?? '',
          price:     i.price,
          quantity:  i.quantity,
          image:     i.image ?? '',
        }))),
        subtotal: subtotal.toString(),
        shipping: shippingCost.toString(),
      },
    })

    return NextResponse.json({ url: session.url })
  } catch (err) {
    console.error('[stripe/checkout]', err)
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: 'Datos inválidos' }, { status: 400 })
    }
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}
