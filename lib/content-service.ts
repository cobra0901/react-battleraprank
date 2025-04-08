"use server"

import type { MediaContent } from "@/types/content-types"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"

/**
 * Get content created by a specific user
 */
export async function getUserContent(userId: string): Promise<MediaContent[]> {
  try {
    const supabase = createServerComponentClient({ cookies })
    
    const { data, error } = await supabase
      .from('media_content')
      .select('*')
      .eq('userId', userId)
      .order('createdAt', { ascending: false })
    
    if (error) {
      console.error('Error fetching user content:', error)
      return []
    }
    
    return data.map(item => ({
      ...item,
      likedByCurrentUser: false // This will be updated in a separate query if needed
    })) as MediaContent[]
  } catch (error) {
    console.error('Error fetching user content:', error)
    return []
  }
}

/**
 * Add new content for a user
 */
export async function addUserContent(
  userId: string, 
  data: Partial<MediaContent>
): Promise<MediaContent> {
  try {
    const supabase = createServerComponentClient({ cookies })
    
    // Verify the current user
    const { data: { user } } = await supabase.auth.getUser()
    
    if (user?.id !== userId) {
      throw new Error('Unauthorized: You can only add content for your own account')
    }
    
    const newContent = {
      userId,
      title: data.title || '',
      description: data.description || '',
      url: data.url || '',
      type: data.type || 'article',
      thumbnail: data.thumbnail || '',
      likes: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    
    const { data: insertedContent, error } = await supabase
      .from('media_content')
      .insert(newContent)
      .select()
      .single()
    
    if (error) {
      console.error('Error adding content:', error)
      throw new Error('Failed to add content')
    }
    
    return {
      ...insertedContent,
      likedByCurrentUser: false
    } as MediaContent
  } catch (error) {
    console.error('Error adding content:', error)
    throw error
  }
}

/**
 * Like or unlike a piece of content
 */
export async function likeContent(contentId: string): Promise<void> {
  try {
    const supabase = createServerComponentClient({ cookies })
    
    // Get the current user
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      throw new Error('You must be logged in to like content')
    }
    
    // Check if already liked
    const { data: existingLike, error: checkError } = await supabase
      .from('content_likes')
      .select()
      .eq('contentId', contentId)
      .eq('userId', user.id)
      .single()
    
    if (!existingLike) {
      // Add like
      const { error: insertError } = await supabase
        .from('content_likes')
        .insert({
          contentId,
          userId: user.id,
          createdAt: new Date().toISOString()
        })
        
      if (insertError) {
        console.error('Error liking content:', insertError)
        throw new Error('Failed to like content')
      }
      
      // Increment likes count
      await supabase.rpc('increment_content_likes', { content_id: contentId })
    } else {
      // Remove like
      const { error: deleteError } = await supabase
        .from('content_likes')
        .delete()
        .eq('contentId', contentId)
        .eq('userId', user.id)
        
      if (deleteError) {
        console.error('Error unliking content:', deleteError)
        throw new Error('Failed to unlike content')
      }
      
      // Decrement likes count
      await supabase.rpc('decrement_content_likes', { content_id: contentId })
    }
  } catch (error) {
    console.error('Error toggling content like:', error)
    throw error
  }
}
