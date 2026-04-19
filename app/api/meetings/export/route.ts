import { createServerSupabaseClient } from '@/lib/supabase-server'
import { NextResponse } from 'next/server'

export async function GET() {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: meetings } = await supabase.from('meetings').select('*').eq('user_id', user.id).order('created_at', { ascending: false })

  const headers = ['date', 'title', 'organizer', 'duration_min', 'attendees', 'type', 'needed', 'alternative', 'energy', 'notes']
  const rows = (meetings ?? []).map(r => [
    new Date(r.created_at).toISOString(), r.title, r.organizer, r.duration, r.attendees,
    r.type, r.needed, r.alternative, r.energy, (r.notes ?? '').replace(/"/g, '""'),
  ])
  const csv = [headers, ...rows].map(row => row.map(v => `"${v}"`).join(',')).join('\n')

  return new NextResponse(csv, {
    headers: {
      'Content-Type': 'text/csv',
      'Content-Disposition': `attachment; filename="meetingroi-${Date.now()}.csv"`,
    },
  })
}
