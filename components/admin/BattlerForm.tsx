"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { createBattler, updateBattler } from "@/lib/data-service"
import { uploadImage } from "@/lib/upload-service"
import { isCommunityManager } from "@/lib/user-service"
import type { Battler } from "@/lib/data-service"
import { X, Upload, Save, AlertTriangle } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { updateUserAddedBattler } from "@/lib/user-service"

interface BattlerFormProps {
  battler?: Battler
}

export default function BattlerForm({ battler }: BattlerFormProps) {
  const router = useRouter()
  const isEditing = !!battler
  const { user } = useAuth()
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [isCheckingAuth, setIsCheckingAuth] = useState(true)

  const [formData, setFormData] = useState({
    name: battler?.name || "",
    location: battler?.location || "",
    image: battler?.image || "/placeholder.svg?height=400&width=400",
    banner: battler?.banner || "/placeholder.svg?height=200&width=1200",
    tags: battler?.tags.join(", ") || "",
    totalPoints: battler?.totalPoints || 0,
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    const checkAuthorization = async () => {
      if (!user) {
        setIsAuthorized(false)
        setIsCheckingAuth(false)
        return
      }

      try {
        // Check if user is a community manager or admin
        const isCM = await isCommunityManager(user.id)
        setIsAuthorized(isCM || user.role === "admin")
      } catch (error) {
        console.error("Error checking authorization:", error)
        setIsAuthorized(false)
      } finally {
        setIsCheckingAuth(false)
      }
    }

    checkAuthorization()
  }, [user])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: "image" | "banner") => {
    if (!e.target.files || e.target.files.length === 0) return

    const file = e.target.files[0]

    try {
      const formData = new FormData()
      formData.append("file", file)

      const imageUrl = await uploadImage(formData)

      setFormData((prev) => ({ ...prev, [field]: imageUrl }))
    } catch (error) {
      console.error(`Error uploading ${field}:`, error)
      setError(`Failed to upload ${field}. Please try again.`)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!isAuthorized) {
      setError("You don't have permission to perform this action")
      return
    }

    setError("")
    setIsSubmitting(true)

    try {
      const battlerData = {
        name: formData.name,
        location: formData.location,
        image: formData.image,
        banner: formData.banner,
        tags: formData.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean),
        totalPoints: Number(formData.totalPoints),
        addedBy: user?.id, // Track who added the battler
        addedAt: new Date().toISOString(),
      }

      if (isEditing && battler) {
        await updateBattler(battler.id, battlerData)
      } else {
        const newBattler = await createBattler(battlerData)

        // Update the user's addedBattlers array
        if (user) {
          await updateUserAddedBattler(user.id)
        }
      }

      router.push("/admin/battlers")
      router.refresh()
    } catch (error) {
      console.error("Error saving battler:", error)
      setError("Failed to save battler. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isCheckingAuth) {
    return (
      <Card>
        <CardContent className="pt-6 flex justify-center items-center min-h-[200px]">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
        </CardContent>
      </Card>
    )
  }

  if (!isAuthorized) {
    return (
      <Card>
        <CardContent className="pt-6">
          <Alert variant="destructive" className="mb-4">
            <AlertTriangle className="h-4 w-4 mr-2" />
            <AlertDescription>
              You don't have permission to add or edit battlers. Only community managers and admins can perform this
              action.
            </AlertDescription>
          </Alert>

          <div className="text-center py-4">
            <h3 className="text-lg font-medium mb-2">Want to become a community manager?</h3>
            <p className="text-sm text-gray-400 mb-4">
              Community managers can add battlers to the Alt Battle Rap Algorithm and help maintain the platform.
            </p>
            <Button onClick={() => router.push("/request-community-manager")}>
              Request Community Manager Privileges
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="p-3 text-sm bg-red-900/30 border border-red-800 text-red-400 rounded-md">{error}</div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Battler name"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="City, State"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tags">Tags (comma separated)</Label>
                <Input
                  id="tags"
                  name="tags"
                  value={formData.tags}
                  onChange={handleChange}
                  placeholder="URL, Veteran, Lyricist"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="totalPoints">Initial Rating</Label>
                <Input
                  id="totalPoints"
                  name="totalPoints"
                  type="number"
                  min="0"
                  max="10"
                  step="0.1"
                  value={formData.totalPoints}
                  onChange={handleChange}
                  placeholder="0.0"
                />
              </div>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <Label>Profile Image</Label>
                <div className="flex items-center gap-4">
                  <div className="w-24 h-24 relative rounded-full overflow-hidden border border-gray-800">
                    <Image src={formData.image || "/placeholder.svg"} alt="Profile" fill className="object-cover" />
                  </div>
                  <div className="flex-1">
                    <Label htmlFor="image" className="cursor-pointer">
                      <div className="flex items-center justify-center w-full h-10 bg-gray-800 hover:bg-gray-700 rounded-md transition-colors">
                        <Upload className="w-4 h-4 mr-2" />
                        Upload Image
                      </div>
                      <Input
                        id="image"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleImageUpload(e, "image")}
                      />
                    </Label>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Banner Image</Label>
                <div className="space-y-2">
                  <div className="w-full h-32 relative rounded-md overflow-hidden border border-gray-800">
                    <Image src={formData.banner || "/placeholder.svg"} alt="Banner" fill className="object-cover" />
                  </div>
                  <Label htmlFor="banner" className="cursor-pointer">
                    <div className="flex items-center justify-center w-full h-10 bg-gray-800 hover:bg-gray-700 rounded-md transition-colors">
                      <Upload className="w-4 h-4 mr-2" />
                      Upload Banner
                    </div>
                    <Input
                      id="banner"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleImageUpload(e, "banner")}
                    />
                  </Label>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/admin/battlers")}
              disabled={isSubmitting}
            >
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            >
              <Save className="w-4 h-4 mr-2" />
              {isSubmitting ? "Saving..." : isEditing ? "Update Battler" : "Create Battler"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

