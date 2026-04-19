import { createServerSupabaseClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import ShareClient from '@/components/ShareClient'

export default async function SharePage() {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/')

  const cutoff = new Date(Date.now() - 7 * 86400000).toISOString()
  const [{ data: meetings }, { data: profile }] = await Promise.all([
    supabase.from('meetings').select('*').eq('user_id', user.id).gte('created_at', cutoff),
    supabase.from('profiles').select('hourly_rate, name').eq('id', user.id).single(),
  ])

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-black tracking-tight mb-2">📸 Share your week</h1>
        <p style={{ color: '#8a93a6' }}>Your last 7 days, quantified. Screenshot and post. Organizer names are anonymized.</p>
      </div>
      <ShareClient meetings={meetings ?? []} hourlyRate={profile?.hourly_rate ?? 75} />
    </div>
  )
}
