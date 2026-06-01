'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { CYCLE_START, PHOTO_DATE, MILESTONES } from '@/lib/data'

interface W { id:string; date:string; weight:number; bf:number|null }

export default function StatsTab() {
  const [history, setHistory] = useState<W[]>([])
  const [weight, setWeight] = useState('')
  const [bf, setBf] = useState('')
  const today = new Date()
  const cycleDay = Math.max(1, Math.floor((today.getTime() - CYCLE_START.getTime()) / 86400000))
  const daysLeft = Math.max(0, Math.ceil((PHOTO_DATE.getTime() - today.getTime()) / 86400000))

  useEffect(() => { load() }, [])
  async function load() {
    const { data } = await supabase.from('weight_log').select('*').order('created_at', { ascending:false }).limit(30)
    if (data) setHistory(data)
  }
  async function log() {
    if (!weight) return
    await supabase.from('weight_log').insert({ date:today.toISOString().split('T')[0], weight:+weight, bf:bf?+bf:null })
    setWeight(''); setBf(''); load()
  }
  async function del(id:string) { await supabase.from('weight_log').delete().eq('id',id); load() }

  const inp = { background:'#0a0a0a', border:'1px solid #111', padding:'10px 14px', color:'#fff', fontSize:14, fontFamily:'Inter,sans-serif', width:'100%', outline:'none' }

  return (
    <div style={{ padding:'24px', maxWidth:800, margin:'0 auto' }}>
      <div style={{ marginBottom:32 }}>
        <div style={{ fontFamily:'Bebas Neue, sans-serif', fontSize:80, lineHeight:0.9, color:'#fff' }}>
          {history[0] ? history[0].weight+'KG' : '77.1KG'}
        </div>
        <div style={{ fontSize:10, color:'#E53E3E', letterSpacing:'0.2em', marginTop:8 }}>50KG LOST SINCE FEB 2025</div>
        <div style={{ fontSize:10, color:'#555', letterSpacing:'0.15em', marginTop:4 }}>
          {history[0]?.bf ? history[0].bf+'% BODY FAT' : '17–18% BODY FAT'}
        </div>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:2, marginBottom:32 }}>
        {[
          { val:cycleDay, lbl:'CYCLE DAY', sub:'of 91' },
          { val:daysLeft, lbl:'DAYS TO PHOTO', sub:'Instagram' },
          { val:'182', lbl:'HEIGHT CM', sub:'77.1kg start' },
        ].map((s,i) => (
          <div key={i} style={{ background:'#0a0a0a', border:'1px solid #111', padding:'20px 16px' }}>
            <div style={{ fontFamily:'Bebas Neue, sans-serif', fontSize:40, color: i===0?'#E53E3E':'#fff', lineHeight:1 }}>{s.val}</div>
            <div style={{ fontSize:10, color:'#555', letterSpacing:'0.1em', marginTop:4 }}>{s.lbl}</div>
            <div style={{ fontSize:10, color:'#333', marginTop:2 }}>{s.sub}</div>
          </div>
        ))}
      </div>

      <div style={{ marginBottom:24 }}>
        <div style={{ fontSize:10, letterSpacing:'0.2em', color:'#555', marginBottom:12 }}>LOG WEIGHT</div>
        <div style={{ background:'#0a0a0a', border:'1px solid #111', padding:'20px' }}>
          <div style={{ display:'flex', gap:8, marginBottom:12 }}>
            <input style={inp} type="number" placeholder="Weight (kg)" step="0.1" value={weight} onChange={e=>setWeight(e.target.value)} />
            <input style={inp} type="number" placeholder="BF% (optional)" step="0.1" value={bf} onChange={e=>setBf(e.target.value)} />
          </div>
          <button onClick={log} style={{ width:'100%', padding:'14px', background:'#E53E3E', color:'#fff', border:'none', fontFamily:'Bebas Neue,sans-serif', fontSize:18, letterSpacing:2, cursor:'pointer' }}>LOG</button>
        </div>
        <div style={{ marginTop:12, display:'flex', flexDirection:'column', gap:0 }}>
          {history.map(e => (
            <div key={e.id} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'12px 0', borderBottom:'1px solid #0d0d0d' }}>
              <div>
                <div style={{ fontSize:16, fontWeight:600 }}>{e.weight}kg{e.bf ? ` · ${e.bf}%BF` : ''}</div>
                <div style={{ fontSize:11, color:'#555', marginTop:2 }}>{e.date}</div>
              </div>
              <button onClick={() => del(e.id)} style={{ background:'none', border:'none', color:'#333', cursor:'pointer', fontSize:18 }}>×</button>
            </div>
          ))}
        </div>
      </div>

      <div>
        <div style={{ fontSize:10, letterSpacing:'0.2em', color:'#555', marginBottom:12 }}>MILESTONES</div>
        {MILESTONES.map((m,i) => (
          <div key={i} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'12px 0', borderBottom:'1px solid #0d0d0d' }}>
            <span style={{ fontSize:13, color: m.done?'#E53E3E':'#aaa' }}>{m.name}</span>
            <span style={{ fontSize:10, color: m.done?'#E53E3E':'#555', letterSpacing:'0.1em' }}>{m.date}{m.done?' ✓':''}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
