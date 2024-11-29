import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get in-progress puzzles with puzzle details
    const { data: inProgress } = await supabase
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
      .eq('completed', false)
      .order('last_played_at', { ascending: false })
      .limit(5)

    // Get completed puzzles count
    const { count: totalSolved } = await supabase
      .from('puzzle_progress')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .eq('completed', true)

    // Get favorites count
    const { count: favorites } = await supabase
      .from('puzzle_favorites')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .eq('is_favorite', true)

    // Get recent activity with puzzle details
    const { data: recentActivity } = await supabase
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
      .limit(10)

    return NextResponse.json({
      stats: {
        totalSolved: totalSolved || 0,
        inProgress: inProgress?.length || 0,
        favorites: favorites || 0
      },
      recentActivity: recentActivity || [],
      inProgressPuzzles: inProgress || []
    })
  } catch (err) {
    console.error('Error fetching dashboard data:', err)
    return NextResponse.json({ error: 'Failed to fetch dashboard data' }, { status: 500 })
  }
}