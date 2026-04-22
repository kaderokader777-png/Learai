'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function SignupPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  async function handleSignup() {
    setLoading(true); setError('')
    const { error } = await supabase.auth.signUp({ email, password })
    if (error) { setError(error.message); setLoading(false) }
    else router.push('/app')
  }

  return (
    <main style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',padding:20}}>
      <div style={{width:'100%',maxWidth:400}}>
        <h1 style={{fontSize:36,marginBottom:24}}>Create account</h1>
        <input type="email" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} style={{width:'100%',display:'block',background:'#13131a',border:'1px solid #222230',borderRadius:6,padding:'13px 16px',fontSize:15,color:'#e2e2d8',marginBottom:12,outline:'none'}}/>
        <input type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} onKeyDown={e=>e.key==='Enter'&&handleSignup()} style={{width:'100%',display:'block',background:'#13131a',border:'1px solid #222230',borderRadius:6,padding:'13px 16px',fontSize:15,color:'#e2e2d8',marginBottom:24,outline:'none'}}/>
        {error && <p style={{color:'#e07070',fontSize:14,marginBottom:16}}>{error}</p>}
        <button onClick={handleSignup} disabled={loading} style={{width:'100%',background:'#e8b84b',color:'#0a0a0f',border:'none',borderRadius:6,padding:'14px',fontSize:16,fontWeight:700,cursor:'pointer'}}>{loading?'Creating…':'Create Account →'}</button>
        <p style={{textAlign:'center',marginTop:24,color:'#6b6b60',fontSize:14}}>Have an account? <Link href="/login" style={{color:'#e8b84b'}}>Sign in</Link></p>
      </div>
    </main>
  )
}
