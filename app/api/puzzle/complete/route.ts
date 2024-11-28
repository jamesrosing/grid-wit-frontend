import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    const { data: { session } } = await supabase.auth.getSession()

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { puzzleId, progress, completed } = await request.json()

    // Update puzzle progress
    const { error } = await supabase
      .from('puzzle_progress')
      .upsert({
        user_id: session.user.id,
        puzzle_id: puzzleId,
        state: JSON.stringify({ grid: progress, completed, lastPlayedAt: new Date().toISOString() }),
        completed,
        last_played_at: new Date().toISOString()
      })

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error completing puzzle:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
