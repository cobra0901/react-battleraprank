"use server"

import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import type { RoleWeight, UserRole } from "@/types/auth-types"

// Default weights for each role
const DEFAULT_WEIGHTS: RoleWeight[] = [
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

export async function getRoleWeights(): Promise<Record<UserRole, number>> {
  try {
    const supabase = createServerComponentClient({ cookies })
    const { data, error } = await supabase.from("role_weights").select("*")

    if (error) {
      console.error("Error fetching role weights:", error)
      // Return default weights as record
      return DEFAULT_WEIGHTS.reduce((acc, curr) => {
        acc[curr.role] = curr.weight
        return acc
      }, {} as Record<UserRole, number>)
    }

    if (!data || data.length === 0) {
      console.log("No role weights found, using defaults")
      // Return default weights as record
      return DEFAULT_WEIGHTS.reduce((acc, curr) => {
        acc[curr.role] = curr.weight
        return acc
      }, {} as Record<UserRole, number>)
    }

    // Convert from array to record
    const weightRecord = data.reduce((acc, curr) => {
      acc[curr.role as UserRole] = curr.weight
      return acc
    }, {} as Record<UserRole, number>)

    // Fill in any missing roles with defaults
    DEFAULT_WEIGHTS.forEach((defaultWeight) => {
      if (!weightRecord[defaultWeight.role]) {
        weightRecord[defaultWeight.role] = defaultWeight.weight
      }
    })

    return weightRecord
  } catch (error) {
    console.error("Error in getRoleWeights:", error)
    // Return default weights as record
    return DEFAULT_WEIGHTS.reduce((acc, curr) => {
      acc[curr.role] = curr.weight
      return acc
    }, {} as Record<UserRole, number>)
  }
}

export async function updateRoleWeight(
  role: UserRole,
  weight: number
): Promise<{ success: boolean; error?: any }> {
  try {
    const supabase = createServerComponentClient({ cookies })
    
    const { error } = await supabase
      .from("role_weights")
      .upsert({ role, weight, updated_at: new Date().toISOString() })
      
    if (error) {
      console.error("Error updating role weight:", error)
      return { success: false, error }
    }
    
    return { success: true }
  } catch (error) {
    console.error("Error in updateRoleWeight:", error)
    return { success: false, error }
  }
}

export async function resetRoleWeightsToDefault(): Promise<{ success: boolean; error?: any }> {
  try {
    const supabase = createServerComponentClient({ cookies })
    
    // Delete existing weights
    await supabase.from("role_weights").delete().neq("role", "dummy_value")
    
    // Insert default weights
    const { error } = await supabase.from("role_weights").insert(
      DEFAULT_WEIGHTS.map((weight) => ({
        role: weight.role,
        weight: weight.weight,
        updated_at: new Date().toISOString(),
      }))
    )
    
    if (error) {
      console.error("Error resetting role weights:", error)
      return { success: false, error }
    }
    
    return { success: true }
  } catch (error) {
    console.error("Error in resetRoleWeightsToDefault:", error)
    return { success: false, error }
  }
}
