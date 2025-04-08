"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Search, Plus, Award, X, Save } from "lucide-react"
import type { UserProfile } from "@/types/auth-types"

interface UserBadgeManagerProps {
  users: UserProfile[]
  filter: string
}

export default function UserBadgeManager({ users, filter }: UserBadgeManagerProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [availableBadges, setAvailableBadges] = useState<string[]>([
    "Top Contributor",
    "Expert Analyst",
    "Verified Critic",
    "Community Leader",
    "Battle Historian",
    "Culture Curator",
    "Trusted Source",
    "Elite Rater",
    "Content Creator",
    "Veteran Member",
  ])
  const [selectedBadges, setSelectedBadges] = useState<string[]>([])
  const [customBadge, setCustomBadge] = useState("")

  // Filter users based on search query
  // const filteredUsers = users.filter(
  //   (user) =>
  //     user.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
  //     user.username.toLowerCase().includes(searchQuery.toLowerCase()),
  // )

  const handleOpenBadgeDialog = (user: UserProfile) => {
    setSelectedUser(user)
    // In a real app, you would fetch the user's current badges here
    setSelectedBadges(user.badges || [])
    setIsDialogOpen(true)
  }

  const handleAddCustomBadge = () => {
    if (customBadge.trim() && !availableBadges.includes(customBadge)) {
      setAvailableBadges((prev) => [...prev, customBadge])
      setCustomBadge("")
    }
  }

  const handleToggleBadge = (badge: string) => {
    if (selectedBadges.includes(badge)) {
      setSelectedBadges((prev) => prev.filter((b) => b !== badge))
    } else {
      setSelectedBadges((prev) => [...prev, badge])
    }
  }

  const handleSaveBadges = async () => {
    if (!selectedUser) return

    try {
      // In a real app, this would update the user's badges in the database
      // For now, we'll just close the dialog
      console.log(`Saving badges for ${selectedUser.displayName}:`, selectedBadges)
      setIsDialogOpen(false)
    } catch (error) {
      console.error("Error saving badges:", error)
    }
  }

  const getRoleBadge = (user: UserProfile) => {
    if (user.roles.media) {
      return <Badge className="bg-purple-900/30 text-purple-400 border-purple-700">Media</Badge>
    }
    if (user.roles.battler) {
      return <Badge className="bg-green-900/30 text-green-400 border-green-700">Battler</Badge>
    }
    if (user.roles.league_owner) {
      return <Badge className="bg-amber-900/30 text-amber-400 border-amber-700">League Owner</Badge>
    }
    return null
  }

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-gray-900 border-gray-700"
          />
        </div>
      </div>

      {/* <div className="space-y-4">
        {filteredUsers.length === 0 ? (
          <div className="text-center py-8 text-gray-400">No users found matching your search criteria</div>
        ) : (
          filteredUsers.map((user) => (
            <div key={user.id} className="flex items-center gap-4 p-4 bg-gray-900 rounded-lg border border-gray-800">
              <Link href={`/profile/${user.username}`} className="flex items-center gap-3 flex-1">
                <div className="relative w-12 h-12 rounded-full overflow-hidden">
                  <Image
                    src={user.profileImage || "/placeholder.svg"}
                    alt={user.displayName}
                    fill
                    className="object-cover"
                  />
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium">{user.displayName}</h3>
                    {getRoleBadge(user)}
                    {user.verified && <Badge className="bg-blue-900/30 text-blue-400 border-blue-700">Verified</Badge>}
                  </div>
                  <p className="text-sm text-gray-400">@{user.username}</p>
                </div>
              </Link>

              <div className="flex flex-wrap gap-2 max-w-md">
                {user.badges?.map((badge) => (
                  <Badge key={badge} className="bg-gray-800 text-gray-300">
                    {badge}
                  </Badge>
                ))}
              </div>

              <Button variant="outline" size="sm" onClick={() => handleOpenBadgeDialog(user)}>
                <Award className="w-4 h-4 mr-1" />
                Manage Badges
              </Button>
            </div>
          ))
        )}
      </div> */}

      {/* Badge Management Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px] bg-gray-900 border-gray-800">
          <DialogHeader>
            <DialogTitle>Manage Badges for {selectedUser?.displayName}</DialogTitle>
          </DialogHeader>

          <div className="space-y-6 py-4">
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Current Badges</h3>
              <div className="flex flex-wrap gap-2 min-h-[40px] p-2 border border-gray-800 rounded-md">
                {selectedBadges.length === 0 ? (
                  <p className="text-sm text-gray-500">No badges assigned</p>
                ) : (
                  selectedBadges.map((badge) => (
                    <Badge key={badge} className="bg-gray-800 text-gray-300 flex items-center gap-1">
                      {badge}
                      <button onClick={() => handleToggleBadge(badge)} className="ml-1 hover:text-red-400">
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))
                )}
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-medium">Available Badges</h3>
              <div className="flex flex-wrap gap-2 p-2 border border-gray-800 rounded-md">
                {availableBadges
                  .filter((badge) => !selectedBadges.includes(badge))
                  .map((badge) => (
                    <Badge
                      key={badge}
                      variant="outline"
                      className="cursor-pointer hover:bg-gray-800"
                      onClick={() => handleToggleBadge(badge)}
                    >
                      <Plus className="w-3 h-3 mr-1" />
                      {badge}
                    </Badge>
                  ))}
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-medium">Add Custom Badge</h3>
              <div className="flex gap-2">
                <Input
                  placeholder="Enter custom badge name"
                  value={customBadge}
                  onChange={(e) => setCustomBadge(e.target.value)}
                  className="bg-gray-800 border-gray-700"
                />
                <Button variant="outline" onClick={handleAddCustomBadge} disabled={!customBadge.trim()}>
                  <Plus className="w-4 h-4 mr-1" />
                  Add
                </Button>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveBadges}>
              <Save className="w-4 h-4 mr-1" />
              Save Badges
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

