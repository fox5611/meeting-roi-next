'use client'
import { useState } from 'react'
import Link from 'next/link'
import AuthModal from '@/components/AuthModal'
import PricingModal from '@/components/PricingModal'

export default function LandingPage() {
  const [showAuth, setShowAuth] = useState(false)
  const [showPricing, setShowPricing] = useState(false)

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg)' }}>
      {/* NAV */}
      <nav style={{ borderBottom: '1px solid var(--border)', backdropFilter: 'blur(16px)', background: 'rgba(11,13,18,0.75)', position: 'sticky', top: 0, zIndex: 50 }}>
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <span className="text-lg font-black">⏱ MeetingROI</span>
          <div className="flex gap-5 items-center">
            <button onClick={() => setShowPricing(true)} className="text-sm font-medium" style={{ color: 'var(--muted, #8a93a6)' }}>Pricing</button>
            <button onClick={() => setShowAuth(true)} className="btn-secondary text-sm py-2 px-4">Sign in</button>
            <button onClick={() => setShowAuth(true)} className="btn-primary text-sm py-2 px-4">Get started free</button>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="px-6 py-24 text-center" style={{ background: 'radial-gradient(ellipse 80% 50% at 50% 0%, rgba(255,77,109,0.18), transparent 60%), radial-gradient(ellipse 60% 40% at 20% 100%, rgba(91,140,255,0.12), transparent 60%)' }}>
        <div className="max-w-4xl mx-auto">
          <div className="inline-block px-4 py-1.5 rounded-full text-sm font-semibold mb-6" style={{ background: 'rgba(255,77,109,0.12)', border: '1px solid rgba(255,77,109,0.3)', color: 'var(--accent)' }}>
            🔥 The tool your company doesn&apos;t want you to use
          </div>
          <h1 className="font-black tracking-tight mb-5" style={{ fontSize: 'clamp(40px,7vw,72px)', lineHeight: 1.05 }}>
            Rate your meetings.<br />
            <span className="gradient-text">Expose your time-wasters.</span>
          </h1>
          <p className="text-lg mb-10 max-w-2xl mx-auto" style={{ color: '#8a93a6' }}>
            30 seconds after every meeting, answer one question: <strong style={{ color: '#e8ecf4' }}>"Was I needed?"</strong><br />
            We'll tell you exactly who's bleeding your calendar dry.
          </p>
          <div className="flex gap-3 justify-center flex-wrap mb-16">
            <button onClick={() => setShowAuth(true)} className="btn-primary text-base">Rate your last meeting →</button>
            <button onClick={() => setShowPricing(true)} className="btn-secondary text-base">See pricing</button>
          </div>
          <div className="flex gap-12 justify-center flex-wrap">
            {[['$0', 'to start'], ['30 sec', 'per meeting'], ['100%', 'local or cloud']].map(([val, label]) => (
              <div key={label} className="text-center">
                <div className="text-3xl font-black">{val}</div>
                <div className="text-xs uppercase tracking-widest mt-1" style={{ color: '#8a93a6' }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <h2 className="text-3xl font-black text-center mb-2 tracking-tight">Everything you need to reclaim your calendar</h2>
        <p className="text-center mb-12" style={{ color: '#8a93a6' }}>Built for people who are tired of meetings that could've been emails.</p>
        <div className="grid md:grid-cols-3 gap-4">
          {[
            { icon: '⚡', title: '30-second post-mortems', desc: 'Rate any meeting in seconds. Was I needed? Energy cost? Could it have been async?' },
            { icon: '📊', title: 'Live ROI dashboard', desc: 'See your hours burned, dollar cost, and "needed rate" across any time window.' },
            { icon: '🏆', title: 'Hall of Time-Wasters', desc: "Ranked leaderboard of who's costing you the most. Wasted-time score per organizer." },
            { icon: '📸', title: 'Shareable cards', desc: 'One-click "week-in-review" card. Screenshot and post. Anonymized names.' },
            { icon: '💰', title: 'Cost calculator', desc: "Real dollar estimates based on your team's hourly rate. Makes the pain tangible." },
            { icon: '📅', title: 'Calendar sync (coming)', desc: 'Google Calendar + Outlook integration. Auto-prompt after every meeting ends.' },
          ].map(f => (
            <div key={f.title} className="card">
              <div className="text-3xl mb-3">{f.icon}</div>
              <div className="font-bold mb-2">{f.title}</div>
              <div className="text-sm" style={{ color: '#8a93a6' }}>{f.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* PRICING TEASER */}
      <section className="max-w-4xl mx-auto px-6 py-20 text-center">
        <h2 className="text-3xl font-black mb-4 tracking-tight">Simple pricing. Cancel anytime.</h2>
        <p className="mb-10" style={{ color: '#8a93a6' }}>Start free, upgrade when you're hooked.</p>
        <div className="grid md:grid-cols-3 gap-4 text-left">
          {[
            { name: 'Free', price: '$0', desc: 'Try it out', features: ['5 meetings/month', 'Basic dashboard', 'Local storage only'] },
            { name: 'Individual Pro', price: '$15/mo', desc: 'For solo users', features: ['Unlimited meetings', 'Full dashboard', 'CSV export', 'Shareable cards', 'Cloud sync'], highlight: true },
            { name: 'Business', price: '$100/mo', desc: 'For teams', features: ['Everything in Pro', 'Team leaderboard', 'Slack bot', 'Weekly digest', 'Up to 50 members'] },
          ].map(p => (
            <div key={p.name} className="card flex flex-col" style={p.highlight ? { borderColor: 'var(--accent)', background: 'linear-gradient(135deg, var(--card), rgba(255,77,109,0.05))' } : {}}>
              {p.highlight && <div className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: 'var(--accent)' }}>Most popular</div>}
              <div className="font-bold text-lg">{p.name}</div>
              <div className="text-3xl font-black my-2">{p.price}</div>
              <div className="text-sm mb-4" style={{ color: '#8a93a6' }}>{p.desc}</div>
              <ul className="text-sm flex flex-col gap-2 flex-1 mb-5">
                {p.features.map(f => <li key={f} className="flex gap-2 items-center"><span style={{ color: 'var(--green)' }}>✓</span>{f}</li>)}
              </ul>
              <button onClick={() => setShowAuth(true)} className={p.highlight ? 'btn-primary w-full justify-center' : 'btn-secondary w-full justify-center'}>
                Get started
              </button>
            </div>
          ))}
        </div>
      </section>

      <footer className="text-center py-10 text-sm" style={{ color: '#8a93a6', borderTop: '1px solid var(--border)' }}>
        MeetingROI — your data stays yours. Free tier runs entirely in your browser.
      </footer>

      {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
      {showPricing && <PricingModal onClose={() => setShowPricing(false)} />}
    </div>
  )
}
