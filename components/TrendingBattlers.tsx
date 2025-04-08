"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, Star } from "lucide-react"

interface Battler {
  id: number
  name: string
  image: string
  location: string
  rating: number
  change: number
  spotlightBadges: string[]
}

export default function TrendingBattlers() {
  const [battlers, setBattlers] = useState<Battler[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Mock data for trending battlers
    const mockBattlers = [
      {
        id: 1,
        name: "Loaded Lux",
        image: "/placeholder.svg?height=300&width=300",
        location: "Harlem, NY",
        rating: 9.2,
        change: 0.3,
        spotlightBadges: ["Wordsmith", "Scheme King", "Crowd Control"],
      },
      {
        id: 2,
        name: "Geechi Gotti",
        image: "/placeholder.svg?height=300&width=300",
        location: "Compton, CA",
        rating: 9.0,
        change: 0.5,
        spotlightBadges: ["Authentic", "Consistent", "Performance"],
      },
      {
        id: 3,
        name: "Rum Nitty",
        image: "/placeholder.svg?height=300&width=300",
        location: "Phoenix, AZ",
        rating: 8.9,
        change: 0.2,
        spotlightBadges: ["Puncher", "Wordplay", "Technical"],
      },
      {
        id: 4,
        name: "Tsu Surf",
        image: "/placeholder.svg?height=300&width=300",
        location: "Newark, NJ",
        rating: 8.7,
        change: -0.1,
        spotlightBadges: ["Performance", "Crowd Control", "Freestyle"],
      },
    ]

    setBattlers(mockBattlers)
    setIsLoading(false)
  }, [])

  return (
    <div>
      <div className="flex items-center mb-4">
        <TrendingUp className="w-5 h-5 mr-2 text-blue-400" />
        <h2 className="text-2xl font-bold">Trending Battlers</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {isLoading
          ? Array(4)
              .fill(0)
              .map((_, index) => (
                <Card key={index} className="bg-gray-900 border-gray-800 animate-pulse">
                  <CardContent className="p-4 h-64"></CardContent>
                </Card>
              ))
          : battlers.map((battler) => (
              <Link key={battler.id} href={`/battlers/${battler.id}`} className="group">
                <Card className="bg-gray-900 border-gray-800 overflow-hidden hover:border-blue-500 transition-all hover:shadow-lg hover:shadow-blue-900/20 group-hover:transform group-hover:translate-y-[-5px] duration-300">
                  <CardContent className="p-0">
                    <div className="relative aspect-square">
                      <Image
                        src={battler.image || "/placeholder.svg"}
                        alt={battler.name}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute top-2 right-2">
                        <Badge
                          className={`${
                            battler.change > 0 ? "bg-green-900/60 text-green-400" : "bg-red-900/60 text-red-400"
                          }`}
                        >
                          {battler.change > 0 ? "+" : ""}
                          {battler.change.toFixed(1)}
                        </Badge>
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-medium text-lg">{battler.name}</h3>
                          <p className="text-sm text-gray-400">{battler.location}</p>
                        </div>
                        <div className="flex items-center">
                          <Star className="w-4 h-4 text-blue-500 fill-blue-500 mr-1" />
                          <span className="font-bold">{battler.rating.toFixed(1)}</span>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-1 mt-3">
                        {battler.spotlightBadges.map((badge) => (
                          <Badge key={badge} variant="outline" className="bg-blue-900/20 border-blue-700">
                            {badge}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
      </div>
    </div>
  )
}

