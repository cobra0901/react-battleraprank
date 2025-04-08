export interface MediaContent {
  id: string
  userId: string
  title: string
  description: string
  url: string
  type: "video" | "article" | "podcast"
  thumbnail?: string
  likes: number
  likedByCurrentUser: boolean
  createdAt: string
  updatedAt: string
}

