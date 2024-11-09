import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { pool } from '@/lib/db'

export async function GET() {
  const { userId } = await auth()
  if (!userId) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  try {
    const [
      totalSolved,
      inProgress,
      favorites,
      recentActivity,
      inProgressPuzzles,
      favoritePuzzles
    ] = await Promise.all([
      pool.query(
        `SELECT COUNT(*) FROM user_puzzle_states 
         WHERE user_id = $1 AND completed = true`,
        [userId]
      ),
      pool.query(
        `SELECT COUNT(*) FROM user_puzzle_states 
         WHERE user_id = $1 AND completed = false`,
        [userId]
      ),
      pool.query(
        `SELECT COUNT(*) FROM user_puzzle_states 
         WHERE user_id = $1 AND is_favorite = true`,
        [userId]
      ),
      pool.query(
        `SELECT * FROM user_puzzle_states 
         WHERE user_id = $1 
         ORDER BY last_played_at DESC 
         LIMIT 5`,
        [userId]
      ),
      pool.query(
        `SELECT * FROM user_puzzle_states 
         WHERE user_id = $1 AND completed = false 
         ORDER BY last_played_at DESC`,
        [userId]
      ),
      pool.query(
        `SELECT * FROM user_puzzle_states 
         WHERE user_id = $1 AND is_favorite = true 
         ORDER BY last_played_at DESC`,
        [userId]
      )
    ])

    return NextResponse.json({
      stats: {
        totalSolved: parseInt(totalSolved.rows[0].count),
        inProgress: parseInt(inProgress.rows[0].count),
        favorites: parseInt(favorites.rows[0].count)
      },
      recentActivity: recentActivity.rows,
      inProgressPuzzles: inProgressPuzzles.rows,
      favoritePuzzles: favoritePuzzles.rows
    })
  } catch (error) {
    return new NextResponse('Internal Server Error', { status: 500 })
  }
} 