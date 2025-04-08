"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Plus, Trash2, ExternalLink, ThumbsUp, Eye } from "lucide-react"
import Image from "next/image"
import { useAuth } from "@/contexts/auth-context"
import { addContentLink, deleteContentLink, getUserContentLinks, likeContentLink } from "@/lib/user-service"
import {
  isValidYouTubeUrl,
  getYouTubeVideoInfo,
  extractYouTubeVideoId,
  getYouTubeEmbedUrl,
} from "@/lib/youtube-service"
import type { ContentLink } from "@/types/auth-types"

export default function ContentLinkManager() {
  const { user, userProfile } = useAuth()
  const [contentLinks, setContentLinks] = useState<ContentLink[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [formData, setFormData] = useState({
    url: "",
    displayName: "",
    type: "youtube" as "youtube" | "article" | "podcast" | "other",
  })
  const [formErrors, setFormErrors] = useState({
    url: "",
    displayName: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const canAddLinks =
    userProfile &&
    (userProfile.roles.media ||
      userProfile.roles.battler ||
      userProfile.roles.league_owner ||
      userProfile.roles.admin ||
      userProfile.roles.community_manager)

  useEffect(() => {
    const fetchContentLinks = async () => {
      if (!user) return

      try {
        const links = await getUserContentLinks(user.id)
        setContentLinks(links)
      } catch (error) {
        console.error("Error fetching content links:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchContentLinks()
  }, [user])

  const validateForm = () => {
    const errors = {
      url: "",
      displayName: "",
    }

    if (!formData.url) {
      errors.url = "URL is required"
    } else if (formData.type === "youtube" && !isValidYouTubeUrl(formData.url)) {
      errors.url = "Invalid YouTube URL"
    }

    if (!formData.displayName) {
      errors.displayName = "Display name is required"
    }

    setFormErrors(errors)
    return !errors.url && !errors.displayName
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm() || !user) return

    setIsSubmitting(true)

    try {
      let thumbnail = ""
      let views = 0

      if (formData.type === "youtube") {
        const videoInfo = await getYouTubeVideoInfo(formData.url)
        thumbnail = videoInfo ? videoInfo.thumbnail : ""
        views = videoInfo ? videoInfo.views : 0
      }

      // const newLink = await addContentLink(user.id, {
      //   url: formData.url,
      //   displayName: formData.displayName,
      //   type: formData.type,
      //   thumbnail,
      //   views,
      // })

      // setContentLinks((prev) => [newLink, ...prev])
      // setIsDialogOpen(false)
      // setFormData({
      //   url: "",
      //   displayName: "",
      //   type: "youtube",
      // })
    } catch (error) {
      console.error("Error adding content link:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!user) return

    try {
      await deleteContentLink(id)
      setContentLinks((prev) => prev.filter((link) => link.id !== id))
    } catch (error) {
      console.error("Error deleting content link:", error)
    }
  }

  const handleLike = async (id: string) => {
    if (!user) return

    try {
      await likeContentLink(id, user.id)
      setContentLinks((prev) =>
        prev.map((link) => {
          if (link.id === id) {
            return { ...link, likes: link.likes + 1 }
          }
          return link
        }),
      )
    } catch (error) {
      console.error("Error liking content link:", error)
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">My Content</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2].map((i) => (
            <Card key={i} className="bg-gray-900 border-gray-800">
              <CardContent className="p-0 h-48 animate-pulse"></CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">My Content</h2>
        {canAddLinks && (
          <Button onClick={() => setIsDialogOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Content
          </Button>
        )}
      </div>

      {contentLinks.length === 0 ? (
        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="p-6 text-center text-gray-400">
            {canAddLinks ? (
              <>
                <p>You haven't added any content yet.</p>
                <Button variant="outline" className="mt-4" onClick={() => setIsDialogOpen(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Your First Content
                </Button>
              </>
            ) : (
              <p>Only media creators, battlers, and league owners can add content links.</p>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {contentLinks.map((link) => (
            <ContentLinkCard key={link.id} link={link} onDelete={handleDelete} onLike={handleLike} isOwner={true} />
          ))}
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-gray-900 border-gray-800">
          <DialogHeader>
            <DialogTitle>Add Content Link</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="type">Content Type</Label>
              <Select
                value={formData.type}
                onValueChange={(value: "youtube" | "article" | "podcast" | "other") =>
                  setFormData((prev) => ({ ...prev, type: value }))
                }
              >
                <SelectTrigger id="type" className="bg-gray-800 border-gray-700">
                  <SelectValue placeholder="Select content type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="youtube">YouTube Video</SelectItem>
                  <SelectItem value="article">Article</SelectItem>
                  <SelectItem value="podcast">Podcast</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="url">URL</Label>
              <Input
                id="url"
                value={formData.url}
                onChange={(e) => setFormData((prev) => ({ ...prev, url: e.target.value }))}
                placeholder={formData.type === "youtube" ? "https://www.youtube.com/watch?v=..." : "https://..."}
                className="bg-gray-800 border-gray-700"
              />
              {formErrors.url && <p className="text-red-500 text-sm">{formErrors.url}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="displayName">Display Name</Label>
              <Input
                id="displayName"
                value={formData.displayName}
                onChange={(e) => setFormData((prev) => ({ ...prev, displayName: e.target.value }))}
                placeholder="How you want this content to be displayed"
                className="bg-gray-800 border-gray-700"
              />
              {formErrors.displayName && <p className="text-red-500 text-sm">{formErrors.displayName}</p>}
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Adding..." : "Add Content"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

interface ContentLinkCardProps {
  link: ContentLink
  onDelete?: (id: string) => void
  onLike: (id: string) => void
  isOwner: boolean
}

export function ContentLinkCard({ link, onDelete, onLike, isOwner }: ContentLinkCardProps) {
  const { user } = useAuth()

  const renderContent = async () => {
    if (link.type === "youtube") {
      const videoId = extractYouTubeVideoId(link.url)
      // if (!videoId) return null

      // const embedUrl = await getYouTubeEmbedUrl(videoId)

      return (
        <div className="relative aspect-video w-full">
          {/* <iframe
            src={embedUrl || ""}
            className="absolute inset-0 w-full h-full"
            allowFullScreen
            title={link.displayName}
          /> */}
        </div>
      )
    }

    return (
      <div className="relative h-48 w-full">
        <Image
          src={link.thumbnail || "/placeholder.svg?height=480&width=640"}
          alt={link.displayName}
          fill
          className="object-cover"
        />
      </div>
    )
  }

  return (
    <Card className="bg-gray-900 border-gray-800 overflow-hidden">
      <CardContent className="p-0">
        {renderContent()}

        <div className="p-4">
          <h3 className="font-semibold text-lg mb-2">{link.displayName}</h3>

          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center gap-1 text-gray-400 hover:text-amber-400"
                onClick={() => onLike(link.id)}
                disabled={!user}
              >
                <ThumbsUp className="w-4 h-4" />
                {link.likes}
              </Button>

              {link.views !== undefined && (
                <span className="flex items-center gap-1 text-sm text-gray-400">
                  <Eye className="w-4 h-4" />
                  {link.views.toLocaleString()}
                </span>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <Button asChild variant="ghost" size="sm">
                <a href={link.url} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="w-4 h-4" />
                </a>
              </Button>

              {isOwner && onDelete && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-red-400 hover:text-red-300"
                  onClick={() => onDelete(link.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

