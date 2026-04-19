export type Plan = 'free' | 'pro' | 'business'

export interface Profile {
  id: string
  name: string | null
  hourly_rate: number
  plan: Plan
  stripe_customer_id: string | null
  created_at: string
}

export interface Meeting {
  id: string
  user_id: string
  title: string
  organizer: string
  duration: number
  attendees: number
  type: string
  needed: 'yes' | 'maybe' | 'no'
  alternative: 'good' | 'shorter' | 'async' | 'skipped'
  energy: number
  notes: string | null
  created_at: string
}

export interface OrganizerStat {
  organizer: string
  meetings: number
  totalMins: number
  wastedScore: number
  notNeeded: number
}

export interface Metrics {
  count: number
  hours: number
  attendeeHours: number
  cost: number
  neededPct: number
  avgEnergy: string
  asyncPct: number
  leaderboard: OrganizerStat[]
  worst: string | null
  altCounts: Record<string, number>
}
