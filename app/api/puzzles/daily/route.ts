import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    // First try to get today's daily puzzle
    const { data: dailyPuzzle, error: dailyError } = await supabase
      .from('daily_puzzles')
      .select('puzzle_id')
      .eq('date', today.toISOString().split('T')[0])
      .single()

    if (dailyError && dailyError.code !== 'PGRST116') {
      throw dailyError
    }

    let puzzleId = dailyPuzzle?.puzzle_id

    // If no daily puzzle exists for today, create one
    if (!puzzleId) {
      // Get a random puzzle that hasn't been used as a daily puzzle recently
      const { data: puzzle, error: puzzleError } = await supabase
        .from('puzzles')
        .select('id')
        .order('random()')
        .limit(1)
        .single()

      if (puzzleError) throw puzzleError
      puzzleId = puzzle.id

      // Save this as today's daily puzzle
      const { error: insertError } = await supabase
        .from('daily_puzzles')
        .insert({
          date: today.toISOString().split('T')[0],
          puzzle_id: puzzleId
        })

      if (insertError) throw insertError
    }

    // Get the full puzzle data
    const { data: puzzle, error: finalError } = await supabase
      .from('puzzles')
      .select('*')
      .eq('id', puzzleId)
      .single()

    if (finalError) throw finalError

    return NextResponse.json(puzzle)
  } catch (error) {
    console.error('Error fetching daily puzzle:', error)
    return NextResponse.json(
      { error: 'Failed to fetch daily puzzle' },
      { status: 500 }
    )
  }
} 