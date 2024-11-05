import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ClerkProvider, SignInButton, SignUpButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs'

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
    <ClerkProvider>
      <html lang="en" className="h-full">
        <body className={`${inter.className} min-h-full bg-zinc-50`}>
          <main className="container mx-auto px-4 py-4 md:py-8 min-h-screen">
            <header className="mb-4 md:mb-8 flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="text-center sm:text-left">
                <h1 className="text-2xl md:text-3xl font-bold text-zinc-800">
                  Grid Wit
                </h1>
                <p className="text-sm md:text-base text-zinc-600">
                  Unlock your mind one word at a time
                </p>
              </div>
              
              {/* Auth Buttons */}
              <div className="flex gap-3 items-center">
                <SignedOut>
                  <div className="flex gap-3">
                    <SignInButton mode="modal">
                      <button className="px-3 py-1.5 md:px-4 md:py-2 text-sm md:text-base rounded-md bg-zinc-900 text-white hover:bg-zinc-800 transition-colors">
                        Sign In
                      </button>
                    </SignInButton>
                    <SignUpButton mode="modal">
                      <button className="px-3 py-1.5 md:px-4 md:py-2 text-sm md:text-base rounded-md border border-zinc-900 text-zinc-900 hover:bg-zinc-100 transition-colors">
                        Sign Up
                      </button>
                    </SignUpButton>
                  </div>
                </SignedOut>
                <SignedIn>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-zinc-600 hidden md:inline">
                      My Account
                    </span>
                    <UserButton 
                      afterSignOutUrl="/"
                      appearance={{
                        elements: {
                          avatarBox: "w-8 h-8 md:w-10 md:h-10",
                          rootBox: "h-8 md:h-10",
                        }
                      }}
                    />
                  </div>
                </SignedIn>
              </div>
            </header>
            {children}
          </main>
        </body>
      </html>
    </ClerkProvider>
  )
}