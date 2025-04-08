"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Trophy, TrendingUp, TrendingDown, Calendar, Filter, Tag, X } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"

interface Battler {
  id: string
  name: string
  image: string
  location: string
  weightedRating: number
  unweightedRating: number
  change: number
  lastUpdated: string
  badges: string[]
  tags: string[]
  userType?: "media" | "battler" | "league_owner" | "admin"
}

interface RankingSystemProps {
  compact?: boolean
  showTitle?: string
}

export default function RankingSystem({ compact = false, showTitle }: RankingSystemProps) {
  const [timeFrame, setTimeFrame] = useState<"all" | "month" | "week" | "day">("month")
  const [rankingType, setRankingType] = useState<"weighted" | "unweighted">("weighted")
  const [battlers, setBattlers] = useState<Battler[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [filter, setFilter] = useState<"all" | "trending-up" | "trending-down">("all")
  const [availableTags, setAvailableTags] = useState<string[]>([])
  const [selectedTags, setSelectedTags] = useState<string[]>([])

  useEffect(() => {
    // Mock data for battlers
    const mockBattlers: Battler[] = [
      {
        id: "1",
        name: "Loaded Lux",
        image: "/placeholder.svg?height=300&width=300",
        location: "Harlem, NY",
        weightedRating: 9.2,
        unweightedRating: 8.9,
        change: 0.3,
        lastUpdated: "2 days ago",
        badges: ["Wordsmith", "Scheme King"],
        tags: ["URL", "Veteran", "East Coast"],
        userType: "battler",
      },
      {
        id: "2",
        name: "Geechi Gotti",
        image: "/placeholder.svg?height=300&width=300",
        location: "Compton, CA",
        weightedRating: 9.0,
        unweightedRating: 9.1,
        change: 0.5,
        lastUpdated: "1 day ago",
        badges: ["Authentic", "Consistent"],
        tags: ["URL", "West Coast", "COTY"],
      },
      {
        id: "3",
        name: "Rum Nitty",
        image: "/placeholder.svg?height=300&width=300",
        location: "Phoenix, AZ",
        weightedRating: 8.9,
        unweightedRating: 8.7,
        change: 0.2,
        lastUpdated: "3 days ago",
        badges: ["Puncher", "Wordplay"],
        tags: ["URL", "West Coast", "Puncher"],
      },
      {
        id: "4",
        name: "Tsu Surf",
        image: "/placeholder.svg?height=300&width=300",
        location: "Newark, NJ",
        weightedRating: 8.7,
        unweightedRating: 8.8,
        change: -0.1,
        lastUpdated: "5 days ago",
        badges: ["Performance", "Crowd Control"],
        tags: ["URL", "East Coast", "Veteran"],
        userType: "media",
      },
      {
        id: "5",
        name: "JC",
        image: "/placeholder.svg?height=300&width=300",
        location: "Pontiac, MI",
        weightedRating: 8.5,
        unweightedRating: 8.3,
        change: 0.1,
        lastUpdated: "4 days ago",
        badges: ["Lyricist", "Technical"],
        tags: ["URL", "Midwest", "Lyricist"],
      },
      {
        id: "6",
        name: "K-Shine",
        image: "/placeholder.svg?height=300&width=300",
        location: "Harlem, NY",
        weightedRating: 8.3,
        unweightedRating: 8.4,
        change: -0.2,
        lastUpdated: "1 week ago",
        badges: ["Performance", "Energy"],
        tags: ["URL", "East Coast", "Performance"],
        userType: "league_owner",
      },
      {
        id: "7",
        name: "Hitman Holla",
        image: "/placeholder.svg?height=300&width=300",
        location: "St. Louis, MO",
        weightedRating: 8.2,
        unweightedRating: 8.5,
        change: -0.3,
        lastUpdated: "2 weeks ago",
        badges: ["Performance", "Remixes"],
        tags: ["URL", "Midwest", "Performance", "Mainstream"],
      },
      {
        id: "8",
        name: "Charlie Clips",
        image: "/placeholder.svg?height=300&width=300",
        location: "Harlem, NY",
        weightedRating: 8.1,
        unweightedRating: 8.0,
        change: 0.2,
        lastUpdated: "3 days ago",
        badges: ["Freestyle", "Humor"],
        tags: ["URL", "East Coast", "Freestyle", "Veteran"],
      },
    ]

    // Extract all unique tags
    const allTags = new Set<string>()
    mockBattlers.forEach((battler) => {
      battler.tags.forEach((tag) => allTags.add(tag))
    })
    setAvailableTags(Array.from(allTags).sort())

    // Apply filters
    let filteredBattlers = [...mockBattlers]

    // Apply trending filter
    if (filter === "trending-up") {
      filteredBattlers = filteredBattlers.filter((battler) => battler.change > 0)
    } else if (filter === "trending-down") {
      filteredBattlers = filteredBattlers.filter((battler) => battler.change < 0)
    }

    // Apply tag filters
    if (selectedTags.length > 0) {
      filteredBattlers = filteredBattlers.filter((battler) => selectedTags.every((tag) => battler.tags.includes(tag)))
    }

    // Sort by rating type
    filteredBattlers.sort((a, b) => {
      const ratingA = rankingType === "weighted" ? a.weightedRating : a.unweightedRating
      const ratingB = rankingType === "weighted" ? b.weightedRating : b.unweightedRating
      return ratingB - ratingA
    })

    // Limit to 5 if compact mode
    if (compact) {
      filteredBattlers = filteredBattlers.slice(0, 5)
    }

    setBattlers(filteredBattlers)
    setIsLoading(false)
  }, [timeFrame, rankingType, filter, selectedTags, compact])

  const getRatingLabel = () => {
    return rankingType === "weighted" ? "Weighted Rating" : "Unweighted Rating"
  }

  const getUserTypeBadge = (userType?: string) => {
    if (!userType) return null

    const badgeStyles: Record<string, string> = {
      media: "bg-purple-900/30 text-purple-400 border-purple-700",
      battler: "bg-green-900/30 text-green-400 border-green-700",
      league_owner: "bg-amber-900/30 text-amber-400 border-amber-700",
      admin: "bg-red-900/30 text-red-400 border-red-700",
    }

    return (
      <Badge className={badgeStyles[userType]}>
        {userType
          .split("_")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ")}
      </Badge>
    )
  }

  const addTag = (tag: string) => {
    if (!selectedTags.includes(tag)) {
      setSelectedTags([...selectedTags, tag])
    }
  }

  const removeTag = (tag: string) => {
    setSelectedTags(selectedTags.filter((t) => t !== tag))
  }

  const getTimeFrameTitle = () => {
    switch (timeFrame) {
      case "day":
        return "Daily Champion"
      case "week":
        return "Champion of the Week"
      case "month":
        return "Champion of the Month"
      default:
        return "All-Time Champion"
    }
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center mb-4">
        <Trophy className="w-5 h-5 mr-2 text-yellow-500" />
        <h2 className="text-2xl font-bold">{showTitle || "Battle Rap Rankings"}</h2>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <Tabs
          value={rankingType}
          onValueChange={(value) => setRankingType(value as "weighted" | "unweighted")}
          className="w-full md:w-auto"
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="weighted">Weighted</TabsTrigger>
            <TabsTrigger value="unweighted">Unweighted</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
          <Select value={timeFrame} onValueChange={(value) => setTimeFrame(value as any)}>
            <SelectTrigger className="w-full sm:w-[150px]">
              <Calendar className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Time Frame" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Time</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="day">Today</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filter} onValueChange={(value) => setFilter(value as any)}>
            <SelectTrigger className="w-full sm:w-[150px]">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Filter" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Battlers</SelectItem>
              <SelectItem value="trending-up">Trending Up</SelectItem>
              <SelectItem value="trending-down">Trending Down</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Tag Filtering */}
      {!compact && (
        <div className="mb-6">
          <div className="flex items-center mb-2">
            <Tag className="w-4 h-4 mr-2 text-blue-400" />
            <h3 className="text-sm font-medium">Filter by Tags</h3>
          </div>

          <div className="flex flex-wrap gap-2 mb-4">
            {selectedTags.map((tag) => (
              <Badge key={tag} className="bg-blue-900/30 text-blue-300 border-blue-700 flex items-center gap-1">
                {tag}
                <button onClick={() => removeTag(tag)} className="ml-1 hover:text-white">
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            ))}
          </div>

          <div className="flex flex-wrap gap-2">
            {availableTags
              .filter((tag) => !selectedTags.includes(tag))
              .map((tag) => (
                <Badge
                  key={tag}
                  variant="outline"
                  className="cursor-pointer hover:bg-blue-900/20"
                  onClick={() => addTag(tag)}
                >
                  {tag}
                </Badge>
              ))}
          </div>
        </div>
      )}

      <Card className="flex-1">
        <CardHeader>
          <CardTitle>
            {showTitle || getTimeFrameTitle()}
            {filter !== "all" && ` (${filter === "trending-up" ? "Trending Up" : "Trending Down"})`}
          </CardTitle>
        </CardHeader>
        <CardContent className="overflow-auto">
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-20 bg-gray-800 animate-pulse rounded-md"></div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {battlers.length === 0 ? (
                <div className="text-center py-8 text-gray-400">No battlers match your current filters</div>
              ) : (
                battlers.map((battler, index) => (
                  <Link key={battler.id} href={`/battlers/${battler.id}`} className="block">
                    <div className="flex items-center gap-4 p-4 bg-gray-900 rounded-lg border border-gray-800 hover:border-blue-500 transition-all">
                      <div className="flex-shrink-0 w-8 text-center font-bold text-lg text-gray-400">#{index + 1}</div>
                      <div className="relative w-12 h-12 rounded-full overflow-hidden">
                        <Image
                          src={battler.image || "/placeholder.svg"}
                          alt={battler.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="font-medium">{battler.name}</h3>
                          {getUserTypeBadge(battler.userType)}
                        </div>
                        <p className="text-sm text-gray-400">{battler.location}</p>
                        {!compact && (
                          <div className="flex flex-wrap gap-1 mt-1">
                            {battler.tags.map((tag) => (
                              <Badge key={tag} variant="outline" className="text-xs py-0 px-1">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold">
                          {rankingType === "weighted"
                            ? battler.weightedRating.toFixed(1)
                            : battler.unweightedRating.toFixed(1)}
                        </div>
                        <p className="text-xs text-gray-400">{getRatingLabel()}</p>
                      </div>
                      <div className="text-center w-20">
                        <div
                          className={`flex items-center justify-center ${
                            battler.change > 0
                              ? "text-green-500"
                              : battler.change < 0
                                ? "text-red-500"
                                : "text-gray-400"
                          }`}
                        >
                          {battler.change > 0 ? (
                            <TrendingUp className="w-4 h-4 mr-1" />
                          ) : battler.change < 0 ? (
                            <TrendingDown className="w-4 h-4 mr-1" />
                          ) : null}
                          <span>
                            {battler.change > 0 ? "+" : ""}
                            {battler.change.toFixed(1)}
                          </span>
                        </div>
                        <p className="text-xs text-gray-400">{battler.lastUpdated}</p>
                      </div>
                    </div>
                  </Link>
                ))
              )}
            </div>
          )}

          {compact && battlers.length > 0 && (
            <div className="mt-4 text-center">
              <Button asChild variant="outline">
                <Link href="/analytics">View Full Rankings</Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

