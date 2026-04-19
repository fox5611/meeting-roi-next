'use client'
import { useState } from 'react'
import { computeMetrics, filterByDays } from '@/lib/metrics'
import type { Meeting, Profile } from '@/types'

const RANGES: { label: string; val: number | 'all' }[] = [
  { label: 'Last 7 days', val: 7 },
  { label: 'Last 30 days', val: 30 },
  { label: 'All time', val: 'all' },
]

function MetricCard({ label, value, sub, variant }: { label: string; value: string; sub: string; variant?: 'danger' | 'success' }) {
  const colors = {
    danger: { border: 'rgba(255,77,109,0.3)', bg: 'linear-gradient(135deg, var(--card), rgba(255,77,109,0.04))' },
    success: { border: 'rgba(61,220,151,0.3)', bg: 'linear-gradient(135deg, var(--card), rgba(61,220,151,0.04))' },
  }
  const style = variant ? { borderColor: colors[variant].border, background: colors[variant].bg } : {}
  const valColor = variant === 'danger' ? '#ff4d6d' : variant === 'success' ? '#3ddc97' : undefined
  return (
    <div className="card" style={style}>
      <div className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: '#8a93a6' }}>{label}</div>
      <div className="text-4xl font-black mb-1" style={valColor ? { color: valColor } : {}}>{value}</div>
      <div className="text-xs" style={{ color: '#8a93a6' }}>{sub}</div>
    </div>
  )
}

export default function DashboardClient({ meetings, profile }: { meetings: Meeting[]; profile: Profile | null }) {
  const [range, setRange] = useState<number | 'all'>(7)
  const hourlyRate = profile?.hourly_rate ?? 75
  const filtered = filterByDays(meetings, range)
  const m = computeMetrics(filtered, hourlyRate)

  return (
    <div>
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-3xl font-black tracking-tight mb-1">📊 Dashboard</h1>
          <p style={{ color: '#8a93a6' }}>Your meeting ROI at a glance.</p>
        </div>
        <div className="flex gap-2">
          {RANGES.map(r => (
            <button key={String(r.val)} onClick={() => setRange(r.val)}
              className="px-3 py-1.5 rounded-lg text-sm font-semibold transition-all"
              style={range === r.val ? { background: 'var(--card-2, #1c2130)', color: '#e8ecf4', border: '1px solid #323a54' } : { background: 'var(--card)', color: '#8a93a6', border: '1px solid var(--border)' }}>
              {r.label}
            </button>
          ))}
        </div>
      </div>

      {meetings.length === 0 ? (
        <div className="card text-center py-16">
          <div className="text-5xl mb-4">📭</div>
          <div className="font-bold text-lg mb-2">No meetings rated yet</div>
          <p className="mb-6" style={{ color: '#8a93a6' }}>Rate your first meeting to start tracking your ROI.</p>
          <a href="/app/rate" className="btn-primary">Rate your first meeting →</a>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
            <MetricCard label="Meetings rated" value={String(m.count)} sub={range === 'all' ? 'all time' : `last ${range} days`} />
            <MetricCard label="Attendee-hours" value={`${m.attendeeHours.toFixed(1)}h`} sub="total across all attendees" />
            <MetricCard label="Money burned 🔥" value={`$${Math.round(m.cost).toLocaleString()}`} sub="on meetings you weren't needed for" variant="danger" />
            <MetricCard label='"Needed" rate' value={m.count ? `${m.neededPct}%` : '—'} sub="meetings you actually needed to be in" />
            <MetricCard label="Avg energy cost" value={String(m.avgEnergy)} sub="1 = refreshing · 5 = draining" />
            <MetricCard label="Could've been async" value={`${m.asyncPct}%`} sub="reclaimable calendar time" variant="success" />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {/* Breakdown */}
            <div className="card">
              <h3 className="font-bold mb-4">Meeting breakdown</h3>
              {[
                { label: '👍 Good as-is', val: m.altCounts.good ?? 0 },
                { label: '⏱ Half the length', val: m.altCounts.shorter ?? 0 },
                { label: '📝 Could be async', val: m.altCounts.async ?? 0 },
                { label: '🚫 Could be skipped', val: m.altCounts.skipped ?? 0 },
              ].map(row => {
                const pct = m.count ? Math.round((row.val / m.count) * 100) : 0
                return (
                  <div key={row.label} className="flex items-center gap-3 mb-3">
                    <span className="text-sm w-36" style={{ color: '#8a93a6' }}>{row.label}</span>
                    <div className="flex-1 rounded-md overflow-hidden" style={{ height: 22, background: 'var(--bg-2)' }}>
                      <div style={{ width: `${pct}%`, height: '100%', background: 'linear-gradient(90deg, #ff4d6d, #ffa657)', borderRadius: 4, transition: 'width 0.4s' }} />
                    </div>
                    <span className="text-sm font-bold w-8 text-right">{pct}%</span>
                  </div>
                )
              })}
            </div>

            {/* Recent */}
            <div className="card">
              <h3 className="font-bold mb-4">Recent meetings</h3>
              <div className="flex flex-col gap-2 max-h-64 overflow-y-auto">
                {filtered.slice(0, 8).map(r => (
                  <div key={r.id} className="flex items-center justify-between p-3 rounded-lg" style={{ background: 'var(--bg-2)' }}>
                    <div>
                      <div className="text-sm font-semibold">{r.title}</div>
                      <div className="text-xs mt-0.5" style={{ color: '#8a93a6' }}>{r.organizer} · {r.duration}m · {r.attendees} ppl</div>
                    </div>
                    <span className="text-xs font-bold px-2 py-1 rounded-full" style={
                      r.needed === 'yes' ? { background: 'rgba(61,220,151,0.15)', color: '#3ddc97' } :
                      r.needed === 'maybe' ? { background: 'rgba(255,166,87,0.15)', color: '#ffa657' } :
                      { background: 'rgba(255,77,109,0.15)', color: '#ff4d6d' }
                    }>{r.needed === 'yes' ? 'Needed' : r.needed === 'maybe' ? 'Maybe' : 'Not needed'}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
