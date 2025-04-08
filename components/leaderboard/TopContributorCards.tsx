"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Award, TrendingUp, BarChart2 } from "lucide-react"
import { getTopContributors } from "@/lib/stats-service"
import type { TopContributor } from "@/types/stats-types"

export default function TopContributorCards() {
  const [contributors, setContributors] = useState<TopContributor[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchContributors = async () => {
      try {
        const data = await getTopContributors()
        setContributors(data)
      } catch (error) {
        console.error("Error fetching top contributors:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchContributors()
  }, [])

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="pb-2">
              <div className="h-6 bg-gray-800 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-800 rounded w-1/2"></div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-gray-800"></div>
                <div className="space-y-2">
                  <div className="h-5 bg-gray-800 rounded w-24"></div>
                  <div className="h-4 bg-gray-800 rounded w-20"></div>
                </div>
              </div>
              <div className="h-4 bg-gray-800 rounded w-full mt-4"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  const getIcon = (index: number) => {
    const icons = [
      <BarChart2 key="chart" className="h-5 w-5 text-blue-500" />,
      <TrendingUp key="trend" className="h-5 w-5 text-green-500" />,
      <Award key="award" className="h-5 w-5 text-purple-500" />,
    ]
    return icons[index % icons.length]
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {contributors.map((contributor, index) => (
        <Card key={contributor.userId}>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              {getIcon(index)}
              {contributor.contribution}
            </CardTitle>
            <CardDescription>{contributor.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="relative w-16 h-16 rounded-full overflow-hidden">
                <Image
                  src={contributor.profileImage || "/placeholder.svg"}
                  alt={contributor.displayName}
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <Link href={`/profile/${contributor.username}`} className="font-medium text-lg hover:underline">
                  {contributor.displayName}
                </Link>
                <p className="text-sm text-gray-400">@{contributor.username}</p>
                <div className="mt-1 text-sm">
                  <span className="font-semibold">{contributor.score}</span>{" "}
                  <span className="text-gray-400">
                    {index === 0 ? "consistency score" : index === 1 ? "ratings" : "influence score"}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

