export const dynamic = "force-dynamic";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import CommunityManagersManager from "@/components/admin/CommunityManagersManager"

// Check if user is taskmasterpeace or admin
async function canManageCommunityManagers() {
  const supabase = createServerComponentClient({ cookies })
  
  // Get the current session
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) return false
  
  // Get user profile
  const { data: profile, error } = await supabase
    .from("user_profiles")
    .select("email, roles")
    .eq("id", session.user.id)
    .single()
  
  if (error || !profile) return false
  
  // Check if user is taskmasterpeace (by email) or an admin
  const isTaskmasterpeace = profile.email?.toLowerCase() === "taskmasterpeace@gmail.com"
  const isAdmin = profile.roles?.admin === true
  
  return isTaskmasterpeace || isAdmin
}

export default async function CommunityManagersPage() {
  // Check if user has permission
  const hasPermission = await canManageCommunityManagers()
  
  // Redirect if not authorized
  if (!hasPermission) {
    redirect("/unauthorized")
  }
  
  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Community Managers</h1>

      <div className="grid grid-cols-1 gap-6">
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle>About Community Managers</CardTitle>
            <CardDescription>
              Community managers help maintain the Alt Battle Rap Algorithm by adding battlers and moderating content.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-400">
              Community managers have special permissions to add battlers to the platform and help maintain the quality
              of the content. They can add new battlers, update battler information, and moderate user-generated
              content. Each battler added to the system is tracked to the community manager who added them.
            </p>
          </CardContent>
        </Card>

        <CommunityManagersManager />
      </div>
    </div>
  )
}
