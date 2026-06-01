import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function GET(req: NextRequest) {
  const today = new Date().toISOString().split('T')[0]
  const [meals, health] = await Promise.all([
    supabase.from('meals').select('cal,pro,carb').eq('date', today),
    supabase.from('health_data').select('*').order('date', { ascending: false }).limit(1)
  ])
  const t = (meals.data||[]).reduce((a:any,m:any) => ({ cal:a.cal+m.cal, pro:a.pro+m.pro }), { cal:0,pro:0 })
  const h = health.data?.[0]
  const CYCLE_START = new Date('2026-05-29')
  const cycleDay = Math.max(1, Math.floor((new Date().getTime() - CYCLE_START.getTime()) / 86400000))
  const msg = [
    `Day ${cycleDay} — Good morning.`,
    h?.hrv ? (h.hrv < 25 ? `HRV ${Math.round(h.hrv)}ms — rest today.` : h.hrv < 40 ? `HRV ${Math.round(h.hrv)}ms — light training only.` : `HRV ${Math.round(h.hrv)}ms — green light.`) : '',
    `Target: 2,400 kcal · 200g protein.`,
    h?.sleep_hours && h.sleep_hours < 6 ? `Only ${h.sleep_hours}h sleep — HGH effectiveness reduced.` : ''
  ].filter(Boolean).join(' ')
  return NextResponse.json({ success: true, day: cycleDay, message: msg })
}
