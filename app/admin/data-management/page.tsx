export const dynamic = "force-dynamic";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import ClearMockDataButton from "@/components/admin/ClearMockDataButton"
import { Button } from "@/components/ui/button"
import Link from "next/link"

// Function to check if user has appropriate role
async function hasAdminPermission() {
  const supabase = createServerComponentClient({ cookies })
  
  // Get the current session
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) return false
  
  // Get user role from profiles table
  const { data: profile, error } = await supabase
    .from("user_profiles")
    .select("roles")
    .eq("id", session.user.id)
    .single()
  
  if (error || !profile) return false
  
  // Only admin can access this page
  return profile.roles?.admin === true
}

export default async function DataManagementPage() {
  // Check if user has permission
  const hasPermission = await hasAdminPermission()
  
  // Redirect if not authorized
  if (!hasPermission) {
    redirect("/unauthorized")
  }
  
  // Get battler count
  const supabase = createServerComponentClient({ cookies })
  const { count: battlerCount } = await supabase
    .from("battlers")
    .select("*", { count: "exact", head: true })
  
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Data Management</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Battlers</h2>
          <p className="text-gray-400 mb-6">
            Current count: <span className="text-white font-medium">{battlerCount || 0}</span>
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link href="/admin/battlers/create">
              <Button className="w-full sm:w-auto">Create New Battler</Button>
            </Link>
            <ClearMockDataButton />
          </div>
        </div>
        
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Database Management</h2>
          <p className="text-gray-400 mb-6">
            Tools for managing the database and data migration.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link href="/admin/battlers">
              <Button variant="outline" className="w-full sm:w-auto">
                View All Battlers
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
