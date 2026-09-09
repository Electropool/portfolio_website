import type { Viewport } from 'next'
import '../index.css'
import { siteMetadata } from '../config/siteMetadata'

export const metadata = siteMetadata

export const viewport: Viewport = {
  themeColor: '#080808',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
