'use client'
import { PLANS } from '@/lib/stripe'
import { useState } from 'react'
import AuthModal from './AuthModal'

export default function PricingModal({ onClose }: { onClose: () => void }) {
  const [showAuth, setShowAuth] = useState(false)

  if (showAuth) return <AuthModal onClose={onClose} />

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}>
      <div className="card w-full max-w-2xl relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-lg" style={{ color: '#8a93a6' }}>✕</button>
        <h2 className="text-2xl font-black mb-1">Simple pricing</h2>
        <p className="text-sm mb-6" style={{ color: '#8a93a6' }}>Start free. Upgrade when you're hooked.</p>
        <div className="grid md:grid-cols-3 gap-3">
          {[
            { name: 'Free', price: '$0', sub: 'Forever', features: ['5 meetings/month', 'Basic dashboard', 'Browser-local only'] },
            { name: PLANS.pro.name, price: `$${PLANS.pro.price}/mo`, sub: 'Cancel anytime', features: PLANS.pro.features, highlight: true },
            { name: PLANS.business.name, price: `$${PLANS.business.price}/mo`, sub: 'Cancel anytime', features: PLANS.business.features },
          ].map(p => (
            <div key={p.name} className="p-4 rounded-xl flex flex-col gap-2"
              style={p.highlight ? { border: '1px solid var(--accent)', background: 'rgba(255,77,109,0.05)' } : { border: '1px solid var(--border)', background: 'var(--bg-2)' }}>
              {p.highlight && <div className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--accent)' }}>Most popular</div>}
              <div className="font-bold">{p.name}</div>
              <div className="text-2xl font-black">{p.price}</div>
              <div className="text-xs mb-1" style={{ color: '#8a93a6' }}>{p.sub}</div>
              <ul className="text-xs flex flex-col gap-1 flex-1">
                {p.features.map(f => <li key={f} className="flex gap-1.5"><span style={{ color: 'var(--green)' }}>✓</span>{f}</li>)}
              </ul>
              <button onClick={() => setShowAuth(true)} className={p.highlight ? 'btn-primary text-sm justify-center mt-2' : 'btn-secondary text-sm justify-center mt-2'}>
                Get started
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
