'use client'
import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'

const TYPES = ['Standup', 'Sync / status', 'Decision-making', 'Brainstorm', '1:1', 'All-hands', 'Interview', 'External / client']

function ChipGroup({ name, options, value, onChange }: { name: string; options: { label: string; val: string }[]; value: string | null; onChange: (v: string) => void }) {
  return (
    <div className="flex gap-2 flex-wrap">
      {options.map(o => (
        <button key={o.val} type="button" className={`chip ${value === o.val ? 'active' : ''}`} onClick={() => onChange(o.val)}>
          {o.label}
        </button>
      ))}
    </div>
  )
}

export default function MeetingForm({ userId }: { userId: string }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState('')
  const [form, setForm] = useState({ title: '', organizer: '', duration: 30, attendees: 6, type: 'Sync / status', notes: '' })
  const [needed, setNeeded] = useState<string | null>(null)
  const [alternative, setAlternative] = useState<string | null>(null)
  const [energy, setEnergy] = useState<string | null>(null)

  const set = useCallback((k: string, v: string | number) => setForm(f => ({ ...f, [k]: v })), [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!needed || !alternative || !energy) { setMsg('Please answer all three questions.'); return }
    setLoading(true)
    const res = await fetch('/api/meetings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, needed, alternative, energy: parseInt(energy, 10), user_id: userId }),
    })
    setLoading(false)
    if (res.ok) {
      setMsg('✓ Saved!')
      setTimeout(() => router.push('/app/dashboard'), 800)
    } else {
      const d = await res.json()
      setMsg(d.error === 'Free limit reached' ? '🔒 Free limit reached — upgrade to Pro' : 'Something went wrong.')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="card flex flex-col gap-5">
      <div className="grid grid-cols-2 gap-4">
        <label className="flex flex-col gap-1">
          <span className="text-xs font-semibold" style={{ color: '#8a93a6' }}>Meeting title</span>
          <input value={form.title} onChange={e => set('title', e.target.value)} placeholder="e.g. Q2 strategy sync" required />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-xs font-semibold" style={{ color: '#8a93a6' }}>Organizer</span>
          <input value={form.organizer} onChange={e => set('organizer', e.target.value)} placeholder="e.g. Sarah (VP Product)" required />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-xs font-semibold" style={{ color: '#8a93a6' }}>Duration (min)</span>
          <input type="number" min={1} max={480} value={form.duration} onChange={e => set('duration', parseInt(e.target.value))} required />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-xs font-semibold" style={{ color: '#8a93a6' }}># Attendees</span>
          <input type="number" min={1} max={200} value={form.attendees} onChange={e => set('attendees', parseInt(e.target.value))} required />
        </label>
      </div>
      <label className="flex flex-col gap-1">
        <span className="text-xs font-semibold" style={{ color: '#8a93a6' }}>Meeting type</span>
        <select value={form.type} onChange={e => set('type', e.target.value)}>
          {TYPES.map(t => <option key={t}>{t}</option>)}
        </select>
      </label>

      <div>
        <div className="text-sm font-semibold mb-2">Was <em style={{ color: 'var(--accent)', fontStyle: 'normal' }}>you</em> needed?</div>
        <ChipGroup name="needed" value={needed} onChange={setNeeded} options={[{ label: '✅ Yes', val: 'yes' }, { label: '🤷 Maybe', val: 'maybe' }, { label: '❌ No', val: 'no' }]} />
      </div>

      <div>
        <div className="text-sm font-semibold mb-2">This meeting could have been…</div>
        <ChipGroup name="alternative" value={alternative} onChange={setAlternative} options={[
          { label: '👍 Fine as-is', val: 'good' }, { label: '⏱ Half the length', val: 'shorter' },
          { label: '📝 An async message', val: 'async' }, { label: '🚫 Skipped entirely', val: 'skipped' },
        ]} />
      </div>

      <div>
        <div className="text-sm font-semibold mb-2">Energy cost <span className="font-normal text-xs" style={{ color: '#8a93a6' }}>(1 = refreshing, 5 = drained my soul)</span></div>
        <ChipGroup name="energy" value={energy} onChange={setEnergy} options={[1,2,3,4,5].map(n => ({ label: String(n), val: String(n) }))} />
      </div>

      <label className="flex flex-col gap-1">
        <span className="text-xs font-semibold" style={{ color: '#8a93a6' }}>Note (optional, only you see this)</span>
        <textarea rows={2} value={form.notes} onChange={e => set('notes', e.target.value)} placeholder="e.g. half the people didn't say a word" />
      </label>

      <div className="flex items-center gap-4">
        <button type="submit" disabled={loading} className="btn-primary">{loading ? 'Saving…' : 'Save rating'}</button>
        {msg && <span className="text-sm font-semibold" style={{ color: msg.startsWith('✓') ? 'var(--green)' : 'var(--accent)' }}>{msg}</span>}
      </div>
    </form>
  )
}
