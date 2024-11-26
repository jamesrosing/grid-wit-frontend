import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

// GET /api/bookmarks - Get user's bookmarked puzzles
export async function GET() {
  try {
    const supabase = createRouteHandlerClient({ cookies })

    const { data: bookmarks, error } = await supabase
      .from('puzzle_bookmarks')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error

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

    const { data, error } = await supabase
      .from('puzzle_bookmarks')
      .insert({ puzzle_id })
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

    const { error } = await supabase
      .from('puzzle_bookmarks')
      .delete()
      .match({ puzzle_id })

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      { error: 'Error deleting bookmark' },
      { status: 500 }
    )
  }
}
