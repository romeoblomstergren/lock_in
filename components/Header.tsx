'use client'
import { CYCLE_START, PHOTO_DATE } from '@/lib/data'

export default function Header() {
  const today = new Date()
  const cycleDay = Math.max(1, Math.ceil((today.getTime() - CYCLE_START.getTime()) / 86400000))
  const daysLeft = Math.max(0, Math.ceil((PHOTO_DATE.getTime() - today.getTime()) / 86400000))
  const pct = Math.min(100, Math.round(((30 - daysLeft) / 30) * 100))

  return (
    <div style={{ padding: '1.25rem 1.25rem 0.875rem', borderBottom: '1px solid #222' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
        <span style={{ fontSize: 11, letterSpacing: '0.2em', color: '#888', fontFamily: 'Space Mono, monospace' }}>LOCK IN</span>
        <span style={{ fontSize: 11, color: '#c8f542', fontFamily: 'Space Mono, monospace' }}>DAY {cycleDay}</span>
      </div>
      <div style={{ fontSize: 24, fontWeight: 800, lineHeight: 1 }}>Your Protocol</div>
      <div style={{ fontSize: 12, color: '#888', marginTop: 3 }}>{daysLeft} days to Instagram photo</div>
      <div style={{ marginTop: 12 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: '#444', fontFamily: 'Space Mono, monospace', marginBottom: 5 }}>
          <span>Photo countdown</span>
          <span>{daysLeft} days left</span>
        </div>
        <div style={{ height: 3, background: '#222', borderRadius: 2 }}>
          <div style={{ height: 3, background: '#c8f542', borderRadius: 2, width: `${pct}%`, transition: 'width 0.5s' }} />
        </div>
      </div>
    </div>
  )
}
