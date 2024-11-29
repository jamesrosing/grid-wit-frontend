'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { CalendarDays, Star, Clock, Loader2, CheckCircle2, Trophy } from 'lucide-react'
import Link from 'next/link'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"

interface PuzzleProgress {
  id: string
  puzzle_id: string
  completed: boolean
  last_played_at: string
  puzzle: {
    id: string
    title: string
    author: string
    date: string
  }
}

interface DashboardData {
  stats: {
    totalAttempted: number
    totalSolved: number
    inProgress: number
    favorites: number
    completionRate: number
  }
  recentActivity: PuzzleProgress[]
  completedPuzzles: PuzzleProgress[]
  inProgressPuzzles: PuzzleProgress[]
}

export default function DashboardPage() {
  const router = useRouter()
  const supabase = createClientComponentClient()
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadDashboardData() {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (!session) {
          router.push('/login')
          return
        }

        const response = await fetch('/api/dashboard')
        if (!response.ok) {
          throw new Error('Failed to fetch dashboard data')
        }
        const data = await response.json()
        setDashboardData(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load dashboard')
      } finally {
        setLoading(false)
      }
    }

    loadDashboardData()
  }, [router, supabase])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-zinc-400" />
      </div>
    )
  }

  if (error || !dashboardData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
          {error || 'Failed to load dashboard'}
        </h1>
      </div>
    )
  }

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
      </div>
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="in-progress">In Progress</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Attempted</CardTitle>
                <CalendarDays className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{dashboardData?.stats.totalAttempted}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Completed</CardTitle>
                <Trophy className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{dashboardData?.stats.totalSolved}</div>
                <Progress value={dashboardData?.stats.completionRate} className="mt-2" />
                <p className="text-xs text-muted-foreground mt-1">
                  {dashboardData?.stats.completionRate}% completion rate
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">In Progress</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{dashboardData?.stats.inProgress}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Favorites</CardTitle>
                <Star className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{dashboardData?.stats.favorites}</div>
              </CardContent>
            </Card>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-8">
                  {dashboardData?.recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-center">
                      {activity.completed ? (
                        <CheckCircle2 className="mr-4 h-4 w-4 text-green-500" />
                      ) : (
                        <Clock className="mr-4 h-4 w-4 text-blue-500" />
                      )}
                      <div className="flex-1 space-y-1">
                        <Link 
                          href={`/puzzles/${activity.puzzle_id}`}
                          className="text-sm font-medium leading-none hover:underline"
                        >
                          {activity.puzzle.title || `Puzzle #${activity.puzzle_id}`}
                        </Link>
                        <p className="text-sm text-muted-foreground">
                          {activity.completed ? 'Completed' : 'Last played'} on{' '}
                          {new Date(activity.last_played_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Start a New Puzzle</CardTitle>
                <CardDescription>
                  Choose from our collection of crossword puzzles
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <Link 
                  href="/"
                  className="inline-flex w-full items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-zinc-900 text-zinc-50 hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200 h-10 px-4 py-2"
                >
                  Daily Puzzle
                </Link>
                <Link 
                  href="/puzzles/random"
                  className="inline-flex w-full items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-zinc-900 text-zinc-50 hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200 h-10 px-4 py-2"
                >
                  Random Puzzle
                </Link>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="completed" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Completed Puzzles</CardTitle>
              <CardDescription>
                All puzzles you have successfully completed
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {dashboardData?.completedPuzzles.map((puzzle) => (
                  <div key={puzzle.id} className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                      <div>
                        <Link 
                          href={`/puzzles/${puzzle.puzzle_id}`}
                          className="text-sm font-medium leading-none hover:underline"
                        >
                          {puzzle.puzzle.title || `Puzzle #${puzzle.puzzle_id}`}
                        </Link>
                        <p className="text-sm text-muted-foreground">
                          by {puzzle.puzzle.author}
                        </p>
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Completed on {new Date(puzzle.last_played_at).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="in-progress" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>In Progress Puzzles</CardTitle>
              <CardDescription>
                Puzzles you have started but not yet completed
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {dashboardData?.inProgressPuzzles.map((puzzle) => (
                  <div key={puzzle.id} className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <Clock className="h-4 w-4 text-blue-500" />
                      <div>
                        <Link 
                          href={`/puzzles/${puzzle.puzzle_id}`}
                          className="text-sm font-medium leading-none hover:underline"
                        >
                          {puzzle.puzzle.title || `Puzzle #${puzzle.puzzle_id}`}
                        </Link>
                        <p className="text-sm text-muted-foreground">
                          by {puzzle.puzzle.author}
                        </p>
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Last played on {new Date(puzzle.last_played_at).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}