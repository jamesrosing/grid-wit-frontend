import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

interface PuzzleProgress {
  [puzzleId: string]: {
    grid: string[][]
    startTime: string
    lastSaveTime: string
  }
}

interface PuzzleState {
  progress: PuzzleProgress
  saveProgress: (puzzleId: string, grid: string[][]) => void
  getProgress: (puzzleId: string) => {
    grid: string[][]
    startTime: string
    lastSaveTime: string
  } | null
  clearProgress: (puzzleId: string) => void
}

export const usePuzzleStore = create<PuzzleState>()(
  persist(
    (set, get) => ({
      progress: {},
      saveProgress: (puzzleId, grid) => {
        const now = new Date().toISOString()
        set((state) => ({
          progress: {
            ...state.progress,
            [puzzleId]: {
              grid,
              startTime: state.progress[puzzleId]?.startTime || now,
              lastSaveTime: now,
            },
          },
        }))
      },
      getProgress: (puzzleId) => {
        return get().progress[puzzleId] || null
      },
      clearProgress: (puzzleId) => {
        set((state) => {
          const { [puzzleId]: _, ...rest } = state.progress
          return { progress: rest }
        })
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