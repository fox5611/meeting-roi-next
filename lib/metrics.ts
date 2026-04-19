import type { Meeting, Metrics, OrganizerStat } from '@/types'

export function computeMetrics(meetings: Meeting[], hourlyRate: number): Metrics {
  const count = meetings.length
  const totalMins = meetings.reduce((s, r) => s + r.duration, 0)
  const attendeeMinutes = meetings.reduce((s, r) => s + r.duration * r.attendees, 0)
  const hours = totalMins / 60
  const attendeeHours = attendeeMinutes / 60

  const wastedMins = meetings.filter(r => r.needed === 'no').reduce((s, r) => s + r.duration * r.attendees, 0)
  const cost = (wastedMins / 60) * hourlyRate

  const neededCount = meetings.filter(r => r.needed === 'yes').length
  const neededPct = count ? Math.round((neededCount / count) * 100) : 0

  const avgEnergy = count ? (meetings.reduce((s, r) => s + r.energy, 0) / count).toFixed(1) : '—'

  const asyncCount = meetings.filter(r => r.alternative === 'async' || r.alternative === 'skipped').length
  const asyncPct = count ? Math.round((asyncCount / count) * 100) : 0

  const orgMap = new Map<string, OrganizerStat>()
  for (const r of meetings) {
    const existing = orgMap.get(r.organizer) ?? { organizer: r.organizer, meetings: 0, totalMins: 0, wastedScore: 0, notNeeded: 0 }
    existing.meetings++
    existing.totalMins += r.duration
    if (r.needed === 'no') { existing.wastedScore += r.duration * r.attendees; existing.notNeeded++ }
    else if (r.needed === 'maybe') { existing.wastedScore += r.duration * r.attendees * 0.4 }
    orgMap.set(r.organizer, existing)
  }
  const leaderboard = Array.from(orgMap.values())
    .filter(o => o.wastedScore > 0)
    .sort((a, b) => b.wastedScore - a.wastedScore)

  const altCounts: Record<string, number> = { good: 0, shorter: 0, async: 0, skipped: 0 }
  for (const r of meetings) altCounts[r.alternative] = (altCounts[r.alternative] ?? 0) + 1

  return { count, hours, attendeeHours, cost, neededPct, avgEnergy, asyncPct, leaderboard, worst: leaderboard[0]?.organizer ?? null, altCounts }
}

export function filterByDays(meetings: Meeting[], days: number | 'all'): Meeting[] {
  if (days === 'all') return meetings
  const cutoff = Date.now() - days * 86400000
  return meetings.filter(r => new Date(r.created_at).getTime() >= cutoff)
}
