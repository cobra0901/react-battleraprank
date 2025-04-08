"use client"

import { useState } from "react"
import { Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useAuth } from "@/contexts/auth-context"
import { cn } from "@/lib/utils"

type Notification = {
  id: string
  title: string
  message: string
  timestamp: Date
  read: boolean
  type: "info" | "warning" | "success" | "error"
  link?: string
}

// Mock notifications - in a real app, these would come from a database or API
const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: "1",
    title: "New Rating",
    message: "Your battler received a new rating",
    timestamp: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
    read: false,
    type: "info",
    link: "/my-ratings",
  },
  {
    id: "2",
    title: "Community Manager Request",
    message: "Your request to become a community manager is being reviewed",
    timestamp: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
    read: true,
    type: "info",
  },
  {
    id: "3",
    title: "Content Liked",
    message: "Someone liked your YouTube video",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3), // 3 hours ago
    read: false,
    type: "success",
    link: "/profile",
  },
]

export default function NotificationCenter() {
  const { user } = useAuth()
  const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS)
  const [open, setOpen] = useState(false)

  const unreadCount = notifications.filter((n) => !n.read).length

  const markAsRead = (id: string) => {
    setNotifications(notifications.map((n) => (n.id === id ? { ...n, read: true } : n)))
  }

  const markAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })))
  }

  if (!user) return null

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5 text-gray-400 hover:text-gray-100" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-medium text-white">
              {unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="flex items-center justify-between border-b p-3">
          <h3 className="font-medium">Notifications</h3>
          {unreadCount > 0 && (
            <Button variant="ghost" size="sm" className="text-xs h-7" onClick={markAllAsRead}>
              Mark all as read
            </Button>
          )}
        </div>
        <div className="max-h-80 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="p-4 text-center text-sm text-gray-500">No notifications</div>
          ) : (
            <div className="divide-y">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={cn(
                    "p-3 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer",
                    !notification.read && "bg-blue-50 dark:bg-blue-900/20",
                  )}
                  onClick={() => {
                    markAsRead(notification.id)
                    if (notification.link) {
                      // In a real app, use router.push or similar
                      window.location.href = notification.link
                    }
                  }}
                >
                  <div className="flex justify-between items-start">
                    <div className="font-medium text-sm">{notification.title}</div>
                    <div className="text-xs text-gray-500">{formatTimeAgo(notification.timestamp)}</div>
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">{notification.message}</div>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="border-t p-2 text-center">
          <Button variant="ghost" size="sm" className="text-xs w-full">
            View all notifications
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}

// Helper function to format timestamps
function formatTimeAgo(date: Date): string {
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

  if (diffInSeconds < 60) return `${diffInSeconds}s ago`
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
  return `${Math.floor(diffInSeconds / 86400)}d ago`
}

