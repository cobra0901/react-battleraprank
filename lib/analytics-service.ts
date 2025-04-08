"use server"

import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import type { RoleWeight, UserRole } from "@/types/auth-types"

// Default weights for each role - will be replaced with database values when available
export const DEFAULT_ROLE_WEIGHTS: RoleWeight[] = [
  {
    role: "fan",
    weight: 1.0,
    displayName: "Fan",
    description: "Battle rap enthusiasts and viewers",
    color: "blue",
  },
  {
    role: "media",
    weight: 2.0,
    displayName: "Media",
    description: "Battle rap journalists, bloggers, and content creators",
    color: "purple",
  },
  {
    role: "battler",
    weight: 2.5,
    displayName: "Battler",
    description: "Active battle rappers",
    color: "green",
  },
  {
    role: "league_owner",
    weight: 3.0,
    displayName: "League Owner",
    description: "Owners and operators of battle rap leagues",
    color: "amber",
  },
  {
    role: "admin",
    weight: 5.0,
    displayName: "Admin",
    description: "Platform administrators",
    color: "red",
  },
  {
    role: "community_manager",
    weight: 4.0,
    displayName: "Community Manager",
    description: "Community moderators and managers",
    color: "indigo",
  },
]

/**
 * Get role weights from the database, or use defaults if not available
 */
export async function getRoleWeights(): Promise<RoleWeight[]> {
  try {
    const supabase = createServerComponentClient({ cookies })
    
    // Try to get role weights from the database
    const { data, error } = await supabase
      .from("role_weights")
      .select("*")
      
    if (error) {
      console.error("Error fetching role weights:", error)
      return DEFAULT_ROLE_WEIGHTS
    }
    
    if (!data || data.length === 0) {
      return DEFAULT_ROLE_WEIGHTS
    }
    
    // Map database fields to RoleWeight interface
    return data.map(item => ({
      role: item.role as UserRole,
      weight: item.weight,
      displayName: DEFAULT_ROLE_WEIGHTS.find(r => r.role === item.role)?.displayName || item.role,
      description: DEFAULT_ROLE_WEIGHTS.find(r => r.role === item.role)?.description || "",
      color: DEFAULT_ROLE_WEIGHTS.find(r => r.role === item.role)?.color || "gray",
    }))
  } catch (error) {
    console.error("Error in getRoleWeights:", error)
    return DEFAULT_ROLE_WEIGHTS
  }
}

/**
 * Update a role weight in the database
 */
export async function updateRoleWeight(
  role: UserRole, 
  weight: number
): Promise<{ success: boolean; error?: any }> {
  try {
    const supabase = createServerComponentClient({ cookies })
    
    // Get the current user
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return { success: false, error: "Authentication required" }
    }
    
    // Check if user is admin
    const { data: profile, error: profileError } = await supabase
      .from("user_profiles")
      .select("roles")
      .eq("id", user.id)
      .single()
      
    if (profileError || !profile) {
      return { success: false, error: "User profile not found" }
    }
    
    if (!profile.roles.admin) {
      return { success: false, error: "Admin permissions required" }
    }
    
    // Update the role weight
    const { error } = await supabase
      .from("role_weights")
      .upsert({ 
        role, 
        weight,
        updated_at: new Date().toISOString() 
      })
      
    if (error) {
      console.error("Error updating role weight:", error)
      return { success: false, error }
    }
    
    return { success: true }
  } catch (error) {
    console.error("Error updating role weight:", error)
    return { success: false, error }
  }
}

/**
 * Reset role weights to default values
 */
export async function resetRoleWeightsToDefault(): Promise<{ success: boolean; error?: any }> {
  try {
    const supabase = createServerComponentClient({ cookies })
    
    // Get the current user
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return { success: false, error: "Authentication required" }
    }
    
    // Check if user is admin
    const { data: profile, error: profileError } = await supabase
      .from("user_profiles")
      .select("roles")
      .eq("id", user.id)
      .single()
      
    if (profileError || !profile) {
      return { success: false, error: "User profile not found" }
    }
    
    if (!profile.roles.admin) {
      return { success: false, error: "Admin permissions required" }
    }
    
    // Delete existing weights first
    await supabase.from("role_weights").delete().neq("role", "dummy_value")
    
    // Insert default weights
    const { error } = await supabase
      .from("role_weights")
      .insert(DEFAULT_ROLE_WEIGHTS.map(item => ({
        role: item.role,
        weight: item.weight,
        updated_at: new Date().toISOString()
      })))
      
    if (error) {
      console.error("Error resetting role weights:", error)
      return { success: false, error }
    }
    
    return { success: true }
  } catch (error) {
    console.error("Error resetting role weights:", error)
    return { success: false, error }
  }
}

/**
 * Get battler attribute averages by category
 */
export async function getBattlerAttributeAverages(
  battlerId: string, 
  category?: string
): Promise<any[]> {
  try {
    const supabase = createServerComponentClient({ cookies })
    
    let query = supabase
      .from("battler_attribute_averages")
      .select("*")
      .eq("battlerId", battlerId)
      
    if (category) {
      query = query.eq("category", category)
    }
    
    const { data, error } = await query
    
    if (error) {
      console.error("Error fetching battler attribute averages:", error)
      return []
    }
    
    return data || []
  } catch (error) {
    console.error("Error fetching battler attribute averages:", error)
    return []
  }
}

/**
 * Get top battlers by role, filtered by category and attribute
 */
export async function getTopBattlersByRole(
  role: UserRole, 
  category?: string, 
  attribute?: string, 
  limit = 10
): Promise<any[]> {
  try {
    const supabase = createServerComponentClient({ cookies })
    
    if (attribute && category) {
      // Get top battlers by specific attribute
      const { data, error } = await supabase
        .from("battler_attribute_averages")
        .select("battlerId, weightedAverage")
        .eq("category", category)
        .eq("attribute", attribute)
        .order("weightedAverage", { ascending: false })
        .limit(limit)
      
      if (error) {
        console.error("Error fetching top battlers by attribute:", error)
        return []
      }
      
      // Get battler details for these IDs
      const battlerIds = data.map(item => item.battlerId)
      if (battlerIds.length === 0) return []
      
      const { data: battlers, error: battlerError } = await supabase
        .from("battlers")
        .select("id, name, image")
        .in("id", battlerIds)
      
      if (battlerError) {
        console.error("Error fetching battler details:", battlerError)
        return []
      }
      
      // Combine the data
      return data.map(item => {
        const battler = battlers.find(b => b.id === item.battlerId)
        return {
          id: item.battlerId,
          name: battler?.name || "Unknown",
          score: item.weightedAverage,
          image: battler?.image || "/placeholder.svg"
        }
      })
    } else if (category) {
      // Get top battlers by category
      const { data, error } = await supabase
        .from("battler_category_averages")
        .select("battlerId, average")
        .eq("category", category)
        .order("average", { ascending: false })
        .limit(limit)
      
      if (error) {
        console.error("Error fetching top battlers by category:", error)
        return []
      }
      
      // Get battler details for these IDs
      const battlerIds = data.map(item => item.battlerId)
      if (battlerIds.length === 0) return []
      
      const { data: battlers, error: battlerError } = await supabase
        .from("battlers")
        .select("id, name, image")
        .in("id", battlerIds)
      
      if (battlerError) {
        console.error("Error fetching battler details:", battlerError)
        return []
      }
      
      // Combine the data
      return data.map(item => {
        const battler = battlers.find(b => b.id === item.battlerId)
        return {
          id: item.battlerId,
          name: battler?.name || "Unknown",
          score: item.average,
          image: battler?.image || "/placeholder.svg"
        }
      })
    } else {
      // Get top battlers overall
      const { data, error } = await supabase
        .from("battlers")
        .select("id, name, totalPoints, image")
        .order("totalPoints", { ascending: false })
        .limit(limit)
      
      if (error) {
        console.error("Error fetching top battlers overall:", error)
        return []
      }
      
      return data.map(battler => ({
        id: battler.id,
        name: battler.name,
        score: battler.totalPoints,
        image: battler.image || "/placeholder.svg"
      }))
    }
  } catch (error) {
    console.error("Error in getTopBattlersByRole:", error)
    return []
  }
}

/**
 * Get community stats
 */
export async function getCommunityStats(): Promise<any> {
  try {
    const supabase = createServerComponentClient({ cookies })
    
    // Get user count
    const { count: userCount, error: userError } = await supabase
      .from("user_profiles")
      .select("*", { count: 'exact', head: true })
    
    // Get ratings count
    const { count: ratingCount, error: ratingError } = await supabase
      .from("ratings")
      .select("*", { count: 'exact', head: true })
    
    // Get active users (users who logged in within the last 30 days)
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
    
    const { count: activeUsers, error: activeError } = await supabase
      .from("auth.users")
      .select("*", { count: 'exact', head: true })
      .gt("last_sign_in_at", thirtyDaysAgo.toISOString())
    
    // Calculate average rating
    const { data: avgData, error: avgError } = await supabase
      .from("ratings")
      .select("value")
    
    let avgRating = 0
    if (avgData && avgData.length > 0) {
      const sum = avgData.reduce((acc, curr) => acc + curr.value, 0)
      avgRating = sum / avgData.length
    }
    
    return {
      userCount: userCount || 0,
      ratingCount: ratingCount || 0,
      activeUsers: activeUsers || 0,
      avgRating: avgRating || 0,
    }
  } catch (error) {
    console.error("Error getting community stats:", error)
    return {
      userCount: 0,
      ratingCount: 0,
      activeUsers: 0,
      avgRating: 0,
    }
  }
}
