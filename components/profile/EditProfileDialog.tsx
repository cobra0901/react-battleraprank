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
import { Camera, Upload, X } from "lucide-react"
import { updateUserProfile } from "@/lib/user-service"
import type { UserProfile } from "@/types/auth-types"

interface EditProfileDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  user: UserProfile
}

export default function EditProfileDialog({ open, onOpenChange, user }: EditProfileDialogProps) {
  const router = useRouter()
  const [formData, setFormData] = useState({
    displayName: user.displayName,
    bio: user.bio || "",
    location: user.location || "",
    website: user.website || "",
    profileImage: user.profileImage || "/placeholder.svg?height=400&width=400",
    bannerImage: user.bannerImage || "/placeholder.svg?height=200&width=1200",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: "profileImage" | "bannerImage") => {
    if (!e.target.files || e.target.files.length === 0) return

    const file = e.target.files[0]

    // In a real app, you would upload to a storage service
    // For now, we'll just use a placeholder
    const imageUrl = `/placeholder.svg?height=${field === "profileImage" ? "400" : "200"}&width=${field === "profileImage" ? "400" : "1200"}&text=${encodeURIComponent(file.name)}`

    setFormData((prev) => ({ ...prev, [field]: imageUrl }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      await updateUserProfile(user.id, formData)
      onOpenChange(false)
      router.refresh()
    } catch (error) {
      console.error("Error updating profile:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] bg-gray-900 border-gray-800">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Banner Image */}
          <div className="space-y-2">
            <Label>Banner Image</Label>
            <div className="relative h-32 rounded-lg overflow-hidden border border-gray-800">
              <Image src={formData.bannerImage || "/placeholder.svg"} alt="Banner" fill className="object-cover" />
              <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 hover:opacity-100 transition-opacity">
                <Label htmlFor="bannerImage" className="cursor-pointer">
                  <div className="flex items-center justify-center gap-2 bg-gray-800 text-white px-4 py-2 rounded-md hover:bg-gray-700">
                    <Camera className="w-4 h-4" />
                    Change Banner
                  </div>
                  <Input
                    id="bannerImage"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleImageUpload(e, "bannerImage")}
                  />
                </Label>
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-6">
            {/* Profile Image */}
            <div className="space-y-2">
              <Label>Profile Image</Label>
              <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-gray-800">
                <Image src={formData.profileImage || "/placeholder.svg"} alt="Profile" fill className="object-cover" />
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 hover:opacity-100 transition-opacity">
                  <Label htmlFor="profileImage" className="cursor-pointer">
                    <div className="flex items-center justify-center gap-2 bg-gray-800 text-white p-2 rounded-full hover:bg-gray-700">
                      <Camera className="w-4 h-4" />
                    </div>
                    <Input
                      id="profileImage"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleImageUpload(e, "profileImage")}
                    />
                  </Label>
                </div>
              </div>
            </div>

            <div className="flex-1 space-y-4">
              {/* Display Name */}
              <div className="space-y-2">
                <Label htmlFor="displayName">Display Name</Label>
                <Input
                  id="displayName"
                  name="displayName"
                  value={formData.displayName}
                  onChange={handleChange}
                  className="bg-gray-800 border-gray-700"
                  required
                />
              </div>

              {/* Location */}
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className="bg-gray-800 border-gray-700"
                  placeholder="City, State"
                />
              </div>

              {/* Website */}
              <div className="space-y-2">
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  name="website"
                  value={formData.website}
                  onChange={handleChange}
                  className="bg-gray-800 border-gray-700"
                  placeholder="https://yourwebsite.com"
                />
              </div>
            </div>
          </div>

          {/* Bio */}
          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              className="bg-gray-800 border-gray-700 min-h-[100px]"
              placeholder="Tell us about yourself..."
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              <Upload className="w-4 h-4 mr-2" />
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

