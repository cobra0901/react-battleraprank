import { notFound } from "next/navigation"
import { getUserByUsername, getUserPrivacySettings } from "@/lib/user-service"
import UserProfileHeader from "@/components/profile/UserProfileHeader"
import MediaContentSection from "@/components/profile/MediaContentSection"
import SocialLinksSection from "@/components/profile/SocialLinksSection"
import UserRatingsSection from "@/components/profile/UserRatingsSection"
import UserBadgesSection from "@/components/profile/UserBadgesSection"
import UserHistoricalDataSection from "@/components/profile/UserHistoricalDataSection"
import YouTubeVideoSection from "@/components/profile/YouTubeVideoSection"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ShieldAlert, Youtube, Video, FileText, Trophy, History, User, BarChart2 } from "lucide-react"

// Import the UserAddedBattlersSection
import UserAddedBattlersSection from "@/components/profile/UserAddedBattlersSection"

export default async function UserProfilePage({ params }: { params: { username: string } }) {
  // In a real app, this would fetch from your database
  const user = await getUserByUsername(params.username)

  if (!user) {
    notFound()
  }

  // Get user privacy settings
  const privacySettings = await getUserPrivacySettings(user.id)
  const visibilityLevel = privacySettings?.visibilityLevel || "medium"
  const showRatings = privacySettings?.showRatings !== false
  const showBadges = privacySettings?.showBadges !== false
  const showHistoricalData = privacySettings?.showHistoricalData === true

  const isMediaUser = user.roles.media
  const isBattler = user.roles.battler
  const isLeagueOwner = user.roles.league_owner

  // Determine profile type for layout
  let profileType = "fan"
  if (isMediaUser) profileType = "media"
  if (isBattler) profileType = "battler"
  if (isLeagueOwner) profileType = "league"

  return (
    <div className="container mx-auto px-4 py-8">
      <UserProfileHeader user={user} />

      {visibilityLevel === "low" && (
        <Alert className="mt-6 bg-gray-900 border-amber-800">
          <ShieldAlert className="h-4 w-4 text-amber-500" />
          <AlertDescription>
            This user has limited their profile visibility. Some information may be hidden.
          </AlertDescription>
        </Alert>
      )}

      {/* Different tab layouts based on user role */}
      {profileType === "media" && (
        <Tabs defaultValue="videos" className="mt-8">
          <TabsList className="mb-6 bg-gray-900 border border-gray-800">
            <TabsTrigger value="videos">
              <Youtube className="h-4 w-4 mr-2" />
              YouTube Videos
            </TabsTrigger>
            <TabsTrigger value="content">
              <Video className="h-4 w-4 mr-2" />
              Media Content
            </TabsTrigger>
            {showRatings && (
              <TabsTrigger value="ratings">
                <Trophy className="h-4 w-4 mr-2" />
                Ratings
              </TabsTrigger>
            )}
            {showBadges && (
              <TabsTrigger value="badges">
                <Trophy className="h-4 w-4 mr-2" />
                Badges
              </TabsTrigger>
            )}
            <TabsTrigger value="about">
              <User className="h-4 w-4 mr-2" />
              About
            </TabsTrigger>
            {showHistoricalData && (
              <TabsTrigger value="history">
                <History className="h-4 w-4 mr-2" />
                History
              </TabsTrigger>
            )}
          </TabsList>

          {/* <TabsContent value="videos">
            {user.youtubeChannels && user.youtubeChannels.length > 0 ? (
              <YouTubeVideoSection channels={user.youtubeChannels} />
            ) : (
              <div className="text-center py-12 text-gray-400">No YouTube channels have been added yet.</div>
            )}
          </TabsContent> */}

          <TabsContent value="content">
            <MediaContentSection userId={user.id} username={params.username} />
          </TabsContent>

          {showRatings && (
            <TabsContent value="ratings">
              <UserRatingsSection userId={user.id} />
            </TabsContent>
          )}

          {showBadges && (
            <TabsContent value="badges">
              <UserBadgesSection userId={user.id} />
            </TabsContent>
          )}

          <TabsContent value="about">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-2 space-y-6">
                <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
                  <h3 className="text-xl font-semibold mb-4">About</h3>
                  <p className="text-gray-300">{user.bio || "No bio provided."}</p>
                </div>

                <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
                  <h3 className="text-xl font-semibold mb-4">Media Outlet</h3>
                  <p className="text-gray-300">{user.mediaOutlet || "No media outlet specified."}</p>
                </div>
              </div>

              {/* <div>
                <SocialLinksSection userId={user.id} socialLinks={user.socialLinks} />
              </div> */}
            </div>
          </TabsContent>

          {showHistoricalData && (
            <TabsContent value="history">
              <UserHistoricalDataSection userId={user.id} />
            </TabsContent>
          )}
        </Tabs>
      )}

      {profileType === "battler" && (
        <Tabs defaultValue="battles" className="mt-8">
          <TabsList className="mb-6 bg-gray-900 border border-gray-800">
            <TabsTrigger value="battles">
              <Video className="h-4 w-4 mr-2" />
              Battles
            </TabsTrigger>
            <TabsTrigger value="stats">
              <BarChart2 className="h-4 w-4 mr-2" />
              Stats
            </TabsTrigger>
            {showRatings && (
              <TabsTrigger value="ratings">
                <Trophy className="h-4 w-4 mr-2" />
                Ratings
              </TabsTrigger>
            )}
            {showBadges && (
              <TabsTrigger value="badges">
                <Trophy className="h-4 w-4 mr-2" />
                Badges
              </TabsTrigger>
            )}
            <TabsTrigger value="about">
              <User className="h-4 w-4 mr-2" />
              About
            </TabsTrigger>
            {showHistoricalData && (
              <TabsTrigger value="history">
                <History className="h-4 w-4 mr-2" />
                History
              </TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="battles">
            <div className="text-center py-12 text-gray-400">Battle history coming soon</div>
          </TabsContent>

          <TabsContent value="stats">
            <div className="text-center py-12 text-gray-400">Battler statistics coming soon</div>
          </TabsContent>

          {showRatings && (
            <TabsContent value="ratings">
              <UserRatingsSection userId={user.id} />
            </TabsContent>
          )}

          {showBadges && (
            <TabsContent value="badges">
              <UserBadgesSection userId={user.id} />
            </TabsContent>
          )}

          <TabsContent value="about">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-2 space-y-6">
                <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
                  <h3 className="text-xl font-semibold mb-4">About</h3>
                  <p className="text-gray-300">{user.bio || "No bio provided."}</p>
                </div>

                <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
                  <h3 className="text-xl font-semibold mb-4">Battle Stats</h3>
                  <p className="text-gray-300">Battle statistics coming soon.</p>
                </div>
              </div>

              {/* <div>
                <SocialLinksSection userId={user.id} socialLinks={user.socialLinks} />
              </div> */}
            </div>
          </TabsContent>

          {showHistoricalData && (
            <TabsContent value="history">
              <UserHistoricalDataSection userId={user.id} />
            </TabsContent>
          )}
        </Tabs>
      )}

      {profileType === "league" && (
        <Tabs defaultValue="events" className="mt-8">
          <TabsList className="mb-6 bg-gray-900 border border-gray-800">
            <TabsTrigger value="events">
              <Video className="h-4 w-4 mr-2" />
              Events
            </TabsTrigger>
            <TabsTrigger value="videos">
              <Youtube className="h-4 w-4 mr-2" />
              YouTube Videos
            </TabsTrigger>
            <TabsTrigger value="roster">
              <User className="h-4 w-4 mr-2" />
              Roster
            </TabsTrigger>
            {showBadges && (
              <TabsTrigger value="badges">
                <Trophy className="h-4 w-4 mr-2" />
                Badges
              </TabsTrigger>
            )}
            <TabsTrigger value="about">
              <FileText className="h-4 w-4 mr-2" />
              About
            </TabsTrigger>
            {showHistoricalData && (
              <TabsTrigger value="history">
                <History className="h-4 w-4 mr-2" />
                History
              </TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="events">
            <div className="text-center py-12 text-gray-400">League events coming soon</div>
          </TabsContent>

          {/* <TabsContent value="videos">
            {user.youtubeChannels && user.youtubeChannels.length > 0 ? (
              <YouTubeVideoSection channels={user.youtubeChannels} />
            ) : (
              <div className="text-center py-12 text-gray-400">No YouTube channels have been added yet.</div>
            )}
          </TabsContent> */}

          <TabsContent value="roster">
            <div className="text-center py-12 text-gray-400">League roster coming soon</div>
          </TabsContent>

          {showBadges && (
            <TabsContent value="badges">
              <UserBadgesSection userId={user.id} />
            </TabsContent>
          )}

          <TabsContent value="about">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-2 space-y-6">
                <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
                  <h3 className="text-xl font-semibold mb-4">About</h3>
                  <p className="text-gray-300">{user.bio || "No bio provided."}</p>
                </div>

                <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
                  <h3 className="text-xl font-semibold mb-4">League Information</h3>
                  <p className="text-gray-300">League information coming soon.</p>
                </div>
              </div>

              {/* <div>
                <SocialLinksSection userId={user.id} socialLinks={user.socialLinks} />
              </div> */}
            </div>
          </TabsContent>

          {showHistoricalData && (
            <TabsContent value="history">
              <UserHistoricalDataSection userId={user.id} />
            </TabsContent>
          )}
        </Tabs>
      )}

      {profileType === "fan" && (
        <Tabs defaultValue="ratings" className="mt-8">
          <TabsList className="mb-6 bg-gray-900 border border-gray-800">
            {showRatings && (
              <TabsTrigger value="ratings">
                <Trophy className="h-4 w-4 mr-2" />
                Ratings
              </TabsTrigger>
            )}
            {showBadges && (
              <TabsTrigger value="badges">
                <Trophy className="h-4 w-4 mr-2" />
                Badges
              </TabsTrigger>
            )}
            <TabsTrigger value="about">
              <User className="h-4 w-4 mr-2" />
              About
            </TabsTrigger>
            {showHistoricalData && (
              <TabsTrigger value="history">
                <History className="h-4 w-4 mr-2" />
                History
              </TabsTrigger>
            )}
          </TabsList>

          {showRatings && (
            <TabsContent value="ratings">
              <UserRatingsSection userId={user.id} />
            </TabsContent>
          )}

          {showBadges && (
            <TabsContent value="badges">
              <UserBadgesSection userId={user.id} />
            </TabsContent>
          )}

          <TabsContent value="about">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-2 space-y-6">
                <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
                  <h3 className="text-xl font-semibold mb-4">About</h3>
                  <p className="text-gray-300">{user.bio || "No bio provided."}</p>
                </div>
              </div>

              {/* <div>
                <SocialLinksSection userId={user.id} socialLinks={user.socialLinks} />
              </div> */}
            </div>
          </TabsContent>

          {showHistoricalData && (
            <TabsContent value="history">
              <UserHistoricalDataSection userId={user.id} />
            </TabsContent>
          )}
        </Tabs>
      )}

      {user.roles.community_manager && (
        <div className="mt-8">
          <UserAddedBattlersSection userId={user.id} />
        </div>
      )}
    </div>
  )
}

