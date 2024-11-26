'use client'

import { Menu, X, Sun, Moon, Calendar, Laptop, Search, BookmarkIcon, Clock, Star, LayoutDashboard, LogOut, LogIn } from 'lucide-react'
import { useState } from 'react'
import Link from 'next/link'
import { useTheme } from 'next-themes'
import { searchPuzzles } from '@/lib/api'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'
import Image from 'next/image'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const { theme, setTheme } = useTheme()
  const { user } = useAuth()

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
              {user ? (
                <div className="relative ml-3">
                  <div>
                    <button
                      onClick={() => setIsOpen(!isOpen)}
                      className="flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                    >
                      <span className="sr-only">Open user menu</span>
                      <img
                        className="h-8 w-8 rounded-full"
                        src={user.user_metadata.avatar_url || `https://ui-avatars.com/api/?name=${user.email}`}
                        alt=""
                      />
                    </button>
                  </div>
                  {isOpen && (
                    <div className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                      <Link
                        href="/profile"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Profile Settings
                      </Link>
                      <Link
                        href="/dashboard"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Dashboard
                      </Link>
                      <Link
                        href="/"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Daily Puzzle
                      </Link>
                      <Link
                        href="/bookmarks"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Bookmarks
                      </Link>
                      <Link
                        href="/in-progress"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        In Progress
                      </Link>
                      <Link
                        href="/favorites"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Favorites
                      </Link>
                      <button
                        onClick={() => {
                          handleSignOut()
                          setIsMenuOpen(false)
                        }}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Sign out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-center gap-4 mt-4">
                  <Link
                    href="/auth/login"
                    className="w-full rounded-md bg-zinc-900 dark:bg-zinc-50 px-8 py-2 text-sm font-medium text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors text-center"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign In
                  </Link>
                </div>
              )}

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