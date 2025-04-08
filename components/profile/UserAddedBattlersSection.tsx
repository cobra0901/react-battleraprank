"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { getUserAddedBattlers } from "@/lib/user-service"
import type { Battler } from "@/lib/data-service"

interface UserAddedBattlersSectionProps {
  userId: string
}

export default function UserAddedBattlersSection({ userId }: UserAddedBattlersSectionProps) {
  const [battlers, setBattlers] = useState<Battler[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchBattlers = async () => {
      try {
        const data = await getUserAddedBattlers(userId)
        setBattlers(data)
      } catch (error) {
        console.error("Error fetching user added battlers:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchBattlers()
  }, [userId])

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>
            <Skeleton className="h-6 w-48" />
          </CardTitle>
          <CardDescription>
            <Skeleton className="h-4 w-64" />
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array(3)
              .fill(0)
              .map((_, i) => (
                <div key={i} className="flex flex-col space-y-2">
                  <Skeleton className="h-32 w-full rounded-md" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (battlers.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Battlers Added</CardTitle>
          <CardDescription>This user hasn't added any battlers to the platform yet.</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Battlers Added</CardTitle>
        <CardDescription>Battlers this community manager has added to the Alt Battle Rap Algorithm</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {battlers.map((battler) => (
            <Link key={battler.id} href={`/battlers/${battler.id}`} className="block group">
              <div className="bg-gray-800 rounded-lg overflow-hidden border border-gray-700 transition-all hover:border-gray-500">
                <div className="relative h-32 w-full">
                  <Image
                    src={battler.image || "/placeholder.svg?height=400&width=400"}
                    alt={battler.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-3">
                  <h3 className="font-medium group-hover:text-primary-foreground transition-colors">{battler.name}</h3>
                  <div className="flex items-center text-sm text-gray-400">
                    <span>{battler.location}</span>
                    <span className="mx-2">•</span>
                    <span>{battler.totalPoints.toFixed(1)}</span>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {battler.tags.slice(0, 3).map((tag, i) => (
                      <Badge key={i} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                    {battler.tags.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{battler.tags.length - 3}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

