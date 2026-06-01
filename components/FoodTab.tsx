'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { DAILY_TARGETS } from '@/lib/data'

interface Meal { id: string; name: string; cal: number; pro: number; carb: number; fat: number; water: number }

export default function FoodTab() {
  const [meals, setMeals] = useState<Meal[]>([])
  const [form, setForm] = useState({ name: '', cal: '', pro: '', carb: '', fat: '', water: '' })
  const today = new Date().toISOString().split('T')[0]

  useEffect(() => { loadMeals() }, [])

  async function loadMeals() {
    const { data } = await supabase.from('meals').select('*').eq('date', today).order('created_at', { ascending: true })
    if (data) setMeals(data)
  }

  async function addMeal() {
    if (!form.cal && !form.pro && !form.water) return
    const meal = { date: today, name: form.name || 'Meal', cal: +form.cal||0, pro: +form.pro||0, carb: +form.carb||0, fat: +form.fat||0, water: +form.water||0 }
    await supabase.from('meals').insert(meal)
    setForm({ name: '', cal: '', pro: '', carb: '', fat: '', water: '' })
    loadMeals()
  }

  async function deleteMeal(id: string) {
    await supabase.from('meals').delete().eq('id', id)
    loadMeals()
  }

  async function resetDay() {
    if (!confirm("Reset today's food log?")) return
    await supabase.from('meals').delete().eq('date', today)
    loadMeals()
  }

  const totals = meals.reduce((acc, m) => ({ cal: acc.cal+m.cal, pro: acc.pro+m.pro, carb: acc.carb+m.carb, water: acc.water+m.water }), { cal:0, pro:0, carb:0, water:0 })
  const bars = [
    { key: 'cal', label: 'Calories', val: totals.cal, target: DAILY_TARGETS.cal, unit: 'kcal', color: '#c8f542' },
    { key: 'pro', label: 'Protein', val: totals.pro, target: DAILY_TARGETS.protein, unit: 'g', color: '#4299ff' },
    { key: 'carb', label: 'Carbs', val: totals.carb, target: DAILY_TARGETS.carbs, unit: 'g', color: '#f5a742' },
    { key: 'water', label: 'Water', val: totals.water, target: DAILY_TARGETS.water, unit: 'L', color: '#42f5a7' },
  ]

  const s: React.CSSProperties & Record<string, any> = {}
  const inp = { background: '#0a0a0a', border: '1px solid #222', borderRadius: 8, padding: '8px 10px', color: '#f0f0f0', fontSize: 15, fontFamily: 'Syne, sans-serif', width: '100%', outline: 'none' }

  return (
    <div style={{ padding: '1.25rem', overflowY: 'auto' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ fontSize: 10, letterSpacing: '0.15em', color: '#444', fontFamily: 'Space Mono, monospace', marginBottom: 12 }}>MACRO PROGRESS</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 12 }}>
          <div style={{ background: '#111', border: '1px solid #c8f542', borderRadius: 12, padding: '0.875rem' }}>
            <div style={{ fontSize: 24, fontWeight: 800 }}>{Math.round(totals.cal)}</div>
            <div style={{ fontSize: 11, color: '#888', fontFamily: 'Space Mono, monospace', marginTop: 4 }}>kcal logged</div>
            <div style={{ fontSize: 10, color: '#444', marginTop: 2 }}>target 2,400</div>
          </div>
          <div style={{ background: '#111', border: '1px solid #222', borderRadius: 12, padding: '0.875rem' }}>
            <div style={{ fontSize: 24, fontWeight: 800 }}>{Math.round(totals.pro)}<span style={{ fontSize: 13, color: '#888' }}>g</span></div>
            <div style={{ fontSize: 11, color: '#888', fontFamily: 'Space Mono, monospace', marginTop: 4 }}>protein</div>
            <div style={{ fontSize: 10, color: '#444', marginTop: 2 }}>target 200g</div>
          </div>
        </div>
        <div style={{ background: '#111', border: '1px solid #222', borderRadius: 12, padding: '1rem' }}>
          {bars.map(b => {
            const pct = Math.min(100, Math.round((b.val / b.target) * 100))
            const display = b.key === 'water' ? (b.val/1000).toFixed(1)+'L' : Math.round(b.val)+(b.unit === 'g' ? 'g' : '')
            const targetDisplay = b.key === 'water' ? '3L' : b.target+(b.unit === 'g' ? 'g' : '')
            return (
              <div key={b.key} style={{ marginBottom: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                  <span style={{ fontSize: 13, fontWeight: 600 }}>{b.label}</span>
                  <span style={{ fontSize: 12, fontFamily: 'Space Mono, monospace', color: '#888' }}>{display} / {targetDisplay}</span>
                </div>
                <div style={{ height: 4, background: '#222', borderRadius: 2 }}>
                  <div style={{ height: 4, background: b.color, borderRadius: 2, width: `${pct}%`, transition: 'width 0.4s' }} />
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ fontSize: 10, letterSpacing: '0.15em', color: '#444', fontFamily: 'Space Mono, monospace', marginBottom: 12 }}>LOG MEAL</div>
        <div style={{ background: '#111', border: '1px solid #222', borderRadius: 12, padding: '1rem' }}>
          <div style={{ marginBottom: 8 }}>
            <div style={{ fontSize: 10, color: '#444', fontFamily: 'Space Mono, monospace', marginBottom: 4 }}>MEAL NAME</div>
            <input style={inp} placeholder="e.g. Mince and rice" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 10 }}>
            {[['cal','CALORIES','kcal'],['pro','PROTEIN','g'],['carb','CARBS','g'],['water','WATER','ml']].map(([k, lbl, unit]) => (
              <div key={k}>
                <div style={{ fontSize: 10, color: '#444', fontFamily: 'Space Mono, monospace', marginBottom: 4 }}>{lbl}</div>
                <input style={inp} type="number" placeholder={unit} value={(form as any)[k]} onChange={e => setForm(f => ({ ...f, [k]: e.target.value }))} />
              </div>
            ))}
          </div>
          <button onClick={addMeal} style={{ width: '100%', padding: 12, background: '#c8f542', color: '#000', fontSize: 14, fontWeight: 700, border: 'none', borderRadius: 10, cursor: 'pointer', fontFamily: 'Syne, sans-serif' }}>Log meal</button>
          <button onClick={resetDay} style={{ width: '100%', padding: 10, background: 'none', color: '#888', fontSize: 13, border: '1px solid #222', borderRadius: 10, cursor: 'pointer', fontFamily: 'Syne, sans-serif', marginTop: 6 }}>Reset today</button>
        </div>
        <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 6 }}>
          {meals.map((m, i) => (
            <div key={m.id} style={{ background: '#181818', borderRadius: 8, padding: '8px 12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600 }}>{m.name}</div>
                <div style={{ fontSize: 11, color: '#888', fontFamily: 'Space Mono, monospace' }}>{Math.round(m.cal)}kcal · {Math.round(m.pro)}g P · {Math.round(m.carb)}g C</div>
              </div>
              <button onClick={() => deleteMeal(m.id)} style={{ background: 'none', border: 'none', color: '#444', cursor: 'pointer', fontSize: 16, paddingLeft: 8 }}>×</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
