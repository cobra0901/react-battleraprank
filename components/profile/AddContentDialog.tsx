"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Upload, X, Camera } from "lucide-react"
import { addUserContent } from "@/lib/content-service"
import type { MediaContent } from "@/types/content-types"

interface AddContentDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  userId: string
  onContentAdded: (content: MediaContent) => void
}

export default function AddContentDialog({ open, onOpenChange, userId, onContentAdded }: AddContentDialogProps) {
  const router = useRouter()
  const [formData, setFormData] = useState<Partial<MediaContent>>({
    title: "",
    description: "",
    url: "",
    type: "video",
    thumbnail: "/placeholder.svg?height=300&width=600",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (value: string) => {
    setFormData((prev) => ({ ...prev, type: value as "video" | "article" | "podcast" }))
  }

  const handleThumbnailUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return

    const file = e.target.files[0]

    // In a real app, you would upload to a storage service
    // For now, we'll just use a placeholder
    const imageUrl = `/placeholder.svg?height=300&width=600&text=${encodeURIComponent(file.name)}`

    setFormData((prev) => ({ ...prev, thumbnail: imageUrl }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const newContent = await addUserContent(userId, formData)
      onContentAdded(newContent)
      onOpenChange(false)
      router.refresh()

      // Reset form
      setFormData({
        title: "",
        description: "",
        url: "",
        type: "video",
        thumbnail: "/placeholder.svg?height=300&width=600",
      })
    } catch (error) {
      console.error("Error adding content:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] bg-gray-900 border-gray-800">
        <DialogHeader>
          <DialogTitle>Add New Content</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Content Type */}
          <div className="space-y-2">
            <Label htmlFor="type">Content Type</Label>
            <Select value={formData.type} onValueChange={handleSelectChange}>
              <SelectTrigger id="type" className="bg-gray-800 border-gray-700">
                <SelectValue placeholder="Select content type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="video">Video</SelectItem>
                <SelectItem value="article">Article</SelectItem>
                <SelectItem value="podcast">Podcast</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="bg-gray-800 border-gray-700"
              required
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="bg-gray-800 border-gray-700 min-h-[100px]"
              required
            />
          </div>

          {/* URL */}
          <div className="space-y-2">
            <Label htmlFor="url">Content URL</Label>
            <Input
              id="url"
              name="url"
              value={formData.url}
              onChange={handleChange}
              className="bg-gray-800 border-gray-700"
              placeholder="https://example.com/your-content"
              required
            />
          </div>

          {/* Thumbnail */}
          <div className="space-y-2">
            <Label>Thumbnail</Label>
            <div className="relative h-40 rounded-lg overflow-hidden border border-gray-800">
              <Image src={formData.thumbnail || "/placeholder.svg"} alt="Thumbnail" fill className="object-cover" />
              <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 hover:opacity-100 transition-opacity">
                <Label htmlFor="thumbnail" className="cursor-pointer">
                  <div className="flex items-center justify-center gap-2 bg-gray-800 text-white px-4 py-2 rounded-md hover:bg-gray-700">
                    <Camera className="w-4 h-4" />
                    Upload Thumbnail
                  </div>
                  <Input
                    id="thumbnail"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleThumbnailUpload}
                  />
                </Label>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              <Upload className="w-4 h-4 mr-2" />
              {isSubmitting ? "Adding..." : "Add Content"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

