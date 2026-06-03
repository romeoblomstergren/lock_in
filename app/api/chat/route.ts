import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const body = await req.json()
  const messages = body.messages || []
  const lastUserMsg = messages.filter((m: any) => m.role === 'user').pop()?.content || ''

  const foodKeywords = ['spiste', 'drak', 'ate', 'had', 'log', 'logged', 'mince', 'skyr', 'ris', 'rice', 'æg', 'eggs', 'rugbrød', 'protein', 'shake', 'bar', 'chicken', 'kylling', 'brød', 'mad', 'gr', 'ml', 'stk', 'pack', 'pak', 'pieces', 'hamburger', 'kamsteg', 'solsikke', 'peanut', 'jordnød']
  const hasFood = foodKeywords.some(kw => lastUserMsg.toLowerCase().includes(kw))

  let nutritionContext = ''

  if (hasFood) {
    try {
      const cleanQuery = lastUserMsg
        .replace(/\d+\s*(gr|g|ml|stk|pieces|pack|pak)/gi, '')
        .replace(/jeg spiste|jeg drak|i ate|i had|log|logged/gi, '')
        .trim()
        .slice(0, 80)

      const query = encodeURIComponent(cleanQuery)
      const res = await fetch(
        `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${query}&search_simple=1&action=process&json=1&page_size=3&lc=da&cc=dk`,
        { headers: { 'User-Agent': 'LockInApp/1.0' } }
      )

      if (res.ok) {
        const data = await res.json()
        const products = data.products?.slice(0, 3) || []
        
        if (products.length > 0) {
          const productInfo = products.map((p: any) => {
            const n = p.nutriments || {}
            const kcal = Math.round(n['energy-kcal_100g'] || (n['energy_100g'] || 0) / 4.184)
            const protein = Math.round(n['proteins_100g'] || 0)
            const carbs = Math.round(n['carbohydrates_100g'] || 0)
            const fat = Math.round(n['fat_100g'] || 0)
            const name = p.product_name_da || p.product_name || p.generic_name || 'Unknown'
            return `"${name}": ${kcal}kcal, ${protein}g protein, ${carbs}g carbs, ${fat}g fat per 100g`
          }).join(' | ')

          nutritionContext = `\n\n[DANISH PRODUCT DATABASE RESULTS — USE THESE EXACT VALUES: ${productInfo}. Scale to the amount mentioned by the user. DO NOT estimate — use only these values.]`
        }
      }
    } catch (e) {
      console.error('Food search error:', e)
    }
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
