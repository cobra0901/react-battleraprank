"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Trophy, TrendingUp, BarChart2 } from "lucide-react"
import { getLeaderboard } from "@/lib/stats-service"
import type { LeaderboardEntry } from "@/types/stats-types"

export default function UserLeaderboard() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [filteredLeaderboard, setFilteredLeaderboard] = useState<LeaderboardEntry[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const data = await getLeaderboard()
        setLeaderboard(data)
        setFilteredLeaderboard(data)
      } catch (error) {
        console.error("Error fetching leaderboard:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchLeaderboard()
  }, [])

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value
    setSearchQuery(query)

    if (query.trim() === "") {
      setFilteredLeaderboard(leaderboard)
    } else {
      const filtered = leaderboard.filter(
        (entry) =>
          entry.displayName.toLowerCase().includes(query.toLowerCase()) ||
          entry.username.toLowerCase().includes(query.toLowerCase()),
      )
      setFilteredLeaderboard(filtered)
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <CardTitle className="text-xl flex items-center gap-2">
              <Trophy className="h-5 w-5 text-yellow-500" />
              User Leaderboard
            </CardTitle>
            <CardDescription>Top contributors ranked by ratings and influence</CardDescription>
          </div>
          <div className="relative w-full md:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search users..."
              className="pl-8 bg-gray-800 border-gray-700"
              value={searchQuery}
              onChange={handleSearch}
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="overall" className="space-y-4">
          <TabsList className="bg-gray-900 border border-gray-800">
            <TabsTrigger value="overall">
              <Trophy className="h-4 w-4 mr-2" />
              Overall
            </TabsTrigger>
            <TabsTrigger value="consistency">
              <BarChart2 className="h-4 w-4 mr-2" />
              Consistency
            </TabsTrigger>
            <TabsTrigger value="influence">
              <TrendingUp className="h-4 w-4 mr-2" />
              Influence
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overall" className="space-y-4">
            {isLoading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
              </div>
            ) : filteredLeaderboard.length === 0 ? (
              <div className="text-center py-8 text-gray-400">No users found</div>
            ) : (
              <div className="space-y-2">
                {filteredLeaderboard
                  .sort((a, b) => a.rank - b.rank)
                  .map((entry, index) => (
                    <div
                      key={entry.userId}
                      className="flex items-center justify-between p-3 rounded-lg bg-gray-900 border border-gray-800"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-800 text-sm font-semibold">
                          {entry.rank}
                        </div>
                        <div className="relative w-10 h-10 rounded-full overflow-hidden">
                          <Image
                            src={entry.profileImage || "/placeholder.svg"}
                            alt={entry.displayName}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <Link href={`/profile/${entry.username}`} className="font-medium hover:underline">
                            {entry.displayName}
                          </Link>
                          <p className="text-sm text-gray-400">@{entry.username}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">{entry.totalRatings}</div>
                        <div className="text-sm text-gray-400">Ratings</div>
                      </div>
                    </div>
                  ))}
              </div>
            )}

            <div className="flex justify-center pt-2">
              <Button variant="outline" size="sm">
                View All Rankings
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="consistency" className="space-y-4">
            {isLoading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
              </div>
            ) : filteredLeaderboard.length === 0 ? (
              <div className="text-center py-8 text-gray-400">No users found</div>
            ) : (
              <div className="space-y-2">
                {filteredLeaderboard
                  .sort((a, b) => (b.consistency ?? 0) - (a.consistency ?? 0))
                  .map((entry, index) => (
                    <div
                      key={entry.userId}
                      className="flex items-center justify-between p-3 rounded-lg bg-gray-900 border border-gray-800"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-800 text-sm font-semibold">
                          {index + 1}
                        </div>
                        <div className="relative w-10 h-10 rounded-full overflow-hidden">
                          <Image
                            src={entry.profileImage || "/placeholder.svg"}
                            alt={entry.displayName}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <Link href={`/profile/${entry.username}`} className="font-medium hover:underline">
                            {entry.displayName}
                          </Link>
                          <p className="text-sm text-gray-400">@{entry.username}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">{entry.consistency}</div>
                        <div className="text-sm text-gray-400">Consistency</div>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="influence" className="space-y-4">
            {isLoading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
              </div>
            ) : filteredLeaderboard.length === 0 ? (
              <div className="text-center py-8 text-gray-400">No users found</div>
            ) : (
              <div className="space-y-2">
                {filteredLeaderboard
                  .sort((a, b) => (b.influence ?? 0) - (a.influence ?? 0))
                  .map((entry, index) => (
                    <div
                      key={entry.userId}
                      className="flex items-center justify-between p-3 rounded-lg bg-gray-900 border border-gray-800"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-800 text-sm font-semibold">
                          {index + 1}
                        </div>
                        <div className="relative w-10 h-10 rounded-full overflow-hidden">
                          <Image
                            src={entry.profileImage || "/placeholder.svg"}
                            alt={entry.displayName}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <Link href={`/profile/${entry.username}`} className="font-medium hover:underline">
                            {entry.displayName}
                          </Link>
                          <p className="text-sm text-gray-400">@{entry.username}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">{entry.influence}</div>
                        <div className="text-sm text-gray-400">Influence</div>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

