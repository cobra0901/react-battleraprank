export const dynamic = "force-dynamic";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import ManageManagersForm from "@/components/admin/ManageManagersForm"

// Function to check if user is admin
async function isAdmin() {
  const supabase = createServerComponentClient({ cookies })
  
  // Get the current session
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) return false
  
  // Get user role from profiles table
  const { data: profile, error } = await supabase
    .from("user_profiles")
    .select("roles, email")
    .eq("id", session.user.id)
    .single()
  
  if (error || !profile) return false
  
  // Only admin or taskmasterpeace@gmail.com can manage community managers
  return profile.roles?.admin === true || profile.email === "taskmasterpeace@gmail.com"
}

// Get existing users with their roles
async function getUsers() {
  const supabase = createServerComponentClient({ cookies })
  
  const { data: users, error } = await supabase
    .from("user_profiles")
    .select("id, email, display_name, roles")
    .order("email", { ascending: true })
  
  if (error) {
    console.error("Error fetching users:", error)
    return []
  }
  
  return users
}

export default async function ManageManagersPage() {
  // Check if user is admin
  const adminCheck = await isAdmin()
  
  // Redirect if not authorized
  if (!adminCheck) {
    redirect("/unauthorized")
  }
  
  // Get users with their roles
  const users = await getUsers()
  
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-2">Manage Community Managers</h1>
      <p className="text-muted-foreground mb-6">
        As an admin, you can designate users as community managers, who will have permission to create battlers.
      </p>
      
      <ManageManagersForm initialUsers={users} />
    </div>
  )
}
