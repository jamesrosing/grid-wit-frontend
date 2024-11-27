import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { pool } from '@/lib/db'

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    const { data: { session } } = await supabase.auth.getSession()

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { progress, completed } = await request.json()
    const puzzleId = params.id

    const result = await pool.query(
      `INSERT INTO user_puzzle_states (user_id, puzzle_id, progress, completed)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (user_id, puzzle_id) 
       DO UPDATE SET 
         progress = $3,
         completed = $4,
         last_played_at = CURRENT_TIMESTAMP
       RETURNING *`,
      [session.user.id, puzzleId, progress, completed]
    )
    return NextResponse.json(result.rows[0])
  } catch (error) {
    console.error('Save puzzle progress error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}