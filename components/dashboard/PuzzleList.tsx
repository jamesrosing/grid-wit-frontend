'use client'

import { LucideIcon } from 'lucide-react'
import Link from 'next/link'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

interface Puzzle {
  id: string
  title: string
  author: string
  date: string
  difficulty?: string
  puzzle_favorites?: Array<{ is_favorite: boolean }>
  puzzle_progress?: Array<{
    completed: boolean
    last_played_at: string
  }>
}

export interface PuzzleListProps {
  title: string
  description: string
  icon?: LucideIcon
  puzzles: Puzzle[]
}

export function PuzzleList({ title, description, icon: Icon, puzzles }: PuzzleListProps) {
  if (!puzzles?.length) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
            <CardTitle>{title}</CardTitle>
          </div>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">No puzzles found.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center space-x-2">
          {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
          <CardTitle>{title}</CardTitle>
        </div>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {puzzles.map((puzzle) => (
            <div
              key={puzzle.id}
              className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent"
            >
              <div className="space-y-1">
                <Link
                  href={`/puzzle/${puzzle.id}`}
                  className="text-sm font-medium leading-none hover:underline"
                >
                  {puzzle.title || `Puzzle #${puzzle.id}`}
                </Link>
                <p className="text-sm text-muted-foreground">
                  By {puzzle.author} • {new Date(puzzle.date).toLocaleDateString()}
                </p>
                {puzzle.difficulty && (
                  <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
                    {puzzle.difficulty}
                  </span>
                )}
              </div>
              <div className="flex items-center space-x-2">
                {puzzle.puzzle_progress?.[0]?.completed && (
                  <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900/20 dark:text-green-400">
                    Completed
                  </span>
                )}
                {puzzle.puzzle_favorites?.[0]?.is_favorite && (
                  <span className="inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400">
                    Favorite
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
} 