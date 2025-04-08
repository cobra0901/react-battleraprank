"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Plus, ThumbsUp, Calendar, ExternalLink, Edit, Trash2 } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import AddContentDialog from "./AddContentDialog"
import { getUserContent, likeContent } from "@/lib/content-service"
import type { MediaContent } from "@/types/content-types"

interface MediaContentSectionProps {
  userId: string
  username: string
}

export default function MediaContentSection({ userId, username }: MediaContentSectionProps) {
  const { user: currentUser } = useAuth()
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [content, setContent] = useState<MediaContent[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("all")

  const isOwnProfile = currentUser?.id === userId

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const data = await getUserContent(userId)
        setContent(data)
      } catch (error) {
        console.error("Error fetching content:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchContent()
  }, [userId])

  const handleLike = async (contentId: string) => {
    if (!currentUser) return

    try {
      await likeContent(contentId)

      // Update local state
      setContent((prev) =>
        prev.map((item) => {
          if (item.id === contentId) {
            return {
              ...item,
              likes: item.likes + 1,
              likedByCurrentUser: true,
            }
          }
          return item
        }),
      )
    } catch (error) {
      console.error("Error liking content:", error)
    }
  }

  const filteredContent = activeTab === "all" ? content : content.filter((item) => item.type === activeTab)

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Media Content</h2>
        {isOwnProfile && (
          <Button onClick={() => setIsAddDialogOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Content
          </Button>
        )}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList className="bg-gray-900 border border-gray-800">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="video">Videos</TabsTrigger>
          <TabsTrigger value="article">Articles</TabsTrigger>
          <TabsTrigger value="podcast">Podcasts</TabsTrigger>
        </TabsList>
      </Tabs>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="bg-gray-900 border-gray-800">
              <CardContent className="p-0 h-48 animate-pulse"></CardContent>
            </Card>
          ))}
        </div>
      ) : filteredContent.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          {isOwnProfile
            ? "You haven't added any content yet. Click 'Add Content' to get started."
            : `${username} hasn't added any content yet.`}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredContent.map((item) => (
            <ContentCard key={item.id} content={item} isOwner={isOwnProfile} onLike={handleLike} />
          ))}
        </div>
      )}

      {isOwnProfile && (
        <AddContentDialog
          open={isAddDialogOpen}
          onOpenChange={setIsAddDialogOpen}
          userId={userId}
          onContentAdded={(newContent) => {
            setContent((prev) => [newContent, ...prev])
          }}
        />
      )}
    </div>
  )
}

interface ContentCardProps {
  content: MediaContent
  isOwner: boolean
  onLike: (contentId: string) => void
}

function ContentCard({ content, isOwner, onLike }: ContentCardProps) {
  const { user } = useAuth()

  const getTypeColor = (type: string) => {
    switch (type) {
      case "video":
        return "bg-red-900/30 text-red-400 border-red-700"
      case "article":
        return "bg-blue-900/30 text-blue-400 border-blue-700"
      case "podcast":
        return "bg-green-900/30 text-green-400 border-green-700"
      default:
        return "bg-gray-900/30 text-gray-400 border-gray-700"
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })
  }

  return (
    <Card className="bg-gray-900 border-gray-800 overflow-hidden hover:border-amber-500 transition-all">
      <CardContent className="p-0">
        <div className="flex flex-col">
          {content.thumbnail && (
            <div className="relative h-48 w-full">
              <Image src={content.thumbnail || "/placeholder.svg"} alt={content.title} fill className="object-cover" />
              <Badge className={`absolute top-2 right-2 ${getTypeColor(content.type)}`}>
                {content.type.charAt(0).toUpperCase() + content.type.slice(1)}
              </Badge>
              {isOwner && (
                <div className="absolute top-2 left-2 flex gap-1">
                  <Button variant="ghost" size="icon" className="h-8 w-8 bg-black/50 hover:bg-black/70">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 bg-black/50 hover:bg-black/70 text-red-400 hover:text-red-300"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          )}

          <div className="p-4">
            <h3 className="font-semibold text-lg mb-2">{content.title}</h3>
            <p className="text-gray-400 text-sm line-clamp-2 mb-3">{content.description}</p>

            <div className="flex justify-between items-center">
              <div className="flex items-center text-sm text-gray-400">
                <Calendar className="w-4 h-4 mr-1" />
                {formatDate(content.createdAt)}
              </div>

              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className={`flex items-center gap-1 ${content.likedByCurrentUser ? "text-amber-400" : "text-gray-400 hover:text-amber-400"}`}
                  onClick={() => !content.likedByCurrentUser && onLike(content.id)}
                  disabled={!user || content.likedByCurrentUser}
                >
                  <ThumbsUp className="w-4 h-4" />
                  {content.likes}
                </Button>

                <Button asChild variant="ghost" size="sm" className="text-gray-400 hover:text-gray-300">
                  <a href={content.url} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="w-4 h-4 mr-1" />
                    View
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

