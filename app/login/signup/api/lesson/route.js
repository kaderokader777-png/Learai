import { createClient } from '@/lib/supabase/server'
import Anthropic from '@anthropic-ai/sdk'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
const FREE_LIMIT = 3

export async function POST(request) {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 })

    const today = new Date().toISOString().split('T')[0]
    const { data: profile } = await supabase.from('profiles').select('is_pro, daily_usage, usage_date').eq('id', user.id).single()
    const isPro = profile?.is_pro || false
    const currentUsage = profile?.usage_date === today ? (profile?.daily_usage || 0) : 0
    if (!isPro && currentUsage >= FREE_LIMIT) return Response.json({ error: 'Daily limit reached' }, { status: 403 })

    await supabase.from('profiles').upsert({ id: user.id, daily_usage: currentUsage + 1, usage_date: today, is_pro: isPro })

    const { topic } = await request.json()
    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514', max_tokens: 1000,
      system: `You are a brilliant teacher. Respond ONLY with JSON: {"lesson":"3-4 paragraphs","quiz":["Q1?","Q2?","Q3?"],"takeaways":["T1","T2","T3","T4"]}`,
      messages: [{ role: 'user', content: `Teach me about: ${topic}` }],
    })
    const raw = message.content.map(b => b.text || '').join('')
    const parsed = JSON.parse(raw.replace(/```json|```/g, '').trim())
    return Response.json(parsed)
  } catch (err) {
    return Response.json({ error: 'Failed' }, { status: 500 })
  }
}
