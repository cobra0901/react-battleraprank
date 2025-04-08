"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Edit, Save, X, Youtube, Twitter, Instagram, LinkIcon } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { updateUserSocialLinks } from "@/lib/user-service"
import type { SocialLinks } from "@/types/auth-types"

interface SocialLinksSectionProps {
  userId: string
  socialLinks: SocialLinks
}

export default function SocialLinksSection({ userId, socialLinks }: SocialLinksSectionProps) {
  const { user: currentUser } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [links, setLinks] = useState<SocialLinks>(
    socialLinks || {
      youtube: "",
      twitter: "",
      instagram: "",
      website: "",
    },
  )
  const [isSubmitting, setIsSubmitting] = useState(false)

  const isOwnProfile = currentUser?.id === userId

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setLinks((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      await updateUserSocialLinks(userId, links)
      setIsEditing(false)
    } catch (error) {
      console.error("Error updating social links:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold">Social Links</h3>
        {isOwnProfile && !isEditing && (
          <Button variant="ghost" size="sm" onClick={() => setIsEditing(true)}>
            <Edit className="w-4 h-4 mr-2" />
            Edit
          </Button>
        )}
      </div>

      {isEditing ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="youtube" className="flex items-center">
              <Youtube className="w-4 h-4 mr-2 text-red-500" />
              YouTube
            </Label>
            <Input
              id="youtube"
              name="youtube"
              value={links.youtube}
              onChange={handleChange}
              className="bg-gray-800 border-gray-700"
              placeholder="https://youtube.com/@yourchannel"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="twitter" className="flex items-center">
              <Twitter className="w-4 h-4 mr-2 text-blue-400" />
              Twitter
            </Label>
            <Input
              id="twitter"
              name="twitter"
              value={links.twitter}
              onChange={handleChange}
              className="bg-gray-800 border-gray-700"
              placeholder="https://twitter.com/yourusername"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="instagram" className="flex items-center">
              <Instagram className="w-4 h-4 mr-2 text-pink-500" />
              Instagram
            </Label>
            <Input
              id="instagram"
              name="instagram"
              value={links.instagram}
              onChange={handleChange}
              className="bg-gray-800 border-gray-700"
              placeholder="https://instagram.com/yourusername"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="website" className="flex items-center">
              <LinkIcon className="w-4 h-4 mr-2 text-gray-400" />
              Website
            </Label>
            <Input
              id="website"
              name="website"
              value={links.website}
              onChange={handleChange}
              className="bg-gray-800 border-gray-700"
              placeholder="https://yourwebsite.com"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsEditing(false)}
              disabled={isSubmitting}
            >
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
            <Button type="submit" size="sm" disabled={isSubmitting}>
              <Save className="w-4 h-4 mr-2" />
              {isSubmitting ? "Saving..." : "Save"}
            </Button>
          </div>
        </form>
      ) : (
        <div className="space-y-4">
          {links.youtube ? (
            <a
              href={links.youtube}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center text-gray-300 hover:text-red-400 transition-colors"
            >
              <Youtube className="w-5 h-5 mr-3 text-red-500" />
              YouTube Channel
            </a>
          ) : isOwnProfile ? (
            <div className="flex items-center text-gray-500">
              <Youtube className="w-5 h-5 mr-3 text-gray-500" />
              Add your YouTube channel
            </div>
          ) : null}

          {links.twitter ? (
            <a
              href={links.twitter}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center text-gray-300 hover:text-blue-400 transition-colors"
            >
              <Twitter className="w-5 h-5 mr-3 text-blue-400" />
              Twitter
            </a>
          ) : isOwnProfile ? (
            <div className="flex items-center text-gray-500">
              <Twitter className="w-5 h-5 mr-3 text-gray-500" />
              Add your Twitter
            </div>
          ) : null}

          {links.instagram ? (
            <a
              href={links.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center text-gray-300 hover:text-pink-400 transition-colors"
            >
              <Instagram className="w-5 h-5 mr-3 text-pink-500" />
              Instagram
            </a>
          ) : isOwnProfile ? (
            <div className="flex items-center text-gray-500">
              <Instagram className="w-5 h-5 mr-3 text-gray-500" />
              Add your Instagram
            </div>
          ) : null}

          {links.website ? (
            <a
              href={links.website}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center text-gray-300 hover:text-gray-100 transition-colors"
            >
              <LinkIcon className="w-5 h-5 mr-3 text-gray-400" />
              Website
            </a>
          ) : isOwnProfile ? (
            <div className="flex items-center text-gray-500">
              <LinkIcon className="w-5 h-5 mr-3 text-gray-500" />
              Add your website
            </div>
          ) : null}

          {!links.youtube && !links.twitter && !links.instagram && !links.website && !isOwnProfile && (
            <p className="text-gray-500 italic">No social links provided</p>
          )}
        </div>
      )}
    </div>
  )
}

