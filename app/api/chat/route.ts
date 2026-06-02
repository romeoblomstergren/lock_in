import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const body = await req.json()
  const messages = body.messages || []
  const lastUserMsg = messages.filter((m: any) => m.role === 'user').pop()?.content || ''

  // Search for nutritional data if food is mentioned
  let nutritionContext = ''
  const foodKeywords = ['spiste', 'drak', 'ate', 'had', 'log', 'logged', 'mince', 'skyr', 'ris', 'rice', 'æg', 'eggs', 'rugbrød', 'protein', 'shake', 'bar', 'chicken', 'kylling']
  const hasFood = foodKeywords.some(kw => lastUserMsg.toLowerCase().includes(kw))

  if (hasFood) {
    try {
      const searchQuery = encodeURIComponent(lastUserMsg.slice(0, 100) + ' calories nutrition per 100g')
      const searchRes = await fetch(`https://api.nal.usda.gov/fdc/v1/foods/search?query=${searchQuery}&pageSize=1&api_key=DEMO_KEY`)
      if (searchRes.ok) {
        const searchData = await searchRes.json()
        const food = searchData.foods?.[0]
        if (food) {
          const kcal = food.foodNutrients?.find((n: any) => n.nutrientName?.includes('Energy'))?.value
          const protein = food.foodNutrients?.find((n: any) => n.nutrientName?.includes('Protein'))?.value
          const carbs = food.foodNutrients?.find((n: any) => n.nutrientName?.includes('Carbohydrate'))?.value
          if (kcal) nutritionContext = `\n\n[NUTRITION REFERENCE: ${food.description} — ${Math.round(kcal)}kcal, ${Math.round(protein||0)}g protein, ${Math.round(carbs||0)}g carbs per 100g. Use this as accurate reference.]`
        }
      }
    } catch {}
  }

  // Add nutrition context to last message if found
  if (nutritionContext && messages.length > 0) {
    const lastMsg = messages[messages.length - 1]
    if (lastMsg.role === 'user') {
      messages[messages.length - 1] = { ...lastMsg, content: lastMsg.content + nutritionContext }
    }
  }

  const res = await fetch('https://api.deepseek.com/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`,
    },
    body: JSON.stringify({ ...body, messages })
  })
  const data = await res.json()
  return NextResponse.json(data)
}
