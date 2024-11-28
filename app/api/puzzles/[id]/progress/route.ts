import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    const { data: { session } } = await supabase.auth.getSession()

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { progress, completed } = await request.json()
    const puzzleId = params.id

    const result = await supabase
      .from('user_puzzle_states')
      .upsert({
        user_id: session.user.id,
        puzzle_id: puzzleId,
        progress,
        completed,
      })
      .select()
      .single()
    return NextResponse.json(result)
  } catch (error) {
    console.error('Save puzzle progress error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}