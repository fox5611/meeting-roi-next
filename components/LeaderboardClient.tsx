'use client'
import { useState } from 'react'
import { computeMetrics, filterByDays } from '@/lib/metrics'
import type { Meeting } from '@/types'

const MEDALS = ['🥇', '🥈', '🥉']

export default function LeaderboardClient({ meetings, hourlyRate }: { meetings: Meeting[]; hourlyRate: number }) {
  const [range, setRange] = useState<number | 'all'>(30)
  const filtered = filterByDays(meetings, range)
  const { leaderboard } = computeMetrics(filtered, hourlyRate)

  return (
    <div>
      <div className="flex gap-2 mb-6">
        {[{ label: '7 days', val: 7 }, { label: '30 days', val: 30 }, { label: 'All time', val: 'all' as const }].map(r => (
          <button key={String(r.val)} onClick={() => setRange(r.val)}
            className="px-3 py-1.5 rounded-lg text-sm font-semibold"
            style={range === r.val ? { background: 'var(--card-2,#1c2130)', color: '#e8ecf4', border: '1px solid #323a54' } : { background: 'var(--card)', color: '#8a93a6', border: '1px solid var(--border)' }}>
            {r.label}
          </button>
        ))}
      </div>

      {leaderboard.length === 0 ? (
        <div className="card text-center py-16">
          <div className="text-5xl mb-4">🏆</div>
          <div className="font-bold text-lg mb-2">No time-wasters yet</div>
          <p style={{ color: '#8a93a6' }}>Rate meetings where you weren't needed to populate the leaderboard.</p>
        </div>
      ) : (
        <div className="card flex flex-col gap-3">
          {leaderboard.map((o, i) => {
            const hoursWasted = (o.wastedScore / 60).toFixed(1)
            const dollars = Math.round((o.wastedScore / 60) * hourlyRate)
            return (
              <div key={o.organizer} className="flex items-center gap-4 p-4 rounded-xl" style={{ background: 'var(--bg-2)' }}>
                <div className="text-2xl w-8 text-center">{MEDALS[i] ?? `#${i + 1}`}</div>
                <div className="flex-1">
                  <div className="font-bold">{o.organizer}</div>
                  <div className="text-xs mt-0.5" style={{ color: '#8a93a6' }}>{o.meetings} meetings · {o.notNeeded} you weren't needed for</div>
                </div>
                <div className="text-right">
                  <div className="font-black text-lg" style={{ color: '#ff4d6d' }}>${dollars.toLocaleString()}</div>
                  <div className="text-xs" style={{ color: '#8a93a6' }}>{hoursWasted}h attendee-time wasted</div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      <p className="text-xs mt-4 text-center" style={{ color: '#8a93a6' }}>
        Wasted-time score = duration × attendees for meetings where you weren't needed (+ 40% weight for "maybe").
      </p>
    </div>
  )
}
