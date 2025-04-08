export const dynamic = "force-dynamic";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getTopRaters, getTopContributors, getUserStats } from "@/lib/stats-service"
import UserLeaderboard from "@/components/leaderboard/UserLeaderboard"
import UserStatsOverview from "@/components/leaderboard/UserStatsOverview"
import TopContributorCards from "@/components/leaderboard/TopContributorCards"
import { Trophy, Star, Award, Users } from "lucide-react"

export default async function LeaderboardPage() {
  // Fetch top users by different metrics 
  const topRaters = await getTopRaters()
  const topContributors = await getTopContributors()
  const userStats = await getUserStats('123')

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-8">
        <Trophy className="w-6 h-6 mr-2 text-amber-500" />
        <h1 className="text-3xl font-bold">Community Leaderboard</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* <div className="lg:col-span-2">
          <UserStatsOverview stats={userStats} />
        </div>
        <div>
          <TopContributorCards contributors={topContributors} />
        </div> */}
      </div>

      <Tabs defaultValue="most-ratings" className="mb-8">
        <TabsList className="mb-6 bg-gray-900 border border-gray-800">
          <TabsTrigger value="most-ratings">
            <Star className="w-4 h-4 mr-2" />
            Most Ratings
          </TabsTrigger>
          <TabsTrigger value="most-accurate">
            <Award className="w-4 h-4 mr-2" />
            Most Accurate
          </TabsTrigger>
          <TabsTrigger value="most-followed">
            <Users className="w-4 h-4 mr-2" />
            Most Followed
          </TabsTrigger>
        </TabsList>

        <TabsContent value="most-ratings">
          <Card>
            <CardHeader>
              <CardTitle>Top Raters</CardTitle>
              <CardDescription>Users who have rated the most battlers</CardDescription>
            </CardHeader>
            <CardContent>
              {/* <UserLeaderboard users={topRaters} metric="ratings" /> */}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="most-accurate">
          <Card>
            <CardHeader>
              <CardTitle>Most Accurate Raters</CardTitle>
              <CardDescription>Users whose ratings most closely match the community consensus</CardDescription>
            </CardHeader>
            <CardContent>
              {/* <UserLeaderboard users={topRaters.sort((a, b) => b.accuracyScore - a.accuracyScore)} metric="accuracy" /> */}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="most-followed">
          <Card>
            <CardHeader>
              <CardTitle>Most Followed Users</CardTitle>
              <CardDescription>Users with the most followers in the community</CardDescription>
            </CardHeader>
            <CardContent>
              {/* <UserLeaderboard users={topRaters.sort((a, b) => b.followers - a.followers)} metric="followers" /> */}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="bg-gray-900 p-6 rounded-lg border border-gray-800">
        <h2 className="text-xl font-bold mb-4">How Rankings Work</h2>
        <div className="space-y-4 text-gray-300">
          <p>Our leaderboard rankings are calculated based on several factors:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <strong>Most Ratings</strong> - Based on the total number of battlers rated by each user.
            </li>
            <li>
              <strong>Accuracy Score</strong> - Calculated by comparing a user's ratings to the community average. The
              closer your ratings are to the consensus, the higher your accuracy score.
            </li>
            <li>
              <strong>Followers</strong> - The number of community members who follow your profile to see your ratings
              and content.
            </li>
          </ul>
          <p>
            Rankings are updated daily. Keep rating battlers and contributing to the community to improve your ranking!
          </p>
        </div>
      </div>
    </div>
  )
}

