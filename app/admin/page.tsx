export const dynamic = "force-dynamic";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getBattlers, getAllBadges, getAttributes } from "@/lib/data-service"
import { Users, Tag, BarChart, TrendingUp, UserPlus, Settings, ShieldCheck } from "lucide-react"
import Link from "next/link"
import MockDataManager from "@/components/admin/MockDataManager"
import QuickActionToolbar from "@/components/admin/QuickActionToolbar"
import { Button } from "@/components/ui/button"

export default async function AdminDashboard() {
  const [battlers, badges, attributes] = await Promise.all([getBattlers(), getAllBadges(), getAttributes()])

  const stats = [
    {
      title: "Total Battlers",
      value: battlers.length,
      description: "Battlers in the database",
      icon: <Users className="w-8 h-8 text-blue-500" />,
      change: "+2 this week",
    },
    {
      title: "Total Badges",
      value: badges.length,
      description: "Across all categories",
      icon: <Tag className="w-8 h-8 text-purple-500" />,
      change: "No change",
    },
    {
      title: "Attributes",
      value: attributes.length,
      description: "Rating categories",
      icon: <BarChart className="w-8 h-8 text-green-500" />,
      change: "No change",
    },
    {
      title: "User Ratings",
      value: "1,245",
      description: "Total submitted ratings",
      icon: <TrendingUp className="w-8 h-8 text-amber-500" />,
      change: "+156 this week",
    },
  ]

  const recentBattlers = battlers.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()).slice(0, 5)

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>
      <div className="mb-6">
        <QuickActionToolbar />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              {stat.icon}
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.description}</p>
              <p className="text-xs mt-2 text-gray-400">{stat.change}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mb-8">
        <MockDataManager />
      </div>

      {/* Admin Management Tools */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserPlus className="h-5 w-5 text-purple-500" />
              Battler Management
            </CardTitle>
            <CardDescription>
              Create and manage battler profiles for the platform
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-3">
              <Link href="/admin/battlers/create" passHref prefetch={true}>
                <Button className="w-full justify-start">
                  <UserPlus className="mr-2 h-4 w-4" />
                  Create New Battler
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-blue-500" />
              User Management
            </CardTitle>
            <CardDescription>
              Manage roles and permissions for community managers
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-3">
              <Link href="/admin/managers" passHref prefetch={true}>
                <Button className="w-full justify-start">
                  <Settings className="mr-2 h-4 w-4" />
                  Manage Community Managers
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
        <Card>
          <CardHeader>
            <CardTitle>Recent Battlers</CardTitle>
            <CardDescription>Latest battlers added to the platform</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentBattlers.map((battler) => (
                <div key={battler.id} className="flex items-center justify-between border-b border-gray-800 pb-3">
                  <div>
                    <p className="font-medium">{battler.name}</p>
                    <p className="text-sm text-gray-400">{battler.location}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{battler.totalPoints.toFixed(1)}</p>
                    <p className="text-xs text-gray-400">{new Date(battler.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>System Status</CardTitle>
            <CardDescription>Current system performance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">Database</p>
                  <p className="text-sm text-green-500">Operational</p>
                </div>
                <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                  <div className="h-full bg-green-500 w-[95%]"></div>
                </div>
                <p className="text-xs text-gray-400">95% healthy</p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">API</p>
                  <p className="text-sm text-green-500">Operational</p>
                </div>
                <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                  <div className="h-full bg-green-500 w-[98%]"></div>
                </div>
                <p className="text-xs text-gray-400">98% uptime</p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">Storage</p>
                  <p className="text-sm text-amber-500">Warning</p>
                </div>
                <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-500 w-[75%]"></div>
                </div>
                <p className="text-xs text-gray-400">75% capacity used</p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">Cache</p>
                  <p className="text-sm text-green-500">Operational</p>
                </div>
                <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                  <div className="h-full bg-green-500 w-[90%]"></div>
                </div>
                <p className="text-xs text-gray-400">90% hit rate</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
