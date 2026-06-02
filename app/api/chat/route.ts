import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const body = await req.json()
  const messages = body.messages || []
  const lastUserMsg = messages.filter((m: any) => m.role === 'user').pop()?.content || ''

  const foodKeywords = ['spiste', 'drak', 'ate', 'had', 'log', 'logged', 'mince', 'skyr', 'ris', 'rice', 'æg', 'eggs', 'rugbrød', 'protein', 'shake', 'bar', 'chicken', 'kylling', 'brød', 'mad', 'grams', 'gr', 'g ', 'kg', 'ml', 'stk', 'pieces']
  const hasFood = foodKeywords.some(kw => lastUserMsg.toLowerCase().includes(kw))

  let nutritionContext = ''

  if (hasFood) {
    try {
      // Search Open Food Facts — includes Danish/Lidl/Netto products
      const query = encodeURIComponent(lastUserMsg.slice(0, 80).replace(/[0-9]+g?r?\s*/g, '').trim())
      const res = await fetch(`https://world.openfoodfacts.org/cgi/search.pl?search_terms=${query}&search_simple=1&action=process&json=1&page_size=1&lc=da&cc=dk`)
      
      if (res.ok) {
        const data = await res.json()
        const product = data.products?.[0]
        if (product?.nutriments) {
          const n = product.nutriments
          const kcal = n['energy-kcal_100g'] || n['energy_100g'] ? Math.round((n['energy_100g']||0) / 4.184) : null
          const protein = n['proteins_100g']
          const carbs = n['carbohydrates_100g']
          const fat = n['fat_100g']
          const name = product.product_name_da || product.product_name || product.generic_name
          if (name && (kcal || protein)) {
            nutritionContext = `\n\n[DANISH PRODUCT FOUND: "${name}" — ${kcal ? Math.round(kcal)+'kcal' : ''}, ${protein ? Math.round(protein)+'g protein' : ''}, ${carbs ? Math.round(carbs)+'g carbs' : ''}, ${fat ? Math.round(fat)+'g fat' : ''} per 100g. Use these exact values scaled to the amount mentioned.]`
          }
        }
      }
    } catch {}
  }

  if (nutritionContext && messages.length > 0) {
    const last = messages[messages.length - 1]
    if (last.role === 'user') {
      messages[messages.length - 1] = { ...last, content: last.content + nutritionContext }
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
