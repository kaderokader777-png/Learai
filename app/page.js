import Link from 'next/link'

export default function Home() {
  return (
    <main style={{minHeight:'100vh',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',padding:'40px 20px',textAlign:'center',background:'#0a0a0f'}}>
      <div style={{fontSize:11,letterSpacing:4,textTransform:'uppercase',color:'#e8b84b',marginBottom:24}}>AI-Powered Learning</div>
      <h1 style={{fontFamily:'Georgia,serif',fontSize:'clamp(2.8rem,8vw,5rem)',fontWeight:700,lineHeight:1.08,marginBottom:24,color:'#f5f5ee'}}>Learn Anything.<br/><em style={{color:'#e8b84b'}}>Instantly.</em></h1>
      <p style={{fontSize:18,color:'#888880',maxWidth:480,lineHeight:1.7,marginBottom:48}}>Type any topic. Get a clear lesson, quiz questions, and key takeaways — powered by AI.</p>
      <div style={{display:'flex',gap:14,flexWrap:'wrap',justifyContent:'center',marginBottom:80}}>
        <Link href="/signup" style={{background:'#e8b84b',color:'#0a0a0f',padding:'15px 34px',borderRadius:6,fontWeight:700,fontSize:16}}>Start Free →</Link>
        <Link href="/login" style={{border:'1px solid #222230',color:'#e2e2d8',padding:'15px 34px',borderRadius:6,fontSize:16}}>Sign In</Link>
      </div>
    </main>
  )
}
