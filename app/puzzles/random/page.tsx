import { redirect } from 'next/navigation'

export default async function RandomPuzzlePage() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/puzzles/random`, {
      cache: 'no-store',
    })
    
    if (!response.ok) {
      throw new Error('Failed to fetch random puzzle')
    }

    const puzzle = await response.json()
    redirect(`/puzzles/${puzzle.id}`)
  } catch (error) {
    console.error('Error in random puzzle page:', error)
    redirect('/')
  }
} 