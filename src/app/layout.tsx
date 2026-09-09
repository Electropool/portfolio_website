import type { Metadata } from 'next'
import '../index.css'

export const metadata: Metadata = {
  title: 'Arpan Kar — Portfolio',
  description: 'ElectroPool portfolio',
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
