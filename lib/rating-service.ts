"use server"

import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { getRoleWeights } from "./role-weight-service"
import type { UserRole } from "@/types/auth-types"
import type { UserRating } from "@/types/rating-types"

interface Rating {
  id: string
  userId: string
  battlerId: string
  category: string
  attribute: string
  value: number
  createdAt: string
  updatedAt: string
}

export async function submitRating(
  userId: string,
  battlerId: string,
  category: string,
  attribute: string,
  value: number,
): Promise<{ success: boolean; error?: any }> {
  try {
    const supabase = createServerComponentClient({ cookies })
    
    // Check if rating already exists
    const { data: existingRating, error: checkError } = await supabase
      .from("ratings")
      .select("*")
      .eq("userId", userId)
      .eq("battlerId", battlerId)
      .eq("category", category)
      .eq("attribute", attribute)
      .single()

    if (existingRating) {
      // Update existing rating
      const { error } = await supabase
        .from("ratings")
        .update({
          value,
          updatedAt: new Date().toISOString(),
        })
        .eq("id", existingRating.id)

      if (error) {
        console.error("Error updating rating:", error)
        return { success: false, error }
      }
    } else {
      // Create new rating
      const { error } = await supabase.from("ratings").insert({
        userId,
        battlerId,
        category,
        attribute,
        value,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })

      if (error) {
        console.error("Error creating rating:", error)
        return { success: false, error }
      }
    }

    // Recalculate weighted average for this attribute
    await recalculateWeightedAverage(battlerId, category, attribute)

    // Recalculate category average
    await recalculateCategoryAverage(battlerId, category)

    return { success: true }
  } catch (error) {
    console.error("Error submitting rating:", error)
    return { success: false, error }
  }
}

// Helper to recalculate the weighted average for a battler's attribute
async function recalculateWeightedAverage(
  battlerId: string,
  category: string,
  attribute: string,
): Promise<void> {
  try {
    const supabase = createServerComponentClient({ cookies })
    
    // Get all ratings for this battler's attribute
    const { data: ratings, error: ratingsError } = await supabase
      .from("ratings")
      .select("userId, value")
      .eq("battlerId", battlerId)
      .eq("category", category)
      .eq("attribute", attribute)

    if (ratingsError) {
      console.error("Error fetching ratings:", ratingsError)
      return
    }

    if (!ratings || ratings.length === 0) {
      // No ratings, set weighted average to 0
      await supabase
        .from("battler_attribute_averages")
        .upsert({
          battlerId,
          category,
          attribute,
          weightedAverage: 0,
          totalRatings: 0,
          updatedAt: new Date().toISOString(),
        })
      return
    }

    // Get user roles for weighting
    let weightedSum = 0
    let weightSum = 0

    for (const rating of ratings) {
      // Get user's role for weighting
      const { data: userData, error: userError } = await supabase
        .from("user_profiles")
        .select("roles")
        .eq("id", rating.userId)
        .single()

      if (userError) {
        console.warn(`Error fetching user ${rating.userId}:`, userError)
        continue
      }

      const userRole = Object.keys(userData.roles).find(
        (role) => userData.roles[role],
      ) as UserRole

      const roleWeights = await getRoleWeights()
      const weight = roleWeights[userRole] || 1
      weightedSum += rating.value * weight
      weightSum += weight
    }

    const weightedAverage = weightSum > 0 ? weightedSum / weightSum : 0

    // Update or insert the weighted average
    await supabase.from("battler_attribute_averages").upsert({
      battlerId,
      category,
      attribute,
      weightedAverage,
      totalRatings: ratings.length,
      updatedAt: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Error recalculating weighted average:", error)
  }
}

// Helper to recalculate the category average
async function recalculateCategoryAverage(battlerId: string, category: string): Promise<void> {
  try {
    const supabase = createServerComponentClient({ cookies })
    
    // Get all attribute averages for this category
    const { data: attributeAverages, error: averagesError } = await supabase
      .from("battler_attribute_averages")
      .select("weightedAverage")
      .eq("battlerId", battlerId)
      .eq("category", category)

    if (averagesError) {
      console.error("Error fetching attribute averages:", averagesError)
      return
    }

    if (!attributeAverages || attributeAverages.length === 0) {
      return
    }

    // Calculate the average of all attribute averages
    const sum = attributeAverages.reduce(
      (total, curr) => total + (curr.weightedAverage || 0),
      0,
    )
    const average = attributeAverages.length > 0 ? sum / attributeAverages.length : 0

    // Update the battler's category average
    await supabase.from("battler_category_averages").upsert({
      battlerId,
      category,
      average,
      updatedAt: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Error recalculating category average:", error)
  }
}

export async function getBattlerAttributeAverages(
  battlerId: string,
  category?: string,
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

export async function getTopBattlersByRole(
  role: UserRole,
  category?: string,
  attribute?: string,
  limit = 10,
): Promise<any[]> {
  try {
    const supabase = createServerComponentClient({ cookies })
    
    if (attribute) {
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

      // Get battler details
      const battlerIds = data.map((item) => item.battlerId)
      if (battlerIds.length === 0) return []

      const { data: battlers, error: battlersError } = await supabase
        .from("battlers")
        .select("*")
        .in("id", battlerIds)

      if (battlersError) {
        console.error("Error fetching battler details:", battlersError)
        return []
      }

      // Combine data
      return data.map((item) => {
        const battler = battlers.find((b) => b.id === item.battlerId)
        return {
          ...battler,
          score: item.weightedAverage,
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

      // Get battler details
      const battlerIds = data.map((item) => item.battlerId)
      if (battlerIds.length === 0) return []

      const { data: battlers, error: battlersError } = await supabase
        .from("battlers")
        .select("*")
        .in("id", battlerIds)

      if (battlersError) {
        console.error("Error fetching battler details:", battlersError)
        return []
      }

      // Combine data
      return data.map((item) => {
        const battler = battlers.find((b) => b.id === item.battlerId)
        return {
          ...battler,
          score: item.average,
        }
      })
    } else {
      // Get top battlers overall - use the totalPoints field
      const { data, error } = await supabase
        .from("battlers")
        .select("*")
        .order("totalPoints", { ascending: false })
        .limit(limit)

      if (error) {
        console.error("Error fetching top battlers overall:", error)
        return []
      }

      return data.map((battler) => ({
        ...battler,
        score: battler.totalPoints,
      }))
    }
  } catch (error) {
    console.error("Error in getTopBattlersByRole:", error)
    return []
  }
}

export async function getUserRatings(userId: string): Promise<UserRating[]> {
  try {
    const supabase = createServerComponentClient({ cookies })
    
    const { data, error } = await supabase
      .from("ratings")
      .select(`
        id,
        battlerId,
        category,
        attribute,
        value,
        createdAt,
        updatedAt,
        battlers:battlerId(name)
      `)
      .eq("userId", userId)
      .order("createdAt", { ascending: false })
    
    if (error) {
      console.error("Error fetching user ratings:", error)
      return []
    }
    
    return data.map(rating => ({
      id: rating.id,
      rating: rating.value,
      battlerId: rating.battlerId,
      battlerName: Array.isArray(rating.battlers) || !rating.battlers ? "Unknown Battler" : (rating.battlers as { name: string }).name || "Unknown Battler",
      category: rating.category,
      attribute: rating.attribute,
      createdAt: rating.createdAt,
      updatedAt: rating.updatedAt
    })) as UserRating[]
  } catch (error) {
    console.error("Error fetching user ratings:", error)
    return []
  }
}
