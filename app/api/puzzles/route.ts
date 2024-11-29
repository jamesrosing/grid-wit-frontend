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

    const { data: puzzles } = await supabase
      .from('puzzles')
      .select(`
        id,
        title,
        author,
        date,
        difficulty,
        puzzle_favorites!left (
          is_favorite
        ),
        puzzle_progress!left (
          completed,
          last_played_at
        )
      `)
      .eq('puzzle_favorites.user_id', user.id)
      .eq('puzzle_progress.user_id', user.id)
      .order('date', { ascending: false })

    return NextResponse.json(puzzles || [])
  } catch (err) {
    console.error('Error fetching puzzles:', err)
    return NextResponse.json({ error: 'Failed to fetch puzzles' }, { status: 500 })
  }
} 