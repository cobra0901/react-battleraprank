"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Play, Youtube } from "lucide-react"
import Image from "next/image"

interface Video {
  id: string
  title: string
  thumbnail: string
}

export default function YouTubeCarousel({ playlistId }: { playlistId: string }) {
  const [videos, setVideos] = useState<Video[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const carouselRef = useRef<HTMLDivElement>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Mock data for videos (in a real app, you would fetch this from YouTube API)
  useEffect(() => {
    // Actual videos from the user's playlist
    const actualVideos = [
      {
        id: "Iu5aZDqOKm4",
        title: "Backstage Beatdown: The Eazy vs Papoose Brawl",
        thumbnail: `https://img.youtube.com/vi/Iu5aZDqOKm4/mqdefault.jpg`,
      },
      {
        id: "O5HHsIiB4Bk",
        title: "The Attempted Assassination of Big T",
        thumbnail: `https://img.youtube.com/vi/O5HHsIiB4Bk/mqdefault.jpg`,
      },
      {
        id: "4BwT8aTCpiY",
        title: "Calicoe & Norbes: Shootout on Joy Road",
        thumbnail: `https://img.youtube.com/vi/4BwT8aTCpiY/mqdefault.jpg`,
      },
      {
        id: "kGMqBOUG3RY",
        title: "The Heinous Murder of Pat Stay",
        thumbnail: `https://img.youtube.com/vi/kGMqBOUG3RY/mqdefault.jpg`,
      },
      {
        id: "7FO85Z4J0Zw",
        title: "The Horrific Nightmare of Hitman Holla",
        thumbnail: `https://img.youtube.com/vi/7FO85Z4J0Zw/mqdefault.jpg`,
      },
      {
        id: "9_9_or_9_11",
        title: "Queenzflip fights ARP: Squabble in the Snow",
        thumbnail: `/placeholder.svg?height=180&width=320&text=Battle+Rap+Stories`,
      },
      {
        id: "7FO85Z4J0Zw",
        title: "Tsu Surf's Rollin' 60's: Who told on Surf??",
        thumbnail: `/placeholder.svg?height=180&width=320&text=Battle+Rap+Stories`,
      },
      {
        id: "kyd_slade",
        title: "Kyd Slade : Did He Tell?",
        thumbnail: `/placeholder.svg?height=180&width=320&text=Battle+Rap+Stories`,
      },
    ]

    setVideos(actualVideos)
    setIsLoading(false)
  }, [playlistId])

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % videos.length)
  }

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + videos.length) % videos.length)
  }

  const openVideo = (videoId: string) => {
    window.open(`https://www.youtube.com/watch?v=${videoId}`, "_blank")
  }

  return (
    <div className="relative">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          <Youtube className="w-6 h-6 mr-2 text-red-500" />
          <h2 className="text-2xl font-bold">Algorithm Institute of BR Stories</h2>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="icon" onClick={prevSlide} disabled={isLoading}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={nextSlide} disabled={isLoading}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div ref={carouselRef} className="overflow-hidden">
        {isLoading ? (
          <div className="h-64 bg-gray-800 animate-pulse rounded-lg flex items-center justify-center">
            <p className="text-gray-400">Loading videos...</p>
          </div>
        ) : (
          <div
            className="flex transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {videos.map((video, index) => (
              <div key={video.id} className="min-w-full">
                <Card className="bg-gray-900 border-gray-800 overflow-hidden">
                  <CardContent className="p-0 relative">
                    <div className="relative aspect-video max-h-[220px]">
                      <Image
                        src={video.thumbnail || "/placeholder.svg?height=180&width=320&text=Battle+Rap+Stories"}
                        alt={video.title}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                        <Button
                          variant="default"
                          size="sm"
                          className="rounded-full bg-red-600 hover:bg-red-700"
                          onClick={() => openVideo(video.id)}
                        >
                          <Play className="h-4 w-4 fill-current" />
                        </Button>
                      </div>
                    </div>
                    <div className="p-3">
                      <h3 className="font-medium text-sm line-clamp-1">{video.title}</h3>
                      <div className="flex justify-between items-center mt-1">
                        <span className="text-xs text-gray-400">Algorithm Institute</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 px-2 text-xs"
                          onClick={() => openVideo(video.id)}
                        >
                          Watch
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex justify-center mt-4 gap-1">
        {videos.map((_, index) => (
          <button
            key={index}
            className={`h-2 w-2 rounded-full transition-colors ${
              index === currentIndex ? "bg-red-500" : "bg-gray-600"
            }`}
            onClick={() => setCurrentIndex(index)}
          />
        ))}
      </div>
    </div>
  )
}

