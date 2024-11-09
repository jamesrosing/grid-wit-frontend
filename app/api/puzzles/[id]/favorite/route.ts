import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { pool } from '@/lib/db'

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { userId } = await auth()
  if (!userId) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  try {
    const result = await pool.query(
      `INSERT INTO user_puzzle_states (user_id, puzzle_id, is_favorite)
       VALUES ($1, $2, true)
       ON CONFLICT (user_id, puzzle_id) 
       DO UPDATE SET is_favorite = NOT user_puzzle_states.is_favorite
       RETURNING *`,
      [userId, params.id]
    )
    return NextResponse.json(result.rows[0])
  } catch (error) {
    return new NextResponse('Internal Server Error', { status: 500 })
  }
} 