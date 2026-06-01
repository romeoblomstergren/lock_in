'use client'
import { useEffect, useRef, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { SYSTEM_PROMPT, DAILY_TARGETS } from '@/lib/data'

interface Message { role: 'user' | 'assistant' | 'system'; text: string }
const CHIPS = ['What should I eat right now?','How are my macros today?','High protein meal idea','Post workout meal','Am I on track today?']

export default function AITab() {
  const [messages, setMessages] = useState<Message[]>([{ role:'assistant', text:"Hey! Tell me what you ate and I'll log it automatically." }])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [history, setHistory] = useState<{role:string;content:string}[]>([])
  const ref = useRef<HTMLDivElement>(null)
  const today = new Date().toISOString().split('T')[0]
  useEffect(() => { ref.current?.scrollIntoView({behavior:'smooth'}) }, [messages])

  async function getCtx() {
    const {data} = await supabase.from('meals').select('cal,pro,carb,water').eq('date',today)
    if(!data) return ''
    const t = data.reduce((a:any,m:any)=>({cal:a.cal+m.cal,pro:a.pro+m.pro,carb:a.carb+m.carb,water:a.water+m.water}),{cal:0,pro:0,carb:0,water:0})
    return `Today: ${Math.round(t.cal)}kcal ${Math.round(t.pro)}g protein. Need: ${Math.round(DAILY_TARGETS.cal-t.cal)}kcal ${Math.round(DAILY_TARGETS.protein-t.pro)}g protein.`
  }

  async function send(text?: string) {
    const msg = text||input.trim()
    if(!msg||loading) return
    setInput(''); setLoading(true)
    setMessages(p=>[...p,{role:'user',text:msg}])
    const ctx = await getCtx()
    const fullMsg = msg+(ctx?'\n\n['+ctx+']':'')
    const hist = [...history,{role:'user',content:fullMsg}]
    try {
      const res = await fetch('/api/chat',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({model:'deepseek-chat',max_tokens:1000,messages:[{role:'system',content:SYSTEM_PROMPT},...hist.slice(-12)]})})
      const d = await res.json()
      let txt = d.choices?.[0]?.message?.content||'Error.'
      let log = null
      const m = txt.match(/LOGMEAL:(\{[^}]+\})/)
      if(m){try{log=JSON.parse(m[1])}catch{}; txt=txt.replace(/LOGMEAL:\{[^}]+\}/,'').trim()}
      setHistory([...hist,{role:'assistant',content:txt}])
      setMessages(p=>[...p,{role:'assistant',text:txt}])
      if(log?.cal){
        await supabase.from('meals').insert({date:today,name:log.name||'AI logged',cal:log.cal||0,pro:log.pro||0,carb:log.carb||0,fat:0,water:log.water||0})
        setMessages(p=>[...p,{role:'system',text:`Logged: ${log.name} · ${Math.round(log.cal)}kcal · ${Math.round(log.pro||0)}g protein`}])
      }
    } catch { setMessages(p=>[...p,{role:'assistant',text:'Error — try again.'}]) }
    setLoading(false)
  }

  const S = (r:string):React.CSSProperties => ({
    maxWidth:r==='system'?'100%':'88%', padding:r==='system'?'6px 12px':'10px 14px',
    borderRadius:r==='system'?8:14, fontSize:r==='system'?11:14, lineHeight:1.5,
    alignSelf:r==='user'?'flex-end':r==='system'?'center':'flex-start',
    background:r==='user'?'#c8f542':r==='system'?'rgba(200,245,66,0.08)':'#111',
    color:r==='user'?'#000':r==='system'?'#c8f542':'#f0f0f0',
    border:r==='system'?'1px solid rgba(200,245,66,0.2)':r==='assistant'?'1px solid #222':'none',
    fontWeight:r==='user'?600:400
  })

  return (
    <div style={{display:'flex',flexDirection:'column',height:'calc(100vh - 180px)',padding:'1.25rem'}}>
      <div style={{background:'#111',border:'1px solid #222',borderLeft:'3px solid #c8f542',borderRadius:12,padding:'0.875rem 1rem',marginBottom:12,fontSize:12,color:'#888',lineHeight:1.5}}>
        <div style={{fontSize:10,color:'#c8f542',fontFamily:'Space Mono,monospace',marginBottom:4}}>YOUR COACH KNOWS:</div>
        77.1kg · 182cm · Test E + HGH + SARMs · 2,400 kcal / 200g protein target
      </div>
      <div style={{display:'flex',gap:6,flexWrap:'wrap',marginBottom:12}}>
        {CHIPS.map((c,i)=><div key={i} onClick={()=>send(c)} style={{padding:'5px 12px',background:'#111',border:'1px solid #222',borderRadius:20,fontSize:12,color:'#888',cursor:'pointer',fontFamily:'Space Mono,monospace',whiteSpace:'nowrap'}}>{c}</div>)}
      </div>
      <div style={{flex:1,overflowY:'auto',display:'flex',flexDirection:'column',gap:10,marginBottom:12}}>
        {messages.map((m,i)=><div key={i} style={S(m.role)}>{m.text}</div>)}
        {loading&&<div style={{maxWidth:'88%',padding:'12px 16px',borderRadius:14,background:'#111',border:'1px solid #222',alignSelf:'flex-start',display:'flex',gap:4,alignItems:'center'}}>{[0,1,2].map(i=><div key={i} style={{width:6,height:6,borderRadius:'50%',background:'#444',animation:'bounce 1.2s infinite',animationDelay:`${i*0.2}s`}}/>)}</div>}
        <div ref={ref}/>
      </div>
      <div style={{display:'flex',gap:8,alignItems:'flex-end'}}>
        <textarea value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>{if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();send()}}} placeholder="e.g. I ate 300g mince and rice..." style={{flex:1,background:'#111',border:'1px solid #222',borderRadius:12,padding:'10px 14px',color:'#f0f0f0',fontSize:14,fontFamily:'Syne,sans-serif',outline:'none',resize:'none',minHeight:44,maxHeight:120,lineHeight:1.4}} rows={1}/>
        <button onClick={()=>send()} disabled={loading||!input.trim()} style={{width:44,height:44,background:'#c8f542',border:'none',borderRadius:12,cursor:'pointer',fontSize:18,display:'flex',alignItems:'center',justifyContent:'center',opacity:loading||!input.trim()?0.4:1,flexShrink:0}}>↑</button>
      </div>
    </div>
  )
}