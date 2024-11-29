'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { CalendarDays, Star, Clock, Loader2 } from 'lucide-react'
import Link from 'next/link'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface DashboardData {
  stats: {
    totalSolved: number
    inProgress: number
    favorites: number
  }
  recentActivity: Array<{
    id: string
    puzzle_id: string
    completed: boolean
    last_played_at: string
  }>
  inProgressPuzzles: Array<{
    id: string
    puzzle_id: string
    last_played_at: string
  }>
  favoritePuzzles: Array<{
    id: string
    puzzle_id: string
    created_at: string
  }>
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
          <TabsTrigger value="analytics" disabled>Analytics</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">In Progress</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{dashboardData.stats.inProgress}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Favorites</CardTitle>
                <Star className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{dashboardData.stats.favorites}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Solved</CardTitle>
                <CalendarDays className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{dashboardData.stats.totalSolved}</div>
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
                  {dashboardData.recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-center">
                      <CalendarDays className="mr-4 h-4 w-4 text-muted-foreground" />
                      <div className="flex-1 space-y-1">
                        <p className="text-sm font-medium leading-none">
                          {activity.completed ? 'Completed' : 'Started'} Puzzle #{activity.puzzle_id}
                        </p>
                        <p className="text-sm text-muted-foreground">
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
              <CardContent>
                <Link 
                  href="/puzzles"
                  className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-zinc-900 text-zinc-50 hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200 h-10 px-4 py-2"
                >
                  Browse Puzzles
                </Link>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}