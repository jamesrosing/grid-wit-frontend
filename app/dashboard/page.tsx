'use client'

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CalendarDays, Star, Clock, Trophy, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import type { DashboardData } from '@/types'

export default function DashboardPage() {
  const router = useRouter()
  const supabase = createClientComponentClient()
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadDashboard() {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (!session) {
          router.replace('/login')
          return
        }

        const { data: recentActivity } = await supabase
          .from('puzzle_progress')
          .select('*')
          .eq('user_id', session.user.id)
          .order('last_played_at', { ascending: false })
          .limit(5)

        const { data: inProgress } = await supabase
          .from('puzzle_progress')
          .select('*')
          .eq('user_id', session.user.id)
          .eq('completed', false)
          .order('last_played_at', { ascending: false })

        const { data: favorites } = await supabase
          .from('puzzle_favorites')
          .select('*')
          .eq('user_id', session.user.id)
          .eq('is_favorite', true)

        setDashboardData({
          recentActivity: recentActivity || [],
          inProgressPuzzles: inProgress || [],
          favoritePuzzles: favorites || []
        })
      } catch (err) {
        setError('Failed to load dashboard data')
        console.error('Dashboard error:', err)
      } finally {
        setLoading(false)
      }
    }

    loadDashboard()
  }, [supabase, router])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-zinc-400" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">{error}</p>
      </div>
    )
  }

  if (!dashboardData) return null

  return (
    <div className="space-y-4">
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="stats">Statistics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          {/* Stats Overview */}
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">In Progress</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{dashboardData.inProgressPuzzles.length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Favorites</CardTitle>
                <Star className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{dashboardData.favoritePuzzles.length}</div>
              </CardContent>
            </Card>
          </div>

          {/* Daily Puzzle Card */}
          <Card>
            <CardHeader>
              <CardTitle>Daily Puzzle</CardTitle>
              <CardDescription>Today&apos;s challenge awaits!</CardDescription>
            </CardHeader>
            <CardContent>
              <Link 
                href="/"
                className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-zinc-900 text-zinc-50 hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200 h-10 px-4 py-2"
              >
                Start Puzzle
              </Link>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Your puzzle solving history</CardDescription>
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
        </TabsContent>

        <TabsContent value="stats" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Statistics</CardTitle>
              <CardDescription>Your puzzle solving statistics</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}