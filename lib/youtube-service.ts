"use server"

import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"

/**
 * Gets information about a YouTube video
 */
export async function getYouTubeVideoInfo(videoUrl: string): Promise<{
  title: string
  thumbnail: string
  views: number
  likes: number
  comments: number
} | null> {
  try {
    // Extract video ID from URL
    const videoId = await extractYouTubeVideoId(videoUrl)

    if (!videoId) {
      throw new Error("Invalid YouTube URL")
    }

    // In a production app, you would call the YouTube API here
    // For now, return a placeholder with real video ID
    return {
      title: `YouTube Video ${videoId}`,
      thumbnail: `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`,
      views: 0,
      likes: 0,
      comments: 0,
    }
  } catch (error) {
    console.error("Error getting YouTube video info:", error)
    return null
  }
}

/**
 * Extracts the video ID from a YouTube URL
 */
export async function extractYouTubeVideoId(url: string): Promise<string | null> {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
  const match = url.match(regExp)

  if (match && match[2].length === 11) {
    return match[2]
  }

  return null
}

/**
 * Returns a YouTube embed URL from a video ID
 */
export async function getYouTubeEmbedUrl(videoId: string): Promise<string> {
  return `https://www.youtube.com/embed/${videoId}`
}

/**
 * Checks if a URL is a valid YouTube URL
 */
export async function isValidYouTubeUrl(url: string): Promise<boolean> {
  const videoId = await extractYouTubeVideoId(url)
  return !!videoId
}

/**
 * Gets featured videos for the home page from the database
 */
export async function getFeaturedVideos() {
  try {
    const supabase = createServerComponentClient({ cookies })
    
    // Get videos from the database
    const { data, error } = await supabase
      .from("featured_videos")
      .select("*")
      .order("order", { ascending: true })

    // If there's an error or no data, return empty array
    if (error || !data || data.length === 0) {
      console.error("Error fetching featured videos:", error)
      return []
    }

    return data
  } catch (error) {
    console.error("Error fetching featured videos:", error)
    return []
  }
}

/**
 * Saves featured videos (admin only)
 */
interface FeaturedVideo {
  title: string
  videoId: string
  thumbnail?: string
  order: number
}

export async function manageFeaturedVideos(videos: FeaturedVideo[]): Promise<boolean> {
  try {
    const supabase = createServerComponentClient({ cookies })
    
    // First, delete all existing featured videos
    const { error: deleteError } = await supabase
      .from("featured_videos")
      .delete()
      .not("id", "is", null) // Safety check

    if (deleteError) {
      console.error("Error deleting featured videos:", deleteError)
      return false
    }

    // Then insert the new videos
    const { error: insertError } = await supabase
      .from("featured_videos")
      .insert(
        videos.map((video) => ({
          title: video.title,
          videoId: video.videoId,
          thumbnail: video.thumbnail || `https://img.youtube.com/vi/${video.videoId}/mqdefault.jpg`,
          order: video.order,
        }))
      )

    if (insertError) {
      console.error("Error inserting featured videos:", insertError)
      return false
    }

    return true
  } catch (error) {
    console.error("Error managing featured videos:", error)
    return false
  }
}

/**
 * Gets videos from a YouTube channel
 * Note: In a production app, you would use the YouTube API
 */
export async function getChannelVideos(
  channelId: string,
  maxResults = 5,
): Promise<
  {
    id: string
    title: string
    thumbnail: string
    views: number
    likes: number
    comments: number
    publishedAt: string
  }[]
> {
  try {
    // In a production app, you would call the YouTube API here with the channel ID
    // This is a placeholder implementation until YouTube API is integrated
    
    // Return empty array since we're not using mock data anymore
    return []
  } catch (error) {
    console.error("Error getting channel videos:", error)
    return []
  }
}
