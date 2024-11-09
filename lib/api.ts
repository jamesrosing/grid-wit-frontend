import { Puzzle } from '@/types'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'

interface UserPuzzleProgress {
  progress: string[][]
  completed: boolean
}

interface SavedPuzzle {
  puzzle_id: number
  progress: string[][]
  completed: boolean
  last_played: string
  puzzle: {
    date_published: string
    author: string
  }
}

interface NewUser {
  username: string
  email: string
}

interface User {
  id: number
  username: string
  email: string
  created_at: string
}

interface DashboardData {
  stats: {
    totalSolved: number
    inProgress: number
    favorites: number
  }
  recentActivity: Array<{
    id: number
    completed: boolean
    last_played_at: string
    puzzle_id: number
  }>
  inProgressPuzzles: Array<{
    id: number
    puzzle_id: number
    last_played_at: string
    completed: boolean
    is_favorite: boolean
  }>
  favoritePuzzles: Array<{
    id: number
    puzzle_id: number
    last_played_at: string
    completed: boolean
    is_favorite: boolean
  }>
}

// Get daily puzzle
export async function getDailyPuzzle(): Promise<Puzzle> {
  const response = await fetch(`${API_BASE_URL}/api/puzzles/daily`)
  if (!response.ok) {
    throw new Error('Failed to fetch puzzle')
  }
  return response.json()
}

// Search puzzles
export async function searchPuzzles(params: {
  author?: string
  date?: string
  word?: string
  clue?: string
  page?: number
  per_page?: number
}): Promise<{ puzzles: Puzzle[], total: number, page: number, total_pages: number }> {
  const searchParams = new URLSearchParams()
  Object.entries(params).forEach(([key, value]) => {
    if (value) searchParams.append(key, value.toString())
  })

  const response = await fetch(`${API_BASE_URL}/api/puzzles/search?${searchParams}`)
  if (!response.ok) {
    throw new Error('Failed to search puzzles')
  }
  return response.json()
}

// Create new user
export async function createUser(userData: NewUser): Promise<User> {
  const response = await fetch(`${API_BASE_URL}/api/users`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  })
  if (!response.ok) {
    throw new Error('Failed to create user')
  }
  return response.json()
}

// Get user's saved puzzles
export async function getUserPuzzles(userId: number): Promise<{ puzzles: SavedPuzzle[] }> {
  const response = await fetch(`${API_BASE_URL}/api/users/${userId}/puzzles`)
  if (!response.ok) {
    throw new Error('Failed to fetch user puzzles')
  }
  return response.json()
}

// Save puzzle progress (new save)
export async function savePuzzleProgress(
  userId: number,
  puzzleId: number,
  progressData: UserPuzzleProgress
): Promise<SavedPuzzle> {
  const response = await fetch(`${API_BASE_URL}/api/users/${userId}/puzzles/${puzzleId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(progressData),
  })
  if (!response.ok) {
    throw new Error('Failed to save puzzle progress')
  }
  return response.json()
}

// Update puzzle progress
export async function updatePuzzleProgress(
  userId: number,
  puzzleId: number,
  progressData: UserPuzzleProgress
): Promise<SavedPuzzle> {
  const response = await fetch(`${API_BASE_URL}/api/users/${userId}/puzzles/${puzzleId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(progressData),
  })
  if (!response.ok) {
    throw new Error('Failed to update puzzle progress')
  }
  return response.json()
}

// Get API status
export async function getApiStatus(): Promise<{
  status: string
  database: string
  puzzle_count: number
  clue_count: number
  timestamp: string
}> {
  const response = await fetch(`${API_BASE_URL}/api/status`)
  if (!response.ok) {
    throw new Error('Failed to get API status')
  }
  return response.json()
}

export async function getDashboardData(): Promise<DashboardData> {
  const response = await fetch(`${API_BASE_URL}/api/dashboard`, {
    headers: {
      'Content-Type': 'application/json',
    },
    cache: 'no-cache' // Disable caching for now
  })
  
  if (!response.ok) {
    throw new Error(`Failed to fetch dashboard data: ${response.statusText}`)
  }
  
  return response.json()
}