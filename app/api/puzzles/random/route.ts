import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies })

    // Get a random puzzle that is not today's daily puzzle
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    // First, get today's daily puzzle ID to exclude it
    const { data: dailyPuzzle } = await supabase
      .from('daily_puzzles')
      .select('puzzle_id')
      .eq('date', today.toISOString().split('T')[0])
      .single()

    // Then get a random puzzle that's not the daily puzzle
    const { data: puzzle, error } = await supabase
      .from('puzzles')
      .select('*')
      .neq('id', dailyPuzzle?.puzzle_id || '')
      .order('random()')
      .limit(1)
      .single()

    if (error) throw error

    return NextResponse.json(puzzle)
  } catch (error) {
    console.error('Error fetching random puzzle:', error)
    return NextResponse.json(
      { error: 'Failed to fetch random puzzle' },
      { status: 500 }
    )
  }
} 