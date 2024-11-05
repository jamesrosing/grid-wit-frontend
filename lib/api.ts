import { Puzzle } from '@/types'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'

export async function getDailyPuzzle(): Promise<Puzzle> {
  const response = await fetch(`${API_BASE_URL}/api/puzzles/daily`)
  if (!response.ok) {
    throw new Error('Failed to fetch puzzle')
  }
  return response.json()
}