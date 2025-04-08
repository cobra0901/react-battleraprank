export const dynamic = "force-dynamic";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import MediaUsersManager from "@/components/admin/MediaUsersManager"

// Check if user is taskmasterpeace or admin
async function canManageMediaUsers() {
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

export default async function MediaUsersPage() {
  // Check if user has permission
  const hasPermission = await canManageMediaUsers()
  
  // Redirect if not authorized
  if (!hasPermission) {
    redirect("/unauthorized")
  }
  
  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Media Users</h1>

      <div className="grid grid-cols-1 gap-6">
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle>About Media Users</CardTitle>
            <CardDescription>
              Media users can create battlers once their account is confirmed.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-400">
              Media users who have been confirmed can create battlers on the platform.
              This role is suitable for journalists, content creators, and other media personnel.
              Only admins and taskmasterpeace can confirm media users.
            </p>
          </CardContent>
        </Card>

        <MediaUsersManager />
      </div>
    </div>
  )
}
