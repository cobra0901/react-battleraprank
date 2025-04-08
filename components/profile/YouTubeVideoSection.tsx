"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { ExternalLink, ThumbsUp, MessageSquare, Eye, Calendar } from "lucide-react"
import { getChannelVideos } from "@/lib/youtube-service"
import type { YouTubeChannel } from "@/types/auth-types"

interface YouTubeVideoSectionProps {
  channels: YouTubeChannel[]
}

export default function YouTubeVideoSection({ channels }: YouTubeVideoSectionProps) {
  const [activeChannel, setActiveChannel] = useState<string | null>(channels.length > 0 ? channels[0].id : null)
  const [videos, setVideos] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchVideos = async () => {
      if (!activeChannel) return

      setIsLoading(true)
      try {
        const channelId = activeChannel
        const data = await getChannelVideos(channelId, 6)
        setVideos(data)
      } catch (error) {
        console.error("Error fetching videos:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchVideos()
  }, [activeChannel])

  if (channels.length === 0) {
    return <div className="text-center py-12 text-gray-400">No YouTube channels have been added yet.</div>
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })
  }

  const formatCount = (count: number) => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`
    }
    return count.toString()
  }

  return (
    <div className="space-y-6">
      <Tabs value={activeChannel || ""} onValueChange={setActiveChannel} className="mb-6">
        <TabsList className="bg-gray-900 border border-gray-800">
          {channels.map((channel) => (
            <TabsTrigger key={channel.id} value={channel.id}>
              {channel.name}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="bg-gray-900 border-gray-800">
              <CardContent className="p-0">
                <div className="animate-pulse">
                  <div className="h-48 bg-gray-800"></div>
                  <div className="p-4 space-y-3">
                    <div className="h-4 bg-gray-800 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-800 rounded w-1/2"></div>
                    <div className="h-3 bg-gray-800 rounded w-full"></div>
                    <div className="flex justify-between">
                      <div className="h-3 bg-gray-800 rounded w-1/4"></div>
                      <div className="h-3 bg-gray-800 rounded w-1/4"></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : videos.length === 0 ? (
        <div className="text-center py-12 text-gray-400">No videos found for this channel.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.map((video) => (
            <Card
              key={video.id}
              className="bg-gray-900 border-gray-800 overflow-hidden hover:border-amber-500 transition-all"
            >
              <CardContent className="p-0">
                <div className="flex flex-col">
                  <div className="relative h-48 w-full">
                    <Image
                      src={video.thumbnailUrl || "/placeholder.svg"}
                      alt={video.title}
                      fill
                      className="object-cover"
                    />
                    <Badge className="absolute top-2 right-2 bg-red-900/30 text-red-400 border-red-700">YouTube</Badge>
                  </div>

                  <div className="p-4">
                    <h3 className="font-semibold text-lg mb-2 line-clamp-2">{video.title}</h3>
                    <p className="text-gray-400 text-sm line-clamp-2 mb-3">{video.description}</p>

                    <div className="flex justify-between items-center">
                      <div className="flex items-center text-sm text-gray-400">
                        <Calendar className="w-4 h-4 mr-1" />
                        {formatDate(video.publishedAt)}
                      </div>

                      <div className="flex gap-3 text-sm text-gray-400">
                        <div className="flex items-center gap-1">
                          <Eye className="w-3 h-3" />
                          {formatCount(video.viewCount)}
                        </div>
                        <div className="flex items-center gap-1">
                          <ThumbsUp className="w-3 h-3" />
                          {formatCount(video.likeCount)}
                        </div>
                        <div className="flex items-center gap-1">
                          <MessageSquare className="w-3 h-3" />
                          {formatCount(video.commentCount)}
                        </div>
                      </div>
                    </div>

                    <div className="mt-4">
                      <Button asChild variant="outline" size="sm" className="w-full">
                        <a href={`https://youtube.com/watch?v=${video.id}`} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="w-4 h-4 mr-2" />
                          Watch on YouTube
                        </a>
                      </Button>
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

