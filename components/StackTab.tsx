'use client'
import { STACK, MILESTONES } from '@/lib/data'

const STATUS_STYLES: Record<string, { bg: string; color: string; label: string }> = {
  active: { bg: 'rgba(200,245,66,0.15)', color: '#c8f542', label: 'ACTIVE' },
  monitor: { bg: 'rgba(245,167,66,0.15)', color: '#f5a742', label: 'MONITOR' },
  incoming: { bg: 'rgba(66,153,255,0.15)', color: '#4299ff', label: 'INCOMING' },
  standby: { bg: 'rgba(245,167,66,0.15)', color: '#f5a742', label: 'STANDBY' },
  pct: { bg: 'rgba(168,85,247,0.15)', color: '#a855f7', label: 'PCT' },
}

export default function StackTab() {
  return (
    <div style={{ padding: '1.25rem', overflowY: 'auto' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ fontSize: 10, letterSpacing: '0.15em', color: '#444', fontFamily: 'Space Mono, monospace', marginBottom: 12 }}>ACTIVE STACK</div>
        <div style={{ background: '#111', border: '1px solid #222', borderRadius: 12, overflow: 'hidden' }}>
          {STACK.map((item, i) => {
            const s = STATUS_STYLES[item.status] || STATUS_STYLES.active
            return (
              <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem 1rem', borderBottom: i < STACK.length - 1 ? '1px solid #222' : 'none' }}>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600 }}>{item.name}</div>
                  <div style={{ fontSize: 12, color: '#888', fontFamily: 'Space Mono, monospace', marginTop: 2 }}>{item.dose}</div>
                </div>
                <span style={{ fontSize: 10, padding: '3px 8px', borderRadius: 20, fontWeight: 700, fontFamily: 'Space Mono, monospace', background: s.bg, color: s.color }}>{s.label}</span>
              </div>
            )
          })}
        </div>
      </div>

      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ fontSize: 10, letterSpacing: '0.15em', color: '#444', fontFamily: 'Space Mono, monospace', marginBottom: 12 }}>PIN SCHEDULE</div>
        <div style={{ background: '#111', border: '1px solid #222', borderRadius: 12, overflow: 'hidden' }}>
          {[
            { name: 'Test E 250mg', time: 'THU 15:20 weekly' },
            { name: 'HCG 500 IU', time: 'TUE + FRI' },
            { name: 'HGH 3 IU', time: 'NIGHTLY pre-bed' },
          ].map((p, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 1rem', borderBottom: i < 2 ? '1px solid #222' : 'none' }}>
              <div style={{ fontSize: 14, fontWeight: 600 }}>{p.name}</div>
              <div style={{ fontSize: 12, fontFamily: 'Space Mono, monospace', color: '#c8f542' }}>{p.time}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ fontSize: 10, letterSpacing: '0.15em', color: '#444', fontFamily: 'Space Mono, monospace', marginBottom: 12 }}>CYCLE TIMELINE</div>
        <div style={{ background: '#111', border: '1px solid #222', borderRadius: 12, overflow: 'hidden' }}>
          {[
            { name: 'First pin', time: '29 May 2026 ✓', done: true },
            { name: 'Switch to Test C + Primo', time: '16 Jul 2026', done: false },
            { name: 'Last pin', time: '20 Aug 2026', done: false },
            { name: 'PCT starts', time: '3 Sep 2026', done: false },
            { name: 'Enclo 25mg + Nolva', time: '4–6 weeks PCT', done: false },
          ].map((item, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 1rem', borderBottom: i < 4 ? '1px solid #222' : 'none' }}>
              <div style={{ fontSize: 13 }}>{item.name}</div>
              <div style={{ fontSize: 11, fontFamily: 'Space Mono, monospace', color: item.done ? '#c8f542' : '#888' }}>{item.time}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ fontSize: 10, letterSpacing: '0.15em', color: '#444', fontFamily: 'Space Mono, monospace', marginBottom: 12 }}>PCT SUPPLIES</div>
        <div style={{ background: '#111', border: '1px solid #222', borderRadius: 12, overflow: 'hidden' }}>
          {[
            { name: 'Enclomiphene', dose: '100 × 25mg', status: 'pct' },
            { name: 'Nolvadex', dose: '100 × 20mg', status: 'pct' },
            { name: 'Exemestane', dose: '100 × 25mg', status: 'standby' },
            { name: 'HCG', dose: '10,000 IU total', status: 'active' },
          ].map((item, i) => {
            const s = STATUS_STYLES[item.status]
            return (
              <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem 1rem', borderBottom: i < 3 ? '1px solid #222' : 'none' }}>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600 }}>{item.name}</div>
                  <div style={{ fontSize: 12, color: '#888', fontFamily: 'Space Mono, monospace', marginTop: 2 }}>{item.dose}</div>
                </div>
                <span style={{ fontSize: 10, padding: '3px 8px', borderRadius: 20, fontWeight: 700, fontFamily: 'Space Mono, monospace', background: s.bg, color: s.color }}>{s.label}</span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
