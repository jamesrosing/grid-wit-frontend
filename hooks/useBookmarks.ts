import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import type { Database } from '@/lib/database.types'

type PuzzleFavorite = Database['public']['Tables']['puzzle_favorites']['Row']

export function useBookmarks() {
  const [bookmarks, setBookmarks] = useState<PuzzleFavorite[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { user } = useAuth()

  // Fetch bookmarks
  useEffect(() => {
    if (!user) {
      setBookmarks([])
      setLoading(false)
      return
    }

    async function fetchBookmarks() {
      try {
        const response = await fetch('/api/bookmarks')
        if (!response.ok) throw new Error('Failed to fetch bookmarks')
        const data = await response.json()
        setBookmarks(data || [])
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error fetching bookmarks')
        setBookmarks([])
      } finally {
        setLoading(false)
      }
    }

    fetchBookmarks()
  }, [user])

  // Add bookmark
  const addBookmark = async (puzzleId: string) => {
    if (!user) return

    try {
      const response = await fetch('/api/bookmarks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ puzzle_id: puzzleId }),
      })

      if (!response.ok) throw new Error('Failed to add bookmark')

      const newBookmark = await response.json()
      setBookmarks(prev => [...prev, newBookmark])
      return newBookmark
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error adding bookmark')
      throw err
    }
  }

  // Remove bookmark
  const removeBookmark = async (puzzleId: string) => {
    if (!user) return

    try {
      const response = await fetch('/api/bookmarks', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ puzzle_id: puzzleId }),
      })

      if (!response.ok) throw new Error('Failed to remove bookmark')

      setBookmarks(prev => prev.filter(b => b.puzzle_id !== puzzleId))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error removing bookmark')
      throw err
    }
  }

  // Check if puzzle is bookmarked
  const isBookmarked = (puzzleId: string) => {
    return bookmarks.some(b => b.puzzle_id === puzzleId)
  }

  return {
    bookmarks,
    loading,
    error,
    addBookmark,
    removeBookmark,
    isBookmarked,
  }
}
