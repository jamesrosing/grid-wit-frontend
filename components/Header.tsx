'use client'

import { SignInButton, SignUpButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs'
import { Menu, X, Sun, Moon, Calendar, Laptop, Search, BookmarkIcon, Clock, Star, LayoutDashboard } from 'lucide-react'
import { useState } from 'react'
import Link from 'next/link'
import { useTheme } from 'next-themes'
import { searchPuzzles } from '@/lib/api'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const { theme, setTheme } = useTheme()

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white dark:bg-zinc-950 dark:border-zinc-800">
      <div className="container flex h-14 items-center justify-between px-4">
        {/* Logo and Title */}
        <div className="flex flex-col">
          <span className="font-bold text-xl text-zinc-900 dark:text-zinc-50">Grid Wit</span>
          <span className="text-xs text-zinc-500 dark:text-zinc-400">Unlock your mind. One word at a time.</span>
        </div>

        {/* Header Actions */}
        <div className="flex items-center gap-2">
          <SignedIn>
            <button
              className="p-2"
              onClick={() => setIsSearchOpen(true)}
              aria-label="Search"
            >
              <Search className="h-5 w-5 text-zinc-700 dark:text-zinc-300" />
            </button>
          </SignedIn>
          <button
            className="p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Menu"
          >
            <Menu className="h-5 w-5 text-zinc-700 dark:text-zinc-300" />
          </button>
        </div>
      </div>

      {/* Search Modal */}
      {isSearchOpen && (
        <>
          <div 
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50"
            onClick={() => setIsSearchOpen(false)}
          />
          <div className="fixed right-4 top-20 w-[350px] bg-white dark:bg-zinc-950 z-50 animate-in slide-in-from-top">
            <div className="flex flex-col p-4 gap-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-medium text-zinc-900 dark:text-zinc-50">Search Puzzles</h2>
                <button 
                  onClick={() => setIsSearchOpen(false)}
                  className="p-2"
                  aria-label="Close search"
                >
                  <X className="h-5 w-5 text-zinc-700 dark:text-zinc-300" />
                </button>
              </div>
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Search by puzzle ID..."
                  className="w-full px-3 py-2 text-sm bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 border border-zinc-200 dark:border-zinc-700"
                />
                <input
                  type="date"
                  className="w-full px-3 py-2 text-sm bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 border border-zinc-200 dark:border-zinc-700"
                />
                <input
                  type="text"
                  placeholder="Search by word..."
                  className="w-full px-3 py-2 text-sm bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 border border-zinc-200 dark:border-zinc-700"
                />
                <input
                  type="text"
                  placeholder="Search by clue..."
                  className="w-full px-3 py-2 text-sm bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 border border-zinc-200 dark:border-zinc-700"
                />
                <button
                  className="w-full px-4 py-2 text-sm font-medium text-white bg-zinc-900 dark:bg-zinc-50 dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors"
                >
                  Search
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Menu Overlay */}
      {isMenuOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50"
            onClick={() => setIsMenuOpen(false)}
          />
          
          {/* Menu Container */}
          <div className="fixed right-0 top-0 h-full w-[300px] bg-white dark:bg-zinc-950 z-50 animate-in slide-in-from-right">
            <div className="flex h-14 items-center justify-between px-4 border-b border-zinc-200 dark:border-zinc-800">
              <span className="font-bold text-xl text-zinc-900 dark:text-zinc-50">Grid Wit</span>
              <button 
                onClick={() => setIsMenuOpen(false)}
                className="p-2"
                aria-label="Close menu"
              >
                <X className="h-5 w-5 text-zinc-700 dark:text-zinc-300" />
              </button>
            </div>

            {/* Menu Content */}
            <div className="p-4 flex flex-col gap-6">
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

                <nav className="space-y-1">
                  <Link 
                    href="/dashboard"
                    className="flex items-center gap-3 px-2 py-2 text-sm text-zinc-900 dark:text-zinc-50 hover:bg-zinc-100 dark:hover:bg-zinc-800/50"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <LayoutDashboard className="h-4 w-4" />
                    <span>Dashboard</span>
                  </Link>

                  <Link 
                    href="/"
                    className="flex items-center gap-3 px-2 py-2 text-sm text-zinc-900 dark:text-zinc-50 hover:bg-zinc-100 dark:hover:bg-zinc-800/50"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Calendar className="h-4 w-4" />
                    <span>Daily Puzzle</span>
                  </Link>

                  <Link 
                    href="/saved"
                    className="flex items-center gap-3 px-2 py-2 text-sm text-zinc-900 dark:text-zinc-50 hover:bg-zinc-100 dark:hover:bg-zinc-800/50"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <BookmarkIcon className="h-4 w-4" />
                    <span>Saved Puzzles</span>
                  </Link>

                  <Link 
                    href="/in-progress"
                    className="flex items-center gap-3 px-2 py-2 text-sm text-zinc-900 dark:text-zinc-50 hover:bg-zinc-100 dark:hover:bg-zinc-800/50"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Clock className="h-4 w-4" />
                    <span>In Progress</span>
                  </Link>

                  <Link 
                    href="/favorites"
                    className="flex items-center gap-3 px-2 py-2 text-sm text-zinc-900 dark:text-zinc-50 hover:bg-zinc-100 dark:hover:bg-zinc-800/50"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Star className="h-4 w-4" />
                    <span>Favorites</span>
                  </Link>
                </nav>
              </SignedIn>

              <SignedOut>
                <div className="flex flex-col items-center gap-4 mt-4">
                  <SignInButton mode="modal">
                    <button className="w-full rounded-md bg-zinc-900 dark:bg-zinc-50 px-8 py-2 text-sm font-medium text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors">
                      Sign In
                    </button>
                  </SignInButton>
                  <SignUpButton mode="modal">
                    <button className="w-full rounded-md border border-zinc-200 dark:border-zinc-700 px-8 py-2 text-sm font-medium text-zinc-900 dark:text-zinc-50 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors">
                      Sign Up
                    </button>
                  </SignUpButton>
                </div>
              </SignedOut>

              {/* Theme Icons */}
              <div className="flex items-center gap-2 px-2">
                <button
                  onClick={() => setTheme('light')}
                  className={`p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors ${theme === 'light' ? 'bg-zinc-100 dark:bg-zinc-800' : ''}`}
                >
                  <Sun className="h-4 w-4 text-zinc-900 dark:text-zinc-50" />
                </button>
                <button
                  onClick={() => setTheme('dark')}
                  className={`p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors ${theme === 'dark' ? 'bg-zinc-100 dark:bg-zinc-800' : ''}`}
                >
                  <Moon className="h-4 w-4 text-zinc-900 dark:text-zinc-50" />
                </button>
                <button
                  onClick={() => setTheme('system')}
                  className={`p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors ${theme === 'system' ? 'bg-zinc-100 dark:bg-zinc-800' : ''}`}
                >
                  <Laptop className="h-4 w-4 text-zinc-900 dark:text-zinc-50" />
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </header>
  )
}