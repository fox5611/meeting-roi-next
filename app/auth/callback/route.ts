import { createServerSupabaseClient } from '@/lib/supabase-server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')

  if (code) {
    const supabase = await createServerSupabaseClient()
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error && data.user) {
      // Upsert profile
      await supabase.from('profiles').upsert({
        id: data.user.id,
        name: data.user.user_metadata?.full_name ?? null,
        hourly_rate: 75,
        plan: 'free',
      }, { onConflict: 'id', ignoreDuplicates: true })
      return NextResponse.redirect(`${origin}/app/dashboard`)
    }
  }

  return NextResponse.redirect(`${origin}/?error=auth`)
}
