'use client'

import { useEffect, useState } from 'react'
import { Star } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

interface FavoriteItem {
  id: string
  puzzle_id: string
  created_at: string
}

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<FavoriteItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { user } = useAuth()
  const supabase = createClientComponentClient()

  useEffect(() => {
    if (!user) {
      setFavorites([])
      setLoading(false)
      return
    }

    async function fetchFavorites() {
      try {
        const response = await fetch('/api/favorites')
        if (!response.ok) throw new Error('Failed to fetch favorites')
        const data = await response.json()
        setFavorites(data || [])
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error fetching favorites')
        setFavorites([])
      } finally {
        setLoading(false)
      }
    }

    fetchFavorites()
  }, [user])

  const removeFavorite = async (puzzleId: string) => {
    try {
      const response = await fetch(`/api/favorites/${puzzleId}`, {
        method: 'DELETE',
      })
      if (!response.ok) throw new Error('Failed to remove favorite')
      setFavorites(favorites.filter(fav => fav.puzzle_id !== puzzleId))
    } catch (err) {
      console.error('Error removing favorite:', err)
    }
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Star className="w-12 h-12 text-zinc-400" />
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Sign in to view favorites</h1>
        <p className="text-zinc-600 dark:text-zinc-400">
          Please sign in to view your favorite puzzles.
        </p>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-zinc-900"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Star className="w-12 h-12 text-red-500" />
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Error loading favorites</h1>
        <p className="text-zinc-600 dark:text-zinc-400">{error}</p>
      </div>
    )
  }

  if (!favorites || favorites.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Star className="w-12 h-12 text-zinc-400" />
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">No favorites yet</h1>
        <p className="text-zinc-600 dark:text-zinc-400">
          Start adding puzzles to your favorites to see them here.
        </p>
      </div>
    )
  }

  return (
    <div className="container max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8 text-zinc-900 dark:text-zinc-50">Favorite Puzzles</h1>
      <div className="space-y-4">
        {favorites.map((favorite) => (
          <div
            key={favorite.id}
            className="flex items-center justify-between p-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800"
          >
            <div className="flex items-center gap-4">
              <Star className="h-5 w-5 text-yellow-400 fill-current" />
              <div>
                <p className="font-medium text-zinc-900 dark:text-zinc-50">
                  Puzzle #{favorite.puzzle_id}
                </p>
                <p className="text-sm text-zinc-500">
                  Added on {new Date(favorite.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => removeFavorite(favorite.puzzle_id)}
                className="text-xs px-3 py-1 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
