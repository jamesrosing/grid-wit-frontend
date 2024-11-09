import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import * as PuzzleState from '@/lib/puzzle-state'

export async function GET() {
  const { userId } = await auth()
  if (!userId) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  try {
    const states = await PuzzleState.getUserPuzzleStates(userId)
    return NextResponse.json(states)
  } catch (error) {
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}

export async function POST(req: Request) {
  const { userId } = await auth()
  if (!userId) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  try {
    const { puzzleId, progress } = await req.json()
    const state = await PuzzleState.savePuzzleState(userId, puzzleId, progress)
    return NextResponse.json(state)
  } catch (error) {
    return new NextResponse('Internal Server Error', { status: 500 })
  }
} 