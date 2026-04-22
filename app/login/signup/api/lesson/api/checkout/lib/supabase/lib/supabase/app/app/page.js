'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function AppPage() {
  const [topic, setTopic] = useState('')
  const [loading, setLoading] = useState(false)
  const [lesson, setLesson] = useState(null)
  const [error, setError] = useState('')
  const [lastTopic, setLastTopic] = useState('')
  const [isPro, setIsPro] = useState(false)
  const [usageCount, setUsageCount] = useState(0)
  const [upgrading, setUpgrading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }
      const { data: profile } = await supabase.from('profiles').select('is_pro, daily_usage, usage_date').eq('id', user.id).single()
      if (profile) {
        setIsPro(profile.is_pro || false)
        const today = new Date().toISOString().split('T')[0]
        setUsageCount(profile.usage_date === today ? (profile.daily_usage || 0) : 0)
      }
    }
    load()
  }, [])

  async function fetchLesson() {
    if (!topic.trim() || (!isPro && usageCount >= 3)) return
    setLoading(true); setLesson(null); setError(''); setLastTopic(topic.trim())
    try {
      const res = await fetch('/api/lesson', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ topic: topic.trim() }) })
      const data = await res.json()
      if (data.error) { setError(data.error); return }
      setLesson(data); setUsageCount(c => c + 1)
    } catch { setError('Something went wrong.') }
    finally { setLoading(false) }
  }

  async function handleUpgrade() {
    setUpgrading(true)
    const res = await fetch('/api/checkout', { method: 'POST' })
    const { url } = await res.json()
    if (url) window.location.href = url
    setUpgrading(false)
  }

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/')
  }

  const atLimit = !isPro && usageCount >= 3

  return (
    <main style={{minHeight:'100vh',background:'#0a0a0f',padding:'0 16px 60px'}}>
      <nav style={{maxWidth:680,margin:'0 auto',display:'flex',justifyContent:'space-between',alignItems:'center',padding:'20px 0'}}>
        <span style={{fontSize:20,color:'#e8b84b'}}>LearnAI</span>
        <div style={{display:'flex',gap:16,alignItems:'center'}}>
          {!isPro && <span style={{fontSize:13,color:'#6b6b60'}}>{usageCount}/3 free</span>}
          {isPro && <span style={{fontSize:12,color:'#7c6cfc',border:'1px solid #7c6cfc',borderRadius:4,padding:'3px 8px'}}>PRO</span>}
          <button onClick={handleLogout} style={{fontSize:13,color:'#6b6b60',background:'none',border:'none',cursor:'pointer'}}>Sign out</button>
        </div>
      </nav>
      <div style={{maxWidth:680,margin:'0 auto'}}>
        <div style={{textAlign:'center',padding:'40px 0 36px'}}>
          <h1 style={{fontSize:'clamp(2rem,6vw,3rem)',lineHeight:1.1,marginBottom:10,color:'#f5f5ee'}}>Learn Anything, <em style={{color:'#e8b84b'}}>Instantly.</em></h1>
          <p style={{color:'#6b6b60',fontSize:16}}>Type a topic — get a lesson, quiz, and key takeaways.</p>
        </div>
        <div style={{display:'flex',gap:10,marginBottom:32}}>
          <input placeholder="e.g. black holes, stoicism..." value={topic} onChange={e=>setTopic(e.target.value)} onKeyDown={e=>e.key==='Enter'&&fetchLesson()} disabled={atLimit} style={{flex:1,background:'#13131a',border:'1px solid #222230',borderRadius:6,padding:'13px 16px',fontSize:15,color:'#e2e2d8',outline:'none',opacity:atLimit?0.5:1}}/>
          <button onClick={fetchLesson} disabled={loading||atLimit} style={{background:'#e8b84b',color:'#0a0a0f',border:'none',borderRadius:6,padding:'13px 22px',fontSize:15,fontWeight:700,cursor:atLimit?'not-allowed':'pointer',opacity:loading||atLimit?0.6:1}}>{loading?'Loading…':'Teach Me'}</button>
        </div>
        {atLimit && (
          <div style={{background:'#16162a',border:'1px solid #7c6cfc',borderRadius:10,padding:'24px 28px',marginBottom:32,textAlign:'center'}}>
            <h3 style={{fontSize:22,marginBottom:8,color:'#f5f5ee'}}>Daily limit reached!</h3>
            <p style={{color:'#888880',marginBottom:20}}>Upgrade to Pro for unlimited lessons.</p>
            <button onClick={handleUpgrade} disabled={upgrading} style={{background:'#7c6cfc',color:'#fff',border:'none',borderRadius:6,padding:'13px 28px',fontSize:15,fontWeight:700,cursor:'pointer'}}>{upgrading?'Redirecting…':'Upgrade to Pro — $9/month'}</button>
          </div>
        )}
        {error && <p style={{color:'#e07070',fontSize:14,marginBottom:20,textAlign:'center'}}>{error}</p>}
        {loading && <p style={{textAlign:'center',color:'#6b6b60',padding:'32px 0'}}>Generating lesson on <em>{lastTopic}</em>…</p>}
        {lesson && (
          <>
            {[{title:'✦ Lesson',content:<p style={{fontSize:15,lineHeight:1.8,color:'#d4d4cc',whiteSpace:'pre-wrap'}}>{lesson.lesson}</p>},{title:'✦ Quiz',content:<ul style={{listStyle:'none',padding:0}}>{lesson.quiz?.map((q,i)=><li key={i} style={{background:'#0e0e18',border:'1px solid #222230',borderRadius:6,padding:'13px 16px',fontSize:14,color:'#d4d4cc',marginBottom:10}}><strong style={{color:'#e8b84b'}}>{i+1}.</strong> {q}</li>)}</ul>},{title:'✦ Takeaways',content:<ul style={{listStyle:'none',padding:0}}>{lesson.takeaways?.map((t,i)=><li key={i} style={{display:'flex',gap:10,fontSize:14,color:'#d4d4cc',marginBottom:10}}><span style={{color:'#e8b84b'}}>—</span>{t}</li>)}</ul>}].map(({title,content})=>(
              <div key={title} style={{background:'#13131a',border:'1px solid #222230',borderRadius:10,padding:'24px 26px',marginBottom:16}}>
                <div style={{fontSize:11,letterSpacing:3,textTransform:'uppercase',color:'#e8b84b',marginBottom:14}}>{title}</div>
                {content}
              </div>
            ))}
          </>
        )}
      </div>
    </main>
  )
}
