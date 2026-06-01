'use client'
import { CYCLE_START, PHOTO_DATE } from '@/lib/data'

export default function Header() {
  const today = new Date()
  const cycleDay = Math.max(1, Math.floor((today.getTime() - CYCLE_START.getTime()) / 86400000))
  const daysLeft = Math.max(0, Math.ceil((PHOTO_DATE.getTime() - today.getTime()) / 86400000))
  return (
    <div style={{ padding: '20px 24px 0', borderBottom: '1px solid #111', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', paddingBottom: 16 }}>
      <div>
        <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 32, letterSpacing: 2, lineHeight: 1 }}>LOCK IN</div>
        <div style={{ fontSize: 10, color: '#555', letterSpacing: '0.2em', marginTop: 2 }}>CYCLE DAY {cycleDay} — {daysLeft} DAYS TO PHOTO</div>
      </div>
      <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#E53E3E' }} />
    </div>
  )
}
