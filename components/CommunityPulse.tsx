"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, TrendingUp, MessageSquare, Award } from "lucide-react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "@/components/ui/chart"

interface CommunityStats {
  totalRatings: number
  activeUsers: number
  recentBattles: number
  topBadges: { badge: string; count: number }[]
  activityData: { date: string; ratings: number }[]
}

export default function CommunityPulse() {
  const [stats, setStats] = useState<CommunityStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Mock data for community stats
    const mockStats: CommunityStats = {
      totalRatings: 12458,
      activeUsers: 843,
      recentBattles: 24,
      topBadges: [
        { badge: "Wordsmith", count: 342 },
        { badge: "Puncher", count: 287 },
        { badge: "Performance", count: 256 },
        { badge: "Consistent", count: 198 },
        { badge: "Crowd Control", count: 176 },
      ],
      activityData: [
        { date: "Jan", ratings: 720 },
        { date: "Feb", ratings: 832 },
        { date: "Mar", ratings: 901 },
        { date: "Apr", ratings: 934 },
        { date: "May", ratings: 1290 },
        { date: "Jun", ratings: 1330 },
        { date: "Jul", ratings: 1450 },
      ],
    }

    setStats(mockStats)
    setIsLoading(false)
  }, [])

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-pulse">
        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="p-4 h-64"></CardContent>
        </Card>
        <Card className="bg-gray-900 border-gray-800 md:col-span-2">
          <CardContent className="p-4 h-64"></CardContent>
        </Card>
      </div>
    )
  }

  if (!stats) return null

  return (
    <div>
      <div className="flex items-center mb-4">
        <Users className="w-5 h-5 mr-2 text-blue-400" />
        <h2 className="text-2xl font-bold">Community Pulse</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-lg">Community Stats</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <MessageSquare className="w-4 h-4 mr-2 text-purple-400" />
                <span>Total Ratings</span>
              </div>
              <span className="font-bold">{stats.totalRatings.toLocaleString()}</span>
            </div>

            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <Users className="w-4 h-4 mr-2 text-blue-400" />
                <span>Active Users</span>
              </div>
              <span className="font-bold">{stats.activeUsers.toLocaleString()}</span>
            </div>

            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <TrendingUp className="w-4 h-4 mr-2 text-green-400" />
                <span>Recent Battles</span>
              </div>
              <span className="font-bold">{stats.recentBattles}</span>
            </div>

            <div className="pt-2">
              <div className="flex items-center mb-2">
                <Award className="w-4 h-4 mr-2 text-yellow-400" />
                <span>Top Badges</span>
              </div>
              <div className="flex flex-wrap gap-1">
                {stats.topBadges.map((item) => (
                  <Badge key={item.badge} className="bg-gray-800 text-gray-300">
                    {item.badge} ({item.count})
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800 md:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">Rating Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={stats.activityData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="date" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1F2937",
                      borderColor: "#374151",
                      color: "#E5E7EB",
                    }}
                  />
                  <Line type="monotone" dataKey="ratings" stroke="#8B5CF6" strokeWidth={2} activeDot={{ r: 8 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

