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