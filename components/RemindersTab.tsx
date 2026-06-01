'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

interface Reminder { id: string; title: string; time: string; days: string[]; active: boolean }

const ALL_DAYS = ['mon','tue','wed','thu','fri','sat','sun']
const DAY_LABELS: Record<string,string> = { mon:'M',tue:'T',wed:'W',thu:'T',fri:'F',sat:'S',sun:'S' }

const PRESETS = [
  { title:'Take SARMs', time:'08:00', days:ALL_DAYS },
  { title:'HGH pre-bed', time:'22:00', days:ALL_DAYS },
  { title:'Pin Test E', time:'15:20', days:['thu'] },
  { title:'Pin HCG', time:'09:00', days:['tue','fri'] },
  { title:'Meal 1', time:'08:00', days:ALL_DAYS },
  { title:'Meal 2', time:'13:00', days:ALL_DAYS },
  { title:'Meal 3', time:'18:00', days:ALL_DAYS },
  { title:'Meal 4', time:'21:00', days:ALL_DAYS },
]

export default function RemindersTab() {
  const [reminders, setReminders] = useState<Reminder[]>([])
  const [form, setForm] = useState({ title:'', time:'', days: ALL_DAYS })
  const [adding, setAdding] = useState(false)

  useEffect(() => { load() }, [])

  async function load() {
    const { data } = await supabase.from('reminders').select('*').order('time')
    if (data) setReminders(data)
  }

  async function add(preset?: any) {
    const r = preset || form
    if (!r.title || !r.time) return
    await supabase.from('reminders').insert({ title:r.title, time:r.time, days:r.days, active:true })
    setForm({ title:'', time:'', days:ALL_DAYS }); setAdding(false); load()
  }

  async function toggle(id: string, active: boolean) {
    await supabase.from('reminders').update({ active: !active }).eq('id', id)
    load()
  }

  async function del(id: string) {
    await supabase.from('reminders').delete().eq('id', id)
    load()
  }

  function toggleDay(day: string) {
    setForm(f => ({ ...f, days: f.days.includes(day) ? f.days.filter(d=>d!==day) : [...f.days, day] }))
  }

  const inp = { background:'#0a0a0a', border:'1px solid #111', padding:'10px 14px', color:'#fff', fontSize:14, fontFamily:'Inter,sans-serif', width:'100%', outline:'none' }

  return (
    <div style={{ padding:'24px', maxWidth:800, margin:'0 auto' }}>
      <div style={{ marginBottom:32 }}>
        <div style={{ fontFamily:'Bebas Neue, sans-serif', fontSize:48, lineHeight:0.9 }}>REMINDERS</div>
        <div style={{ fontSize:10, color:'#555', letterSpacing:'0.2em', marginTop:6 }}>BROWSER NOTIFICATIONS — ALLOW WHEN PROMPTED</div>
      </div>

      <div style={{ marginBottom:32 }}>
        <div style={{ fontSize:10, letterSpacing:'0.2em', color:'#555', marginBottom:12 }}>QUICK ADD</div>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:2 }}>
          {PRESETS.map((p,i) => (
            <button key={i} onClick={() => add(p)}
              style={{ background:'#0a0a0a', border:'1px solid #111', padding:'14px', cursor:'pointer', textAlign:'left' }}>
              <div style={{ fontFamily:'Bebas Neue,sans-serif', fontSize:16, color:'#E53E3E', letterSpacing:1 }}>{p.title}</div>
              <div style={{ fontSize:11, color:'#555', marginTop:2 }}>{p.time} — {p.days.map(d=>DAY_LABELS[d]).join('')}</div>
            </button>
          ))}
        </div>
      </div>

      <div style={{ marginBottom:32 }}>
        <button onClick={() => setAdding(!adding)}
          style={{ width:'100%', padding:'14px', background:'none', border:'1px solid #222', color:'#aaa', fontFamily:'Bebas Neue,sans-serif', fontSize:18, letterSpacing:2, cursor:'pointer' }}>
          {adding ? 'CANCEL' : '+ CUSTOM REMINDER'}
        </button>
        {adding && (
          <div style={{ background:'#0a0a0a', border:'1px solid #111', padding:'20px', marginTop:2 }}>
            <div style={{ marginBottom:10 }}>
              <input style={inp} placeholder="Reminder title" value={form.title} onChange={e=>setForm(f=>({...f,title:e.target.value}))} />
            </div>
            <div style={{ marginBottom:14 }}>
              <input style={inp} type="time" value={form.time} onChange={e=>setForm(f=>({...f,time:e.target.value}))} />
            </div>
            <div style={{ display:'flex', gap:4, marginBottom:16 }}>
              {ALL_DAYS.map(day => (
                <button key={day} onClick={() => toggleDay(day)}
                  style={{ flex:1, padding:'8px 4px', background:form.days.includes(day)?'#E53E3E':'#0d0d0d', border:`1px solid ${form.days.includes(day)?'#E53E3E':'#222'}`, color:'#fff', fontSize:11, cursor:'pointer', fontWeight:600 }}>
                  {DAY_LABELS[day]}
                </button>
              ))}
            </div>
            <button onClick={() => add()}
              style={{ width:'100%', padding:'14px', background:'#E53E3E', color:'#fff', border:'none', fontFamily:'Bebas Neue,sans-serif', fontSize:18, letterSpacing:2, cursor:'pointer' }}>
              ADD REMINDER
            </button>
          </div>
        )}
      </div>

      <div>
        <div style={{ fontSize:10, letterSpacing:'0.2em', color:'#555', marginBottom:12 }}>YOUR REMINDERS ({reminders.length})</div>
        {reminders.length === 0 && (
          <div style={{ padding:'32px 0', textAlign:'center', color:'#333', fontSize:13 }}>No reminders yet. Add from presets above.</div>
        )}
        {reminders.map(r => (
          <div key={r.id} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'14px 0', borderBottom:'1px solid #0d0d0d', opacity: r.active ? 1 : 0.4 }}>
            <div>
              <div style={{ fontSize:14, fontWeight:500, color: r.active ? '#fff' : '#555' }}>{r.title}</div>
              <div style={{ fontSize:11, color:'#555', marginTop:2 }}>{r.time} — {r.days.map(d=>DAY_LABELS[d]).join('')}</div>
            </div>
            <div style={{ display:'flex', gap:8, alignItems:'center' }}>
              <button onClick={() => toggle(r.id, r.active)}
                style={{ width:36, height:20, background: r.active?'#E53E3E':'#111', border:`1px solid ${r.active?'#E53E3E':'#333'}`, borderRadius:10, cursor:'pointer', position:'relative' }}>
                <div style={{ width:14, height:14, background:'#fff', borderRadius:'50%', position:'absolute', top:2, left: r.active?'calc(100% - 16px)':2, transition:'left 0.2s' }} />
              </button>
              <button onClick={() => del(r.id)} style={{ background:'none', border:'none', color:'#333', cursor:'pointer', fontSize:18 }}>×</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
