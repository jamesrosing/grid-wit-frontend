'use client'

import { useEffect, useState } from 'react'
import { getDailyPuzzle } from '@/lib/api'
import { CrosswordGrid } from '@/components/CrosswordGrid'
import { ClueList } from '@/components/ClueList'
import type { Puzzle, Clue, ActiveCell } from '@/types'
import { useUser } from '@clerk/nextjs'

export default function CrosswordPage() {
  const [puzzle, setPuzzle] = useState<Puzzle | null>(null)
  const [activeCell, setActiveCell] = useState<ActiveCell | null>(null)
  const [activeClue, setActiveClue] = useState<Clue | null>(null)
  const [userProgress, setUserProgress] = useState<string[][]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { user } = useUser()

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
          const savedProgress = localStorage.getItem(`puzzle-progress-${user.id}-${data.id}`)
          if (savedProgress) {
            setUserProgress(JSON.parse(savedProgress))
          }
        }
      } catch (err) {
        console.error('Error loading puzzle:', err)
        setError('Failed to load puzzle')
      } finally {
        setLoading(false)
      }
    }
    loadPuzzle()
  }, [user?.id])

  useEffect(() => {
    // Save progress whenever it changes
    if (userProgress.length > 0 && puzzle?.id && user?.id) {
      localStorage.setItem(
        `puzzle-progress-${user.id}-${puzzle.id}`, 
        JSON.stringify(userProgress)
      )
    }
  }, [userProgress, puzzle?.id, user?.id])

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
    <div className="max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr,350px] gap-4 md:gap-8">
        {/* Crossword Grid */}
        <div className="order-2 lg:order-1">
          {activeClue && (
            <div className="mb-4 p-3 md:p-4 bg-zinc-100 dark:bg-zinc-800 text-sm md:text-base text-zinc-900 dark:text-zinc-50">
              <span className="font-bold mr-2">{activeClue.number} {activeClue.direction}:</span>
              {activeClue.text}
            </div>
          )}
          <div className="flex justify-center lg:justify-start">
            <CrosswordGrid
              puzzle={puzzle}
              activeCell={activeCell}
              activeClue={activeClue}
              onCellSelect={handleCellSelect}
              userProgress={userProgress}
              onUpdateProgress={handleUpdateProgress}
            />
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