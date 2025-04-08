export const dynamic = "force-dynamic";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import AdminsManager from "@/components/admin/AdminsManager"

// Check if user is taskmasterpeace
async function isTaskmasterpeace() {
  const supabase = createServerComponentClient({ cookies })
  
  // Get the current session
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) return false
  
  // Get user profile
  const { data: profile, error } = await supabase
    .from("user_profiles")
    .select("email")
    .eq("id", session.user.id)
    .single()
  
  if (error || !profile) return false
  
  // Check if user is taskmasterpeace (by email)
  return profile.email?.toLowerCase() === "taskmasterpeace@gmail.com"
}

export default async function AdminsPage() {
  // Check if user has permission
  const hasPermission = await isTaskmasterpeace()
  
  // Redirect if not taskmasterpeace
  if (!hasPermission) {
    redirect("/unauthorized")
  }
  
  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Administrators</h1>

      <div className="grid grid-cols-1 gap-6">
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle>About Administrators</CardTitle>
            <CardDescription>
              Administrators help maintain the BattleRapRank platform by managing community managers.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-400">
              Administrators can promote users to community managers. This is a high-level role that
              should be granted sparingly. Only taskmasterpeace can promote users to administrators.
            </p>
          </CardContent>
        </Card>

        <AdminsManager />
      </div>
    </div>
  )
}
