"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { User, Mail, Calendar, Settings, Shield, Youtube } from "lucide-react"
import PrivacySettings from "@/components/profile/PrivacySettings"
import YouTubeChannelManager from "@/components/profile/YouTubeChannelManager"
import { getUserPrivacySettings, getUserByUsername } from "@/lib/user-service"
import type { UserPrivacySettings } from "@/components/profile/PrivacySettings"
import type { YouTubeChannel } from "@/types/auth-types"
import { useRouter } from "next/navigation"
import QuickStatsWidget from "@/components/battler/QuickStatsWidget"
import LeagueQuickActions from "@/components/league/LeagueQuickActions"

export default function ProfilePage() {
  const { user } = useAuth()
  const [displayName, setDisplayName] = useState("")
  const [username, setUsername] = useState("")
  const [isEditing, setIsEditing] = useState(false)
  const [privacySettings, setPrivacySettings] = useState<UserPrivacySettings | null>(null)
  const [youtubeChannels, setYoutubeChannels] = useState<YouTubeChannel[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Set initial display name from user metadata or email
    if (user) {
      setDisplayName(user.user_metadata?.display_name || user.email?.split("@")[0] || "")
      setUsername(user.user_metadata?.username || user.email?.split("@")[0] || "")

      // Fetch user data
      const fetchUserData = async () => {
        try {
          setIsLoading(true)

          // Fetch privacy settings
          const settings = await getUserPrivacySettings(user.id)
          setPrivacySettings(settings)

          // Fetch user profile to get YouTube channels
          const userProfile = await getUserByUsername(username)
          if (userProfile) {
            // setYoutubeChannels(userProfile.youtubeChannels || [])
          }
        } catch (error) {
          console.error("Error fetching user data:", error)
        } finally {
          setIsLoading(false)
        }
      }

      fetchUserData()
    }
  }, [user, username])

  const handleSaveProfile = async () => {
    // In a real app, this would update the user's profile in Supabase
    setIsEditing(false)
  }

  if (!user) {
    return <div>Loading...</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">My Profile</h1>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="bg-gray-900 border border-gray-800">
          <TabsTrigger value="profile" className="data-[state=active]:bg-gray-800">
            <User className="h-4 w-4 mr-2" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="youtube" className="data-[state=active]:bg-gray-800">
            <Youtube className="h-4 w-4 mr-2" />
            YouTube
          </TabsTrigger>
          <TabsTrigger value="privacy" className="data-[state=active]:bg-gray-800">
            <Shield className="h-4 w-4 mr-2" />
            Privacy
          </TabsTrigger>
          <TabsTrigger value="settings" className="data-[state=active]:bg-gray-800">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle>Account Information</CardTitle>
                  <CardDescription>Your account details and preferences</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-16 h-16 rounded-full bg-gray-800 flex items-center justify-center">
                      <User className="w-8 h-8 text-gray-400" />
                    </div>
                    <div>
                      <p className="font-medium">{displayName}</p>
                      <p className="text-sm text-gray-400">@{username}</p>
                      <p className="text-sm text-gray-400">{user.email}</p>
                    </div>
                  </div>

                  <div className="pt-4 space-y-2">
                    <div className="flex items-center text-sm text-gray-400">
                      <Mail className="w-4 h-4 mr-2" />
                      <span>Email: {user.email}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-400">
                      <Calendar className="w-4 h-4 mr-2" />
                      <span>Joined: {new Date(user.created_at || "").toLocaleDateString()}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="md:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Profile Settings</CardTitle>
                  <CardDescription>Update your profile information</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="displayName">Display Name</Label>
                      {isEditing ? (
                        <Input id="displayName" value={displayName} onChange={(e) => setDisplayName(e.target.value)} />
                      ) : (
                        <div className="flex items-center justify-between">
                          <p className="text-lg">{displayName}</p>
                          <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                            Edit
                          </Button>
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="username">Username</Label>
                      {isEditing ? (
                        <Input id="username" value={username} onChange={(e) => setUsername(e.target.value)} />
                      ) : (
                        <div className="flex items-center justify-between">
                          <p className="text-lg">@{username}</p>
                        </div>
                      )}
                    </div>

                    {isEditing && (
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={() => setIsEditing(false)}>
                          Cancel
                        </Button>
                        <Button onClick={handleSaveProfile}>Save Changes</Button>
                      </div>
                    )}
                  </div>

                  <div className="border-t border-gray-800 pt-6">
                    <h3 className="text-lg font-medium mb-4">Email Preferences</h3>
                    <div className="space-y-4">
                      <div className="flex items-center">
                        <input type="checkbox" id="emailNotifications" className="mr-3" defaultChecked />
                        <Label htmlFor="emailNotifications">Receive email notifications</Label>
                      </div>
                      <div className="flex items-center">
                        <input type="checkbox" id="weeklyDigest" className="mr-3" defaultChecked />
                        <Label htmlFor="weeklyDigest">Receive weekly digest of new battles</Label>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* {user.roles?.battler && <QuickStatsWidget />}

          {user.roles?.league_owner && <LeagueQuickActions />} */}
        </TabsContent>

        <TabsContent value="youtube">
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : (
            <YouTubeChannelManager userId={user.id} channels={youtubeChannels} />
          )}
        </TabsContent>

        <TabsContent value="privacy">
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : (
            <PrivacySettings userId={user.id} initialSettings={privacySettings || undefined} />
          )}
        </TabsContent>

        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Account Settings</CardTitle>
              <CardDescription>Manage your account settings and preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Notification Settings</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="pushNotifications">Push Notifications</Label>
                    <input type="checkbox" id="pushNotifications" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="emailNotifications">Email Notifications</Label>
                    <input type="checkbox" id="emailNotifications" defaultChecked />
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-800 pt-6 space-y-4">
                <h3 className="text-lg font-medium">Account Actions</h3>
                <div className="space-y-3">
                  <Button variant="outline" className="w-full">
                    Export My Data
                  </Button>
                  <Button variant="destructive" className="w-full">
                    Delete Account
                  </Button>
                </div>
              </div>

              <div className="border-t border-gray-800 pt-6 space-y-4">
                <h3 className="text-lg font-medium">Community Manager</h3>
                <p className="text-sm text-gray-400">
                  Community managers can add battlers to the Alt Battle Rap Algorithm and help maintain the platform.
                </p>
                <Button onClick={() => router.push("/request-community-manager")}>
                  Request Community Manager Privileges
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

