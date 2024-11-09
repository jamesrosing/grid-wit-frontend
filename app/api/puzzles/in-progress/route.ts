import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { pool } from '@/lib/db'

export async function GET() {
  const { userId } = await auth()
  if (!userId) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  try {
    const result = await pool.query(
      `SELECT * FROM user_puzzle_states 
       WHERE user_id = $1 AND completed = false 
       ORDER BY last_played_at DESC`,
      [userId]
    )
    return NextResponse.json(result.rows)
  } catch (error) {
    return new NextResponse('Internal Server Error', { status: 500 })
  }
} 