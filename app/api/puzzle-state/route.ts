import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import * as PuzzleState from '@/lib/puzzle-state'

export async function GET(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    const { data: { session } } = await supabase.auth.getSession()

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const puzzleId = searchParams.get('puzzleId')
    if (!puzzleId) {
      return NextResponse.json(
        { error: 'Missing puzzleId parameter' },
        { status: 400 }
      )
    }

    const state = await PuzzleState.getPuzzleState(puzzleId)
    return NextResponse.json(state)
  } catch (error) {
    console.error('Get puzzle state error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    const { data: { session } } = await supabase.auth.getSession()

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { puzzleId, state, completed } = body

    if (!puzzleId || !state) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from('puzzle_progress')
      .upsert({
        user_id: session.user.id,
        puzzle_id: puzzleId,
        state,
        completed: completed || false,
        last_played_at: new Date().toISOString()
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(data)
  } catch (error) {
    console.error('Save puzzle state error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}