import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { hrv, rhr, sleep_hours, sleep_score, steps, date } = body
  const today = date || new Date().toISOString().split('T')[0]
  const { error } = await supabase.from('health_data').upsert({
    date: today, hrv: hrv||null, rhr: rhr||null,
    sleep_hours: sleep_hours||null, sleep_score: sleep_score||null,
    steps: steps||null, updated_at: new Date().toISOString()
  }, { onConflict: 'date' })
  if (error) return NextResponse.json({ error }, { status: 500 })
  return NextResponse.json({ success: true })
}

export async function GET() {
  const { data } = await supabase.from('health_data').select('*').order('date', { ascending: false }).limit(30)
  return NextResponse.json(data)
}
