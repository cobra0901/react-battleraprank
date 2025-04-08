export interface UserRating {
  id: string
  userId?: string
  battlerId: string
  battlerName: string
  battlerImage?: string
  rating?: number
  badges?: {
    positive: string[]
    negative: string[]
  }
  createdAt?: string
  category?: string
  attribute?: string
  value?: number
  date?: string
}
