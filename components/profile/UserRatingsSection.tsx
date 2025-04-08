"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, Calendar, CheckCircle, XCircle } from "lucide-react"
import { getUserRatings } from "@/lib/rating-service"
import type { UserRating } from "@/types/rating-types"

interface UserRatingsSectionProps {
  userId: string
}

export default function UserRatingsSection({ userId }: UserRatingsSectionProps) {
  const [ratings, setRatings] = useState<UserRating[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchRatings = async () => {
      try {
        const data = await getUserRatings(userId)
        setRatings(data)
      } catch (error) {
        console.error("Error fetching ratings:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchRatings()
  }, [userId])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Ratings</h2>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="bg-gray-900 border-gray-800">
              <CardContent className="p-0 h-32 animate-pulse"></CardContent>
            </Card>
          ))}
        </div>
      ) : ratings.length === 0 ? (
        <div className="text-center py-12 text-gray-400">No ratings yet</div>
      ) : (
        <div className="space-y-4">
          {ratings.map((rating) => (
            <Card
              key={rating.id}
              className="bg-gray-900 border-gray-800 overflow-hidden hover:border-amber-500 transition-all"
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <Link
                    href={`/battlers/${rating.battlerId}`}
                    className="relative w-16 h-16 rounded-full overflow-hidden flex-shrink-0"
                  >
                    <Image
                      src={rating.battlerImage || "/placeholder.svg"}
                      alt={rating.battlerName}
                      fill
                      className="object-cover"
                    />
                  </Link>

                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <Link
                          href={`/battlers/${rating.battlerId}`}
                          className="font-semibold text-lg hover:text-amber-400 transition-colors"
                        >
                          {rating.battlerName}
                        </Link>
                        <div className="flex items-center text-sm text-gray-400 mt-1">
                          <Calendar className="w-4 h-4 mr-1" />
                          {rating.createdAt ? formatDate(rating.createdAt) : "N/A"}
                        </div>
                      </div>

                      <div className="flex items-center bg-amber-900/30 px-3 py-1 rounded-full">
                        <Star className="w-4 h-4 text-amber-400 fill-amber-400 mr-1" />
                        <span className="font-bold">{(rating.rating ?? 0).toFixed(1)}</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mt-3">
                      {(rating.badges?.positive ?? []).map((badge) => (
                        <Badge
                          key={badge}
                          className="bg-green-900/30 text-green-400 border-green-700 flex items-center"
                        >
                          <CheckCircle className="w-3 h-3 mr-1" />
                          {badge}
                        </Badge>
                      ))}

                      {(rating.badges?.negative ?? []).map((badge) => (
                        <Badge key={badge} className="bg-red-900/30 text-red-400 border-red-700 flex items-center">
                          <XCircle className="w-3 h-3 mr-1" />
                          {badge}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

