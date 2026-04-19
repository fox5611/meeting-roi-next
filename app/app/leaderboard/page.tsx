import { createServerSupabaseClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import LeaderboardClient from '@/components/LeaderboardClient'

export default async function LeaderboardPage() {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/')

  const [{ data: meetings }, { data: profile }] = await Promise.all([
    supabase.from('meetings').select('*').eq('user_id', user.id).order('created_at', { ascending: false }),
    supabase.from('profiles').select('hourly_rate, plan').eq('id', user.id).single(),
  ])

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-black tracking-tight mb-2">🏆 Hall of Time-Wasters</h1>
        <p style={{ color: '#8a93a6' }}>Ranked by wasted-time score: meetings you weren't needed for × duration × attendees.</p>
      </div>
      <LeaderboardClient meetings={meetings ?? []} hourlyRate={profile?.hourly_rate ?? 75} />
    </div>
  )
}
