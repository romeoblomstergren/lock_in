'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { PROGRAMS } from '@/lib/data'

const DAY_MAP: Record<number, string> = { 1:'monday', 2:'tuesday', 3:'wednesday', 4:'thursday', 5:'friday', 6:'saturday', 0:'sunday' }
const WEEK_LABELS = ['M','T','W','T','F','S','S']
const WEEK_KEYS = ['monday','tuesday','wednesday','thursday','friday','saturday','sunday']

export default function GymTab() {
  const [done, setDone] = useState<Record<number,boolean>>({})
  const [phase, setPhase] = useState<'foundation'|'development'|'peak'>('foundation')
  const today = new Date().toISOString().split('T')[0]
  const dayKey = DAY_MAP[new Date().getDay()]
  const program = PROGRAMS[phase]
  const workout = (program.days as any)[dayKey]

  useEffect(() => { load() }, [today])

  async function load() {
    const { data } = await supabase.from('workout_log').select('*').eq('date', today)
    if (data) { const m: Record<number,boolean> = {}; data.forEach((r:any) => m[r.exercise_index] = r.done); setDone(m) }
  }

  async function toggle(i: number) {
    const val = !done[i]
    setDone(p => ({...p,[i]:val}))
    await supabase.from('workout_log').upsert({ date:today, exercise_index:i, done:val }, { onConflict:'date,exercise_index' })
  }

  return (
    <div style={{ padding:'24px', maxWidth:800, margin:'0 auto' }}>
      <div style={{ marginBottom:32 }}>
        <div style={{ fontFamily:'Bebas Neue, sans-serif', fontSize:64, lineHeight:0.9, color:'#fff' }}>{dayKey.toUpperCase()}</div>
        <div style={{ fontSize:10, color:'#E53E3E', letterSpacing:'0.2em', marginTop:6 }}>{workout ? workout.label : 'REST DAY'} — {phase.toUpperCase()} PHASE</div>
      </div>

      <div style={{ display:'flex', gap:2, marginBottom:24 }}>
        {(['foundation','development','peak'] as const).map(p => (
          <button key={p} onClick={() => setPhase(p)}
            style={{ flex:1, padding:'10px 4px', background:'none', border:`1px solid ${phase===p?'#E53E3E':'#111'}`, color:phase===p?'#E53E3E':'#444', fontSize:10, letterSpacing:'0.1em', cursor:'pointer', fontFamily:'Inter,sans-serif', fontWeight:600 }}>
            {p.toUpperCase()}
          </button>
        ))}
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'repeat(7,1fr)', gap:4, marginBottom:24 }}>
        {WEEK_LABELS.map((l,i) => {
          const k = WEEK_KEYS[i]
          const isToday = k === dayKey
          const hasWorkout = !!(program.days as any)[k]
          const isSat = k === 'saturday'
          return (
            <div key={i} style={{ aspectRatio:'1', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:2,
              background: isToday ? '#E53E3E' : '#0a0a0a',
              border: `1px solid ${isToday?'#E53E3E':hasWorkout?'#222':'#0d0d0d'}` }}>
              <span style={{ fontSize:10, fontWeight:600, color: isToday?'#fff':hasWorkout?'#fff':'#333' }}>{l}</span>
              {isSat && !isToday && <span style={{ fontSize:7, color:'#444', letterSpacing:'0.05em' }}>OPT</span>}
            </div>
          )
        })}
      </div>

      {!workout ? (
        <div style={{ padding:'40px 0', textAlign:'center' }}>
          <div style={{ fontFamily:'Bebas Neue, sans-serif', fontSize:48, color:'#222' }}>REST</div>
          <div style={{ fontSize:12, color:'#444', marginTop:8, letterSpacing:'0.1em' }}>RECOVERY IS GROWTH</div>
        </div>
      ) : (
        <div>
          <div style={{ fontSize:10, letterSpacing:'0.2em', color:'#555', marginBottom:12 }}>TODAY'S WORKOUT</div>
          {workout.exercises.map((ex:any, i:number) => (
            <div key={i} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'16px 0', borderBottom:'1px solid #0d0d0d' }}>
              <div>
                <div style={{ fontSize:15, fontWeight:500, color: done[i] ? '#444' : '#fff', textDecoration: done[i] ? 'line-through' : 'none' }}>{ex.name}</div>
                <div style={{ fontSize:11, color:'#555', marginTop:3, letterSpacing:'0.05em' }}>{ex.sets} × {ex.reps}</div>
              </div>
              <button onClick={() => toggle(i)}
                style={{ width:28, height:28, border:`1px solid ${done[i]?'#E53E3E':'#222'}`, background:done[i]?'#E53E3E':'none', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>
                {done[i] && <svg width="12" height="12" viewBox="0 0 12 12"><polyline points="2,6 5,9 10,3" stroke="#fff" strokeWidth="1.5" fill="none"/></svg>}
              </button>
            </div>
          ))}
        </div>
      )}

      <div style={{ marginTop:32 }}>
        <div style={{ fontSize:10, letterSpacing:'0.2em', color:'#555', marginBottom:16 }}>FULL WEEK</div>
        {(['monday','tuesday','thursday','friday'] as const).map(day => {
          const w = (program.days as any)[day]
          if (!w) return null
          const labels: Record<string,string> = { monday:'MON',tuesday:'TUE',thursday:'THU',friday:'FRI' }
          return (
            <div key={day} style={{ marginBottom:16 }}>
              <div style={{ display:'flex', justifyContent:'space-between', marginBottom:8 }}>
                <span style={{ fontSize:12, fontWeight:600, color:'#E53E3E', letterSpacing:'0.1em' }}>{labels[day]}</span>
                <span style={{ fontSize:10, color:'#555', letterSpacing:'0.1em' }}>{w.label}</span>
              </div>
              {w.exercises.map((ex:any,i:number) => (
                <div key={i} style={{ display:'flex', justifyContent:'space-between', padding:'8px 0', borderBottom:'1px solid #0a0a0a' }}>
                  <span style={{ fontSize:13, color:'#888' }}>{ex.name}</span>
                  <span style={{ fontSize:11, color:'#333' }}>{ex.sets}×{ex.reps}</span>
                </div>
              ))}
            </div>
          )
        })}
      </div>
    </div>
  )
}
