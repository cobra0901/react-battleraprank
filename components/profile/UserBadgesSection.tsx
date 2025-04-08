"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle } from "lucide-react"
import { getUserBadges } from "@/lib/badge-service"
import type { UserBadge } from "@/types/badge-types"

interface UserBadgesSectionProps {
  userId: string
}

export default function UserBadgesSection({ userId }: UserBadgesSectionProps) {
  const [badges, setBadges] = useState<UserBadge[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchBadges = async () => {
      try {
        const data = await getUserBadges(userId)
        setBadges(data)
      } catch (error) {
        console.error("Error fetching badges:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchBadges()
  }, [userId])

  // Group badges by category
  const groupedBadges = badges.reduce(
    (acc, badge) => {
      if (!acc[badge.category]) {
        acc[badge.category] = {
          positive: [],
          negative: [],
        }
      }

      if (badge.isPositive) {
        acc[badge.category].positive.push(badge)
      } else {
        acc[badge.category].negative.push(badge)
      }

      return acc
    },
    {} as Record<string, { positive: UserBadge[]; negative: UserBadge[] }>,
  )

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Badges</h2>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="bg-gray-900 border-gray-800">
              <CardContent className="p-0 h-48 animate-pulse"></CardContent>
            </Card>
          ))}
        </div>
      ) : Object.keys(groupedBadges).length === 0 ? (
        <div className="text-center py-12 text-gray-400">No badges yet</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Object.entries(groupedBadges).map(([category, { positive, negative }]) => (
            <Card key={category} className="bg-gray-900 border-gray-800">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4">{category}</h3>

                {positive.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-green-400 flex items-center mb-2">
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Positive
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {positive.map((badge) => (
                        <Badge
                          key={badge.id}
                          className="bg-green-900/30 text-green-400 border-green-700"
                          title={badge.description}
                        >
                          {badge.badge}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {negative.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-red-400 flex items-center mb-2">
                      <XCircle className="w-4 h-4 mr-1" />
                      Negative
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {negative.map((badge) => (
                        <Badge
                          key={badge.id}
                          className="bg-red-900/30 text-red-400 border-red-700"
                          title={badge.description}
                        >
                          {badge.badge}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

