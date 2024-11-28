'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import Link from 'next/link'
import type { Database } from '@/lib/database.types'
import { Clock } from 'lucide-react'

interface PuzzleProgress {
  puzzle_id: string
  state: string
  last_played_at: string
  puzzle: {
    id: string
    title: string
    author: string
    date: string
  }
}

export default function InProgressPage() {
  const [puzzles, setPuzzles] = useState<PuzzleProgress[]>([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()
  const supabase = createClientComponentClient<Database>()

  useEffect(() => {
    async function loadInProgressPuzzles() {
      if (!user) return

      try {
        const { data, error } = await supabase
          .from('puzzle_progress')
          .select(`
            puzzle_id,
            state,
            last_played_at,
            puzzle:puzzles (
              id,
              title,
              author,
              date
            )
          `)
          .eq('user_id', user.id)
          .eq('completed', false)
          .order('last_played_at', { ascending: false })

        if (error) {
          console.error('Error loading in-progress puzzles:', error)
          return
        }

        setPuzzles(data || [])
      } catch (e) {
        console.error('Error in loadInProgressPuzzles:', e)
      } finally {
        setLoading(false)
      }
    }

    loadInProgressPuzzles()
  }, [user, supabase])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-4">In Progress</h1>
        <div>Loading...</div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-4">In Progress</h1>
        <div>Please sign in to view your in-progress puzzles.</div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">In Progress</h1>
      {puzzles.length === 0 ? (
        <div>No puzzles in progress.</div>
      ) : (
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {puzzles.map((puzzle) => (
            <Link
              key={puzzle.puzzle_id}
              href={`/`}
              className="block p-4 border border-zinc-200 dark:border-zinc-800 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-900"
            >
              <div className="font-medium">{puzzle.puzzle.title}</div>
              <div className="text-sm text-zinc-500 dark:text-zinc-400">
                by {puzzle.puzzle.author}
              </div>
              <div className="mt-2 text-sm text-zinc-500 dark:text-zinc-400 flex items-center gap-1">
                <Clock className="h-4 w-4" />
                Last played: {new Date(puzzle.last_played_at).toLocaleDateString()}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
