'use client'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'

const NAV = [
  { href: '/app/dashboard', icon: '📊', label: 'Dashboard' },
  { href: '/app/rate', icon: '⚡', label: 'Rate a meeting' },
  { href: '/app/leaderboard', icon: '🏆', label: 'Leaderboard' },
  { href: '/app/share', icon: '📸', label: 'Share' },
  { href: '/app/settings', icon: '⚙', label: 'Settings' },
]

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  async function signOut() {
    await supabase.auth.signOut()
    router.push('/')
  }

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-56 flex-shrink-0 flex flex-col" style={{ background: 'var(--bg-2)', borderRight: '1px solid var(--border)' }}>
        <div className="px-5 py-5 font-black text-lg border-b" style={{ borderColor: 'var(--border)' }}>
          <Link href="/">⏱ MeetingROI</Link>
        </div>
        <nav className="flex flex-col gap-1 p-3 flex-1">
          {NAV.map(n => (
            <Link key={n.href} href={n.href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all"
              style={pathname === n.href
                ? { background: 'rgba(255,77,109,0.12)', color: '#ff4d6d', borderLeft: '2px solid #ff4d6d' }
                : { color: '#8a93a6' }}
            >
              <span>{n.icon}</span>{n.label}
            </Link>
          ))}
        </nav>
        <div className="p-3 border-t" style={{ borderColor: 'var(--border)' }}>
          <button onClick={signOut} className="flex items-center gap-2 px-3 py-2 text-sm w-full rounded-lg" style={{ color: '#8a93a6' }}>
            ↩ Sign out
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-auto">
        <div className="max-w-5xl mx-auto px-8 py-10">
          {children}
        </div>
      </main>
    </div>
  )
}
