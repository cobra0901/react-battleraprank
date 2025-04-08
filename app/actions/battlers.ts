"use server"

import { revalidatePath } from "next/cache"
import { createBattlerDirect } from "@/lib/direct-db"
import { supabase } from "@/lib/supabase"

interface BattlerFormData {
  name: string
  alias?: string
  bio?: string
  avatar_url?: string
}

export async function createBattler(formData: BattlerFormData) {
  try {
    // Get current user
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      throw new Error("User not authenticated")
    }
    
    // Try to create battler with direct DB first (bypasses RLS)
    try {
      const result = await createBattlerDirect(
        formData.name,
        formData.alias || null,
        formData.bio || null,
        formData.avatar_url || null,
        user.id
      )
      
      // Revalidate battlers page
      revalidatePath("/battlers")
      
      return { 
        success: true, 
        data: result,
        message: "Battler created successfully"
      }
    } catch (directError) {
      console.warn("Direct DB creation failed, trying Supabase client:", directError)
      
      // Fallback to Supabase client
      const { data: battler, error } = await supabase
        .from("battlers")
        .insert({
          name: formData.name,
          alias: formData.alias || null,
          bio: formData.bio || null,
          avatar_url: formData.avatar_url || null,
          created_by: user.id,
        })
        .select()
        .single()
      
      if (error) {
        throw error
      }
      
      // Revalidate battlers page
      revalidatePath("/battlers")
      
      return {
        success: true,
        data: battler,
        message: "Battler created successfully"
      }
    }
  } catch (error) {
    console.error("Error creating battler:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error creating battler",
      message: "Failed to create battler"
    }
  }
}
