"use client"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Edit, MapPin, Calendar, ExternalLink } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import EditProfileDialog from "./EditProfileDialog"
import type { UserProfile } from "@/types/auth-types"

interface UserProfileHeaderProps {
  user: UserProfile
}

export default function UserProfileHeader({ user }: UserProfileHeaderProps) {
  const { user: currentUser } = useAuth()
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)

  const isOwnProfile = currentUser?.id === user.id

  // Get role badges
  const getRoleBadges = () => {
    const badges = []

    if (user.roles.admin) badges.push({ label: "Admin", color: "bg-red-900/30 text-red-400 border-red-700" })
    if (user.roles.media) badges.push({ label: "Media", color: "bg-purple-900/30 text-purple-400 border-purple-700" })
    if (user.roles.battler) badges.push({ label: "Battler", color: "bg-green-900/30 text-green-400 border-green-700" })
    if (user.roles.league_owner)
      badges.push({ label: "League Owner", color: "bg-amber-900/30 text-amber-400 border-amber-700" })
    if (badges.length === 0 || user.roles.fan)
      badges.push({ label: "Fan", color: "bg-blue-900/30 text-blue-400 border-blue-700" })

    return badges
  }

  return (
    <div className="relative">
      {/* Banner */}
      <div className="h-48 md:h-64 rounded-xl overflow-hidden relative">
        <Image
          src={user.bannerImage || "/placeholder.svg?height=200&width=1200"}
          alt={`${user.displayName}'s banner`}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-950 to-transparent"></div>
      </div>

      {/* Profile info */}
      <div className="relative -mt-20 px-4 md:px-8">
        <div className="flex flex-col md:flex-row gap-6 items-start">
          {/* Avatar */}
          <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-gray-900 relative">
            <Image
              src={user.profileImage || "/placeholder.svg?height=400&width=400"}
              alt={user.displayName || "User profile image"}
              fill
              className="object-cover"
            />
          </div>

          {/* Info */}
          <div className="flex-1">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold">{user.displayName}</h1>
                <div className="flex flex-wrap gap-2 mt-2">
                  {getRoleBadges().map((badge, index) => (
                    <Badge key={index} className={badge.color}>
                      {badge.label}
                    </Badge>
                  ))}
                  {user.verified && <Badge className="bg-blue-900/30 text-blue-400 border-blue-700">Verified</Badge>}
                </div>

                <div className="flex flex-wrap gap-4 mt-3 text-sm text-gray-400">
                  {user.location && (
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-1" />
                      {user.location}
                    </div>
                  )}
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    Joined {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "Unknown"}
                  </div>
                  {user.website && (
                    <a
                      href={user.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center hover:text-gray-300"
                    >
                      <ExternalLink className="w-4 h-4 mr-1" />
                      Website
                    </a>
                  )}
                </div>
              </div>

              {isOwnProfile && (
                <Button variant="outline" size="sm" onClick={() => setIsEditDialogOpen(true)}>
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Profile
                </Button>
              )}
            </div>

            {user.bio && <p className="mt-4 text-gray-300">{user.bio}</p>}
          </div>
        </div>
      </div>

      {isOwnProfile && <EditProfileDialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen} user={user} />}
    </div>
  )
}

