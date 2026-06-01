'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { PROGRAMS } from '@/lib/data'

const DAY_MAP: Record<number, string> = { 1: 'monday', 2: 'tuesday', 3: 'wednesday', 4: 'thursday', 5: 'friday', 6: 'saturday', 0: 'sunday' }
const WEEK_LABELS = ['M', 'T', 'W', 'T', 'F', 'S', 'S']
const WEEK_TYPES = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']

export default function GymTab() {
  const [done, setDone] = useState<Record<number, boolean>>({})
  const [activePhase, setActivePhase] = useState<'foundation' | 'development' | 'peak'>('foundation')
  const today = new Date().toISOString().split('T')[0]
  const dayOfWeek = new Date().getDay()
  const dayKey = DAY_MAP[dayOfWeek]
  const program = PROGRAMS[activePhase]
  const todayWorkout = (program.days as any)[dayKey]

  useEffect(() => { loadWorkout() }, [today])

  async function loadWorkout() {
    const { data } = await supabase.from('workout_log').select('*').eq('date', today)
    if (data) {
      const map: Record<number, boolean> = {}
      data.forEach((r: any) => { map[r.exercise_index] = r.done })
      setDone(map)
    }
  }

  async function toggleExercise(i: number) {
    const newVal = !done[i]
    setDone(prev => ({ ...prev, [i]: newVal }))
    await supabase.from('workout_log').upsert({ date: today, exercise_index: i, done: newVal }, { onConflict: 'date,exercise_index' })
  }

  const phases = [
    { key: 'foundation', label: 'FOUNDATION', weeks: 4 },
    { key: 'development', label: 'DEVELOPMENT', weeks: 8 },
    { key: 'peak', label: 'PEAK', weeks: 12 },
  ] as const

  return (
    <div style={{ padding: '1.25rem', overflowY: 'auto' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ fontSize: 10, letterSpacing: '0.15em', color: '#444', fontFamily: 'Space Mono, monospace', marginBottom: 12 }}>PROGRAM PHASE</div>
        <div style={{ display: 'flex', gap: 6, marginBottom: 16 }}>
          {phases.map(p => (
            <button key={p.key} onClick={() => setActivePhase(p.key)}
              style={{ flex: 1, padding: '8px 4px', fontSize: 10, fontWeight: 700, fontFamily: 'Space Mono, monospace', border: `1px solid ${activePhase === p.key ? '#c8f542' : '#222'}`, background: activePhase === p.key ? 'rgba(200,245,66,0.1)' : '#111', color: activePhase === p.key ? '#c8f542' : '#888', borderRadius: 8, cursor: 'pointer' }}>
              {p.label}
            </button>
          ))}
        </div>
        <div style={{ background: '#111', border: '1px solid #222', borderRadius: 12, padding: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 24, fontWeight: 800, color: '#c8f542' }}>4</div>
              <div style={{ fontSize: 10, color: '#444', fontFamily: 'Space Mono, monospace' }}>DAYS/WEEK</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 24, fontWeight: 800 }}>{program.avgSets}</div>
              <div style={{ fontSize: 10, color: '#444', fontFamily: 'Space Mono, monospace' }}>AVG SETS</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 24, fontWeight: 800, color: '#42f5a7' }}>{program.weeks}</div>
              <div style={{ fontSize: 10, color: '#444', fontFamily: 'Space Mono, monospace' }}>WEEKS</div>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4, textAlign: 'center', marginBottom: 6 }}>
            {WEEK_LABELS.map((l, i) => <div key={i} style={{ fontSize: 10, color: '#444', fontFamily: 'Space Mono, monospace' }}>{l}</div>)}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4 }}>
            {WEEK_TYPES.map((day, i) => {
              const isToday = day === dayKey
              const isRest = !( program.days as any)[day]
              const isOpt = day === 'saturday'
              return (
                <div key={day} style={{ aspectRatio: '1', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 8, fontWeight: 700, fontFamily: 'Space Mono, monospace',
                  background: isToday ? '#c8f542' : isRest && !isOpt ? '#181818' : isOpt ? 'rgba(66,153,255,0.15)' : 'rgba(200,245,66,0.15)',
                  color: isToday ? '#000' : isRest && !isOpt ? '#444' : isOpt ? '#4299ff' : '#c8f542',
                  border: isToday ? 'none' : isRest && !isOpt ? '1px solid #222' : isOpt ? '1px solid rgba(66,153,255,0.2)' : '1px solid rgba(200,245,66,0.3)'
                }}>
                  {isRest && !isOpt ? 'REST' : isOpt ? 'OPT' : 'GYM'}
                </div>
              )
            })}
          </div>
        </div>
      </div>

      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ fontSize: 10, letterSpacing: '0.15em', color: '#444', fontFamily: 'Space Mono, monospace', marginBottom: 12 }}>
          {dayKey === 'wednesday' || dayKey === 'saturday' || dayKey === 'sunday' ? 'REST DAY' : `TODAY — ${todayWorkout?.label || 'GYM'}`}
        </div>
        {!todayWorkout ? (
          <div style={{ background: '#111', border: '1px solid #222', borderRadius: 12, padding: '2rem', textAlign: 'center', color: '#888', fontSize: 14 }}>
            Rest day. Recovery is growth.
          </div>
        ) : (
          <div style={{ background: '#111', border: '1px solid #222', borderRadius: 12, overflow: 'hidden' }}>
            {todayWorkout.exercises.map((ex: any, i: number) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem 1rem', borderBottom: i < todayWorkout.exercises.length - 1 ? '1px solid #222' : 'none' }}>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600 }}>{ex.name}</div>
                  <div style={{ fontSize: 12, color: '#888', fontFamily: 'Space Mono, monospace', marginTop: 2 }}>{ex.sets}×{ex.reps}</div>
                </div>
                <button onClick={() => toggleExercise(i)}
                  style={{ width: 28, height: 28, borderRadius: 6, border: done[i] ? 'none' : '1px solid #333', background: done[i] ? '#c8f542' : 'none', color: done[i] ? '#000' : '#888', cursor: 'pointer', fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {done[i] ? '✓' : ''}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ fontSize: 10, letterSpacing: '0.15em', color: '#444', fontFamily: 'Space Mono, monospace', marginBottom: 12 }}>FULL WEEK PROGRAM</div>
        {(['monday','tuesday','thursday','friday'] as const).map(day => {
          const w = (program.days as any)[day]
          if (!w) return null
          const dayLabels: Record<string, string> = { monday: 'MONDAY', tuesday: 'TUESDAY', thursday: 'THURSDAY', friday: 'FRIDAY' }
          return (
            <div key={day} style={{ marginBottom: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: '#c8f542' }}>• {dayLabels[day]}</span>
                <span style={{ fontSize: 10, color: '#888', fontFamily: 'Space Mono, monospace' }}>{w.label}</span>
              </div>
              <div style={{ background: '#111', border: '1px solid #222', borderRadius: 10, overflow: 'hidden' }}>
                {w.exercises.map((ex: any, i: number) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.625rem 1rem', borderBottom: i < w.exercises.length - 1 ? '1px solid #1a1a1a' : 'none' }}>
                    <span style={{ fontSize: 13, color: '#ccc' }}>- {ex.name}</span>
                    <span style={{ fontSize: 12, color: '#555', fontFamily: 'Space Mono, monospace' }}>{ex.sets}×{ex.reps}</span>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
        <div style={{ textAlign: 'center', color: '#444', fontSize: 12, fontFamily: 'Space Mono, monospace', padding: '0.5rem' }}>— WEDNESDAY — REST —</div>
      </div>

      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ fontSize: 10, letterSpacing: '0.15em', color: '#444', fontFamily: 'Space Mono, monospace', marginBottom: 12 }}>DR. JAMES PROTOCOL RULES</div>
        {[
          { title: 'Rep range: 10–20 reps', text: 'No heavy 3–5 rep sets. High reps drive blood flow and nutrients into muscle on cycle.' },
          { title: 'Pre-fatigue isolation first', text: 'Tire the target muscle with isolation before compound movements.' },
          { title: 'Conservative overload', text: 'Tendons lag behind muscle on cycle. Small weight jumps only.' },
          { title: 'Warm up 4–5 progressive sets', text: 'Non negotiable before working sets. Your output potential is significantly higher enhanced.' },
        ].map((tip, i) => (
          <div key={i} style={{ background: '#111', border: '1px solid #222', borderLeft: '3px solid #c8f542', borderRadius: 12, padding: '1rem', marginBottom: 8 }}>
            <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 4 }}>{tip.title}</div>
            <div style={{ fontSize: 12, color: '#888', lineHeight: 1.5 }}>{tip.text}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
