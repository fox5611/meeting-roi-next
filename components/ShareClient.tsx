'use client'
import { useRef } from 'react'
import { computeMetrics } from '@/lib/metrics'
import type { Meeting } from '@/types'

function anonymize(name: string) {
  const m = name.match(/^([A-Za-z])/)
  return m ? m[1] + '.' : name.slice(0, 1) + '.'
}

export default function ShareClient({ meetings, hourlyRate }: { meetings: Meeting[]; hourlyRate: number }) {
  const cardRef = useRef<HTMLDivElement>(null)
  const m = computeMetrics(meetings, hourlyRate)
  const weekStart = new Date(Date.now() - 7 * 86400000)
  const worstAnon = m.worst ? anonymize(m.worst) : '—'

  const headline = meetings.length === 0 ? 'No meetings this week.' :
    m.asyncPct >= 50 ? 'Most of my meetings could\'ve been emails.' :
    m.cost > 1000 ? 'My calendar cost my company thousands.' :
    m.neededPct < 40 ? 'I barely needed to be in any of these.' :
    'My week in meetings, quantified.'

  async function copyCaption() {
    const text = `${headline}\n\nThis week:\n• ${m.attendeeHours.toFixed(1)}h in meetings\n• $${Math.round(m.cost).toLocaleString()} burned on meetings I wasn't needed for\n• ${m.asyncPct}% could've been async\n\nTracked with MeetingROI.`
    await navigator.clipboard.writeText(text)
  }

  function printCard() {
    const win = window.open('', '_blank')
    if (!win || !cardRef.current) return
    win.document.write(`<html><head><title>MeetingROI — Week in Review</title>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700;800;900&display=swap" rel="stylesheet">
      <style>*{box-sizing:border-box}body{margin:0;background:#0b0d12;display:flex;align-items:center;justify-content:center;min-height:100vh;font-family:'Inter',sans-serif;padding:20px}</style>
      </head><body>${cardRef.current.outerHTML}</body></html>`)
    win.document.close()
  }

  return (
    <div className="flex flex-col lg:flex-row gap-8 items-start">
      {/* Card */}
      <div ref={cardRef} style={{
        width: 560, minHeight: 294, background: 'linear-gradient(135deg, #1a1530 0%, #2b1a3e 50%, #3d1a2e 100%)',
        borderRadius: 20, padding: 36, display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
        boxShadow: '0 20px 60px rgba(0,0,0,0.5)', position: 'relative', overflow: 'hidden', fontFamily: 'Inter,sans-serif',
      }}>
        <div style={{ position: 'absolute', top: '-50%', right: '-20%', width: '60%', height: '180%', background: 'radial-gradient(circle, rgba(255,77,109,0.25), transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, fontWeight: 700, color: '#e8ecf4', position: 'relative' }}>
          <span>⏱ MeetingROI</span>
          <span style={{ color: '#8a93a6' }}>Week of {weekStart.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
        </div>
        <div style={{ fontSize: 26, fontWeight: 900, lineHeight: 1.2, color: '#e8ecf4', position: 'relative' }}>{headline}</div>
        <div style={{ display: 'flex', gap: 32, position: 'relative' }}>
          {[
            [`${m.attendeeHours.toFixed(1)}h`, 'in meetings'],
            [`$${Math.round(m.cost).toLocaleString()}`, 'burned'],
            [`${m.asyncPct}%`, 'could be async'],
          ].map(([val, label]) => (
            <div key={label}>
              <div style={{ fontSize: 28, fontWeight: 800, color: '#ffa657' }}>{val}</div>
              <div style={{ fontSize: 11, color: '#8a93a6', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</div>
            </div>
          ))}
        </div>
        <div style={{ position: 'relative' }}>
          <div style={{ fontSize: 11, color: '#8a93a6', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Biggest time-sink</div>
          <div style={{ fontSize: 20, fontWeight: 700, color: '#e8ecf4', marginTop: 4 }}>{worstAnon}</div>
        </div>
        <div style={{ fontSize: 12, color: '#8a93a6', position: 'relative' }}>meetingroi.app</div>
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-3">
        <button onClick={printCard} className="btn-primary">Open as page (screenshot to save)</button>
        <button onClick={copyCaption} className="btn-secondary">Copy caption text</button>
        <p className="text-xs mt-2" style={{ color: '#8a93a6' }}>
          Organizer names are anonymized with initials only.<br />
          Data shown: last 7 days.
        </p>
        {meetings.length === 0 && (
          <div className="text-sm p-3 rounded-lg" style={{ background: 'rgba(255,166,87,0.1)', border: '1px solid rgba(255,166,87,0.3)', color: '#ffa657' }}>
            Rate some meetings first to make the card interesting!
          </div>
        )}
      </div>
    </div>
  )
}
