import type { UserRoles } from "./auth-types"

export interface UserStats {
  id: string
  displayName: string
  username: string
  profileImage?: string
  roles: UserRoles
  totalRatings: number
  accuracyScore: number
  followers: number
  isFollowedByCurrentUser: boolean
  badges?: string[] // Special badges assigned to the user
}

export interface CommunityStats {
  totalUsers: number
  activeUsers: number
  totalRatings: number
  totalBattlers: number
  averageRating: number
  lastUpdated: string
  newUsersThisWeek?: number
  newRatingsThisWeek?: number
  roleBreakdown?: {
    role: string
    percentage: number
  }[]
  ratingDistribution?: {
    range: string
    percentage: number
  }[]
}

export interface LeaderboardEntry {
  userId: string
  username: string
  displayName: string
  profileImage: string
  totalPoints: number
  rank: number
  change?: number
  isCurrentUser?: boolean
  totalRatings?: number
  consistency?: number
  influence?: number
  accuracyScore?: number
  followers?: number
}

export interface TopContributor {
  userId: string
  username: string
  displayName: string
  profileImage: string
  contributionCount: number
  lastActive: string
  contribution?: string
  score?: number
  description?: string
}
