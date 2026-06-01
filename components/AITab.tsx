'use client'
import { useEffect, useRef, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { SYSTEM_PROMPT, DAILY_TARGETS, STACK, MILESTONES, CYCLE_START } from '@/lib/data'

interface Message { role: 'user' | 'assistant' | 'system'; text: string }

const CHIPS = [
  'What should I eat right now?',
  'How are my macros today?',
  'Log 300g mince and rice',
  'How is my cycle going?',
  'What compounds am I on?',
  'Am I on track today?',
  'Post workout meal?',
  'How many days into my cycle?',
]

export default function AITab({ onNavigate }: { onNavigate: (tab: string) => void }) {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', text: "Hey. I know your full protocol, stack, macros and cycle. Tell me what you ate and I'll log it. Or ask me anything." }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [history, setHistory] = useState<{ role: string; content: string }[]>([])
  const ref = useRef<HTMLDivElement>(null)
  const today = new Date().toISOString().split('T')[0]
  const cycleDay = Math.max(1, Math.floor((new Date().getTime() - CYCLE_START.getTime()) / 86400000))

  useEffect(() => { ref.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages])

  async function getCtx() {
    const { data } = await supabase.from('meals').select('cal,pro,carb,water').eq('date', today)
    if (!data) return ''
    const t = data.reduce((a: any, m: any) => ({ cal: a.cal+m.cal, pro: a.pro+m.pro, carb: a.carb+m.carb, water: a.water+(m.water||0) }), { cal:0,pro:0,carb:0,water:0 })
    return `Today's macros: ${Math.round(t.cal)}kcal (need ${Math.round(DAILY_TARGETS.cal-t.cal)} more), ${Math.round(t.pro)}g protein (need ${Math.round(DAILY_TARGETS.protein-t.pro)}g more), ${Math.round(t.carb)}g carbs, ${(t.water/1000).toFixed(1)}L water. Cycle day ${cycleDay} of 91.`
  }

  async function send(text?: string) {
    const msg = text || input.trim()
    if (!msg || loading) return
    setInput(''); setLoading(true)
    setMessages(p => [...p, { role: 'user', text: msg }])
    const ctx = await getCtx()
    const fullMsg = msg + (ctx ? '\n\n[LIVE DATA: ' + ctx + ']' : '')
    const hist = [...history, { role: 'user', content: fullMsg }]
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'deepseek-chat',
          max_tokens: 1000,
          messages: [{ role: 'system', content: SYSTEM_PROMPT }, ...hist.slice(-12)]
        })
      })
      const d = await res.json()
      let txt = d.choices?.[0]?.message?.content || 'Error — try again.'
      let logData = null
      const m = txt.match(/LOGMEAL:(\{[^}]+\})/)
      if (m) { try { logData = JSON.parse(m[1]) } catch {}; txt = txt.replace(/LOGMEAL:\{[^}]+\}/, '').trim() }

      // Handle navigation commands from AI
      const navMatch = txt.match(/NAVIGATE:(today|food|gym|stack|stats|ai)/)
      if (navMatch) { txt = txt.replace(/NAVIGATE:\w+/, '').trim(); onNavigate(navMatch[1]) }

      // Handle reminder creation from AI
      const remMatch = txt.match(/ADDREMINDER:(\{[^}]+\})/)
      let remData = null
      if (remMatch) { try { remData = JSON.parse(remMatch[1]) } catch {}; txt = txt.replace(/ADDREMINDER:\{[^}]+\}/, '').trim() }

      setHistory([...hist, { role: 'assistant', content: txt }])
      setMessages(p => [...p, { role: 'assistant', text: txt }])

      if (logData?.cal || logData?.water) {
        await supabase.from('meals').insert({ date: today, name: logData.name || 'AI logged', cal: logData.cal||0, pro: logData.pro||0, carb: logData.carb||0, fat: 0, water: logData.water||0 })
        setMessages(p => [...p, { role: 'system', text: `Logged: ${logData.name} · ${Math.round(logData.cal||0)}kcal · ${Math.round(logData.pro||0)}g P` }])
      }

      if (remData?.title && remData?.time) {
        await supabase.from('reminders').insert({ title: remData.title, time: remData.time, days: remData.days || ['mon','tue','wed','thu','fri','sat','sun'] })
        setMessages(p => [...p, { role: 'system', text: `Reminder set: ${remData.title} at ${remData.time}` }])
      }
    } catch { setMessages(p => [...p, { role: 'assistant', text: 'Error — try again.' }]) }
    setLoading(false)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 60px)', padding: '24px' }}>
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 48, lineHeight: 0.9, color: '#fff' }}>AI COACH</div>
        <div style={{ fontSize: 10, color: '#555', letterSpacing: '0.2em', marginTop: 6 }}>KNOWS YOUR FULL PROTOCOL — LOGS AUTOMATICALLY</div>
      </div>

      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 16 }}>
        {CHIPS.map((chip, i) => (
          <div key={i} onClick={() => send(chip)}
            style={{ padding: '6px 12px', background: '#0a0a0a', border: '1px solid #111', fontSize: 11, color: '#555', cursor: 'pointer', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>
            {chip}
          </div>
        ))}
      </div>

      <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 12 }}>
        {messages.map((msg, i) => (
          <div key={i} style={{
            maxWidth: msg.role === 'system' ? '100%' : '88%',
            padding: msg.role === 'system' ? '6px 12px' : '12px 16px',
            fontSize: msg.role === 'system' ? 11 : 14,
            lineHeight: 1.5,
            alignSelf: msg.role === 'user' ? 'flex-end' : msg.role === 'system' ? 'center' : 'flex-start',
            background: msg.role === 'user' ? '#E53E3E' : msg.role === 'system' ? 'rgba(229,62,62,0.08)' : '#0a0a0a',
            color: msg.role === 'user' ? '#fff' : msg.role === 'system' ? '#E53E3E' : '#ccc',
            border: msg.role === 'system' ? '1px solid rgba(229,62,62,0.2)' : msg.role === 'assistant' ? '1px solid #111' : 'none',
            fontWeight: msg.role === 'user' ? 500 : 400,
            letterSpacing: msg.role === 'system' ? '0.05em' : 0,
          }}>
            {msg.text}
          </div>
        ))}
        {loading && (
          <div style={{ maxWidth: '88%', padding: '12px 16px', background: '#0a0a0a', border: '1px solid #111', alignSelf: 'flex-start', display: 'flex', gap: 4, alignItems: 'center' }}>
            {[0,1,2].map(i => <div key={i} style={{ width: 5, height: 5, background: '#444', animation: 'bounce 1.2s infinite', animationDelay: `${i*0.2}s` }} />)}
          </div>
        )}
        <div ref={ref} />
      </div>

      <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end' }}>
        <textarea value={input} onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() } }}
          placeholder="Tell me what you ate, set a reminder, ask anything..."
          style={{ flex: 1, background: '#0a0a0a', border: '1px solid #111', padding: '12px 14px', color: '#fff', fontSize: 14, fontFamily: 'Inter,sans-serif', outline: 'none', resize: 'none', minHeight: 44, maxHeight: 120, lineHeight: 1.4 }}
          rows={1}
        />
        <button onClick={() => send()} disabled={loading || !input.trim()}
          style={{ width: 44, height: 44, background: '#E53E3E', border: 'none', cursor: 'pointer', fontSize: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: loading || !input.trim() ? 0.4 : 1, flexShrink: 0, color: '#fff' }}>
          ↑
        </button>
      </div>
    </div>
  )
}
