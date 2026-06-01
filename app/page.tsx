'use client'
import { useState } from 'react'
import Header from '@/components/Header'
import TodayTab from '@/components/TodayTab'
import FoodTab from '@/components/FoodTab'
import GymTab from '@/components/GymTab'
import StackTab from '@/components/StackTab'
import StatsTab from '@/components/StatsTab'
import AITab from '@/components/AITab'

const TABS = [
  { id: 'today', label: 'TODAY' },
  { id: 'food', label: 'FOOD' },
  { id: 'gym', label: 'GYM' },
  { id: 'stack', label: 'STACK' },
  { id: 'stats', label: 'STATS' },
  { id: 'ai', label: 'AI ✦' },
]

export default function Home() {
  const [active, setActive] = useState('today')

  return (
    <div style={{ display: 'flex', flexDirection: 'column', maxWidth: 430, margin: '0 auto', minHeight: '100vh', background: '#0a0a0a' }}>
      <Header />
      <div style={{ display: 'flex', borderBottom: '1px solid #222', overflowX: 'auto', flexShrink: 0 }}>
        {TABS.map(tab => (
          <button key={tab.id} onClick={() => setActive(tab.id)}
            style={{
              flex: 1, minWidth: 52, padding: '0.625rem 0.25rem', fontSize: 10, fontWeight: 600,
              letterSpacing: '0.05em', color: active === tab.id ? '#c8f542' : '#444',
              background: 'none', border: 'none', borderBottom: active === tab.id ? '2px solid #c8f542' : '2px solid transparent',
              cursor: 'pointer', fontFamily: 'Syne, sans-serif', whiteSpace: 'nowrap', transition: 'all 0.2s'
            }}>
            {tab.label}
          </button>
        ))}
      </div>
      <div style={{ flex: 1, overflowY: 'auto' }}>
        {active === 'today' && <TodayTab />}
        {active === 'food' && <FoodTab />}
        {active === 'gym' && <GymTab />}
        {active === 'stack' && <StackTab />}
        {active === 'stats' && <StatsTab />}
        {active === 'ai' && <AITab />}
      </div>
    </div>
  )
}
