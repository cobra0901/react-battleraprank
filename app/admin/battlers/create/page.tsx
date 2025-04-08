export const dynamic = "force-dynamic";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import CreateBattlerForm from "@/components/admin/CreateBattlerForm"

// Function to check if user has appropriate role
async function hasCreateBattlerPermission() {
  // For development mode, always return true to allow creating battlers without login
  // You can remove this in production
  const isDevelopment = process.env.NODE_ENV === 'development'
  if (isDevelopment) {
    console.log("Development mode: Skipping permission check for battler creation")
    return true
  }
  
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
  
  // Admin, Community Manager, League Owner, or Media can create battlers
  return (
    profile.roles?.admin === true || 
    profile.roles?.community_manager === true || 
    profile.roles?.league_owner === true || 
    profile.roles?.media === true
  )
}

export default async function CreateBattlerPage() {
  // Check if user has permission
  const hasPermission = await hasCreateBattlerPermission()
  
  // Redirect if not authorized
  if (!hasPermission) {
    redirect("/unauthorized")
  }
  
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Create New Battler</h1>
      <CreateBattlerForm />
    </div>
  )
}
