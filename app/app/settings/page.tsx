import { createServerSupabaseClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import SettingsClient from '@/components/SettingsClient'

export default async function SettingsPage() {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/')

  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-black tracking-tight mb-2">⚙ Settings</h1>
        <p style={{ color: '#8a93a6' }}>Manage your account, billing, and data.</p>
      </div>
      <SettingsClient profile={profile} userEmail={user.email ?? ''} />
    </div>
  )
}
