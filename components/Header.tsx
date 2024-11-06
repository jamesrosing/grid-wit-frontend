'use client'

import { SignInButton, SignUpButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs'
import { Menu, X, Sun, Moon, Calendar } from 'lucide-react'
import { useState } from 'react'
import Link from 'next/link'
import { useTheme } from 'next-themes'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { theme, setTheme } = useTheme()

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white dark:bg-zinc-950 dark:border-zinc-800">
      <div className="container flex h-14 items-center justify-between px-4">
        {/* Logo and Title */}
        <div className="flex flex-col">
          <span className="font-bold text-xl text-zinc-900 dark:text-zinc-50">Grid Wit</span>
          <span className="text-xs text-zinc-500 dark:text-zinc-400">Unlock your mind. One word at a time.</span>
        </div>

        {/* Menu Button */}
        <button
          className="p-2"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Menu"
        >
          <Menu className="h-5 w-5 text-zinc-700 dark:text-zinc-300" />
        </button>
      </div>

      {/* Full Screen Menu */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 bg-white dark:bg-zinc-950 animate-in fade-in-0 slide-in-from-top-5">
          <div className="container h-full px-4">
            {/* Menu Header */}
            <div className="flex h-14 items-center justify-between">
              <span className="font-bold text-xl text-zinc-900 dark:text-zinc-50">Menu</span>
              <button 
                onClick={() => setIsMenuOpen(false)}
                className="p-2"
                aria-label="Close menu"
              >
                <X className="h-5 w-5 text-zinc-700 dark:text-zinc-300" />
              </button>
            </div>

            {/* Menu Content */}
            <div className="mt-8 flex flex-col gap-6">
              <SignedOut>
                <div className="flex flex-col items-center gap-4">
                  <SignInButton mode="modal">
                    <button className="rounded-md bg-zinc-900 dark:bg-zinc-50 px-8 py-2 text-sm font-medium text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors">
                      Sign In
                    </button>
                  </SignInButton>
                  <SignUpButton mode="modal">
                    <button className="rounded-md border border-zinc-200 dark:border-zinc-700 px-8 py-2 text-sm font-medium text-zinc-900 dark:text-zinc-50 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors">
                      Sign Up
                    </button>
                  </SignUpButton>
                </div>
              </SignedOut>
              
              <SignedIn>
                <div className="flex items-center gap-3 px-2">
                  <UserButton 
                    afterSignOutUrl="/"
                    appearance={{
                      elements: {
                        avatarBox: "w-10 h-10",
                      }
                    }}
                  />
                  <span className="text-sm text-zinc-600 dark:text-zinc-400">My Account</span>
                </div>
              </SignedIn>

              {/* Navigation Links */}
              <nav className="space-y-4">
                <Link 
                  href="/"
                  className="flex items-center gap-3 px-2 py-1 text-lg text-zinc-900 dark:text-zinc-50 hover:text-zinc-600 dark:hover:text-zinc-400 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Calendar className="h-5 w-5" />
                  <span>Daily Puzzle</span>
                </Link>
              </nav>

              {/* Theme Toggle */}
              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="flex items-center gap-3 px-2 py-1 text-lg text-zinc-900 dark:text-zinc-50 hover:text-zinc-600 dark:hover:text-zinc-400 transition-colors"
              >
                {theme === 'dark' ? (
                  <>
                    <Sun className="h-5 w-5" />
                    <span>Light Mode</span>
                  </>
                ) : (
                  <>
                    <Moon className="h-5 w-5" />
                    <span>Dark Mode</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}