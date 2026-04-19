import { stripe } from '@/lib/stripe'
import { createServiceClient } from '@/lib/supabase-server'
import { NextResponse } from 'next/server'
import type Stripe from 'stripe'

export async function POST(req: Request) {
  const body = await req.text()
  const sig = req.headers.get('stripe-signature')!
  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  const supabase = createServiceClient()

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session
    const uid = session.metadata?.supabase_uid
    const plan = session.metadata?.plan
    if (uid && plan) {
      await supabase.from('profiles').update({ plan }).eq('id', uid)
    }
  }

  if (event.type === 'customer.subscription.deleted') {
    const sub = event.data.object as Stripe.Subscription
    const { data: profile } = await supabase
      .from('profiles')
      .select('id')
      .eq('stripe_customer_id', sub.customer as string)
      .single()
    if (profile) {
      await supabase.from('profiles').update({ plan: 'free' }).eq('id', profile.id)
    }
  }

  return NextResponse.json({ received: true })
}
