import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

interface PuzzleState {
  selectedCell: { row: number; col: number } | null
  highlightedCells: { row: number; col: number }[]
  revealedCells: { row: number; col: number }[]
  direction: 'across' | 'down'
  startTime: string | null
  lastSaveTime: string | null
  /* eslint-disable @typescript-eslint/no-unused-vars */
  saveProgress: (grid: string[][]) => void
  /* eslint-enable @typescript-eslint/no-unused-vars */
  getProgress: () => null
  clearProgress: () => void
}

export const usePuzzleStore = create<PuzzleState>()(
  persist(
    (set) => ({
      selectedCell: null,
      highlightedCells: [],
      revealedCells: [],
      direction: 'across',
      startTime: null,
      lastSaveTime: null,
      saveProgress: (_grid: string[][]) => {
        const now = new Date().toISOString()
        set(() => ({
          startTime: now,
          lastSaveTime: now,
        }))
      },
      getProgress: () => {
        return null
      },
      clearProgress: () => {
        set(() => ({
          selectedCell: null,
          highlightedCells: [],
          revealedCells: [],
          direction: 'across',
          startTime: null,
          lastSaveTime: null
        }))
      },
    }),
    {
      name: 'puzzle-progress',
    }
  )
)

export async function getPuzzleState(puzzleId: string) {
  const supabase = createRouteHandlerClient({ cookies })
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    return null
  }

  const { data, error } = await supabase
    .from('puzzle_progress')
    .select('*')
    .eq('puzzle_id', puzzleId)
    .eq('user_id', session.user.id)
    .single()

  if (error) {
    console.error('Error fetching puzzle state:', error)
    return null
  }

  return data
}