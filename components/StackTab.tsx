'use client'
import { STACK, MILESTONES, CYCLE_START, PHOTO_DATE, CYCLE_END } from '@/lib/data'

const STATUS: Record<string,{color:string;label:string}> = {
  active: { color:'#333', label:'ACTIVE' },
  monitor: { color:'#E53E3E', label:'MONITOR' },
  incoming: { color:'#555', label:'INCOMING' },
  standby: { color:'#444', label:'STANDBY' },
}

export default function StackTab() {
  const today = new Date()
  const cycleDay = Math.max(1, Math.floor((today.getTime() - CYCLE_START.getTime()) / 86400000))
  const cyclePct = Math.min(100, Math.round((cycleDay / 91) * 100))
  const daysLeft = Math.max(0, Math.ceil((PHOTO_DATE.getTime() - today.getTime()) / 86400000))

  return (
    <div style={{ padding:'24px', maxWidth:800, margin:'0 auto' }}>
      <div style={{ marginBottom:32 }}>
        <div style={{ fontFamily:'Bebas Neue, sans-serif', fontSize:80, lineHeight:0.9, color:'#fff' }}>CYCLE<br/>DAY {cycleDay}</div>
        <div style={{ fontSize:10, color:'#E53E3E', letterSpacing:'0.2em', marginTop:8 }}>91 DAYS TOTAL — {daysLeft} TO PHOTO</div>
        <div style={{ height:2, background:'#111', marginTop:16 }}>
          <div style={{ height:2, background:'#E53E3E', width:`${cyclePct}%`, transition:'width 0.4s' }} />
        </div>
        <div style={{ display:'flex', justifyContent:'space-between', marginTop:6 }}>
          <span style={{ fontSize:10, color:'#333' }}>29 MAY 2026</span>
          <span style={{ fontSize:10, color:'#333' }}>20 AUG 2026</span>
        </div>
      </div>

      <div style={{ marginBottom:32 }}>
        <div style={{ fontSize:10, letterSpacing:'0.2em', color:'#555', marginBottom:12 }}>ACTIVE STACK</div>
        {STACK.map((item,i) => {
          const s = STATUS[item.status] || STATUS.active
          return (
            <div key={i} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'14px 0', borderBottom:'1px solid #0d0d0d' }}>
              <div>
                <div style={{ fontSize:14, fontWeight:500, color:'#fff' }}>{item.name}</div>
                <div style={{ fontSize:11, color:'#555', marginTop:2 }}>{item.dose}</div>
              </div>
              <span style={{ fontSize:9, padding:'3px 8px', border:`1px solid ${s.color}`, color:s.color, letterSpacing:'0.1em', fontWeight:600 }}>{s.label}</span>
            </div>
          )
        })}
      </div>

      <div style={{ marginBottom:32 }}>
        <div style={{ fontSize:10, letterSpacing:'0.2em', color:'#555', marginBottom:12 }}>PIN SCHEDULE</div>
        {[
          { name:'Test E 250mg', time:'THU 15:20 — WEEKLY' },
          { name:'HCG 500 IU', time:'TUE + FRI' },
          { name:'HGH 3 IU', time:'NIGHTLY PRE-BED' },
        ].map((p,i) => (
          <div key={i} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'12px 0', borderBottom:'1px solid #0d0d0d' }}>
            <span style={{ fontSize:14, fontWeight:500 }}>{p.name}</span>
            <span style={{ fontSize:10, color:'#E53E3E', letterSpacing:'0.1em' }}>{p.time}</span>
          </div>
        ))}
      </div>

      <div style={{ marginBottom:32 }}>
        <div style={{ fontSize:10, letterSpacing:'0.2em', color:'#555', marginBottom:12 }}>PCT SUPPLIES</div>
        {[
          { name:'Enclomiphene', dose:'100 × 25mg', status:'PCT' },
          { name:'Nolvadex', dose:'100 × 20mg', status:'PCT' },
          { name:'Exemestane', dose:'100 × 25mg', status:'AI' },
          { name:'HCG', dose:'10,000 IU total', status:'ON-CYCLE' },
        ].map((p,i) => (
          <div key={i} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'12px 0', borderBottom:'1px solid #0d0d0d' }}>
            <div>
              <div style={{ fontSize:14, fontWeight:500 }}>{p.name}</div>
              <div style={{ fontSize:11, color:'#555', marginTop:2 }}>{p.dose}</div>
            </div>
            <span style={{ fontSize:9, padding:'3px 8px', border:'1px solid #333', color:'#555', letterSpacing:'0.1em' }}>{p.status}</span>
          </div>
        ))}
      </div>

      <div>
        <div style={{ fontSize:10, letterSpacing:'0.2em', color:'#555', marginBottom:12 }}>TIMELINE</div>
        {[
          { name:'First pin', date:'29 May 2026', done:true },
          { name:'Switch to Test C + Primo', date:'16 Jul 2026', done:false },
          { name:'Last pin', date:'20 Aug 2026', done:false },
          { name:'PCT starts', date:'3 Sep 2026', done:false },
        ].map((m,i) => (
          <div key={i} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'12px 0', borderBottom:'1px solid #0d0d0d' }}>
            <span style={{ fontSize:13, color: m.done ? '#E53E3E' : '#aaa' }}>{m.name}</span>
            <span style={{ fontSize:10, color: m.done ? '#E53E3E' : '#555', letterSpacing:'0.1em' }}>{m.date}{m.done?' ✓':''}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
