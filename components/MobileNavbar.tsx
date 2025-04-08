"use client"

import type React from "react"

import { useState, useRef } from "react"
import Link from "next/link"
import {
  Menu,
  Home,
  Users,
  BarChart2,
  Video,
  User,
  LogIn,
  Database,
  Search,
  Award,
  Star,
  Settings,
  Bell,
  Trophy,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/auth-context"
import { usePathname } from "next/navigation"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetClose } from "@/components/ui/sheet"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import Image from "next/image"

export default function MobileNavbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const { user, signOut } = useAuth()
  const pathname = usePathname()
  const triggerRef = useRef<HTMLButtonElement>(null)

  const mainNavItems = [
    { href: "/", label: "Home", icon: <Home className="w-5 h-5 mr-3" /> },
    { href: "/battlers", label: "Battlers", icon: <Users className="w-5 h-5 mr-3" /> },
    { href: "/analytics", label: "Analytics", icon: <BarChart2 className="w-5 h-5 mr-3" /> },
    { href: "/media", label: "Media", icon: <Video className="w-5 h-5 mr-3" /> },
  ]

  const secondaryNavItems = [
    { href: "/leaderboard", label: "Leaderboard", icon: <Trophy className="w-5 h-5 mr-3" /> },
    { href: "/rankings", label: "Rankings", icon: <Award className="w-5 h-5 mr-3" /> },
    { href: "/favorites", label: "Favorites", icon: <Star className="w-5 h-5 mr-3" /> },
    { href: "/admin-tools", label: "Admin Tools", icon: <Database className="w-5 h-5 mr-3" /> },
  ]

  const isActive = (path: string) => {
    if (path === "/" && pathname !== "/") {
      return false
    }
    return pathname.startsWith(path)
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      setIsOpen(false)
      // In a real app, this would navigate to search results
      console.log(`Searching for: ${searchQuery}`)
    }
  }

  return (
    <div className="md:hidden">
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button id="mobile-menu-trigger" ref={triggerRef} variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-6 w-6" />
            <span className="sr-only">Toggle menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[300px] sm:w-[350px] bg-gray-900 border-gray-800 overflow-y-auto">
          <SheetHeader className="border-b border-gray-800 pb-4 mb-4">
            <SheetTitle className="flex items-center">
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/1ahq-LogoshiRes-enhance-3.4x.png-RgnWSrnet4mLXiyHJq8wddQ1bMJ8Wr.jpeg"
                alt="Algorithm Institute of Battle Rap"
                width={40}
                height={40}
                className="mr-2"
              />
              <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-amber-300">
                AIBR
              </span>
            </SheetTitle>
          </SheetHeader>

          {/* User profile section */}
          <div className="mb-6">
            {user ? (
              <div className="flex items-center p-4 bg-gray-800/50 rounded-lg">
                <Avatar className="h-10 w-10 mr-3">
                  <AvatarImage src="/placeholder.svg" alt={user.email?.split("@")[0]} />
                  <AvatarFallback>{user.email?.substring(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="font-medium">{user.email?.split("@")[0]}</p>
                  <p className="text-xs text-gray-400">{user.email}</p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-gray-400 hover:text-red-400"
                  onClick={() => {
                    signOut()
                    setIsOpen(false)
                  }}
                >
                  <LogIn className="h-5 w-5 rotate-180" />
                </Button>
              </div>
            ) : (
              <div className="flex gap-2 p-4">
                <SheetClose asChild className="flex-1">
                  <Button asChild variant="default" className="w-full">
                    <Link href="/auth/login">Login</Link>
                  </Button>
                </SheetClose>
                <SheetClose asChild className="flex-1">
                  <Button asChild variant="outline" className="w-full">
                    <Link href="/auth/signup">Sign Up</Link>
                  </Button>
                </SheetClose>
              </div>
            )}
          </div>

          {/* Search bar */}
          <div className="px-4 mb-6">
            <form onSubmit={handleSearch} className="relative">
              <Input
                type="search"
                placeholder="Search battlers, battles..."
                className="bg-gray-800 border-gray-700 pr-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Button type="submit" variant="ghost" size="icon" className="absolute right-0 top-0 h-full">
                <Search className="h-4 w-4" />
              </Button>
            </form>
          </div>

          {/* Main navigation */}
          <div className="mb-6">
            <h3 className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Main Navigation</h3>
            <div className="space-y-1">
              {mainNavItems.map((item) => (
                <SheetClose asChild key={item.href}>
                  <Link
                    href={item.href}
                    className={`flex items-center py-3 px-4 rounded-md transition-colors ${
                      isActive(item.href)
                        ? "bg-amber-900/20 text-amber-400"
                        : "text-gray-300 hover:bg-gray-800 hover:text-amber-400"
                    }`}
                  >
                    {item.icon}
                    {item.label}
                  </Link>
                </SheetClose>
              ))}
            </div>
          </div>

          {/* Secondary navigation */}
          <div className="mb-6">
            <h3 className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Features</h3>
            <div className="space-y-1">
              {secondaryNavItems.map((item) => (
                <SheetClose asChild key={item.href}>
                  <Link
                    href={item.href}
                    className={`flex items-center py-3 px-4 rounded-md transition-colors ${
                      isActive(item.href)
                        ? "bg-amber-900/20 text-amber-400"
                        : "text-gray-300 hover:bg-gray-800 hover:text-amber-400"
                    }`}
                  >
                    {item.icon}
                    {item.label}
                  </Link>
                </SheetClose>
              ))}
            </div>
          </div>

          {/* User account links */}
          {user && (
            <div className="mb-6">
              <h3 className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Your Account</h3>
              <div className="space-y-1">
                <SheetClose asChild>
                  <Link
                    href="/profile"
                    className="flex items-center py-3 px-4 rounded-md transition-colors text-gray-300 hover:bg-gray-800 hover:text-amber-400"
                  >
                    <User className="w-5 h-5 mr-3" />
                    Profile
                  </Link>
                </SheetClose>
                <SheetClose asChild>
                  <Link
                    href="/my-ratings"
                    className="flex items-center py-3 px-4 rounded-md transition-colors text-gray-300 hover:bg-gray-800 hover:text-amber-400"
                  >
                    <Star className="w-5 h-5 mr-3" />
                    My Ratings
                  </Link>
                </SheetClose>
                <SheetClose asChild>
                  <Link
                    href="/notifications"
                    className="flex items-center py-3 px-4 rounded-md transition-colors text-gray-300 hover:bg-gray-800 hover:text-amber-400"
                  >
                    <Bell className="w-5 h-5 mr-3" />
                    Notifications
                    <span className="ml-auto bg-amber-500 text-black text-xs font-bold px-2 py-0.5 rounded-full">
                      3
                    </span>
                  </Link>
                </SheetClose>
                <SheetClose asChild>
                  <Link
                    href="/settings"
                    className="flex items-center py-3 px-4 rounded-md transition-colors text-gray-300 hover:bg-gray-800 hover:text-amber-400"
                  >
                    <Settings className="w-5 h-5 mr-3" />
                    Settings
                  </Link>
                </SheetClose>
              </div>
            </div>
          )}

          {/* Footer links */}
          <div className="border-t border-gray-800 pt-4 mt-auto">
            <div className="flex flex-wrap gap-3 px-4 text-sm text-gray-500">
              <SheetClose asChild>
                <Link href="/about" className="hover:text-gray-300">
                  About
                </Link>
              </SheetClose>
              <SheetClose asChild>
                <Link href="/contact" className="hover:text-gray-300">
                  Contact
                </Link>
              </SheetClose>
              <SheetClose asChild>
                <Link href="/privacy" className="hover:text-gray-300">
                  Privacy
                </Link>
              </SheetClose>
              <SheetClose asChild>
                <Link href="/terms" className="hover:text-gray-300">
                  Terms
                </Link>
              </SheetClose>
            </div>
            <div className="px-4 mt-4 text-xs text-gray-500">© 2023 Algorithm Institute of Battle Rap</div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}

