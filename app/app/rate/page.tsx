import { createServerSupabaseClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import MeetingForm from '@/components/MeetingForm'

export default async function RatePage() {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/')

  const { data: profile } = await supabase.from('profiles').select('plan').eq('id', user.id).single()
  const { count } = await supabase.from('meetings').select('*', { count: 'exact', head: true })
    .eq('user_id', user.id)
    .gte('created_at', new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString())

  const atLimit = profile?.plan === 'free' && (count ?? 0) >= 5

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-black tracking-tight mb-2">⚡ Rate a meeting</h1>
        <p style={{ color: '#8a93a6' }}>Takes 30 seconds. Builds up your dashboard over time.</p>
      </div>
      {atLimit ? (
        <div className="card text-center py-10">
          <div className="text-4xl mb-3">🔒</div>
          <div className="font-bold text-lg mb-2">Free limit reached</div>
          <p className="mb-6" style={{ color: '#8a93a6' }}>You've rated 5 meetings this month — the free tier limit.<br />Upgrade to Pro for unlimited ratings.</p>
          <a href="/app/settings" className="btn-primary">Upgrade to Pro — $15/mo</a>
        </div>
      ) : (
        <MeetingForm userId={user.id} />
      )}
    </div>
  )
}
