"use server"

import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"

// Types for our data
export interface Badge {
  category: string
  badge: string
  description: string
  isPositive: boolean
}

export interface Battler {
  id: string
  name: string
  location: string
  image: string
  banner: string
  tags: string[]
  totalPoints: number
  createdAt: Date
  addedBy?: string
  addedAt?: string
}

export interface Attribute {
  category: string
  attribute: string
  description: string
}

// Memoize function to replace React cache
const memoizedFunctions: Record<string, { result: any, expiry: number }> = {};

export async function memoize<T>(fn: () => Promise<T>, key: string, expiryMs = 60000): Promise<T> {
  const now = Date.now();
  const cached = memoizedFunctions[key];
  
  if (cached && cached.expiry > now) {
    return cached.result;
  }
  
  const result = await fn();
  memoizedFunctions[key] = { result, expiry: now + expiryMs };
  return result;
}

// Fetch writing badges
export async function getWritingBadges(): Promise<Badge[]> {
  try {
    const supabase = createServerComponentClient({ cookies })
    
    const { data, error } = await supabase
      .from('badges')
      .select('*')
      .eq('category', 'Writing')
    
    if (error) {
      console.error("Error fetching writing badges:", error)
      return []
    }
    
    return data as Badge[]
  } catch (error) {
    console.error("Error fetching writing badges:", error)
    return []
  }
}

// Fetch performance badges
export async function getPerformanceBadges(): Promise<Badge[]> {
  try {
    const supabase = createServerComponentClient({ cookies })
    
    const { data, error } = await supabase
      .from('badges')
      .select('*')
      .eq('category', 'Performance')
    
    if (error) {
      console.error("Error fetching performance badges:", error)
      return []
    }
    
    return data as Badge[]
  } catch (error) {
    console.error("Error fetching performance badges:", error)
    return []
  }
}

// Fetch personal reputation badges
export async function getPersonalBadges(): Promise<Badge[]> {
  try {
    const supabase = createServerComponentClient({ cookies })
    
    const { data, error } = await supabase
      .from('badges')
      .select('*')
      .eq('category', 'Personal')
    
    if (error) {
      console.error("Error fetching personal badges:", error)
      return []
    }
    
    return data as Badge[]
  } catch (error) {
    console.error("Error fetching personal badges:", error)
    return []
  }
}

// Get all badges
export async function getAllBadges(): Promise<Badge[]> {
  try {
    const supabase = createServerComponentClient({ cookies })
    
    const { data, error } = await supabase
      .from('badges')
      .select('*')
    
    if (error) {
      console.error("Error fetching all badges:", error)
      return []
    }
    
    return data as Badge[]
  } catch (error) {
    console.error("Error fetching all badges:", error)
    return []
  }
}

// Get battlers
export async function getBattlers(): Promise<Battler[]> {
  try {
    const supabase = createServerComponentClient({ cookies })
    
    const { data, error } = await supabase
      .from('battlers')
      .select('*')
    
    if (error) {
      console.error("Error fetching battlers:", error)
      return []
    }
    
    return data.map(battler => ({
      ...battler,
      createdAt: new Date(battler.createdAt)
    })) as Battler[]
  } catch (error) {
    console.error("Error fetching battlers:", error)
    return []
  }
}

// Get a single battler by ID
export async function getBattlerById(id: string): Promise<Battler | null> {
  try {
    const supabase = createServerComponentClient({ cookies })
    
    const { data, error } = await supabase
      .from('battlers')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error || !data) {
      console.error("Error fetching battler by ID:", error)
      return null
    }
    
    return {
      ...data,
      createdAt: new Date(data.createdAt)
    } as Battler
  } catch (error) {
    console.error("Error fetching battler by ID:", error)
    return null
  }
}

// Get attributes
export async function getAttributes(): Promise<Attribute[]> {
  try {
    const supabase = createServerComponentClient({ cookies })
    
    const { data, error } = await supabase
      .from('attributes')
      .select('*')
    
    if (error) {
      console.error("Error fetching attributes:", error)
      return []
    }
    
    return data as Attribute[]
  } catch (error) {
    console.error("Error fetching attributes:", error)
    return []
  }
}

// Get attributes by category
export async function getAttributesByCategory(category: string): Promise<Attribute[]> {
  try {
    const supabase = createServerComponentClient({ cookies })
    
    const { data, error } = await supabase
      .from('attributes')
      .select('*')
      .eq('category', category)
    
    if (error) {
      console.error(`Error fetching attributes for category ${category}:`, error)
      return []
    }
    
    return data as Attribute[]
  } catch (error) {
    console.error(`Error fetching attributes for category ${category}:`, error)
    return []
  }
}

// Admin functions
export async function createBattler(battler: Omit<Battler, "id" | "createdAt">): Promise<Battler> {
  try {
    const supabase = createServerComponentClient({ cookies })
    
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      throw new Error("You must be logged in to create a battler")
    }
    
    const newBattler = {
      ...battler,
      createdAt: new Date().toISOString(),
      addedBy: user.id,
      addedAt: new Date().toISOString()
    }
    
    const { data, error } = await supabase
      .from('battlers')
      .insert(newBattler)
      .select()
      .single()
    
    if (error) {
      console.error("Error creating battler:", error)
      throw new Error("Failed to create battler")
    }
    
    return {
      ...data,
      createdAt: new Date(data.createdAt)
    } as Battler
  } catch (error) {
    console.error("Error creating battler:", error)
    throw error
  }
}

export async function updateBattler(id: string, battler: Partial<Battler>): Promise<Battler | null> {
  try {
    const supabase = createServerComponentClient({ cookies })
    
    const { data, error } = await supabase
      .from('battlers')
      .update(battler)
      .eq('id', id)
      .select()
      .single()
    
    if (error) {
      console.error("Error updating battler:", error)
      return null
    }
    
    return {
      ...data,
      createdAt: new Date(data.createdAt)
    } as Battler
  } catch (error) {
    console.error("Error updating battler:", error)
    return null
  }
}

export async function deleteBattler(id: string): Promise<boolean> {
  try {
    const supabase = createServerComponentClient({ cookies })
    
    const { error } = await supabase
      .from('battlers')
      .delete()
      .eq('id', id)
    
    if (error) {
      console.error("Error deleting battler:", error)
      return false
    }
    
    return true
  } catch (error) {
    console.error("Error deleting battler:", error)
    return false
  }
}

// Get user by username
export async function getUserByUsername(username: string): Promise<any | null> {
  try {
    const supabase = createServerComponentClient({ cookies })
    
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('username', username)
      .single()
    
    if (error) {
      console.error("Error fetching user by username:", error)
      return null
    }
    
    return data
  } catch (error) {
    console.error("Error fetching user by username:", error)
    return null
  }
}

export async function updateUserAddedBattler(userId: string, battleId: string): Promise<void> {
  try {
    const supabase = createServerComponentClient({ cookies })
    
    // Get current user's added battlers
    const { data: user, error: fetchError } = await supabase
      .from('user_profiles')
      .select('addedBattlers')
      .eq('id', userId)
      .single()
    
    if (fetchError) {
      console.error("Error fetching user's added battlers:", fetchError)
      throw new Error("Failed to update user's added battlers")
    }
    
    const addedBattlers = user?.addedBattlers || []
    
    // Update user's added battlers
    const { error: updateError } = await supabase
      .from('user_profiles')
      .update({ addedBattlers: [...addedBattlers, battleId] })
      .eq('id', userId)
    
    if (updateError) {
      console.error("Error updating user's added battlers:", updateError)
      throw new Error("Failed to update user's added battlers")
    }
  } catch (error) {
    console.error("Error updating user's added battlers:", error)
    throw error
  }
}
