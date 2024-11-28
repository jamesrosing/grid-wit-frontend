import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

// GET /api/bookmarks - Get user's bookmarked puzzles
export async function GET() {
  try {
    const supabase = createRouteHandlerClient({ cookies })

    // Get the current user's ID
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { data: bookmarks } = await supabase
      .from('puzzle_bookmarks')
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
  } catch (error) {
    return NextResponse.json(
      { error: 'Error fetching bookmarks' },
      { status: 500 }
    )
  }
}

// POST /api/bookmarks - Add a bookmark
export async function POST(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    const { puzzle_id } = await request.json()

    // Get the current user's ID
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { data, error } = await supabase
      .from('puzzle_bookmarks')
      .insert({ 
        puzzle_id,
        user_id: user.id 
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json(
      { error: 'Error creating bookmark' },
      { status: 500 }
    )
  }
}

// DELETE /api/bookmarks - Remove a bookmark
export async function DELETE(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    const { puzzle_id } = await request.json()

    // Get the current user's ID
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { error } = await supabase
      .from('puzzle_bookmarks')
      .delete()
      .match({ 
        puzzle_id,
        user_id: user.id 
      })

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      { error: 'Error deleting bookmark' },
      { status: 500 }
    )
  }
}
