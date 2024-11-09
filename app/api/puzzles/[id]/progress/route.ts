import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { pool } from '@/lib/db'

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { userId } = await auth()
  if (!userId) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  try {
    const { progress, completed } = await req.json()
    const result = await pool.query(
      `INSERT INTO user_puzzle_states (user_id, puzzle_id, progress, completed)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (user_id, puzzle_id) 
       DO UPDATE SET 
         progress = $3,
         completed = $4,
         last_played_at = CURRENT_TIMESTAMP
       RETURNING *`,
      [userId, params.id, progress, completed]
    )
    return NextResponse.json(result.rows[0])
  } catch (error) {
    return new NextResponse('Internal Server Error', { status: 500 })
  }
} 