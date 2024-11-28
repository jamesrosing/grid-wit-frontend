import type { Database } from './database.types'
import type { Json } from './database.types'

export interface PuzzleProgress {
  grid: string[][]
  completed: boolean
}

export interface PuzzleState {
  grid: string[][]
  completed: boolean
  lastPlayedAt: string
}

export function validatePuzzleState(state: unknown): state is PuzzleState {
  if (!state || typeof state !== 'object') return false

  const stateObj = state as Record<string, unknown>

  if (!Array.isArray(stateObj.grid)) return false
  if (typeof stateObj.completed !== 'boolean') return false
  if (typeof stateObj.lastPlayedAt !== 'string') return false

  // Check grid structure
  if (!stateObj.grid.every(row => 
    Array.isArray(row) && row.every(cell => 
      typeof cell === 'string'
    )
  )) return false

  return true
}

export function parsePuzzleState(state: Json): PuzzleState | null {
  try {
    const parsed = typeof state === 'string' ? JSON.parse(state) : state
    if (validatePuzzleState(parsed)) {
      return parsed
    }
    return null
  } catch (e) {
    console.error('Failed to parse puzzle state:', e)
    return null
  }
}

export function stringifyPuzzleState(state: PuzzleState): string {
  return JSON.stringify(state)
}

export function createEmptyPuzzleState(): PuzzleState {
  return {
    grid: Array(15).fill(null).map(() => Array(15).fill('')),
    completed: false,
    lastPlayedAt: new Date().toISOString()
  }
}

export function isPuzzleComplete(state: PuzzleState, solution: string[][]): boolean {
  return state.grid.every((row, i) =>
    row.every((cell, j) =>
      cell === solution[i][j] || solution[i][j] === '.'
    )
  )
}

export function updatePuzzleState(
  state: PuzzleState,
  row: number,
  col: number,
  value: string,
  solution: string[][]
): PuzzleState {
  const newGrid = state.grid.map(r => [...r])
  newGrid[row][col] = value

  return {
    grid: newGrid,
    completed: isPuzzleComplete({ ...state, grid: newGrid }, solution),
    lastPlayedAt: new Date().toISOString()
  }
}

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

export async function getPuzzleState(puzzleId: string): Promise<PuzzleState | null> {
  const supabase = createClientComponentClient()
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    throw new Error('Not authenticated')
  }

  const { data, error } = await supabase
    .from('puzzle_progress')
    .select('*')
    .eq('user_id', session.user.id)
    .eq('puzzle_id', puzzleId)
    .single()

  if (error) {
    console.error('Error fetching puzzle state:', error)
    return null
  }

  return parsePuzzleState(data.state)
}

export async function getDashboardData() {
  const supabase = createClientComponentClient()
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    throw new Error('Not authenticated')
  }

  const { data: inProgress, error: inProgressError } = await supabase
    .from('puzzle_progress')
    .select('*')
    .eq('user_id', session.user.id)
    .eq('completed', false)
    .order('last_played_at', { ascending: false })
    .limit(5)

  if (inProgressError) {
    console.error('Error fetching in-progress puzzles:', inProgressError)
    throw inProgressError
  }

  const { data: completed, error: completedError } = await supabase
    .from('puzzle_progress')
    .select('*')
    .eq('user_id', session.user.id)
    .eq('completed', true)
    .order('last_played_at', { ascending: false })
    .limit(5)

  if (completedError) {
    console.error('Error fetching completed puzzles:', completedError)
    throw completedError
  }

  return {
    inProgress: inProgress.map(p => parsePuzzleState(p.state)) || [],
    completed: completed.map(p => parsePuzzleState(p.state)) || []
  }
}