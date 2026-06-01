'use client'
import { useEffect, useRef, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { SYSTEM_PROMPT, DAILY_TARGETS } from '@/lib/data'

interface Message { role: 'user' | 'assistant' | 'system'; text: string }

const QUICK_CHIPS = ['What should I eat right now?','How are my macros today?','I need a high protein meal idea','Post workout meal suggestion','Am I on track today?']

export default function AITab() {
  const [messages, setMessages] = useState<Message[]>([{ role: 'assistant', text: "Hey! Tell me what you ate and I'll log it automatically. Or ask anything about your protocol or nutrition." }])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [history, setHistory] = useState<{ role: string; content: string }[]>([])
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const today = new Date().toISOString().split('T')[0]

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages])

  async function getMacroContext() {
    const { data } = await supabase.from('meals').select('cal,pro,carb,water').eq('date', today)
    if (!data) return ''
    const t = data.reduce((acc: any, m: any) => ({ cal: acc.cal+m.cal, pro: acc.pro+m.pro, carb: acc.carb+m.carb, water: acc.water+m.water }), { cal:0,pro:0,carb:0,water:0 })
    return `Today: ${Math.round(t.cal)}kcal, ${Math.round(t.pro)}g protein, ${Math.round(t.carb)}g carbs. Need: ${Math.round(DAILY_TARGETS.cal-t.cal)}kcal, ${Math.round(DAILY_TARGETS.protein-t.pro)}g protein more.`
  }

  async function sendMessage(text?: string) {
    const msg = text || input.trim()
    if (!msg || loading) return
    setInput('')
    setLoading(true)
    setMessages(prev => [...prev, { role: 'user', text: msg }])
    const macroCtx = await getMacroContext()
    const fullMsg = msg + (macroCtx ? '\n\n[Context: ' + macroCtx + ']' : '')
    const newHistory = [...history, { role: 'user', content: fullMsg }]
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ model: 'deepseek-chat', max_tokens: 1000, messages: [{ role: 'system', content: SYSTEM_PROMPT }, ...newHistory.slice(-12)] })
      })
      const data = await res.json()
      let fullText = data.choices?.[0]?.message?.content || 'Error — try again.'
      let logData = null
      const match = fullText.match(/LOGMEAL:(\{[^}]+\})/)
      if (match) {
        try { logData = JSON.parse(match[1]) } catch {}
        fullText = fullText.replace(/LOGMEAL:\{[^}]+\}/, '').trim()
      }
      setHistory([...newHistory, { role: 'assistant', content: fullText }])
      setMessages(prev => [...prev, { role: 'assistant', text: fullText }])
      if (logData?.cal) {
        await supabase.from('meals').insert({ date: today, name: logData.name||'AI logged', cal: logData.cal||0, pro: logData.pro||0, carb: logData.carb||0, fat: 0, water: logData.water||0 })
        setMessages(prev => [...prev, { role: 'system', text: 'Logged: ' + (logData.name||'meal') + ' · ' + Math.round(logData.cal) + 'kcal · ' + Math.round(logData.pro||0) + 'g protein' }])
      }
    } catch { setMessages(prev => [...prev, { role: 'assistant', text: 'Error — try again.' }]) }
    setLoading(false)
  }

  return (
    <div style={{ display:'flex', flexDirection:'column', height:'calc(100vh - 180px)', padding:'1.25rem' }}>
      <div style={{ background:'#111', border:'1px solid #222', borderLeft:'3px solid #c8f542', borderRadius:12, padding:'0.875rem 1rem', marginBottom:12, fontSize:12, color:'#888', lineHeight:1.5 }}>
        <div style={{ fontSize:10, letterSpacing:'0.1em', color:'#c8f542', fontFamily:'Space Mono, monospace', marginBottom:4 }}>YOUR COACH KNOWS:</div>
        77.1kg · 182cm · 17-18% BF · Test E + HGH + SARMs · Target 2,400 kcal / 200g protein
      </div>
      <div style={{ display:'flex', gap:6, flexWrap:'wrap', marginBottom:12 }}>
        {QUICK_CHIPS.map((chip,i) => <div key={i} onClick={() => sendMessage(chip)} style={{ padding:'5px 12px', background:'#111', border:'1px solid #222', borderRadius:20, fontSize:12, color:'#888', cursor:'pointer', fontFamily:'Space Mono, monospace', whiteSpace:'nowrap' }}>{chip}</div>)}
      </div>
      <div style={{ flex:1, overflowY:'auto', display:'flex', flexDirection:'column', gap:10, marginBottom:12 }}>
        {messages.map((msg,i) => (
          <div key={i} style={{ maxWidth:msg.role==='system'?'100%':'88%', padding:msg.role==='system'?'6px 12px':'10px 14px', borderRadius:msg.role==='system'?8:14, fontSize:msg.role==='system'?11:14, lineHeight:1.5, alignSelf:msg.role==='user'?'flex-end':msg.role==='system'?'center':'flex-start', background:msg.role==='user'?'#c8f542':msg.role==='system'?'rgba(200,245,66,0.08)':'#111', color:msg.role==='user'?'#000':msg.role==='system'?'#c8f542':'#f0f0f0', border:msg.role==='system'?'1px solid rgba(200,245,66,0.2)':msg.role==='assistant'?'1px solid #222':'none', fontWeight:msg.role==='user'?600:400 }}>{msg.text}</div>
        ))}
        {loading && <div style={{ maxWidth:'88%', padding:'12px 16px', borderRadius:14, background:'#111', border:'1px solid #222', alignSelf:'flex-start', display:'flex', gap:4, alignItems:'center' }}>{[0,1,2].map(i => <div key={i} style={{ width:6, height:6, borderRadius:'50%', background:'#444', animation:'bounce 1.2s infinite', animationDelay:`${i*0.2}s` }} />)}</div>}
        <div ref={messagesEndRef} />
      </div>
      <div style={{ display:'flex', gap:8, alignItems:'flex-end' }}>
        <textarea value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => { if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();sendMessage()} }} placeholder="e.g. I ate 300g mince and rice..." style={{ flex:1, background:'#111', border:'1px solid #222', borderRadius:12, padding:'10px 14px', color:'#f0f0f0', fontSize:14, fontFamily:'Syne, sans-serif', outline:'none', resize:'none', minHeight:44, maxHeight:120, lineHeight:1.4 }} rows={1} />
        <button onClick={() => sendMessage()} disabled={loading||!input.trim()} style={{ width:44, height:44, background:'#c8f542', border:'none', borderRadius:12, cursor:'pointer', fontSize:18, display:'flex', alignItems:'center', justifyContent:'center', opacity:loading||!input.trim()?0.4:1, flexShrink:0 }}>↑</button>
      </div>
    </div>
  )
}
