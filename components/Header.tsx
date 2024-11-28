'use client'

import { Menu, X, Sun, Moon, Calendar, Laptop, Search, BookmarkIcon, Clock, Star, LayoutDashboard, LogOut, LogIn } from 'lucide-react'
import { useState } from 'react'
import Link from 'next/link'
import { useTheme } from 'next-themes'
import { searchPuzzles } from '@/lib/api'
import { useAuth } from '@/contexts/AuthContext'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import Image from 'next/image'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const { theme, setTheme } = useTheme()
  const { user } = useAuth()
  const supabase = createClientComponentClient()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
  }

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
          {user && (
            <button
              className="p-2"
              onClick={() => setIsSearchOpen(true)}
              aria-label="Search"
            >
              <Search className="h-5 w-5 text-zinc-700 dark:text-zinc-300" />
            </button>
          )}
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
        <div>
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
        </div>
      )}

      {/* Menu Modal */}
      {isMenuOpen && (
        <div>
          <div 
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50"
            onClick={() => setIsMenuOpen(false)}
          />
          <div className="fixed right-4 top-20 w-[200px] bg-white dark:bg-zinc-950 z-50 animate-in slide-in-from-top">
            <div className="flex flex-col p-2">
          {user ? (
            <>
                  <Link 
                    href="/"
                    className="flex items-center gap-2 px-3 py-2 text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                  >
                    <Calendar className="h-4 w-4" />
                    Daily Puzzle
                  </Link>
                  <Link 
                    href="/in-progress"
                    className="flex items-center gap-2 px-3 py-2 text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                  >
                    <Clock className="h-4 w-4" />
                    In Progress
                  </Link>
                  <Link 
                    href="/dashboard"
                    className="flex items-center gap-2 px-3 py-2 text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                  >
                    <LayoutDashboard className="h-4 w-4" />
                    Dashboard
                  </Link>
                  <Link 
                    href="/bookmarks"
                    className="flex items-center gap-2 px-3 py-2 text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                  >
                    <BookmarkIcon className="h-4 w-4" />
                    Bookmarks
                  </Link>
                  <Link 
                    href="/favorites"
                    className="flex items-center gap-2 px-3 py-2 text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                  >
                    <Star className="h-4 w-4" />
                    Favorites
                  </Link>
                  <hr className="my-2 border-zinc-200 dark:border-zinc-800" />
                  <button
                    onClick={handleSignOut}
                    className="flex items-center gap-2 px-3 py-2 text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                  >
                    <LogOut className="h-4 w-4" />
                    Sign Out
                  </button>
            </>
          ) : (
                <Link 
                  href="/login"
                  className="flex items-center gap-2 px-3 py-2 text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                >
                  <LogIn className="h-4 w-4" />
                Sign In
            </Link>
          )}
              <hr className="my-2 border-zinc-200 dark:border-zinc-800" />
              <button
                onClick={() => setTheme('light')}
                className="flex items-center gap-2 px-3 py-2 text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
              >
                <Sun className="h-4 w-4" />
                Light
              </button>
              <button
                onClick={() => setTheme('dark')}
                className="flex items-center gap-2 px-3 py-2 text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
              >
                <Moon className="h-4 w-4" />
                Dark
              </button>
              <button
                onClick={() => setTheme('system')}
                className="flex items-center gap-2 px-3 py-2 text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
              >
                <Laptop className="h-4 w-4" />
                System
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}