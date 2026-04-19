'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase'
import type { Profile } from '@/types'
import { PLANS } from '@/lib/stripe'

const PLAN_LABELS: Record<string, string> = { free: 'Free', pro: 'Individual Pro', business: 'Business' }

export default function SettingsClient({ profile, userEmail }: { profile: Profile | null; userEmail: string }) {
  const [name, setName] = useState(profile?.name ?? '')
  const [rate, setRate] = useState(profile?.hourly_rate ?? 75)
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')
  const supabase = createClient()

  async function saveProfile() {
    setSaving(true)
    await supabase.from('profiles').update({ name, hourly_rate: rate }).eq('id', profile!.id)
    setSaving(false)
    setMsg('✓ Saved')
    setTimeout(() => setMsg(''), 2000)
  }

  async function upgrade(plan: 'pro' | 'business') {
    const res = await fetch('/api/stripe/checkout', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ plan }),
    })
    const { url } = await res.json()
    window.location.href = url
  }

  async function openPortal() {
    const res = await fetch('/api/stripe/portal', { method: 'POST' })
    const { url } = await res.json()
    window.location.href = url
  }

  const currentPlan = profile?.plan ?? 'free'

  return (
    <div className="flex flex-col gap-6">
      {/* Plan */}
      <div className="card">
        <h3 className="font-bold text-lg mb-1">Plan</h3>
        <p className="text-sm mb-4" style={{ color: '#8a93a6' }}>
          You're on the <strong style={{ color: '#e8ecf4' }}>{PLAN_LABELS[currentPlan]}</strong> plan.
          {currentPlan === 'free' && ' Upgrade for unlimited ratings, CSV export, and shareable cards.'}
        </p>
        <div className="grid md:grid-cols-2 gap-3">
          {(['pro', 'business'] as const).map(p => (
            <div key={p} className="p-4 rounded-xl flex flex-col gap-2"
              style={currentPlan === p ? { border: '1px solid var(--accent)', background: 'rgba(255,77,109,0.05)' } : { border: '1px solid var(--border)', background: 'var(--bg-2)' }}>
              <div className="font-bold">{PLANS[p].name}</div>
              <div className="text-2xl font-black">${PLANS[p].price}<span className="text-sm font-normal" style={{ color: '#8a93a6' }}>/mo</span></div>
              <ul className="text-xs flex flex-col gap-1 flex-1">
                {PLANS[p].features.map(f => <li key={f} className="flex gap-1.5"><span style={{ color: 'var(--green)' }}>✓</span>{f}</li>)}
              </ul>
              {currentPlan === p ? (
                <span className="text-xs font-bold" style={{ color: 'var(--accent)' }}>✓ Current plan</span>
              ) : (
                <button onClick={() => upgrade(p)} className="btn-primary text-sm justify-center mt-1">
                  Upgrade to {PLANS[p].name}
                </button>
              )}
            </div>
          ))}
        </div>
        {currentPlan !== 'free' && (
          <button onClick={openPortal} className="btn-secondary text-sm mt-4">Manage billing / cancel</button>
        )}
      </div>

      {/* Profile */}
      <div className="card">
        <h3 className="font-bold text-lg mb-4">Profile</h3>
        <div className="flex flex-col gap-4">
          <label className="flex flex-col gap-1">
            <span className="text-xs font-semibold" style={{ color: '#8a93a6' }}>Email (read-only)</span>
            <input value={userEmail} disabled style={{ opacity: 0.5 }} />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-xs font-semibold" style={{ color: '#8a93a6' }}>Display name</span>
            <input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. @yourhandle" />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-xs font-semibold" style={{ color: '#8a93a6' }}>Average hourly rate of attendees (USD)</span>
            <input type="number" min={1} max={5000} value={rate} onChange={e => setRate(parseInt(e.target.value))} />
            <span className="text-xs mt-1" style={{ color: '#8a93a6' }}>Used to calculate dollar cost of wasted meetings.</span>
          </label>
          <div className="flex items-center gap-3">
            <button onClick={saveProfile} disabled={saving} className="btn-primary text-sm">
              {saving ? 'Saving…' : 'Save changes'}
            </button>
            {msg && <span className="text-sm font-semibold" style={{ color: 'var(--green)' }}>{msg}</span>}
          </div>
        </div>
      </div>

      {/* Danger zone */}
      <div className="card" style={{ borderColor: 'rgba(255,77,109,0.3)' }}>
        <h3 className="font-bold text-lg mb-1">Data</h3>
        <p className="text-sm mb-4" style={{ color: '#8a93a6' }}>Export or delete all your meeting ratings.</p>
        <div className="flex gap-3">
          <a href="/api/meetings/export" className="btn-secondary text-sm">Export CSV</a>
        </div>
      </div>
    </div>
  )
}
