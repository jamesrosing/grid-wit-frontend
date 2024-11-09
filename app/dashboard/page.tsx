import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CalendarDays, Star, Clock, BookmarkIcon, Trophy, LayoutDashboard } from 'lucide-react'
import Link from 'next/link'
import { getDashboardData } from '@/lib/api'
import { PuzzleList } from '@/components/dashboard/PuzzleList'

interface DashboardData {
  stats: {
    totalSolved: number
    inProgress: number
    favorites: number
  }
  recentActivity: Array<{
    id: number
    completed: boolean
    last_played_at: string
    puzzle_id: number
  }>
  inProgressPuzzles: Array<{
    id: number
    puzzle_id: number
    last_played_at: string
    completed: boolean
    is_favorite: boolean
  }>
  favoritePuzzles: Array<{
    id: number
    puzzle_id: number
    last_played_at: string
    completed: boolean
    is_favorite: boolean
  }>
}

export default async function DashboardPage() {
  const { userId } = await auth()
  if (!userId) {
    redirect('/sign-in')
  }

  try {
    const dashboardData = await getDashboardData()

    return (
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">Dashboard</h2>
        </div>
        
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="puzzles">My Puzzles</TabsTrigger>
            <TabsTrigger value="stats">Statistics</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            {/* Quick Stats */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Solved</CardTitle>
                  <Trophy className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{dashboardData.stats.totalSolved}</div>
                </CardContent>
              </Card>
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
            </div>

            {/* Daily Puzzle Card */}
            <Card>
              <CardHeader>
                <CardTitle>Daily Puzzle</CardTitle>
                <CardDescription>Today's challenge awaits!</CardDescription>
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

          {/* We'll implement these tabs next */}
          <TabsContent value="puzzles" className="space-y-4">
            {/* In Progress Puzzles */}
            <PuzzleList
              title="In Progress"
              description="Puzzles you're currently working on"
              puzzles={dashboardData.inProgressPuzzles}
            />

            {/* Favorite Puzzles */}
            <PuzzleList
              title="Favorites"
              description="Your favorite puzzles"
              puzzles={dashboardData.favoritePuzzles}
            />
          </TabsContent>

          <TabsContent value="stats" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Solving Statistics</CardTitle>
                <p className="text-sm text-zinc-500">Your puzzle solving performance</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium">Average Time</p>
                      <p className="text-2xl font-bold">12:34</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Best Time</p>
                      <p className="text-2xl font-bold">08:15</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium mb-2">Completion Rate</p>
                    <div className="h-2 bg-zinc-100 dark:bg-zinc-800 rounded-full">
                      <div 
                        className="h-full bg-zinc-900 dark:bg-zinc-50 rounded-full"
                        style={{ width: `${(dashboardData.stats.totalSolved / (dashboardData.stats.totalSolved + dashboardData.stats.inProgress)) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    )
  } catch (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-red-500">Failed to load dashboard data</p>
      </div>
    )
  }
} 