import { createServerSupabaseClient } from '@/lib/supabase-server'
import { getStripe, PLANS } from '@/lib/stripe'
import { NextResponse } from 'next/server'
import type { Plan } from '@/types'

export async function POST(req: Request) {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { plan } = await req.json() as { plan: Plan }
  const planConfig = PLANS[plan as 'pro' | 'business']
  if (!planConfig) return NextResponse.json({ error: 'Invalid plan' }, { status: 400 })

  const { data: profile } = await supabase.from('profiles').select('stripe_customer_id').eq('id', user.id).single()
  const stripe = getStripe()

  let customerId = profile?.stripe_customer_id
  if (!customerId) {
    const customer = await stripe.customers.create({ email: user.email!, metadata: { supabase_uid: user.id } })
    customerId = customer.id
    await supabase.from('profiles').update({ stripe_customer_id: customerId }).eq('id', user.id)
  }

  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    mode: 'subscription',
    payment_method_types: ['card'],
    line_items: [{ price: planConfig.priceId, quantity: 1 }],
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/app/settings?success=1`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/app/settings`,
    metadata: { supabase_uid: user.id, plan },
  })

  return NextResponse.json({ url: session.url })
}
