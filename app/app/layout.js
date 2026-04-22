import './globals.css'

export const metadata = {
  title: 'LearnAI — Learn Anything Instantly',
  description: 'AI-powered lessons on any topic.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{margin:0,padding:0,background:'#0a0a0f',color:'#e2e2d8',fontFamily:'Georgia,serif'}}>
        {children}
      </body>
    </html>
  )
}
