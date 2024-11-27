import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    const { data: { session } } = await supabase.auth.getSession()

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { favorite } = await request.json()
    const puzzleId = params.id

    const { data, error } = await supabase
      .from('puzzle_favorites')
      .upsert({
        user_id: session.user.id,
        puzzle_id: puzzleId,
        is_favorite: favorite
      })

    if (error) throw error

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error('Favorite puzzle error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}