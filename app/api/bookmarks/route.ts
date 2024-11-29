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

    const { data: bookmarks } = await supabase
      .from('puzzle_favorites')
      .select(`
        *,
        puzzle:puzzles (
          id,
          title,
          author,
          date,
          grid,
          clues
        )
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
    
    return NextResponse.json(bookmarks)
  } catch (err) {
    console.error('Error fetching bookmarks:', err)
    return NextResponse.json({ error: 'Failed to fetch bookmarks' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    const { puzzle_id } = await request.json()
    
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: bookmark } = await supabase
      .from('puzzle_favorites')
      .insert({ 
        puzzle_id,
        user_id: user.id,
        is_favorite: true,
        created_at: new Date().toISOString()
      })
      .single()
    
    return NextResponse.json(bookmark)
  } catch (err) {
    console.error('Error creating bookmark:', err)
    return NextResponse.json({ error: 'Failed to create bookmark' }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    const { puzzle_id } = await request.json()
    
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await supabase
      .from('puzzle_favorites')
      .delete()
      .match({ 
        puzzle_id,
        user_id: user.id 
      })
    
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Error deleting bookmark:', err)
    return NextResponse.json({ error: 'Failed to delete bookmark' }, { status: 500 })
  }
}
