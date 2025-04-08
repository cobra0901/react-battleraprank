"use server"

import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { formatDistanceToNow } from "date-fns";


export interface UserStats {
  totalRatings: number;
  avgRating: number;
  favoriteCategory: string;
  recentActivity: Array<{
    type: string;
    battlerId: string;
    battlerName: string;
    timestamp: string;
    timeAgo: string;
  }>;
  popularBattlers: Array<{
    battlerId: string;
    battlerName: string;
    count: number;
  }>;
}

// Function to get user statistics
export async function getUserStats(userId: string): Promise<UserStats> {
  try {
    const supabase = createServerComponentClient({ cookies })
    
    // Get all ratings by this user
    const { data: ratings, error: ratingsError } = await supabase
      .from("ratings")
      .select("*, battlers(name)")
      .eq("userId", userId)
      .order("createdAt", { ascending: false })
    
    if (ratingsError) {
      console.error("Error fetching user ratings:", ratingsError)
      return getEmptyStats()
    }
    
    // Calculate total ratings
    const totalRatings = ratings.length
    
    // Calculate average rating
    let avgRating = 0
    if (totalRatings > 0) {
      const sum = ratings.reduce((acc, rating) => acc + rating.value, 0)
      avgRating = sum / totalRatings
    }
    
    // Determine favorite category
    const categoryCount: Record<string, number> = {}
    ratings.forEach(rating => {
      const category = rating.category
      if (category) {
        categoryCount[category] = (categoryCount[category] || 0) + 1
      }
    })
    
    let favoriteCategory = "None"
    let maxCount = 0
    
    Object.entries(categoryCount).forEach(([category, count]) => {
      if (count > maxCount) {
        maxCount = count
        favoriteCategory = category
      }
    })
    
    // Get recent activity
    const recentActivity = ratings.slice(0, 5).map(rating => {
      return {
        type: "Rating",
        battlerId: rating.battlerId,
        battlerName: rating.battlers?.name || "Unknown Battler",
        timestamp: rating.createdAt,
        timeAgo: formatDistanceToNow(new Date(rating.createdAt), { addSuffix: true })
      }
    })
    
    // Get popular battlers (most rated by this user)
    const battlerCount: Record<string, { id: string, name: string, count: number }> = {}
    
    ratings.forEach(rating => {
      const battlerId = rating.battlerId
      const battlerName = rating.battlers?.name || "Unknown Battler"
      
      if (!battlerCount[battlerId]) {
        battlerCount[battlerId] = { id: battlerId, name: battlerName, count: 0 }
      }
      
      battlerCount[battlerId].count++
    })
    
    const popularBattlers = Object.values(battlerCount)
      .sort((a, b) => b.count - a.count)
      .slice(0, 5)
      .map(item => ({
        battlerId: item.id,
        battlerName: item.name,
        count: item.count
      }))
    
    return {
      totalRatings,
      avgRating,
      favoriteCategory,
      recentActivity,
      popularBattlers
    }
  } catch (error) {
    console.error("Error in getUserStats:", error)
    return getEmptyStats()
  }
}

// Helper function to return empty stats object
function getEmptyStats(): UserStats {
  return {
    totalRatings: 0,
    avgRating: 0,
    favoriteCategory: "None",
    recentActivity: [],
    popularBattlers: []
  }
}

// Get user activity summary
export async function getUserActivity(userId: string, limit = 10): Promise<any[]> {
  try {
    const supabase = createServerComponentClient({ cookies })
    
    // Get combined activity (ratings, comments, likes)
    // For now, just focusing on ratings since that's the primary activity
    const { data: ratings, error: ratingsError } = await supabase
      .from("ratings")
      .select("*, battlers(name, image)")
      .eq("userId", userId)
      .order("createdAt", { ascending: false })
      .limit(limit)
    
    if (ratingsError) {
      console.error("Error fetching user activity:", ratingsError)
      return []
    }
    
    return ratings.map(rating => ({
      id: rating.id,
      type: "rating",
      battlerId: rating.battlerId,
      battlerName: rating.battlers?.name || "Unknown Battler",
      battlerImage: rating.battlers?.image || "/placeholder.svg",
      value: rating.value,
      category: rating.category,
      createdAt: rating.createdAt,
      // timeAgo: formatDistanceToNow(new Date(rating.createdAt), { addSuffix: true })
    }))
  } catch (error) {
    console.error("Error in getUserActivity:", error)
    return []
  }
}

// Get rating distribution for a user 
export async function getUserRatingDistribution(userId: string): Promise<any> {
  try {
    const supabase = createServerComponentClient({ cookies })
    
    // Get all ratings by this user
    const { data: ratings, error } = await supabase
      .from("ratings")
      .select("value")
      .eq("userId", userId)
    
    if (error) {
      console.error("Error fetching user rating distribution:", error)
      return {}
    }
    
    // Create distribution buckets (0.5 increments)
    const distribution: Record<string, number> = {
      "1.0": 0,
      "1.5": 0, 
      "2.0": 0,
      "2.5": 0,
      "3.0": 0,
      "3.5": 0,
      "4.0": 0,
      "4.5": 0,
      "5.0": 0,
      "5.5": 0,
      "6.0": 0,
      "6.5": 0,
      "7.0": 0,
      "7.5": 0,
      "8.0": 0,
      "8.5": 0,
      "9.0": 0,
      "9.5": 0,
      "10.0": 0
    }
    
    // Fill the distribution
    ratings.forEach(rating => {
      // Round to nearest 0.5
      const bucketValue = Math.round(rating.value * 2) / 2
      const bucket = bucketValue.toFixed(1)
      
      if (distribution[bucket] !== undefined) {
        distribution[bucket]++
      }
    })
    
    return distribution
  } catch (error) {
    console.error("Error in getUserRatingDistribution:", error)
    return {}
  }
}

// Get category distribution for a user
export async function getUserCategoryDistribution(userId: string): Promise<any> {
  try {
    const supabase = createServerComponentClient({ cookies })
    
    // Get all ratings by this user
    const { data: ratings, error } = await supabase
      .from("ratings")
      .select("category")
      .eq("userId", userId)
    
    if (error) {
      console.error("Error fetching user category distribution:", error)
      return {}
    }
    
    // Create distribution object with main categories
    const distribution: Record<string, number> = {
      "Writing": 0,
      "Performance": 0,
      "Personal": 0
    }
    
    // Fill the distribution
    ratings.forEach(rating => {
      if (rating.category && distribution[rating.category] !== undefined) {
        distribution[rating.category]++
      }
    })
    
    return distribution
  } catch (error) {
    console.error("Error in getUserCategoryDistribution:", error)
    return {}
  }
}

//Get top contributors
export async function getTopContributors(): Promise<any[]> {
  try {
    const supabase = createServerComponentClient({ cookies })
    
    const { data, error } = await supabase
      .from("ratings")
      .select("userId, users!inner(name), count:count(*)")
      .order("count", { ascending: false })
      .limit(3) as { data: Array<{ userId: string; users: Array<{ name: string }>; count: number }> | null; error: any }
    
    if (error) {
      console.error("Error fetching top contributors:", error)
      return []
    }
    
    return data ? data.map(contributor => ({
      userId: contributor.userId,
      name: Array.isArray(contributor.users) && contributor.users.length > 0 ? contributor.users[0].name : "Unknown Contributor",
      count: contributor.count
    })) : []
  } catch (error) {
    console.error("Error in getTopContributors:", error)
    return []
  }
}

//Get leaderboard
export async function getLeaderboard(): Promise<any[]> {
  try {
    const supabase = createServerComponentClient({ cookies })
    
    const { data, error } = await supabase
      .from("ratings")
      .select("userId, users!inner(name), count:count(*)")
      .order("count", { ascending: false })
      .limit(10) as { data: Array<{ userId: string; users: Array<{ name: string }>; count: number }> | null; error: any }
    
    if (error) {
      console.error("Error fetching leaderboard:", error)
      return []
    }
    
    return data ? data.map(contributor => ({
      userId: contributor.userId,
      name: Array.isArray(contributor.users) && contributor.users.length > 0 ? contributor.users[0].name : "Unknown Contributor",
      count: contributor.count
    })) : []
  } catch (error) {
    console.error("Error in getLeaderboard:", error)
    return []
  }
}

//Get user historical data
export async function getUserHistoricalData(userId: string): Promise<any> {
  try {
    const supabase = createServerComponentClient({ cookies })
    
    const { data, error } = await supabase
      .from("ratings")
      .select("value, category, createdAt")
      .eq("userId", userId)
      .order("createdAt", { ascending: true })
    
    if (error) {
      console.error("Error fetching user historical data:", error)
      return []
    }
    
    return data || []
  } catch (error) {
    console.error("Error in getUserHistoricalData:", error)
    return []
  }
}

//Get top raters
export async function getTopRaters(): Promise<any[]> {
  try {
    const supabase = createServerComponentClient({ cookies })
    
    const { data, error } = await supabase
      .from("ratings")
      .select("userId, users!inner(name), count:count(*)")
      .order("count", { ascending: false })
      .limit(10) as { data: Array<{ userId: string; users: Array<{ name: string }>; count: number }> | null; error: any }
    
    if (error) {
      console.error("Error fetching top raters:", error)
      return []
    }
    
    return data ? data.map(rater => ({
      userId: rater.userId,
      name: Array.isArray(rater.users) && rater.users.length > 0 ? rater.users[0].name : "Unknown Rater",
      count: rater.count
    })) : []
  } catch (error) {
    console.error("Error in getTopRaters:", error)
    return []
  }
}