import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-03-25.dahlia',
})

export const PLANS = {
  pro: {
    name: 'Individual Pro',
    price: 15,
    priceId: process.env.STRIPE_PRICE_PRO!,
    features: [
      'Unlimited meeting ratings',
      'Full dashboard & analytics',
      'CSV export',
      'Shareable week-in-review card',
      'Advanced energy tracking',
    ],
  },
  business: {
    name: 'Business',
    price: 100,
    priceId: process.env.STRIPE_PRICE_BUSINESS!,
    features: [
      'Everything in Pro',
      'Team workspace (up to 50 members)',
      'Org-wide anonymous leaderboard',
      'Slack bot integration',
      'Weekly email digest',
      'Priority support',
    ],
  },
}
