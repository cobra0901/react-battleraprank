"use server"

import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"

// Types for tags
export interface Tag {
  id: string
  name: string
  description?: string
  isHidden: boolean
  category?: string
  createdAt: Date
}

// Get all tags
export async function getTags(): Promise<Tag[]> {
  try {
    const supabase = createServerComponentClient({ cookies })
    
    const { data, error } = await supabase
      .from('tags')
      .select('*')
      .order('name', { ascending: true })
    
    if (error) {
      console.error('Error fetching tags:', error)
      return []
    }
    
    return data.map(tag => ({
      ...tag,
      createdAt: new Date(tag.createdAt)
    })) as Tag[]
  } catch (error) {
    console.error('Error fetching tags:', error)
    return []
  }
}

// Get tags by category
export async function getTagsByCategory(category: string): Promise<Tag[]> {
  try {
    const supabase = createServerComponentClient({ cookies })
    
    const { data, error } = await supabase
      .from('tags')
      .select('*')
      .eq('category', category)
      .order('name', { ascending: true })
    
    if (error) {
      console.error(`Error fetching tags for category ${category}:`, error)
      return []
    }
    
    return data.map(tag => ({
      ...tag,
      createdAt: new Date(tag.createdAt)
    })) as Tag[]
  } catch (error) {
    console.error(`Error fetching tags for category ${category}:`, error)
    return []
  }
}

// Add a new tag
export async function addTag(tag: Omit<Tag, "id" | "createdAt">): Promise<Tag> {
  try {
    const supabase = createServerComponentClient({ cookies })
    
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      throw new Error("You must be logged in to add a tag")
    }
    
    const newTag = {
      ...tag,
      createdAt: new Date().toISOString()
    }
    
    const { data, error } = await supabase
      .from('tags')
      .insert(newTag)
      .select()
      .single()
    
    if (error) {
      console.error('Error adding tag:', error)
      throw new Error("Failed to add tag")
    }
    
    return {
      ...data,
      createdAt: new Date(data.createdAt)
    } as Tag
  } catch (error) {
    console.error('Error adding tag:', error)
    throw error
  }
}

// Update an existing tag
export async function updateTag(
  id: string, 
  updates: Partial<Omit<Tag, "id" | "createdAt">>
): Promise<Tag | null> {
  try {
    const supabase = createServerComponentClient({ cookies })
    
    const { data, error } = await supabase
      .from('tags')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) {
      console.error('Error updating tag:', error)
      return null
    }
    
    return {
      ...data,
      createdAt: new Date(data.createdAt)
    } as Tag
  } catch (error) {
    console.error('Error updating tag:', error)
    return null
  }
}

// Delete a tag
export async function deleteTag(id: string): Promise<boolean> {
  try {
    const supabase = createServerComponentClient({ cookies })
    
    const { error } = await supabase
      .from('tags')
      .delete()
      .eq('id', id)
    
    if (error) {
      console.error('Error deleting tag:', error)
      return false
    }
    
    return true
  } catch (error) {
    console.error('Error deleting tag:', error)
    return false
  }
}

// Get tag categories
export async function getTagCategories(): Promise<string[]> {
  try {
    const supabase = createServerComponentClient({ cookies })
    
    const { data, error } = await supabase
      .from('tags')
      .select('category')
      .not('category', 'is', null)
    
    if (error) {
      console.error('Error fetching tag categories:', error)
      return []
    }
    
    // Extract unique categories
    const categories = Array.from(new Set(data.map(tag => tag.category)))
      .filter(Boolean) as string[]
    
    return categories
  } catch (error) {
    console.error('Error fetching tag categories:', error)
    return []
  }
}

// Stuffs I added
// save tags
export async function saveTags(tags: Tag[]): Promise<boolean> {
  try {
    const supabase = createServerComponentClient({ cookies })
    
    const { error } = await supabase
      .from('tags')
      .upsert(tags)
    
    if (error) {
      console.error('Error saving tags:', error)
      return false
    }
    
    return true
  } catch (error) {
    console.error('Error saving tags:', error)
    return false
  }
}

