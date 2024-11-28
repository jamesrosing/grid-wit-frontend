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

  if (!bookmarks || bookmarks.length === 0) {
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
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Bookmarked Puzzles</h1>
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {bookmarks.map((bookmark) => (
          <Link
            key={bookmark.id}
            href={`/`}
            className="block p-4 border border-zinc-200 dark:border-zinc-800 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-900"
          >
            <div className="flex justify-between items-start">
              <div>
                <div className="font-medium">{bookmark.puzzle.title}</div>
                <div className="text-sm text-zinc-500 dark:text-zinc-400">
                  by {bookmark.puzzle.author}
                </div>
                <div className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                  {new Date(bookmark.puzzle.date).toLocaleDateString()}
                </div>
              </div>
              <button
                onClick={(e) => {
                  e.preventDefault()
                  removeBookmark(bookmark.puzzle_id)
                }}
                className="p-1 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded"
              >
                <BookmarkIcon className="w-5 h-5 text-zinc-700 dark:text-zinc-300" />
              </button>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
