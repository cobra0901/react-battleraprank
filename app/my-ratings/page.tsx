"use client"

import { useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import Link from "next/link"
import { CheckCircle, XCircle, Star } from "lucide-react"

// Mock data for user ratings
const mockRatings = [
  {
    id: 1,
    battlerId: 1,
    battlerName: "Loaded Lux",
    battlerImage: "/placeholder.svg?height=100&width=100",
    rating: 8.7,
    date: "2023-11-15",
    badges: {
      positive: ["Wordsmith", "Pen Game", "Battle IQ"],
      negative: ["Inconsistent"],
    },
  },
  {
    id: 2,
    battlerId: 3,
    battlerName: "Geechi Gotti",
    battlerImage: "/placeholder.svg?height=100&width=100",
    rating: 9.2,
    date: "2023-11-10",
    badges: {
      positive: ["Authentic", "Consistent", "Crowd Control"],
      negative: [],
    },
  },
  {
    id: 3,
    battlerId: 4,
    battlerName: "Rum Nitty",
    battlerImage: "/placeholder.svg?height=100&width=100",
    rating: 8.9,
    date: "2023-11-05",
    badges: {
      positive: ["Puncher", "Wordsmith"],
      negative: ["Stage Presence"],
    },
  },
]

export default function MyRatingsPage() {
  const { user } = useAuth()
  const [ratings] = useState(mockRatings)

  if (!user) {
    return <div>Loading...</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">My Ratings</h1>

      <Tabs defaultValue="all">
        <TabsList className="mb-6 bg-gray-900 border border-gray-800">
          <TabsTrigger value="all">All Ratings</TabsTrigger>
          <TabsTrigger value="recent">Recent</TabsTrigger>
          <TabsTrigger value="highest">Highest Rated</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <div className="space-y-6">
            {ratings.length > 0 ? (
              ratings.map((rating) => <RatingCard key={rating.id} rating={rating} />)
            ) : (
              <Card>
                <CardContent className="pt-6">
                  <p className="text-center text-gray-400">You haven't rated any battlers yet.</p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="recent">
          <div className="space-y-6">
            {ratings
              .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
              .map((rating) => (
                <RatingCard key={rating.id} rating={rating} />
              ))}
          </div>
        </TabsContent>

        <TabsContent value="highest">
          <div className="space-y-6">
            {ratings
              .sort((a, b) => b.rating - a.rating)
              .map((rating) => (
                <RatingCard key={rating.id} rating={rating} />
              ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function RatingCard({ rating }: { rating: any }) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex items-center gap-4">
            <div className="relative w-16 h-16 rounded-full overflow-hidden">
              <Image
                src={rating.battlerImage || "/placeholder.svg"}
                alt={rating.battlerName}
                fill
                className="object-cover"
              />
            </div>
            <div>
              <Link href={`/battlers/${rating.battlerId}`} className="text-lg font-medium hover:text-purple-400">
                {rating.battlerName}
              </Link>
              <div className="flex items-center gap-2 mt-1">
                <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                <span className="font-medium">{rating.rating.toFixed(1)}</span>
                <span className="text-sm text-gray-400">• Rated on {new Date(rating.date).toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          <div className="flex-1 mt-4 md:mt-0">
            <div className="flex flex-wrap gap-2">
              {rating.badges.positive.map((badge: string) => (
                <Badge
                  key={badge}
                  className="bg-green-900/30 text-green-400 border-green-700 hover:bg-green-900/30 flex items-center"
                >
                  <CheckCircle className="w-3 h-3 mr-1" />
                  {badge}
                </Badge>
              ))}
              {rating.badges.negative.map((badge: string) => (
                <Badge
                  key={badge}
                  className="bg-red-900/30 text-red-400 border-red-700 hover:bg-red-900/30 flex items-center"
                >
                  <XCircle className="w-3 h-3 mr-1" />
                  {badge}
                </Badge>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2 mt-4 md:mt-0">
            <Button variant="outline" size="sm" asChild>
              <Link href={`/battlers/${rating.battlerId}`}>View Battler</Link>
            </Button>
            <Button variant="outline" size="sm">
              Edit Rating
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function Button({ children, variant, size, asChild, ...props }: any) {
  const Component = asChild ? Link : "button"

  return (
    <Component
      className={`
        inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors
        ${variant === "outline" ? "border border-gray-700 hover:bg-gray-800" : "bg-purple-600 hover:bg-purple-700 text-white"}
        ${size === "sm" ? "h-8 px-3 text-xs" : "h-10 px-4 py-2"}
      `}
      {...props}
    >
      {children}
    </Component>
  )
}

