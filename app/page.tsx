'use client'
import { useState } from 'react'
import TodayTab from '@/components/TodayTab'
import FoodTab from '@/components/FoodTab'
import GymTab from '@/components/GymTab'
import StackTab from '@/components/StackTab'
import StatsTab from '@/components/StatsTab'
import AITab from '@/components/AITab'
import RemindersTab from '@/components/RemindersTab'

const TABS = [
  { id:'today', label:'TODAY', icon:(a:boolean)=><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={a?'#E53E3E':'#444'} strokeWidth="1.5"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg> },
  { id:'food', label:'FOOD', icon:(a:boolean)=><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={a?'#E53E3E':'#444'} strokeWidth="1.5"><path d="M3 11h18M12 3v8M5 21h14l-2-4H7z"/></svg> },
  { id:'gym', label:'GYM', icon:(a:boolean)=><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={a?'#E53E3E':'#444'} strokeWidth="1.5"><path d="M6 4v16M18 4v16M2 8h4M18 8h4M2 16h4M18 16h4"/></svg> },
  { id:'stack', label:'STACK', icon:(a:boolean)=><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={a?'#E53E3E':'#444'} strokeWidth="1.5"><circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M4.22 4.22l2.12 2.12M17.66 17.66l2.12 2.12M2 12h3M19 12h3M4.22 19.78l2.12-2.12M17.66 6.34l2.12-2.12"/></svg> },
  { id:'stats', label:'STATS', icon:(a:boolean)=><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={a?'#E53E3E':'#444'} strokeWidth="1.5"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg> },
  { id:'reminders', label:'REMIND', icon:(a:boolean)=><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={a?'#E53E3E':'#444'} strokeWidth="1.5"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0"/></svg> },
  { id:'ai', label:'AI', icon:(a:boolean)=><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={a?'#E53E3E':'#444'} strokeWidth="1.5"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg> },
]

export default function Home() {
  const [active, setActive] = useState('today')

  const renderTab = () => {
    switch(active) {
      case 'today': return <TodayTab onNavigate={setActive} />
      case 'food': return <FoodTab />
      case 'gym': return <GymTab />
      case 'stack': return <StackTab />
      case 'stats': return <StatsTab />
      case 'reminders': return <RemindersTab />
      case 'ai': return <AITab onNavigate={setActive} />
      default: return <TodayTab onNavigate={setActive} />
    }
  }

  return (
    <div style={{ display:'flex', height:'100vh', background:'#000' }}>
      <div style={{ display:'none', width:220, borderRight:'1px solid #111', flexDirection:'column', padding:'40px 0', flexShrink:0 }} className="sidebar">
        <div style={{ padding:'0 28px', marginBottom:48 }}>
          <div style={{ fontFamily:'Bebas Neue, sans-serif', fontSize:28, letterSpacing:2 }}>LOCK IN</div>
          <div style={{ fontSize:10, color:'#E53E3E', letterSpacing:'0.2em', marginTop:2 }}>CYCLE TRACKER</div>
        </div>
        {TABS.map(tab => (
          <button key={tab.id} onClick={() => setActive(tab.id)}
            style={{ display:'flex', alignItems:'center', gap:14, padding:'14px 28px', background:'none', border:'none', borderLeft:active===tab.id?'2px solid #E53E3E':'2px solid transparent', cursor:'pointer', width:'100%', textAlign:'left' }}>
            {tab.icon(active===tab.id)}
            <span style={{ fontSize:12, fontWeight:600, letterSpacing:'0.15em', color:active===tab.id?'#fff':'#444' }}>{tab.label}</span>
          </button>
        ))}
      </div>

      <div style={{ flex:1, display:'flex', flexDirection:'column', overflow:'hidden' }}>
        <div style={{ flex:1, overflowY:'auto' }}>{renderTab()}</div>
        <div className="bottomnav" style={{ display:'grid', gridTemplateColumns:`repeat(${TABS.length},1fr)`, borderTop:'1px solid #111', background:'#000', flexShrink:0 }}>
          {TABS.map(tab => (
            <button key={tab.id} onClick={() => setActive(tab.id)}
              style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'10px 2px 14px', background:'none', border:'none', cursor:'pointer', gap:4 }}>
              {tab.icon(active===tab.id)}
              <span style={{ fontSize:7, letterSpacing:'0.08em', color:active===tab.id?'#E53E3E':'#444', fontWeight:600 }}>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      <style>{`
        @media (min-width: 768px) {
          .sidebar { display: flex !important; }
          .bottomnav { display: none !important; }
        }
      `}</style>
    </div>
  )
}
