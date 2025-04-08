export const dynamic = "force-dynamic";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getAllUsers } from "@/lib/user-service"
import UserBadgeManager from "@/components/admin/UserBadgeManager"

export default async function UserBadgesPage() {
  const users = await getAllUsers()

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">User Badge Management</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Manage User Badges</CardTitle>
          <CardDescription>Assign special badges to users based on their contributions and roles</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all">
            <TabsList className="mb-6 bg-gray-900 border border-gray-800">
              <TabsTrigger value="all">All Users</TabsTrigger>
              <TabsTrigger value="media">Media</TabsTrigger>
              <TabsTrigger value="battlers">Battlers</TabsTrigger>
              <TabsTrigger value="league-owners">League Owners</TabsTrigger>
            </TabsList>

            <TabsContent value="all">
              <UserBadgeManager users={users} filter="all" />
            </TabsContent>

            <TabsContent value="media">
              <UserBadgeManager users={users.filter((user) => user.roles.media)} filter="media" />
            </TabsContent>

            <TabsContent value="battlers">
              <UserBadgeManager users={users.filter((user) => user.roles.battler)} filter="battlers" />
            </TabsContent>

            <TabsContent value="league-owners">
              <UserBadgeManager users={users.filter((user) => user.roles.league_owner)} filter="league-owners" />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

