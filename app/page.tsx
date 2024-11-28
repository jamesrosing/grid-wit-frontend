'use client'

import { useEffect, useState } from 'react'
import { getDailyPuzzle } from '@/lib/api'
import { CrosswordGrid } from '@/components/CrosswordGrid'
import { ClueList } from '@/components/ClueList'
import { PuzzleInfo } from '@/components/PuzzleInfo'
import type { Puzzle, Clue, ActiveCell } from '@/types'
import { useAuth } from '@/contexts/AuthContext'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import type { Database } from '@/lib/database.types'
import { toast } from 'sonner'

export default function CrosswordPage() {
  const [puzzle, setPuzzle] = useState<Puzzle | null>(null)
  const [activeCell, setActiveCell] = useState<ActiveCell | null>(null)
  const [activeClue, setActiveClue] = useState<Clue | null>(null)
  const [userProgress, setUserProgress] = useState<string[][]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { user } = useAuth()
  const supabase = createClientComponentClient<Database>()

  useEffect(() => {
    async function loadPuzzle() {
      try {
        setLoading(true)
        const data = await getDailyPuzzle()
        
        if (!data) {
          throw new Error('Failed to load puzzle data')
        }

        // Parse grid if it's a string
        if (typeof data.grid === 'string') {
          try {
            data.grid = JSON.parse(data.grid)
          } catch (e) {
            console.error('Error parsing grid:', e)
            throw new Error('Invalid puzzle grid format')
          }
        }
        
        // Initialize puzzle state
        setPuzzle(data)
        setUserProgress(Array(15).fill(null).map(() => Array(15).fill('')))
        
        // Load saved progress if exists
        if (user?.id && data?.id) {
          const { data: savedProgress, error } = await supabase
            .from('puzzle_progress')
            .select('state')
            .eq('user_id', user.id)
            .eq('puzzle_id', data.id.toString())
            .single()

          if (error) {
            console.error('Error loading progress:', error)
          } else if (savedProgress?.state) {
            try {
              const parsedState = typeof savedProgress.state === 'string' 
                ? JSON.parse(savedProgress.state) 
                : savedProgress.state

              if (Array.isArray(parsedState) && 
                  parsedState.length === 15 && 
                  parsedState.every(row => Array.isArray(row) && row.length === 15)) {
                setUserProgress(parsedState)
              } else {
                throw new Error('Invalid saved state format')
              }
            } catch (e) {
              console.error('Error parsing saved state:', e)
              setUserProgress(Array(15).fill(null).map(() => Array(15).fill('')))
            }
          }
        }
      } catch (err) {
        console.error('Error loading puzzle:', err)
        setError(err instanceof Error ? err.message : 'Failed to load puzzle')
      } finally {
        setLoading(false)
      }
    }

    loadPuzzle()
  }, [user?.id, supabase])

  // Save progress to Supabase
  useEffect(() => {
    if (!user?.id || !puzzle?.id) return

    const saveProgress = async () => {
      try {
        const { error } = await supabase
          .from('puzzle_progress')
          .upsert({
            user_id: user.id,
            puzzle_id: puzzle.id.toString(),
            state: JSON.stringify(userProgress),
            completed: false,
            last_played_at: new Date().toISOString()
          })

        if (error) {
          console.error('Error saving progress:', error)
        }
      } catch (e) {
        console.error('Error in saveProgress:', e)
      }
    }

    // Debounce save to avoid too many requests
    const timeoutId = setTimeout(saveProgress, 1000)
    return () => clearTimeout(timeoutId)
  }, [userProgress, user?.id, puzzle, supabase])

  const handleSaveProgress = async () => {
    if (!user?.id || !puzzle?.id) {
      toast.error('Please sign in to save your progress')
      return
    }

    try {
      const { error } = await supabase
        .from('puzzle_progress')
        .upsert({
          user_id: user.id,
          puzzle_id: puzzle.id.toString(),
          state: JSON.stringify(userProgress),
          completed: false,
          last_played_at: new Date().toISOString()
        })

      if (error) {
        console.error('Error saving progress:', error)
        toast.error('Failed to save progress')
      } else {
        toast.success('Progress saved successfully')
      }
    } catch (e) {
      console.error('Error in saveProgress:', e)
      toast.error('Failed to save progress')
    }
  }

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading puzzle...</div>
  }

  if (error) {
    return <div className="flex items-center justify-center min-h-screen text-red-500">{error}</div>
  }

  if (!puzzle) {
    return <div className="flex items-center justify-center min-h-screen">No puzzle available</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1">
          <CrosswordGrid
            puzzle={puzzle}
            activeCell={activeCell}
            activeClue={activeClue}
            onCellSelect={(row, col, direction) => {
              setActiveCell({ row, col, direction })
              const clue = puzzle.clues.find(
                c => c.direction === direction &&
                     c.row === row &&
                     c.column === col
              )
              setActiveClue(clue || null)
            }}
            userProgress={userProgress}
            onUpdateProgress={(row, col, value) => {
              const newProgress = [...userProgress]
              newProgress[row][col] = value
              setUserProgress(newProgress)
            }}
          />
          <div className="mt-4">
            <PuzzleInfo 
              puzzle={puzzle} 
              onSave={handleSaveProgress}
            />
          </div>
        </div>
        <div className="w-full lg:w-80">
          <ClueList
            clues={puzzle.clues}
            activeClue={activeClue}
            onClueSelect={(clue) => {
              setActiveClue(clue)
            setActiveCell({ 
              row: clue.row, 
              col: clue.column, 
              direction: clue.direction || 'across'  // Provide a default if not available
            })
            }}
          />
        </div>
      </div>
    </div>
  )
}