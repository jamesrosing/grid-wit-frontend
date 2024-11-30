'use client'

import { Menu, X, Sun, Moon, Calendar, Laptop, Search, BookmarkIcon, Clock, Star, LayoutDashboard, LogOut, LogIn } from 'lucide-react'
import { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useTheme } from 'next-themes'
import { useAuth } from '@/contexts/AuthContext'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const { setTheme } = useTheme()
  const { user, signOut } = useAuth()
  const router = useRouter()

  const handleSearch = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const author = formData.get('author')
    const date = formData.get('date')
    const year = formData.get('year')

    const params = new URLSearchParams()
    if (author) params.append('author', author.toString())
    if (date) params.append('date', date.toString())
    if (year) params.append('year', year.toString())

    setIsSearchOpen(false)
    router.push(`/puzzles/search?${params.toString()}`)
  }

  const handleSignOut = async () => {
    await signOut()
    router.push('/')
  }

  const startYear = 1976
  const currentYear = new Date().getFullYear()
  const years = Array.from(
    { length: currentYear - startYear + 1 },
    (_, i) => currentYear - i
  )

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white dark:bg-zinc-950 dark:border-zinc-800">
      <div className="container flex h-14 items-center justify-between px-4">
        {/* Logo and Title */}
        <Link href="/" className="flex flex-col hover:opacity-80">
          <span className="font-bold text-xl text-zinc-900 dark:text-zinc-50">Grid Wit</span>
          <span className="text-xs text-zinc-500 dark:text-zinc-400">Unlock your mind. One word at a time.</span>
        </Link>

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
            onClick={() => setIsMenuOpen(true)}
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
              <form onSubmit={handleSearch} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="author" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                    Search by Author
                  </label>
                  <input
                    id="author"
                    name="author"
                    type="text"
                    placeholder="Enter author name..."
                    className="w-full px-3 py-2 text-sm bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 border border-zinc-200 dark:border-zinc-700 rounded-md"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="date" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                    Search by Date
                  </label>
                  <input
                    id="date"
                    name="date"
                    type="date"
                    className="w-full px-3 py-2 text-sm bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 border border-zinc-200 dark:border-zinc-700 rounded-md"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="year" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                    Search by Year
                  </label>
                  <select
                    id="year"
                    name="year"
                    className="w-full px-3 py-2 text-sm bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 border border-zinc-200 dark:border-zinc-700 rounded-md"
                  >
                    <option value="">Select year...</option>
                    {years.map(year => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                </div>
                <button
                  type="submit"
                  className="w-full px-4 py-2 text-sm font-medium text-white bg-zinc-900 dark:bg-zinc-50 dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors rounded-md"
                >
                  Search
                </button>
              </form>
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
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                  >
                    <Calendar className="h-4 w-4" />
                    Daily Puzzle
                  </Link>
                  <Link 
                    href="/puzzles/random"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                  >
                    <Calendar className="h-4 w-4" />
                    New Puzzle
                  </Link>
                  <Link 
                    href="/in-progress"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                  >
                    <Clock className="h-4 w-4" />
                    In Progress
                  </Link>
                  <Link 
                    href="/dashboard"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                  >
                    <LayoutDashboard className="h-4 w-4" />
                    Dashboard
                  </Link>
                  <Link 
                    href="/bookmarks"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                  >
                    <BookmarkIcon className="h-4 w-4" />
                    Bookmarks
                  </Link>
                  <Link 
                    href="/favorites"
                    onClick={() => setIsMenuOpen(false)}
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
                  onClick={() => setIsMenuOpen(false)}
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