'use client'

import { useEffect, useState } from 'react'
import { getDailyPuzzle } from '@/lib/api'
import { CrosswordGrid } from '@/components/CrosswordGrid'
import { ClueList } from '@/components/ClueList'
import type { Puzzle, Clue, ActiveCell } from '@/types'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'

export default function CrosswordPage() {
  const [puzzle, setPuzzle] = useState<Puzzle | null>(null)
  const [activeCell, setActiveCell] = useState<ActiveCell | null>(null)
  const [activeClue, setActiveClue] = useState<Clue | null>(null)
  const [userProgress, setUserProgress] = useState<string[][]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { user } = useAuth()

  useEffect(() => {
    async function loadPuzzle() {
      try {
        setLoading(true)
        const data = await getDailyPuzzle()
        
        // Initialize puzzle state
        setPuzzle(data)
        setUserProgress(Array(15).fill(null).map(() => Array(15).fill('')))
        
        // Load saved progress if exists
        if (user?.id) {
          const { data: savedProgress } = await supabase
            .from('puzzle_progress')
            .select('progress')
            .eq('user_id', user.id)
            .eq('puzzle_id', data.id)
            .single()

          if (savedProgress) {
            setUserProgress(savedProgress.progress as string[][])
          }
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load puzzle')
      } finally {
        setLoading(false)
      }
    }

    loadPuzzle()
  }, [user?.id])

  // Save progress to Supabase
  useEffect(() => {
    if (!user?.id || !puzzle) return

    const saveProgress = async () => {
      const { error } = await supabase
        .from('puzzle_progress')
        .upsert({
          user_id: user.id,
          puzzle_id: puzzle.id,
          progress: userProgress
        })

      if (error) {
        console.error('Error saving progress:', error)
      }
    }

    // Debounce save to avoid too many requests
    const timeoutId = setTimeout(saveProgress, 1000)
    return () => clearTimeout(timeoutId)
  }, [userProgress, user?.id, puzzle])

  const handleCellSelect = (row: number, col: number, direction: 'across' | 'down') => {
    if (!puzzle) return

    setActiveCell({ row, col, direction })
    
    // Find corresponding clue
    const gridIndex = row * 15 + col
    const cell = puzzle.grid[gridIndex]
    
    if (cell !== '.') {
      const clue = puzzle.clues.find(c => 
        c.direction === direction && 
        (c.row === row && c.column === col || // Starts here
         (direction === 'across' && c.row === row && c.column <= col) || // Part of across word
         (direction === 'down' && c.column === col && c.row <= row)) // Part of down word
      )
      
      if (clue) {
        setActiveClue(clue)
      }
    }
  }

  const handleUpdateProgress = (row: number, col: number, value: string) => {
    setUserProgress(prev => {
      const newProgress = prev.map(r => [...r])
      newProgress[row][col] = value
      return newProgress
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (error || !puzzle) {
    return (
      <div className="flex items-center justify-center min-h-screen text-red-500">
        {error || 'No puzzle available'}
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr,350px] gap-4 md:gap-8">
        {/* Crossword Grid */}
        <div className="order-2 lg:order-1">
          {activeClue && (
            <div className="mb-4 p-3 md:p-4 bg-zinc-100 dark:bg-zinc-800 text-sm md:text-base text-zinc-900 dark:text-zinc-50 rounded-lg">
              <span className="font-bold mr-2">{activeClue.number} {activeClue.direction}:</span>
              {activeClue.text}
            </div>
          )}
          <div className="flex flex-col items-center lg:items-start">
            <CrosswordGrid
              puzzle={puzzle}
              activeCell={activeCell}
              activeClue={activeClue}
              onCellSelect={handleCellSelect}
              userProgress={userProgress}
              onUpdateProgress={handleUpdateProgress}
            />
            
            {/* Puzzle Metadata */}
            <div className="mt-6 p-4 bg-zinc-100 dark:bg-zinc-800 rounded-lg w-full max-w-xl">
              <h2 className="text-lg font-semibold mb-2 text-zinc-900 dark:text-zinc-50">
                Puzzle Information
              </h2>
              <dl className="grid grid-cols-2 gap-2 text-sm">
                <dt className="text-zinc-600 dark:text-zinc-400">Puzzle ID:</dt>
                <dd className="text-zinc-900 dark:text-zinc-50">{puzzle.id}</dd>
                
                <dt className="text-zinc-600 dark:text-zinc-400">Date:</dt>
                <dd className="text-zinc-900 dark:text-zinc-50">
                  {new Date(puzzle.date).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </dd>
                
                {puzzle.author && (
                  <>
                    <dt className="text-zinc-600 dark:text-zinc-400">Author:</dt>
                    <dd className="text-zinc-900 dark:text-zinc-50">{puzzle.author}</dd>
                  </>
                )}
                
                {puzzle.editor && (
                  <>
                    <dt className="text-zinc-600 dark:text-zinc-400">Editor:</dt>
                    <dd className="text-zinc-900 dark:text-zinc-50">{puzzle.editor}</dd>
                  </>
                )}

                {puzzle.publisher && (
                  <>
                    <dt className="text-zinc-600 dark:text-zinc-400">Publisher:</dt>
                    <dd className="text-zinc-900 dark:text-zinc-50">{puzzle.publisher}</dd>
                  </>
                )}

                {puzzle.difficulty && (
                  <>
                    <dt className="text-zinc-600 dark:text-zinc-400">Difficulty:</dt>
                    <dd className="text-zinc-900 dark:text-zinc-50 flex items-center">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium
                        ${puzzle.difficulty.toLowerCase() === 'easy' ? 'bg-green-100 text-green-800' :
                          puzzle.difficulty.toLowerCase() === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'}`}>
                        {puzzle.difficulty}
                      </span>
                    </dd>
                  </>
                )}
              </dl>

              {puzzle.notes && (
                <div className="mt-4 pt-4 border-t border-zinc-200 dark:border-zinc-700">
                  <h3 className="text-sm font-medium text-zinc-900 dark:text-zinc-50 mb-2">
                    Notes
                  </h3>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">
                    {puzzle.notes}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Clue Lists */}
        <div className="order-1 lg:order-2 max-h-[50vh] lg:max-h-[80vh] overflow-y-auto">
          <ClueList
            clues={puzzle.clues}
            activeClue={activeClue}
            onClueSelect={(clue) => {
              setActiveClue(clue)
              setActiveCell({
                row: clue.row,
                col: clue.column,
                direction: clue.direction
              })
            }}
          />
        </div>
      </div>
    </div>
  )
}