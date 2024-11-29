'use client'

import { useSearchParams } from 'next/navigation'
import { useEffect, useState, Suspense } from 'react'
import { Puzzle } from '@/types'
import { Loader2 } from 'lucide-react'

function SearchResults() {
  const searchParams = useSearchParams()
  const [puzzles, setPuzzles] = useState<Puzzle[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function searchPuzzles() {
      try {
        setLoading(true)
        const params = new URLSearchParams()
        const author = searchParams.get('author')
        const date = searchParams.get('date')
        const year = searchParams.get('year')

        if (author) params.append('author', author)
        if (date) params.append('date', date)
        if (year) params.append('year', year)

        const response = await fetch(`/api/puzzles/search?${params.toString()}`)
        if (!response.ok) {
          throw new Error('Failed to search puzzles')
        }
        const data = await response.json()
        setPuzzles(data)
      } catch (error) {
        console.error('Error searching puzzles:', error)
        setError(error instanceof Error ? error.message : 'Failed to search puzzles')
      } finally {
        setLoading(false)
      }
    }

    searchPuzzles()
  }, [searchParams])

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
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Error searching puzzles</h1>
        <p className="text-zinc-600 dark:text-zinc-400">{error}</p>
      </div>
    )
  }

  if (!puzzles || puzzles.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">No puzzles found</h1>
        <p className="text-zinc-600 dark:text-zinc-400">
          Try adjusting your search criteria.
        </p>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Search Results</h1>
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {puzzles.map((puzzle) => (
          <div
            key={puzzle.id}
            className="block p-4 border border-zinc-200 dark:border-zinc-800 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-900"
          >
            <div className="font-medium">{puzzle.title}</div>
            <div className="text-sm text-zinc-500 dark:text-zinc-400">
              by {puzzle.author}
            </div>
            <div className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
              {new Date(puzzle.date).toLocaleDateString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-zinc-400" />
      </div>
    }>
      <SearchResults />
    </Suspense>
  )
} 