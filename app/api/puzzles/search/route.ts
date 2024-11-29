import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    const { searchParams } = new URL(request.url)
    
    const author = searchParams.get('author')
    const date = searchParams.get('date')
    const year = searchParams.get('year')

    let query = supabase
      .from('puzzles')
      .select('*')

    if (author) {
      query = query.ilike('author', `%${author}%`)
    }

    if (date) {
      query = query.eq('date', date)
    }

    if (year) {
      query = query.gte('date', `${year}-01-01`).lte('date', `${year}-12-31`)
    }

    const { data: puzzles, error } = await query.order('date', { ascending: false })

    if (error) throw error

    return NextResponse.json(puzzles)
  } catch (error) {
    console.error('Error searching puzzles:', error)
    return NextResponse.json(
      { error: 'Failed to search puzzles' },
      { status: 500 }
    )
  }
} 