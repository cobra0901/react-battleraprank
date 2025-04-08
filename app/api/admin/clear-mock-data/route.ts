import { NextRequest, NextResponse } from "next/server"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"

export async function POST(request: NextRequest) {
  try {
    // Create a Supabase client
    const supabase = createRouteHandlerClient({ cookies })
    
    // Check if user is authenticated and has admin role
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json(
        { success: false, error: "Authentication required" }, 
        { status: 401 }
      )
    }
    
    // Get user role from profiles table
    const { data: profile, error: profileError } = await supabase
      .from("user_profiles")
      .select("roles")
      .eq("id", user.id)
      .single()
    
    if (profileError || !profile || !profile.roles?.admin) {
      return NextResponse.json(
        { success: false, error: "Admin privileges required" }, 
        { status: 403 }
      )
    }
    
    // Delete all mock data
    // 1. Delete all battlers
    const { error: battlerError } = await supabase
      .from("battlers")
      .delete()
      .neq("id", "00000000-0000-0000-0000-000000000000") // safety check to avoid deleting everything
    
    if (battlerError) {
      return NextResponse.json(
        { success: false, error: `Error deleting battlers: ${battlerError.message}` }, 
        { status: 500 }
      )
    }
    
    return NextResponse.json({ success: true, message: "All mock data has been cleared" })
  } catch (error) {
    console.error("Error clearing mock data:", error)
    return NextResponse.json(
      { success: false, error: "Error clearing mock data" }, 
      { status: 500 }
    )
  }
}
