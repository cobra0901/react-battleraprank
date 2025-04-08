export const dynamic = "force-dynamic";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getWritingBadges, getPerformanceBadges, getPersonalBadges } from "@/lib/data-service"
import BadgeTable from "@/components/admin/BadgeTable"

export default async function BadgesPage() {
  const [writingBadges, performanceBadges, personalBadges] = await Promise.all([
    getWritingBadges(),
    getPerformanceBadges(),
    getPersonalBadges(),
  ])

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Manage Badges</h1>

      <Tabs defaultValue="writing">
        <TabsList className="mb-6 bg-gray-900 border border-gray-800">
          <TabsTrigger value="writing">Writing</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="personal">Personal</TabsTrigger>
        </TabsList>

        <TabsContent value="writing">
          <Card>
            <CardHeader>
              <CardTitle>Writing Badges</CardTitle>
              <CardDescription>Manage badges related to writing ability</CardDescription>
            </CardHeader>
            <CardContent>
              <BadgeTable badges={writingBadges} category="Writing" />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance">
          <Card>
            <CardHeader>
              <CardTitle>Performance Badges</CardTitle>
              <CardDescription>Manage badges related to performance ability</CardDescription>
            </CardHeader>
            <CardContent>
              <BadgeTable badges={performanceBadges} category="Performance" />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="personal">
          <Card>
            <CardHeader>
              <CardTitle>Personal Badges</CardTitle>
              <CardDescription>Manage badges related to personal attributes</CardDescription>
            </CardHeader>
            <CardContent>
              <BadgeTable badges={personalBadges} category="Personal" />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

