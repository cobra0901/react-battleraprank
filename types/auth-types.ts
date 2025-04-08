import { Youtube } from "lucide-react"

export interface UserRoles {
  fan: boolean
  media: boolean
  battler: boolean
  league_owner: boolean
  admin: boolean
  community_manager: boolean
  media_confirmed?: boolean
}export type UserRole = "fan" | "media" | "battler" | "league_owner" | "admin" | "community_manager"

export interface RoleWeight {
  role: UserRole
  weight: number
  displayName: string
  description: string
  color: string
}

export interface UserRoles {
  fan: boolean
  media: boolean
  battler: boolean
  league_owner: boolean
  admin: boolean
  community_manager: boolean
  media_confirmed?: boolean 
}

export interface SocialLinks {
  youtube?: string
  twitter?: string
  instagram?: string
  website?: string
}

export interface UserProfile {
  id: string
  email: string
  displayName?: string
  username?: string
  full_name?: string 
  roles: UserRoles
  verified?: boolean
  createdAt?: string
  created_at?: string 
  bio?: string
  location?: string
  website?: string
  profileImage?: string
  bannerImage?: string
  socialLinks?: SocialLinks
  battlerId?: string 
  leagueId?: string 
  mediaOutlet?: string 
  followers?: number
  following?: number
  badges?: string[] 
  privacySettings?: {
    visibilityLevel: "low" | "medium" | "high"
    showEmail: boolean
    showRatings: boolean
    showBadges: boolean
    showHistoricalData: boolean
  }
  contentLinks?: ContentLink[]
  addedBattlers?: string[] 
}

export interface ContentLink {
  id: string
  userId: string
  url: string
  displayName: string
  type: "youtube" | "article" | "podcast" | "other"
  thumbnail?: string
  createdAt: string
  likes: number
  views?: number
}

export interface YouTubeChannel {
  id: string
  url: string
  name: string
  description?: string
  subscriberCount?: number
  videoCount?: number
  viewCount?: number
}
