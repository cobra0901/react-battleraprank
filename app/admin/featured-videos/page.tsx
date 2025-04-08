"use client"
export const dynamic = "force-dynamic";
import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Trash, Plus, Save, ExternalLink, AlertTriangle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { manageFeaturedVideos, getFeaturedVideos } from "@/lib/youtube-service"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface FeaturedVideo {
  id: string
  title: string
  videoId: string
  thumbnail: string
  order: number
}

export default function FeaturedVideosPage() {
  const [videos, setVideos] = useState<FeaturedVideo[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [dbError, setDbError] = useState<string | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    const loadVideos = async () => {
      try {
        setIsLoading(true)
        setDbError(null)
        const featuredVideos = await getFeaturedVideos()
        setVideos(featuredVideos)
      } catch (error) {
        console.error("Error loading featured videos:", error)
        setDbError("Database table not set up yet. Changes will be saved to mock data only.")
        // We should still have mock data from the service
        const mockVideos = await getFeaturedVideos()
        setVideos(mockVideos)

        toast({
          title: "Database Not Ready",
          description: "The featured videos table doesn't exist yet. Using mock data for now.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    loadVideos()
  }, [toast])

  const addNewVideo = () => {
    const newVideo: FeaturedVideo = {
      id: `temp-${Date.now()}`,
      title: "",
      videoId: "",
      thumbnail: "",
      order: videos.length,
    }
    setVideos([...videos, newVideo])
  }

  const removeVideo = (index: number) => {
    const updatedVideos = [...videos]
    updatedVideos.splice(index, 1)
    // Update order for remaining videos
    updatedVideos.forEach((video, idx) => {
      video.order = idx
    })
    setVideos(updatedVideos)
  }

  const updateVideo = (index: number, field: keyof FeaturedVideo, value: string | number) => {
    const updatedVideos = [...videos]
    updatedVideos[index] = {
      ...updatedVideos[index],
      [field]: value,
    }

    // If videoId is updated, try to fetch the thumbnail and title
    if (field === "videoId" && typeof value === "string") {
      const videoId = value.trim()
      // Extract videoId from URL if needed
      const extractedId = extractYouTubeId(videoId)
      if (extractedId) {
        updatedVideos[index].videoId = extractedId
        updatedVideos[index].thumbnail = `https://img.youtube.com/vi/${extractedId}/mqdefault.jpg`
      }
    }

    setVideos(updatedVideos)
  }

  const extractYouTubeId = (input: string): string | null => {
    // Handle full YouTube URLs
    const urlRegex = /(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/i
    const match = input.match(urlRegex)

    if (match && match[1]) {
      return match[1]
    }

    // If input is already just an ID (11 characters)
    if (/^[a-zA-Z0-9_-]{11}$/.test(input)) {
      return input
    }

    return null
  }

  const moveVideo = (index: number, direction: "up" | "down") => {
    if ((direction === "up" && index === 0) || (direction === "down" && index === videos.length - 1)) {
      return
    }

    const updatedVideos = [...videos]
    const newIndex = direction === "up" ? index - 1 : index + 1

    // Swap videos
    ;[updatedVideos[index], updatedVideos[newIndex]] = [updatedVideos[newIndex], updatedVideos[index]]

    // Update order values
    updatedVideos.forEach((video, idx) => {
      video.order = idx
    })

    setVideos(updatedVideos)
  }

  const saveChanges = async () => {
    try {
      // Validate videos before saving
      const invalidVideos = videos.filter((v) => !v.videoId || !v.title)
      if (invalidVideos.length > 0) {
        toast({
          title: "Validation Error",
          description: "All videos must have a title and video ID",
          variant: "destructive",
        })
        return
      }

      await manageFeaturedVideos(videos)

      if (dbError) {
        toast({
          title: "Partial Success",
          description: "Changes saved to mock data. Database table not available yet.",
          variant: "default",
        })
      } else {
        toast({
          title: "Success",
          description: "Featured videos have been updated",
          variant: "default",
        })
      }
    } catch (error) {
      console.error("Error saving featured videos:", error)
      toast({
        title: "Error",
        description: "Failed to save featured videos",
        variant: "destructive",
      })
    }
  }

  const previewVideo = (videoId: string) => {
    window.open(`https://www.youtube.com/watch?v=${videoId}`, "_blank")
  }

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="h-8 w-64 bg-gray-800 animate-pulse rounded mb-6"></div>
        <div className="grid gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 bg-gray-800 animate-pulse rounded"></div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Featured YouTube Videos</h1>
        <div className="flex gap-2">
          <Button onClick={addNewVideo}>
            <Plus className="w-4 h-4 mr-2" />
            Add Video
          </Button>
          <Button onClick={saveChanges} variant="default">
            <Save className="w-4 h-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </div>

      {dbError && (
        <Alert variant="destructive" className="mb-6">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            {dbError} Your changes will still be visible on the site, but won't persist in the database until it's set
            up.
          </AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Manage Featured Videos</CardTitle>
          <CardDescription>
            These videos will be displayed on the home page. Drag to reorder or use the up/down buttons.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {videos.map((video, index) => (
              <div key={video.id} className="border border-gray-800 rounded-lg p-4 bg-gray-900">
                <div className="grid grid-cols-1 md:grid-cols-[1fr_200px] gap-4">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor={`title-${index}`}>Video Title</Label>
                      <Input
                        id={`title-${index}`}
                        value={video.title}
                        onChange={(e) => updateVideo(index, "title", e.target.value)}
                        placeholder="Enter video title"
                      />
                    </div>
                    <div>
                      <Label htmlFor={`videoId-${index}`}>YouTube Video ID or URL</Label>
                      <Input
                        id={`videoId-${index}`}
                        value={video.videoId}
                        onChange={(e) => updateVideo(index, "videoId", e.target.value)}
                        placeholder="e.g., dQw4w9WgXcQ or https://youtube.com/watch?v=dQw4w9WgXcQ"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col items-center">
                    {video.thumbnail ? (
                      <div className="relative w-full aspect-video mb-2 overflow-hidden rounded-md">
                        <img
                          src={video.thumbnail || "/placeholder.svg"}
                          alt={video.title}
                          className="object-cover w-full h-full"
                        />
                      </div>
                    ) : (
                      <div className="w-full aspect-video mb-2 bg-gray-800 flex items-center justify-center rounded-md">
                        <p className="text-gray-500 text-sm">No thumbnail</p>
                      </div>
                    )}

                    <div className="flex gap-2 mt-2 w-full">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => previewVideo(video.videoId)}
                        disabled={!video.videoId}
                        className="flex-1"
                      >
                        <ExternalLink className="w-4 h-4 mr-1" />
                        Preview
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => removeVideo(index)} className="flex-1">
                        <Trash className="w-4 h-4 mr-1" />
                        Remove
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end mt-4 gap-2">
                  <Button variant="outline" size="sm" onClick={() => moveVideo(index, "up")} disabled={index === 0}>
                    Move Up
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => moveVideo(index, "down")}
                    disabled={index === videos.length - 1}
                  >
                    Move Down
                  </Button>
                </div>
              </div>
            ))}

            {videos.length === 0 && (
              <div className="text-center py-8 text-gray-400">
                <p>No featured videos added yet. Click "Add Video" to get started.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

