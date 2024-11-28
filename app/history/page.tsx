'use client'

import { useEffect, useState } from 'react'
import { Clock } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

interface HistoryItem {
  id: string
  puzzle_id: string
  created_at: string
  completed: boolean
}

export default function HistoryPage() {
  const [history, setHistory] = useState<HistoryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { user } = useAuth()
  const supabase = createClientComponentClient()

  useEffect(() => {
    if (!user) {
      setHistory([])
      setLoading(false)
      return
    }

    async function fetchHistory() {
      try {
        const response = await fetch('/api/history')
        if (!response.ok) throw new Error('Failed to fetch history')
        const data = await response.json()
        setHistory(data || [])
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error fetching history')
        setHistory([])
      } finally {
        setLoading(false)
      }
    }

    fetchHistory()
  }, [user])

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Clock className="w-12 h-12 text-zinc-400" />
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Sign in to view history</h1>
        <p className="text-zinc-600 dark:text-zinc-400">
          Please sign in to view your puzzle history.
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
        <Clock className="w-12 h-12 text-red-500" />
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Error loading history</h1>
        <p className="text-zinc-600 dark:text-zinc-400">{error}</p>
      </div>
    )
  }

  if (!history || history.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Clock className="w-12 h-12 text-zinc-400" />
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">No history yet</h1>
        <p className="text-zinc-600 dark:text-zinc-400">
          Start solving puzzles to build your history.
        </p>
      </div>
    )
  }

  return (
    <div className="container max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8 text-zinc-900 dark:text-zinc-50">Puzzle History</h1>
      <div className="space-y-4">
        {history.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between p-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800"
          >
            <div className="flex items-center gap-4">
              <Clock className="h-5 w-5 text-zinc-400" />
              <div>
                <p className="font-medium text-zinc-900 dark:text-zinc-50">
                  Puzzle #{item.puzzle_id}
                </p>
                <p className="text-sm text-zinc-500">
                  Played on {new Date(item.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className={`px-2 py-1 text-xs rounded-full ${
                item.completed
                  ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400'
                  : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400'
              }`}>
                {item.completed ? 'Completed' : 'In Progress'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
