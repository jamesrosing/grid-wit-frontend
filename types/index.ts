export interface Clue {
  number: number
  direction: 'across' | 'down'
  text: string
  answer: string
  row: number
  column: number
}

export interface Puzzle {
  id: number
  date: string
  date_published: string
  author: string
  editor: string
  grid: string  // JSON string of 15x15 array
  clues: Clue[]
  publisher?: string
  difficulty?: string
  notes?: string
}

export interface Cell {
  value: string
  number?: number
  isBlack: boolean
  row: number
  col: number
  isStart: {
    across: boolean
    down: boolean
  }
}

export interface GridPosition {
  row: number
  col: number
}

export interface ActiveCell {
  row: number
  col: number
  direction: 'across' | 'down'
}

export const GRID_SIZE = 15  // Standard crossword size

export interface DashboardData {
  recentActivity: {
    id: string
    puzzle_id: string
    last_played_at: string
    completed: boolean
  }[]
  inProgressPuzzles: {
    id: string
    puzzle_id: string
    last_played_at: string
  }[]
  favoritePuzzles: {
    id: string
    puzzle_id: string
    created_at: string
  }[]
}

export interface UserProfile {
  id: string
  username: string
  display_name?: string
  avatar_url?: string
  bio?: string
  created_at: string
  updated_at: string
}

export interface PuzzleProgress {
  id: string
  user_id: string
  puzzle_id: string
  progress: string[][]  // 2D array of current puzzle state
  completed: boolean
  last_played_at: string
}

export interface PuzzleFavorite {
  id: string
  user_id: string
  puzzle_id: string
  is_favorite: boolean
  created_at: string
}