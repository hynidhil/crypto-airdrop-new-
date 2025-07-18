import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Claimex - Crypto Airdrop Discovery',
  description: 'Discover the latest crypto airdrops and testnet opportunities',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50">
        {children}
      </body>
    </html>
  )
}