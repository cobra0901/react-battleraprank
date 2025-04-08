"use client"

import Link from "next/link"
import Image from "next/image"
import { LogIn, LogOut, User, Database, Trophy } from "lucide-react"
import { usePathname } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import MobileNavbar from "./MobileNavbar"
import NotificationCenter from "@/components/notifications/NotificationCenter"
import KeyboardShortcutsHelper from "@/components/KeyboardShortcutsHelper"
import { cn } from "@/lib/utils"

export default function Header() {
  const pathname = usePathname()
  const { user, signOut } = useAuth()

  return (
    <header className="fixed top-0 left-0 right-0 bg-gray-900/80 backdrop-blur-md border-b border-gray-800 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center">
          <MobileNavbar />
          <Link href="/" className="flex items-center">
            <div className="relative h-10 w-10 mr-2">
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/1ahq-LogoshiRes-enhance-3.4x.png-RgnWSrnet4mLXiyHJq8wddQ1bMJ8Wr.jpeg"
                alt="Algorithm Institute of Battle Rap"
                width={40}
                height={40}
                className="object-contain"
                priority
                style={{ maxHeight: "40px" }}
              />
            </div>
            <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-blue-500">
              AIBR
            </span>
          </Link>
        </div>
        <div className="flex items-center gap-6">
          <nav className="hidden md:flex gap-6">
            <Link
              href="/"
              prefetch={true}
              className={`text-sm font-medium transition-colors hover:text-blue-400 ${
                pathname === "/" ? "text-blue-400" : "text-gray-300"
              }`}
            >
              Home
            </Link>
            <Link
              href="/battlers"
              prefetch={true}
              className={`text-sm font-medium transition-colors hover:text-blue-400 ${
                pathname.includes("/battlers") ? "text-blue-400" : "text-gray-300"
              }`}
            >
              Battlers
            </Link>
            <Link
              href="/analytics"
              prefetch={true}
              className={`text-sm font-medium transition-colors hover:text-blue-400 ${
                pathname.includes("/analytics") ? "text-blue-400" : "text-gray-300"
              }`}
            >
              Analytics
            </Link>
            <Link
              href="/leaderboard"
              prefetch={true}
              className={`text-sm font-medium transition-colors hover:text-amber-400 ${
                pathname.includes("/leaderboard") ? "text-amber-400" : "text-gray-300"
              }`}
            >
              <Trophy className="w-4 h-4 inline mr-1" />
              Leaderboard
            </Link>
            <Link
              href="/admin-tools"
              className={`text-sm font-medium transition-colors hover:text-amber-400 ${
                pathname.includes("/admin-tools") ? "text-amber-400" : "text-gray-300"
              }`}
            >
              <Database className="w-4 h-4 inline mr-1" />
              Admin
            </Link>
            <Link
              href="/diagnostics"
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                pathname === "/diagnostics" ? "text-primary" : "text-muted-foreground",
              )}
            >
              Diagnostics
            </Link>
          </nav>

          <KeyboardShortcutsHelper />

          {user ? (
            <>
              <NotificationCenter />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="gap-2">
                    <User className="h-4 w-4" />
                    <span className="hidden md:inline">{user.email?.split("@")[0]}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href={`/profile/${user.email?.split("@")[0]}`}>Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/my-ratings">My Ratings</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/admin-tools">Admin Tools</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => signOut()} className="text-red-500">
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <Button asChild variant="ghost" size="sm">
              <Link href="/auth/login" className="gap-2">
                <LogIn className="h-4 w-4" />
                <span className="hidden sm:inline">Login</span>
              </Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  )
}
