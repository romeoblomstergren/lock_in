'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { CHECKLIST, DAILY_TARGETS } from '@/lib/data'

export default function TodayTab({ onNavigate }: { onNavigate: (tab: string) => void }) {
  const [checked, setChecked] = useState<Record<string, boolean>>({})
  const [totals, setTotals] = useState({ cal: 0, pro: 0, carb: 0, water: 0 })
  const today = new Date().toISOString().split('T')[0]

  useEffect(() => { load() }, [])

  async function load() {
    const [cl, ml] = await Promise.all([
      supabase.from('checklist').select('*').eq('date', today),
      supabase.from('meals').select('cal,pro,carb,water').eq('date', today)
    ])
    if (cl.data) { const m: Record<string,boolean> = {}; cl.data.forEach((r:any) => m[r.item_id] = r.done); setChecked(m) }
    if (ml.data) setTotals(ml.data.reduce((a:any,m:any) => ({ cal:a.cal+m.cal, pro:a.pro+m.pro, carb:a.carb+m.carb, water:a.water+(m.water||0) }), { cal:0,pro:0,carb:0,water:0 }))
  }

  async function toggle(id: string) {
    const val = !checked[id]
    setChecked(p => ({...p,[id]:val}))
    await supabase.from('checklist').upsert({ date:today, item_id:id, done:val }, { onConflict:'date,item_id' })
  }

  const S = { border: 'none', background: 'none', cursor: 'pointer', padding: 0 }
  const pct = (v: number, t: number) => Math.min(100, Math.round((v/t)*100))

  return (
    <div style={{ padding: '24px', maxWidth: 800, margin: '0 auto' }}>
      <div style={{ marginBottom: 40 }}>
        <div style={{ fontSize: 10, letterSpacing: '0.2em', color: '#555', marginBottom: 12 }}>TODAY'S MACROS</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
          {[
            { label:'KCAL', val: Math.round(totals.cal), target: DAILY_TARGETS.cal, display: Math.round(totals.cal).toString(), accent: true },
            { label:'PROTEIN', val: totals.pro, target: DAILY_TARGETS.protein, display: Math.round(totals.pro)+'g', accent: false },
            { label:'CARBS', val: totals.carb, target: DAILY_TARGETS.carbs, display: Math.round(totals.carb)+'g', accent: false },
            { label:'WATER', val: totals.water, target: DAILY_TARGETS.water, display: (totals.water/1000).toFixed(1)+'L', accent: false },
          ].map((m,i) => (
            <div key={i} onClick={() => onNavigate('food')} style={{ background: '#0a0a0a', padding: '20px', cursor: 'pointer', border: '1px solid #111' }}>
              <div style={{ fontFamily:'Bebas Neue, sans-serif', fontSize:48, lineHeight:1, color: m.accent ? '#E53E3E' : '#fff' }}>{m.display}</div>
              <div style={{ fontSize:10, color:'#555', letterSpacing:'0.15em', marginTop:4 }}>{m.label}</div>
              <div style={{ height:2, background:'#111', marginTop:10 }}>
                <div style={{ height:2, background: m.accent ? '#E53E3E' : '#fff', width:`${pct(m.val,m.target)}%`, transition:'width 0.4s' }} />
              </div>
              <div style={{ fontSize:10, color:'#333', marginTop:4 }}>/ {m.label==='WATER'?'3L':m.label==='KCAL'?'2,400':m.label==='PROTEIN'?'200g':'300g'}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ marginBottom: 40 }}>
        <div style={{ fontSize:10, letterSpacing:'0.2em', color:'#555', marginBottom:16 }}>DAILY CHECKLIST</div>
        {CHECKLIST.map((item, i) => (
          <div key={item.id} onClick={() => toggle(item.id)}
            style={{ display:'flex', alignItems:'center', gap:16, padding:'14px 0', borderBottom:'1px solid #0d0d0d', cursor:'pointer' }}>
            <div style={{ width:18, height:18, border:`1px solid ${checked[item.id]?'#E53E3E':'#333'}`, background:checked[item.id]?'#E53E3E':'transparent', flexShrink:0, display:'flex', alignItems:'center', justifyContent:'center' }}>
              {checked[item.id] && <svg width="10" height="10" viewBox="0 0 10 10"><polyline points="1.5,5 4,7.5 8.5,2" stroke="#fff" strokeWidth="1.5" fill="none"/></svg>}
            </div>
            <span style={{ fontSize:14, color: checked[item.id] ? '#444' : '#aaa', textDecoration: checked[item.id] ? 'line-through' : 'none' }}>{item.label}</span>
          </div>
        ))}
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:2 }}>
        {[
          { label:'GO LOG FOOD', sub:'Tap to add meals', tab:'food' },
          { label:'VIEW GYM', sub:"Today's workout", tab:'gym' },
          { label:'ASK AI', sub:'Log food by chat', tab:'ai' },
        ].map((b,i) => (
          <div key={i} onClick={() => onNavigate(b.tab)}
            style={{ background:'#0a0a0a', border:'1px solid #111', padding:'20px 16px', cursor:'pointer' }}>
            <div style={{ fontFamily:'Bebas Neue, sans-serif', fontSize:20, color:'#E53E3E', letterSpacing:1 }}>{b.label}</div>
            <div style={{ fontSize:11, color:'#555', marginTop:4 }}>{b.sub}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
