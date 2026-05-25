import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { createServiceClient } from '@/lib/supabase/server'
import type Stripe from 'stripe'

export async function POST(req: Request) {
  const body = await req.text()
  const sig  = req.headers.get('stripe-signature')!

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch (err) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  if (event.type !== 'checkout.session.completed') {
    return NextResponse.json({ received: true })
  }

  const session = event.data.object as Stripe.Checkout.Session

  try {
    const supabase = await createServiceClient()
    const meta = session.metadata!
    const items: Array<{
      productId: string; variantId: string; name: string;
      variantLabel: string; price: number; quantity: number; image: string
    }> = JSON.parse(meta.items)

    const address = session.customer_details?.address
    const shippingAddr = address ? {
      full_name: session.customer_details?.name ?? '',
      email:     session.customer_details?.email ?? '',
      phone:     session.customer_details?.phone ?? '',
      line1:     address.line1 ?? '',
      line2:     address.line2 ?? undefined,
      city:      address.city ?? '',
      state:     address.state ?? '',
      zip:       address.postal_code ?? '',
      country:   address.country ?? 'MX',
    } : null

    const subtotal = Number(meta.subtotal)
    const shipping = Number(meta.shipping)

    // Create order
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        stripe_session_id: session.id,
        stripe_payment_id: typeof session.payment_intent === 'string' ? session.payment_intent : null,
        status:            'paid',
        customer_email:    session.customer_details?.email ?? '',
        customer_name:     session.customer_details?.name ?? null,
        customer_phone:    session.customer_details?.phone ?? null,
        shipping_address:  shippingAddr,
        subtotal,
        shipping_cost:     shipping,
        total:             subtotal + shipping,
        currency:          session.currency ?? 'mxn',
      })
      .select()
      .single()

    if (orderError) throw new Error(orderError.message)

    // Create order items
    await supabase.from('order_items').insert(
      items.map(item => ({
        order_id:      order.id,
        product_id:    item.productId,
        variant_id:    item.variantId,
        name:          item.name,
        variant_label: item.variantLabel || null,
        price:         item.price,
        quantity:      item.quantity,
        image_url:     item.image || null,
      }))
    )

    // Decrement stock
    for (const item of items) {
      await supabase.rpc('decrement_stock', { p_variant_id: item.variantId, p_qty: item.quantity })
    }

  } catch (err) {
    console.error('[webhook] Failed to process order:', err)
    return NextResponse.json({ error: 'Processing failed' }, { status: 500 })
  }

  return NextResponse.json({ received: true })
}
