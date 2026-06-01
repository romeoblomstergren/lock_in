'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { DAILY_TARGETS } from '@/lib/data'

interface Meal { id: string; name: string; cal: number; pro: number; carb: number; fat: number; water: number }

export default function FoodTab() {
  const [meals, setMeals] = useState<Meal[]>([])
  const [form, setForm] = useState({ name:'', cal:'', pro:'', carb:'', water:'' })
  const today = new Date().toISOString().split('T')[0]

  useEffect(() => { load() }, [])

  async function load() {
    const { data } = await supabase.from('meals').select('*').eq('date', today).order('created_at')
    if (data) setMeals(data)
  }

  async function add() {
    if (!form.cal && !form.pro && !form.water) return
    await supabase.from('meals').insert({ date:today, name:form.name||'Meal', cal:+form.cal||0, pro:+form.pro||0, carb:+form.carb||0, fat:0, water:+form.water||0 })
    setForm({ name:'', cal:'', pro:'', carb:'', water:'' })
    load()
  }

  async function del(id: string) {
    await supabase.from('meals').delete().eq('id', id)
    load()
  }

  const t = meals.reduce((a,m) => ({ cal:a.cal+m.cal, pro:a.pro+m.pro, carb:a.carb+m.carb, water:a.water+(m.water||0) }), { cal:0,pro:0,carb:0,water:0 })
  const pct = (v:number,max:number) => Math.min(100, Math.round((v/max)*100))
  const inp = { background:'#0a0a0a', border:'1px solid #111', padding:'10px 14px', color:'#fff', fontSize:14, fontFamily:'Inter, sans-serif', width:'100%', outline:'none' }

  return (
    <div style={{ padding:'24px', maxWidth:800, margin:'0 auto' }}>
      <div style={{ marginBottom:32 }}>
        <div style={{ fontFamily:'Bebas Neue, sans-serif', fontSize:72, lineHeight:0.9, color:'#E53E3E' }}>{Math.round(t.cal)}</div>
        <div style={{ fontSize:10, color:'#555', letterSpacing:'0.2em', marginTop:8 }}>KCAL TODAY — {Math.round(DAILY_TARGETS.cal - t.cal)} REMAINING</div>
        <div style={{ height:2, background:'#111', marginTop:16 }}>
          <div style={{ height:2, background:'#E53E3E', width:`${pct(t.cal,DAILY_TARGETS.cal)}%`, transition:'width 0.4s' }} />
        </div>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:2, marginBottom:32 }}>
        {[
          { l:'PROTEIN', v:Math.round(t.pro)+'g', t:'200g', pv:pct(t.pro,DAILY_TARGETS.protein) },
          { l:'CARBS', v:Math.round(t.carb)+'g', t:'300g', pv:pct(t.carb,DAILY_TARGETS.carbs) },
          { l:'WATER', v:(t.water/1000).toFixed(1)+'L', t:'3L', pv:pct(t.water,DAILY_TARGETS.water) },
        ].map((m,i) => (
          <div key={i} style={{ background:'#0a0a0a', border:'1px solid #111', padding:'16px' }}>
            <div style={{ fontFamily:'Bebas Neue, sans-serif', fontSize:32, color:'#fff' }}>{m.v}</div>
            <div style={{ fontSize:10, color:'#555', letterSpacing:'0.1em', marginTop:2 }}>{m.l}</div>
            <div style={{ height:1, background:'#111', marginTop:10 }}>
              <div style={{ height:1, background:'#fff', width:`${m.pv}%` }} />
            </div>
            <div style={{ fontSize:10, color:'#333', marginTop:4 }}>/ {m.t}</div>
          </div>
        ))}
      </div>

      <div style={{ marginBottom:24 }}>
        <div style={{ fontSize:10, letterSpacing:'0.2em', color:'#555', marginBottom:12 }}>LOG MEAL</div>
        <div style={{ background:'#0a0a0a', border:'1px solid #111', padding:'20px' }}>
          <div style={{ marginBottom:10 }}>
            <input style={inp} placeholder="Meal name (optional)" value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))} />
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8, marginBottom:12 }}>
            {[['cal','Calories (kcal)'],['pro','Protein (g)'],['carb','Carbs (g)'],['water','Water (ml)']].map(([k,pl]) => (
              <input key={k} style={inp} type="number" placeholder={pl} value={(form as any)[k]} onChange={e=>setForm(f=>({...f,[k]:e.target.value}))} />
            ))}
          </div>
          <button onClick={add} style={{ width:'100%', padding:'14px', background:'#E53E3E', color:'#fff', border:'none', fontFamily:'Bebas Neue, sans-serif', fontSize:18, letterSpacing:2, cursor:'pointer' }}>LOG</button>
          <button onClick={async()=>{ if(!confirm('Reset?')) return; await supabase.from('meals').delete().eq('date',today); load() }}
            style={{ width:'100%', padding:'10px', background:'none', color:'#333', border:'1px solid #111', fontFamily:'Inter,sans-serif', fontSize:12, cursor:'pointer', marginTop:6, letterSpacing:'0.1em' }}>RESET DAY</button>
        </div>
      </div>

      <div>
        <div style={{ fontSize:10, letterSpacing:'0.2em', color:'#555', marginBottom:12 }}>LOGGED TODAY</div>
        {meals.map(m => (
          <div key={m.id} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'12px 0', borderBottom:'1px solid #0d0d0d' }}>
            <div>
              <div style={{ fontSize:14, color:'#fff', fontWeight:500 }}>{m.name}</div>
              <div style={{ fontSize:11, color:'#555', marginTop:2 }}>{Math.round(m.cal)}kcal · {Math.round(m.pro)}g P · {Math.round(m.carb)}g C{m.water ? ` · ${m.water}ml` : ''}</div>
            </div>
            <button onClick={() => del(m.id)} style={{ background:'none', border:'none', color:'#333', cursor:'pointer', fontSize:18, padding:'0 0 0 16px' }}>×</button>
          </div>
        ))}
      </div>
    </div>
  )
}
