'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { CYCLE_START, PHOTO_DATE, MILESTONES } from '@/lib/data'

interface WeightEntry { id: string; date: string; weight: number; bf: number | null }

export default function StatsTab() {
  const [history, setHistory] = useState<WeightEntry[]>([])
  const [weight, setWeight] = useState('')
  const [bf, setBf] = useState('')

  const today = new Date()
  const cycleDay = Math.max(1, Math.ceil((today.getTime() - CYCLE_START.getTime()) / 86400000) + 1)
  const daysLeft = Math.max(0, Math.ceil((PHOTO_DATE.getTime() - today.getTime()) / 86400000))
  const cyclePct = Math.min(100, Math.round((cycleDay / 91) * 100))
  const photoPct = Math.min(100, Math.round(((30 - daysLeft) / 30) * 100))

  useEffect(() => { loadHistory() }, [])

  async function loadHistory() {
    const { data } = await supabase.from('weight_log').select('*').order('created_at', { ascending: false }).limit(30)
    if (data) setHistory(data)
  }

  async function logWeight() {
    if (!weight) return
    await supabase.from('weight_log').insert({ date: today.toISOString().split('T')[0], weight: +weight, bf: bf ? +bf : null })
    setWeight(''); setBf('')
    loadHistory()
  }

  async function deleteEntry(id: string) {
    await supabase.from('weight_log').delete().eq('id', id)
    loadHistory()
  }

  const inp = { background: '#0a0a0a', border: '1px solid #222', borderRadius: 8, padding: '8px 10px', color: '#f0f0f0', fontSize: 15, fontFamily: 'Syne, sans-serif', width: '100%', outline: 'none' }

  return (
    <div style={{ padding: '1.25rem', overflowY: 'auto' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: '1.5rem' }}>
        {[
          { val: cycleDay, label: 'cycle day', sub: 'of 91 total', color: '#c8f542' },
          { val: daysLeft, label: 'days to photo', sub: 'Instagram', color: '#f0f0f0' },
          { val: '50kg', label: 'total lost', sub: 'since Feb 2025', color: '#42f5a7' },
          { val: '182', label: 'height cm', sub: '77.1kg start', color: '#f0f0f0' },
        ].map((s, i) => (
          <div key={i} style={{ background: '#111', border: '1px solid #222', borderRadius: 12, padding: '1rem', textAlign: 'center' }}>
            <div style={{ fontSize: 28, fontWeight: 800, color: s.color }}>{s.val}</div>
            <div style={{ fontSize: 11, color: '#888', fontFamily: 'Space Mono, monospace', marginTop: 4 }}>{s.label}</div>
            <div style={{ fontSize: 10, color: '#444', marginTop: 2 }}>{s.sub}</div>
          </div>
        ))}
      </div>

      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ fontSize: 10, letterSpacing: '0.15em', color: '#444', fontFamily: 'Space Mono, monospace', marginBottom: 12 }}>WEIGHT LOG</div>
        <div style={{ background: '#111', border: '1px solid #222', borderRadius: 12, padding: '1rem', marginBottom: 12 }}>
          <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end' }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 10, color: '#444', fontFamily: 'Space Mono, monospace', marginBottom: 4 }}>WEIGHT (kg)</div>
              <input style={inp} type="number" placeholder="77.1" step="0.1" value={weight} onChange={e => setWeight(e.target.value)} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 10, color: '#444', fontFamily: 'Space Mono, monospace', marginBottom: 4 }}>BF% (optional)</div>
              <input style={inp} type="number" placeholder="17.5" step="0.1" value={bf} onChange={e => setBf(e.target.value)} />
            </div>
            <button onClick={logWeight} style={{ padding: '8px 14px', background: '#c8f542', color: '#000', fontSize: 13, fontWeight: 700, border: 'none', borderRadius: 8, cursor: 'pointer', fontFamily: 'Syne, sans-serif', whiteSpace: 'nowrap', alignSelf: 'flex-end' }}>Log</button>
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {history.map(entry => (
            <div key={entry.id} style={{ background: '#181818', borderRadius: 8, padding: '8px 12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: 15, fontWeight: 700 }}>{entry.weight}kg{entry.bf ? ` · ${entry.bf}%BF` : ''}</div>
                <div style={{ fontSize: 11, color: '#888', fontFamily: 'Space Mono, monospace' }}>{entry.date}</div>
              </div>
              <button onClick={() => deleteEntry(entry.id)} style={{ background: 'none', border: 'none', color: '#444', cursor: 'pointer', fontSize: 16 }}>×</button>
            </div>
          ))}
        </div>
      </div>

      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ fontSize: 10, letterSpacing: '0.15em', color: '#444', fontFamily: 'Space Mono, monospace', marginBottom: 12 }}>MILESTONES</div>
        <div style={{ background: '#111', border: '1px solid #222', borderRadius: 12, overflow: 'hidden' }}>
          {MILESTONES.map((m, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 1rem', borderBottom: i < MILESTONES.length - 1 ? '1px solid #222' : 'none' }}>
              <div style={{ fontSize: 13, color: m.done ? '#c8f542' : '#f0f0f0' }}>{m.name}</div>
              <div style={{ fontSize: 11, fontFamily: 'Space Mono, monospace', color: m.done ? '#c8f542' : '#888' }}>{m.date}{m.done ? ' ✓' : ''}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ fontSize: 10, letterSpacing: '0.15em', color: '#444', fontFamily: 'Space Mono, monospace', marginBottom: 12 }}>CYCLE PROGRESS</div>
        <div style={{ background: '#111', border: '1px solid #222', borderRadius: 12, padding: '1rem' }}>
          {[
            { label: 'Cycle (91 days)', val: `Day ${cycleDay}`, pct: cyclePct, color: '#c8f542' },
            { label: 'Photo countdown', val: `${daysLeft} days`, pct: photoPct, color: '#42f5a7' },
            { label: 'BF target (17% → 15%)', val: 'In progress', pct: 0, color: '#f5a742' },
          ].map((b, i) => (
            <div key={i} style={{ marginBottom: i < 2 ? 14 : 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                <span style={{ fontSize: 13, fontWeight: 600 }}>{b.label}</span>
                <span style={{ fontSize: 12, fontFamily: 'Space Mono, monospace', color: '#888' }}>{b.val}</span>
              </div>
              <div style={{ height: 4, background: '#222', borderRadius: 2 }}>
                <div style={{ height: 4, background: b.color, borderRadius: 2, width: `${b.pct}%`, transition: 'width 0.4s' }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
