"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, TrendingDown, Eye, ThumbsUp, MessageSquare, BarChart } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"

interface BattlerStats {
  averageRating: number
  ratingChange: number
  totalViews: number
  totalLikes: number
  totalComments: number
  battlesRated: number
}

export default function QuickStatsWidget() {
  const { user } = useAuth()
  const [stats, setStats] = useState<BattlerStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // In a real app, this would fetch from an API
    // For now, we'll use mock data
    const fetchStats = async () => {
      setIsLoading(true)

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500))

      setStats({
        averageRating: 8.7,
        ratingChange: 0.3,
        totalViews: 12450,
        totalLikes: 876,
        totalComments: 124,
        battlesRated: 15,
      })

      setIsLoading(false)
    }

    if (user ) {
      fetchStats()
    }
  }, [user])

  //   if (user && user.roles?.battler) {
  //     fetchStats()
  //   }
  // }, [user])

  // if (!user || !user.roles?.battler || isLoading) {
  //   return null
  // }

  return (
    <Card className="bg-gray-900 border-gray-800">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Your Performance</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-1">
              <BarChart className="h-4 w-4 text-blue-400" />
              <span className="text-sm font-medium">Rating</span>
            </div>
            <div className="flex items-center">
              <span className="text-2xl font-bold">{stats?.averageRating.toFixed(1)}</span>
              {/* <div
                className={`ml-2 flex items-center text-xs ${stats?.ratingChange >= 0 ? "text-green-400" : "text-red-400"}`}
              >
                {stats?.ratingChange >= 0 ? (
                  <TrendingUp className="h-3 w-3 mr-1" />
                ) : (
                  <TrendingDown className="h-3 w-3 mr-1" />
                )}
                {Math.abs(stats?.ratingChange || 0).toFixed(1)}
              </div> */}
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-1">
              <Eye className="h-4 w-4 text-purple-400" />
              <span className="text-sm font-medium">Views</span>
            </div>
            <div className="text-2xl font-bold">{stats?.totalViews.toLocaleString()}</div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-1">
              <ThumbsUp className="h-4 w-4 text-amber-400" />
              <span className="text-sm font-medium">Likes</span>
            </div>
            <div className="text-2xl font-bold">{stats?.totalLikes.toLocaleString()}</div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-1">
              <MessageSquare className="h-4 w-4 text-green-400" />
              <span className="text-sm font-medium">Comments</span>
            </div>
            <div className="text-2xl font-bold">{stats?.totalComments.toLocaleString()}</div>
          </div>

          <div className="space-y-1 col-span-2">
            <div className="flex items-center gap-1">
              <BarChart className="h-4 w-4 text-red-400" />
              <span className="text-sm font-medium">Battles Rated</span>
            </div>
            <div className="text-2xl font-bold">{stats?.battlesRated.toLocaleString()}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

