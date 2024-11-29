'use client'

import { useEffect, useState } from 'react'
import { Star } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { PuzzleList } from '@/components/dashboard/PuzzleList'

export default function FavoritesPage() {
  const [puzzles, setPuzzles] = useState([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()

  useEffect(() => {
    async function loadFavorites() {
      try {
        setLoading(true)
        const response = await fetch('/api/puzzles/favorites')
        const data = await response.json()
        setPuzzles(data)
      } catch (err) {
        console.error('Error loading favorites:', err)
      } finally {
        setLoading(false)
      }
    }

    if (user) {
      loadFavorites()
    }
  }, [user])

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <PuzzleList
        title="Favorite Puzzles"
        description="Your bookmarked puzzles"
        icon={Star}
        puzzles={puzzles}
      />
    </div>
  )
}
