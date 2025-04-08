import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Star, Users, Award, TrendingUp } from "lucide-react"
import type { CommunityStats, UserStats } from "@/types/stats-types"

interface UserStatsOverviewProps {
  stats: {
    totalUsers: number;
    newUsersThisWeek: number;
    totalRatings: number;
    newRatingsThisWeek: number;
    averageRating: number;
    activeUsers: number;
    roleBreakdown: {
      role: string;
      percentage: number;
    }[];
    ratingDistribution: {
      range: string;
      percentage: number;
    }[];
  }
}

export default function UserStatsOverview({ stats }: UserStatsOverviewProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Community Stats</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-gray-900 p-4 rounded-lg border border-gray-800">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-400">Total Users</h3>
              <Users className="w-5 h-5 text-blue-400" />
            </div>
            <p className="text-2xl font-bold">{stats.totalUsers.toLocaleString()}</p>
            <p className="text-xs text-gray-500 mt-1">
              <span className="text-green-400">+{stats.newUsersThisWeek}</span> this week
            </p>
          </div>

          <div className="bg-gray-900 p-4 rounded-lg border border-gray-800">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-400">Total Ratings</h3>
              <Star className="w-5 h-5 text-amber-400" />
            </div>
            <p className="text-2xl font-bold">{stats.totalRatings.toLocaleString()}</p>
            <p className="text-xs text-gray-500 mt-1">
              <span className="text-green-400">+{stats.newRatingsThisWeek}</span> this week
            </p>
          </div>

          <div className="bg-gray-900 p-4 rounded-lg border border-gray-800">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-400">Avg. Rating</h3>
              <Award className="w-5 h-5 text-green-400" />
            </div>
            <p className="text-2xl font-bold">{stats.averageRating.toFixed(1)}</p>
            <p className="text-xs text-gray-500 mt-1">across all battlers</p>
          </div>

          <div className="bg-gray-900 p-4 rounded-lg border border-gray-800">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-400">Active Users</h3>
              <TrendingUp className="w-5 h-5 text-purple-400" />
            </div>
            <p className="text-2xl font-bold">{stats.activeUsers.toLocaleString()}</p>
            <p className="text-xs text-gray-500 mt-1">in the last 30 days</p>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-900 p-4 rounded-lg border border-gray-800">
            <h3 className="text-sm font-medium text-gray-400 mb-3">Most Active User Roles</h3>
            <div className="space-y-3">
              {stats.roleBreakdown.map((role) => (
                <div key={role.role} className="flex items-center">
                  <div className="w-24 text-sm">{role.role}</div>
                  <div className="flex-1 h-2 bg-gray-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${
                        role.role === "Media"
                          ? "bg-purple-500"
                          : role.role === "Battler"
                            ? "bg-green-500"
                            : role.role === "League Owner"
                              ? "bg-amber-500"
                              : "bg-blue-500"
                      }`}
                      style={{ width: `${role.percentage}%` }}
                    ></div>
                  </div>
                  <div className="w-12 text-right text-sm">{role.percentage}%</div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gray-900 p-4 rounded-lg border border-gray-800">
            <h3 className="text-sm font-medium text-gray-400 mb-3">Rating Distribution</h3>
            <div className="space-y-3">
              {stats.ratingDistribution.map((range) => (
                <div key={range.range} className="flex items-center">
                  <div className="w-24 text-sm">{range.range}</div>
                  <div className="flex-1 h-2 bg-gray-800 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-500" style={{ width: `${range.percentage}%` }}></div>
                  </div>
                  <div className="w-12 text-right text-sm">{range.percentage}%</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

