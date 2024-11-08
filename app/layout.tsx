import './globals.css'
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html suppressHydrationWarning>
      <body className=' font-sans'>
        {children}
      </body>
    </html>
  )
}