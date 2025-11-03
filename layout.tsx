import './globals.css'
import Navbar from '@/components/Navbar'

export const metadata = {
  title: 'Aiax Stock Pro',
  description: 'Owner/Admin stock manager'
}

export default function RootLayout({children}:{children:React.ReactNode}){
  return (
    <html lang="en">
      <body>
        <div className='container'>
          <Navbar role={null} />
          {children}
          <footer style={{marginTop:16,color:'#7f6b84',fontSize:12}}>© {new Date().getFullYear()} Aiax</footer>
        </div>
      </body>
    </html>
  )
}
