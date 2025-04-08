"use server"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"

// This service handles the storage and retrieval of mock data
// It ensures analytics components can access the generated data

interface MockDataOptions {
  ratingCount: number
  ratingVariance: number
  timeSpan: number
}

// First, let's check what tables actually exist in the database
async function getExistingTables() {
  try {
    const supabase = createServerComponentClient({ cookies })
    
    // Query to get all tables in the public schema
    const { data, error } = await supabase.from("information_schema.tables")
      .select("table_name")
      .eq("table_schema", "public")

    if (error) {
      console.error("Error fetching tables:", error)
      return []
    }

    return data || []
  } catch (error) {
    console.error("Error in getExistingTables:", error)
    return []
  }
}

export async function generateMockData(options: MockDataOptions) {
  const { ratingCount, ratingVariance, timeSpan } = options

  try {
    // Instead of generating mock data, return a message that this is no longer used
    return {
      success: false,
      message: "Mock data generation is no longer supported. The application now uses real data from Supabase."
    }
  } catch (error) {
    console.error("Error in generateMockData:", error)
    return { success: false, error }
  }
}

export async function getAnalyticsData() {
  try {
    const supabase = createServerComponentClient({ cookies })
    
    // Get real analytics data from the database
    const [battlers, categories, attributes, userCounts, activityData] = await Promise.all([
      // Top battlers
      supabase
        .from("battlers")
        .select("id, name, totalPoints")
        .order("totalPoints", { ascending: false })
        .limit(10),
        
      // Category averages
      supabase
        .from("battler_category_averages")
        .select("category, average")
        .order("average", { ascending: false }),
        
      // Attribute averages 
      supabase
        .from("battler_attribute_averages")
        .select("attribute, category, weightedAverage")
        .order("weightedAverage", { ascending: false })
        .limit(20),
        
      // User counts by role
      supabase
        .from("user_profiles")
        .select("roles"),
        
      // Activity data - recent ratings
      supabase
        .from("ratings")
        .select("createdAt, updatedAt")
        .order("createdAt", { ascending: false })
        .limit(50)
    ])
    
    // Process user roles into counts
    const userRoleCounts: Record<string, number> = {}
    if (userCounts.data) {
      userCounts.data.forEach(user => {
        Object.entries(user.roles).forEach(([role, hasRole]) => {
          if (hasRole) {
            userRoleCounts[role] = (userRoleCounts[role] || 0) + 1
          }
        })
      })
    }
    
    return {
      success: true,
      data: {
        topRatedBattlers: battlers.data || [],
        categoryAverages: categories.data || [],
        attributeAverages: attributes.data || [],
        userRoleCounts: userRoleCounts,
        activityData: activityData.data || []
      }
    }
  } catch (error) {
    console.error("Error in getAnalyticsData:", error)
    return { success: false, error }
  }
}

// Function to generate mock data for testing - simplified version that doesn't rely on database tables
export async function generateMockAnalyticsData(count = 50) {
  try {
    // This function is deprecated - return an error message
    return {
      success: false,
      message: "Mock data generation is no longer supported. The application now uses real data from Supabase."
    }
  } catch (error) {
    console.error("Error in generateMockAnalyticsData:", error)
    return { success: false, error }
  }
}
