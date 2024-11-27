import { pool } from './db'

export interface PuzzleProgress {
  grid: string[][]
  completed: boolean
}

export async function savePuzzleState(
  userId: string,
  puzzleId: number,
  progress: PuzzleProgress
) {
  const client = await pool.connect()
  try {
    const result = await client.query(
      `
      INSERT INTO user_puzzle_states (user_id, puzzle_id, progress, completed)
      VALUES ($1, $2, $3, $4)
      ON CONFLICT (user_id, puzzle_id) 
      DO UPDATE SET 
        progress = $3,
        completed = $4,
        last_played_at = CURRENT_TIMESTAMP
      RETURNING *
      `,
      [userId, puzzleId, JSON.stringify(progress.grid), progress.completed]
    )
    return result.rows[0]
  } finally {
    client.release()
  }
}

export async function togglePuzzleFavorite(userId: string, puzzleId: number) {
  const client = await pool.connect()
  try {
    const result = await client.query(
      `
      INSERT INTO user_puzzle_states (user_id, puzzle_id, is_favorite)
      VALUES ($1, $2, true)
      ON CONFLICT (user_id, puzzle_id) 
      DO UPDATE SET 
        is_favorite = NOT user_puzzle_states.is_favorite
      RETURNING *
      `,
      [userId, puzzleId]
    )
    return result.rows[0]
  } finally {
    client.release()
  }
}

export async function getUserPuzzleStates(userId: string) {
  const client = await pool.connect()
  try {
    const result = await client.query(
      `
      SELECT * FROM user_puzzle_states
      WHERE user_id = $1
      ORDER BY last_played_at DESC
      `,
      [userId]
    )
    return result.rows
  } finally {
    client.release()
  }
}

export async function getFavoritePuzzles(userId: string) {
  const client = await pool.connect()
  try {
    const result = await client.query(
      `
      SELECT * FROM user_puzzle_states
      WHERE user_id = $1 AND is_favorite = true
      ORDER BY last_played_at DESC
      `,
      [userId]
    )
    return result.rows
  } finally {
    client.release()
  }
}

export async function getInProgressPuzzles(userId: string) {
  const client = await pool.connect()
  try {
    const result = await client.query(
      `
      SELECT * FROM user_puzzle_states
      WHERE user_id = $1 AND completed = false
      ORDER BY last_played_at DESC
      `,
      [userId]
    )
    return result.rows
  } finally {
    client.release()
  }
}

export async function getLastPlayedPuzzle(userId: string) {
  const client = await pool.connect()
  try {
    const result = await client.query(
      `
      SELECT * FROM user_puzzle_states
      WHERE user_id = $1
      ORDER BY last_played_at DESC
      LIMIT 1
      `,
      [userId]
    )
    return result.rows[0]
  } finally {
    client.release()
  }
}

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

export interface PuzzleState {
  id: string
  user_id: string
  puzzle_id: string
  state: any
  completed: boolean
  last_played_at: string
  created_at: string
}

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

  return data
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
    inProgress: inProgress || [],
    completed: completed || []
  }
}