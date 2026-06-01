'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { CHECKLIST, DAILY_TARGETS } from '@/lib/data'

interface Meal { cal: number; pro: number; carb: number; water: number }

export default function TodayTab() {
  const [checked, setChecked] = useState<Record<string, boolean>>({})
  const [totals, setTotals] = useState({ cal: 0, pro: 0, carb: 0, water: 0 })
  const today = new Date().toISOString().split('T')[0]

  useEffect(() => {
    loadChecklist()
    loadMeals()
  }, [])

  async function loadChecklist() {
    const { data } = await supabase.from('checklist').select('*').eq('date', today)
    if (data) {
      const map: Record<string, boolean> = {}
      data.forEach((r: any) => { map[r.item_id] = r.done })
      setChecked(map)
    }
  }

  async function loadMeals() {
    const { data } = await supabase.from('meals').select('cal,pro,carb,water').eq('date', today)
    if (data) {
      const t = data.reduce((acc: any, m: Meal) => ({
        cal: acc.cal + (m.cal || 0), pro: acc.pro + (m.pro || 0),
        carb: acc.carb + (m.carb || 0), water: acc.water + (m.water || 0)
      }), { cal: 0, pro: 0, carb: 0, water: 0 })
      setTotals(t)
    }
  }

  async function toggleCheck(id: string) {
    const newVal = !checked[id]
    setChecked(prev => ({ ...prev, [id]: newVal }))
    await supabase.from('checklist').upsert({ date: today, item_id: id, done: newVal }, { onConflict: 'date,item_id' })
  }

  const metrics = [
    { key: 'cal', label: 'kcal', val: Math.round(totals.cal), target: '2,400', color: '#c8f542' },
    { key: 'pro', label: 'protein', val: Math.round(totals.pro) + 'g', target: '200g', color: '#4299ff' },
    { key: 'carb', label: 'carbs', val: Math.round(totals.carb) + 'g', target: '300g', color: '#f5a742' },
    { key: 'water', label: 'water', val: (totals.water / 1000).toFixed(1) + 'L', target: '3L', color: '#42f5a7' },
  ]

  const tips = [
    { title: 'Pre-fatigue isolation first', text: 'Lateral raises and curls before compound presses. Tire the muscle, then load it heavy.', color: '#c8f542' },
    { title: 'HGH pre-bed — non negotiable', text: 'Last food 2–3 hours before injection. Pin right before sleep for maximum GH pulse.', color: '#42f5a7' },
    { title: 'Hit 3 litres water', text: 'Flushes sodium, improves HRV, reduces water retention. Start now.', color: '#f5a742' },
  ]

  return (
    <div style={{ padding: '1.25rem', overflowY: 'auto' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ fontSize: 10, letterSpacing: '0.15em', color: '#444', fontFamily: 'Space Mono, monospace', marginBottom: 12 }}>DAILY CHECKLIST</div>
        <div style={{ background: '#111', border: '1px solid #222', borderRadius: 12, overflow: 'hidden' }}>
          {CHECKLIST.map((item, i) => (
            <div key={item.id} onClick={() => toggleCheck(item.id)}
              style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '0.875rem 1rem', borderBottom: i < CHECKLIST.length - 1 ? '1px solid #222' : 'none', cursor: 'pointer' }}>
              <div style={{ width: 20, height: 20, borderRadius: 4, border: checked[item.id] ? 'none' : '1px solid #333', background: checked[item.id] ? '#c8f542' : 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, color: '#000', flexShrink: 0 }}>
                {checked[item.id] ? '✓' : ''}
              </div>
              <span style={{ fontSize: 13, textDecoration: checked[item.id] ? 'line-through' : 'none', color: checked[item.id] ? '#555' : '#f0f0f0' }}>{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ fontSize: 10, letterSpacing: '0.15em', color: '#444', fontFamily: 'Space Mono, monospace', marginBottom: 12 }}>QUICK MACROS</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          {metrics.map(m => (
            <div key={m.key} style={{ background: '#111', border: `1px solid ${m.key === 'cal' ? '#c8f542' : '#222'}`, borderRadius: 12, padding: '0.875rem' }}>
              <div style={{ fontSize: 24, fontWeight: 800 }}>{m.val}</div>
              <div style={{ fontSize: 11, color: '#888', fontFamily: 'Space Mono, monospace', marginTop: 4 }}>{m.label}</div>
              <div style={{ fontSize: 10, color: '#444', marginTop: 2 }}>/ {m.target}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ fontSize: 10, letterSpacing: '0.15em', color: '#444', fontFamily: 'Space Mono, monospace', marginBottom: 12 }}>TODAY'S REMINDERS</div>
        {tips.map((tip, i) => (
          <div key={i} style={{ background: '#111', border: '1px solid #222', borderLeft: `3px solid ${tip.color}`, borderRadius: 12, padding: '1rem', marginBottom: 8 }}>
            <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 4 }}>{tip.title}</div>
            <div style={{ fontSize: 12, color: '#888', lineHeight: 1.5 }}>{tip.text}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
