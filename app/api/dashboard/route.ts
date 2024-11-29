import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get all puzzle progress with puzzle details
    const { data: allProgress } = await supabase
      .from('puzzle_progress')
      .select(`
        *,
        puzzle:puzzles!left (
          id,
          title,
          author,
          date
        )
      `)
      .eq('user_id', user.id)
      .order('last_played_at', { ascending: false })

    // Separate completed and in-progress puzzles
    const completedPuzzles = allProgress?.filter(p => p.completed) || []
    const inProgressPuzzles = allProgress?.filter(p => !p.completed) || []

    // Get favorites count
    const { count: favorites } = await supabase
      .from('puzzle_favorites')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .eq('is_favorite', true)

    // Get recent activity (last 10 puzzles)
    const recentActivity = allProgress?.slice(0, 10) || []

    // Calculate completion rate
    const totalAttempted = allProgress?.length || 0
    const completionRate = totalAttempted > 0 
      ? Math.round((completedPuzzles.length / totalAttempted) * 100) 
      : 0

    return NextResponse.json({
      stats: {
        totalAttempted,
        totalSolved: completedPuzzles.length,
        inProgress: inProgressPuzzles.length,
        favorites: favorites || 0,
        completionRate
      },
      recentActivity,
      completedPuzzles,
      inProgressPuzzles
    })
  } catch (err) {
    console.error('Error fetching dashboard data:', err)
    return NextResponse.json({ error: 'Failed to fetch dashboard data' }, { status: 500 })
  }
}