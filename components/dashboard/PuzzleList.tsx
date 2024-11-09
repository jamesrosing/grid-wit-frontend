'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CalendarDays, Star } from 'lucide-react'
import Link from 'next/link'

interface PuzzleItem {
  id: number
  puzzle_id: number
  last_played_at: string
  completed: boolean
  is_favorite: boolean
}

interface PuzzleListProps {
  title: string
  description: string
  puzzles: PuzzleItem[]
}

export function PuzzleList({ title, description, puzzles }: PuzzleListProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <p className="text-sm text-zinc-500">{description}</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {puzzles.map((puzzle) => (
            <div 
              key={puzzle.id} 
              className="flex items-center justify-between p-2 hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
            >
              <div className="flex items-center gap-4">
                <CalendarDays className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Puzzle #{puzzle.puzzle_id}</p>
                  <p className="text-xs text-muted-foreground">
                    Last played {new Date(puzzle.last_played_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {puzzle.is_favorite && (
                  <Star className="h-4 w-4 fill-current text-yellow-400" />
                )}
                <Link
                  href={`/puzzle/${puzzle.puzzle_id}`}
                  className="text-xs px-2 py-1 bg-zinc-900 text-zinc-50 dark:bg-zinc-50 dark:text-zinc-900 hover:opacity-90"
                >
                  {puzzle.completed ? 'Review' : 'Continue'}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
} 