"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Plus, Trash2, Edit, Youtube, ExternalLink } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { updateUserYouTubeChannels } from "@/lib/user-service"
import type { YouTubeChannel } from "@/types/auth-types"

interface YouTubeChannelManagerProps {
  userId: string
  channels: YouTubeChannel[]
}

export default function YouTubeChannelManager({ userId, channels: initialChannels }: YouTubeChannelManagerProps) {
  const { toast } = useToast()
  const [channels, setChannels] = useState<YouTubeChannel[]>(initialChannels || [])
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [currentChannel, setCurrentChannel] = useState<YouTubeChannel | null>(null)
  const [formData, setFormData] = useState({
    url: "",
    name: "",
    description: "",
  })
  const [isSaving, setIsSaving] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleAddChannel = async () => {
    setIsSaving(true)
    try {
      // In a real app, we would validate the YouTube URL and extract the channel ID
      const newChannel: YouTubeChannel = {
        id: `channel-${Date.now()}`,
        url: formData.url,
        name: formData.name,
        description: formData.description,
        subscriberCount: Math.floor(Math.random() * 100000) + 1000,
        videoCount: Math.floor(Math.random() * 500) + 10,
        viewCount: Math.floor(Math.random() * 1000000) + 10000,
      }

      const updatedChannels = [...channels, newChannel]
      const contentLinks = updatedChannels.map(channel => ({
        ...channel,
        userId,
        displayName: channel.name,
        type: "youtube" as const,
        createdAt: new Date().toISOString(),
        likes: 0,
      }))
      await updateUserYouTubeChannels(userId, contentLinks)
      setChannels(updatedChannels)

      toast({
        title: "Channel added",
        description: "Your YouTube channel has been added successfully.",
      })

      setIsAddDialogOpen(false)
      resetForm()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add YouTube channel. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleEditChannel = async () => {
    if (!currentChannel) return

    setIsSaving(true)
    try {
      const updatedChannels = channels.map((channel) =>
        channel.id === currentChannel.id
          ? {
              ...channel,
              url: formData.url,
              name: formData.name,
              description: formData.description,
            }
          : channel,
      )

      const contentLinks = updatedChannels.map(channel => ({
        ...channel,
        userId,
        displayName: channel.name,
        type: "youtube" as const,
        createdAt: new Date().toISOString(),
        likes: 0,
      }))
      await updateUserYouTubeChannels(userId, contentLinks)
      setChannels(updatedChannels)

      toast({
        title: "Channel updated",
        description: "Your YouTube channel has been updated successfully.",
      })

      setIsEditDialogOpen(false)
      resetForm()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update YouTube channel. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleDeleteChannel = async () => {
    if (!currentChannel) return

    try {
      const updatedChannels = channels.filter((channel) => channel.id !== currentChannel.id)
      const contentLinks = updatedChannels.map(channel => ({
        ...channel,
        userId,
        displayName: channel.name,
        type: "youtube" as const,
        createdAt: new Date().toISOString(),
        likes: 0,
      }))
      await updateUserYouTubeChannels(userId, contentLinks)
      setChannels(updatedChannels)

      toast({
        title: "Channel deleted",
        description: "Your YouTube channel has been deleted successfully.",
      })

      setIsDeleteDialogOpen(false)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete YouTube channel. Please try again.",
        variant: "destructive",
      })
    }
  }

  const openEditDialog = (channel: YouTubeChannel) => {
    setCurrentChannel(channel)
    setFormData({
      url: channel.url,
      name: channel.name,
      description: channel.description || "",
    })
    setIsEditDialogOpen(true)
  }

  const openDeleteDialog = (channel: YouTubeChannel) => {
    setCurrentChannel(channel)
    setIsDeleteDialogOpen(true)
  }

  const resetForm = () => {
    setFormData({
      url: "",
      name: "",
      description: "",
    })
    setCurrentChannel(null)
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Youtube className="h-5 w-5 text-red-500" />
              YouTube Channels
            </CardTitle>
            <CardDescription>Manage your YouTube channels and videos</CardDescription>
          </div>
          <Button size="sm" onClick={() => setIsAddDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Channel
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {channels.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            You haven't added any YouTube channels yet. Click "Add Channel" to get started.
          </div>
        ) : (
          <div className="space-y-4">
            {channels.map((channel) => (
              <div
                key={channel.id}
                className="flex flex-col md:flex-row md:items-center justify-between p-4 rounded-lg border border-gray-800 bg-gray-900"
              >
                <div className="space-y-2 mb-4 md:mb-0">
                  <h3 className="font-medium text-lg flex items-center gap-2">
                    <Youtube className="h-4 w-4 text-red-500" />
                    {channel.name}
                  </h3>
                  {channel.description && <p className="text-sm text-gray-400">{channel.description}</p>}
                  <div className="flex flex-wrap gap-4 text-sm text-gray-400">
                    <span>{channel.subscriberCount?.toLocaleString()} subscribers</span>
                    <span>{channel.videoCount?.toLocaleString()} videos</span>
                    <span>{channel.viewCount?.toLocaleString()} views</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" asChild>
                    <a href={channel.url} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Visit
                    </a>
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => openEditDialog(channel)}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-red-500"
                    onClick={() => openDeleteDialog(channel)}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Add Channel Dialog */}
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Add YouTube Channel</DialogTitle>
              <DialogDescription>Add your YouTube channel to showcase your videos on your profile.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="url">Channel URL</Label>
                <Input
                  id="url"
                  name="url"
                  placeholder="https://youtube.com/c/yourchannel"
                  value={formData.url}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="name">Channel Name</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Your Channel Name"
                  value={formData.name}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description (Optional)</Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Brief description of your channel"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddChannel} disabled={isSaving || !formData.url || !formData.name}>
                {isSaving ? "Adding..." : "Add Channel"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Channel Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Edit YouTube Channel</DialogTitle>
              <DialogDescription>Update your YouTube channel information.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-url">Channel URL</Label>
                <Input
                  id="edit-url"
                  name="url"
                  placeholder="https://youtube.com/c/yourchannel"
                  value={formData.url}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-name">Channel Name</Label>
                <Input
                  id="edit-name"
                  name="name"
                  placeholder="Your Channel Name"
                  value={formData.name}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-description">Description (Optional)</Label>
                <Textarea
                  id="edit-description"
                  name="description"
                  placeholder="Brief description of your channel"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleEditChannel} disabled={isSaving || !formData.url || !formData.name}>
                {isSaving ? "Saving..." : "Save Changes"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Channel Dialog */}
        <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete YouTube Channel</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete this YouTube channel? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDeleteChannel} className="bg-red-500 hover:bg-red-600">
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardContent>
    </Card>
  )
}

