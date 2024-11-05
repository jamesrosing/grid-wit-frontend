import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Grid Wit',
  description: 'Unlock your mind one word at a time',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen bg-gray-50`}>
        <main className="container mx-auto px-4 py-8">
          <header className="mb-8">
            <h1 className="text-3xl font-bold text-center text-gray-800">
              Grid Wit
            </h1>
            <p className="text-center text-gray-600">
              Cross The Words
            </p>
          </header>
          {children}
        </main>
      </body>
    </html>
  )
}