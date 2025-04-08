"use server"

import { supabase } from "@/lib/supabase"
import { revalidatePath } from "next/cache"
import { clearAllBattlers, clearAllContent, clearAllRatings } from "./direct-db"

interface ClearOptions {
  clearBattlers: boolean
  clearUsers: boolean
  clearRatings: boolean
  clearBadges: boolean
  clearContent: boolean
  preserveAdmins: boolean
}

export async function clearMockData(options: ClearOptions): Promise<void> {
  // Clear data from remote Supabase instance
  console.log("Clearing mock data with options:", options)

  try {
    // For battlers, attempt with direct DB connection first
    if (options.clearBattlers) {
      try {
        // Try direct SQL execution first (bypasses RLS)
        await clearAllBattlers()
        console.log("Successfully cleared battlers using direct SQL")
      } catch (directError) {
        console.warn("Direct SQL clear failed, trying supabase client:", directError)
        
        try {
          // Then try the RPC call (if the function exists)
          const { error } = await supabase.rpc('delete_all_battlers')
          
          if (error) {
            console.warn("RPC delete_all_battlers failed, falling back to direct DELETE:", error)
            // Fallback to direct DELETE - might work depending on permissions
            const { error: deleteError } = await supabase
              .from("battlers")
              .delete()
              .not("id", "is", null)
            
            if (deleteError) {
              console.error("Failed to delete battlers:", deleteError)
              throw deleteError
            }
          }
        } catch (e) {
          console.error("Error trying to delete battlers:", e)
          throw e
        }
      }
    }

    if (options.clearRatings) {
      try {
        // Try direct SQL first
        await clearAllRatings()
        console.log("Successfully cleared ratings using direct SQL")
      } catch (directError) {
        console.warn("Direct SQL clear failed for ratings, using supabase client:", directError)
        // Clear ratings
        const { error } = await supabase.from("ratings").delete().not("id", "is", null)
        if (error) throw error
      }
    }

    if (options.clearContent) {
      try {
        // Try direct SQL first
        await clearAllContent()
        console.log("Successfully cleared content using direct SQL")
      } catch (directError) {
        console.warn("Direct SQL clear failed for content, using supabase client:", directError)
        // Clear content
        const { error } = await supabase.from("content_links").delete().not("id", "is", null)
        if (error) throw error
      }
    }

    if (options.clearBadges) {
      // Clear badges
      const { error } = await supabase.from("badges").delete().not("id", "is", null)
      if (error) throw error
    }

    if (options.clearUsers && !options.preserveAdmins) {
      // Clear all users
      const { error } = await supabase.from("user_profiles").delete().not("id", "is", null)
      if (error) throw error
    } else if (options.clearUsers && options.preserveAdmins) {
      // Clear non-admin users
      const { error } = await supabase
        .from("user_profiles")
        .delete()
        .not("roles->admin", "eq", "true")
      if (error) throw error
    }

    // Revalidate all relevant paths
    revalidatePath("/admin")
    revalidatePath("/battlers")
    
  } catch (error) {
    console.error("Error during clearMockData:", error)
    throw error
  }
}

export async function exportData(): Promise<any> {
  // In a real app, this would export all data from your database
  // For now, we'll just return mock data

  const [
    { data: battlers, error: battlersError },
    { data: users, error: usersError },
    { data: ratings, error: ratingsError },
    { data: badges, error: badgesError },
    { data: content, error: contentError },
  ] = await Promise.all([
    supabase.from("battlers").select("*"),
    supabase.from("user_profiles").select("*"),
    supabase.from("ratings").select("*"),
    supabase.from("badges").select("*"),
    supabase.from("content_links").select("*"),
  ])

  if (battlersError) throw battlersError
  if (usersError) throw usersError
  if (ratingsError) throw ratingsError
  if (badgesError) throw badgesError
  if (contentError) throw contentError

  return {
    battlers: battlers || [],
    users: users || [],
    ratings: ratings || [],
    badges: badges || [],
    content: content || [],
    exportedAt: new Date().toISOString(),
  }
}

export async function importData(data: any): Promise<void> {
  // In a real app, this would import data into your database
  // For now, we'll just simulate it
  console.log("Importing data:", data)

  // Validate the data
  if (!data.battlers || !data.users || !data.ratings || !data.badges || !data.content) {
    throw new Error("Invalid data format")
  }

  // Clear existing data first
  await clearMockData({
    clearBattlers: true,
    clearUsers: true,
    clearRatings: true,
    clearBadges: true,
    clearContent: true,
    preserveAdmins: true,
  })

  // Import the data
  // In a real app, you would use upsert to handle conflicts

  if (data.battlers.length > 0) {
    const { error } = await supabase.from("battlers").insert(data.battlers)
    if (error) throw error
  }

  if (data.users.length > 0) {
    const { error } = await supabase.from("user_profiles").insert(data.users)
    if (error) throw error
  }

  if (data.ratings.length > 0) {
    const { error } = await supabase.from("ratings").insert(data.ratings)
    if (error) throw error
  }

  if (data.badges.length > 0) {
    const { error } = await supabase.from("badges").insert(data.badges)
    if (error) throw error
  }

  if (data.content.length > 0) {
    const { error } = await supabase.from("content_links").insert(data.content)
    if (error) throw error
  }

  return Promise.resolve()
}
