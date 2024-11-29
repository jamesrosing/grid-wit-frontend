'use client'

import { useEffect, useState } from 'react'
import { Grid } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { PuzzleList } from '@/components/dashboard/PuzzleList'

export default function PuzzlesPage() {
  const [puzzles, setPuzzles] = useState([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()

  useEffect(() => {
    async function loadPuzzles() {
      try {
        setLoading(true)
        const response = await fetch('/api/puzzles')
        const data = await response.json()
        setPuzzles(data)
      } catch (err) {
        console.error('Error loading puzzles:', err)
      } finally {
        setLoading(false)
      }
    }

    if (user) {
      loadPuzzles()
    }
  }, [user])

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <PuzzleList
        title="Available Puzzles"
        description="Browse our collection of crossword puzzles"
        icon={Grid}
        puzzles={puzzles}
      />
    </div>
  )
} 