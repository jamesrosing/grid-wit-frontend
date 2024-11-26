'use client'

import { useBookmarks } from '@/hooks/useBookmarks'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import { BookmarkIcon, Loader2 } from 'lucide-react'

export default function BookmarksPage() {
  const { bookmarks, loading, error, removeBookmark } = useBookmarks()
  const { user } = useAuth()

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <BookmarkIcon className="w-12 h-12 text-zinc-400" />
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Sign in to view bookmarks</h1>
        <p className="text-zinc-600 dark:text-zinc-400">
          Please sign in to view and manage your bookmarked puzzles.
        </p>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-zinc-400" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <BookmarkIcon className="w-12 h-12 text-red-500" />
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Error loading bookmarks</h1>
        <p className="text-zinc-600 dark:text-zinc-400">{error}</p>
      </div>
    )
  }

  if (bookmarks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <BookmarkIcon className="w-12 h-12 text-zinc-400" />
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">No bookmarks yet</h1>
        <p className="text-zinc-600 dark:text-zinc-400">
          Start bookmarking puzzles to save them for later.
        </p>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 mb-6">
        Bookmarked Puzzles
      </h1>
      <div className="grid gap-4">
        {bookmarks.map((bookmark) => (
          <div
            key={bookmark.id}
            className="flex items-center justify-between p-4 bg-white dark:bg-zinc-900 rounded-lg shadow-sm"
          >
            <Link
              href={`/puzzles/${bookmark.puzzle_id}`}
              className="flex-1 hover:underline text-zinc-900 dark:text-zinc-50"
            >
              Puzzle #{bookmark.puzzle_id}
            </Link>
            <button
              onClick={() => removeBookmark(bookmark.puzzle_id)}
              className="p-2 text-zinc-500 hover:text-red-500 transition-colors"
              aria-label="Remove bookmark"
            >
              <BookmarkIcon className="w-5 h-5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
