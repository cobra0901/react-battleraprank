"use server"

import type { UserBadge } from "@/types/badge-types"

// Mock data for user badges
const userBadges: UserBadge[] = [
  {
    id: "1",
    userId: "1",
    category: "Writing",
    badge: "Wordsmith",
    description: "Exceptional vocabulary and word usage",
    isPositive: true,
    count: 15,
  },
  {
    id: "2",
    userId: "1",
    category: "Writing",
    badge: "Scheme King",
    description: "Creates complex, extended metaphors",
    isPositive: true,
    count: 12,
  },
  {
    id: "3",
    userId: "1",
    category: "Performance",
    badge: "Crowd Control",
    description: "Exceptional ability to engage the audience",
    isPositive: true,
    count: 10,
  },
  {
    id: "4",
    userId: "1",
    category: "Writing",
    badge: "Recycler",
    description: "Reuses material across battles",
    isPositive: false,
    count: 3,
  },
]

export async function getUserBadges(userId: string): Promise<UserBadge[]> {
  // In a real app, this would query your database
  return userBadges.filter((badge) => badge.userId === userId).sort((a, b) => b.count - a.count)
}

// Add functions for managing user badges

// Mock user profiles data (replace with your actual data source)
const userProfiles = [
  { id: "1", name: "User One", badges: ["Wordsmith", "Scheme King"] },
  { id: "2", name: "User Two", badges: ["Crowd Control"] },
]

// Add these functions after the existing functions
export async function assignUserBadge(userId: string, badge: string): Promise<void> {
  // In a real app, this would update your database
  const userIndex = userProfiles.findIndex((u) => u.id === userId)

  if (userIndex === -1) {
    throw new Error("User not found")
  }

  if (!userProfiles[userIndex].badges) {
    userProfiles[userIndex].badges = []
  }

  if (!userProfiles[userIndex].badges!.includes(badge)) {
    userProfiles[userIndex].badges!.push(badge)
  }
}

export async function removeUserBadge(userId: string, badge: string): Promise<void> {
  // In a real app, this would update your database
  const userIndex = userProfiles.findIndex((u) => u.id === userId)

  if (userIndex === -1) {
    throw new Error("User not found")
  }

  if (userProfiles[userIndex].badges) {
    userProfiles[userIndex].badges = userProfiles[userIndex].badges!.filter((b) => b !== badge)
  }
}

export async function getUserBadgeNames(userId: string): Promise<string[]> {
  // In a real app, this would query your database
  const user = userProfiles.find((u) => u.id === userId)
  return user?.badges || []
}

