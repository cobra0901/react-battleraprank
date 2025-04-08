"use client"

import type React from "react"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { LayoutDashboard, Users, Tag, Settings, BarChart, Database, Award, Sliders, Shield, Video, HardDrive, UserCheck, UserPlus } from "lucide-react"

interface SidebarLinkProps {
  href: string
  icon: React.ReactNode
  children: React.ReactNode
}

function SidebarLink({ href, icon, children }: SidebarLinkProps) {
  const pathname = usePathname()
  const isActive = pathname === href

  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all",
        isActive ? "bg-gray-800 text-white" : "text-gray-400 hover:bg-gray-800/50 hover:text-white",
      )}
    >
      {icon}
      <span>{children}</span>
    </Link>
  )
}

export default function AdminSidebar() {
  return (
    <div className="flex h-full w-full flex-col border-r border-gray-800 bg-gray-950">
      <div className="flex h-14 items-center border-b border-gray-800 px-4">
        <Link href="/admin" className="flex items-center gap-2 font-semibold">
          <Award className="h-6 w-6 text-red-500" />
          <span>Battle Rap Admin</span>
        </Link>
      </div>
      <div className="flex-1 overflow-auto py-2">
        <nav className="grid items-start px-2 text-sm font-medium">
          <SidebarLink href="/admin" icon={<LayoutDashboard className="h-4 w-4" />}>
            Dashboard
          </SidebarLink>
          <SidebarLink href="/admin/battlers" icon={<Users className="h-4 w-4" />}>
            Battlers
          </SidebarLink>
          <SidebarLink href="/admin/battlers/create" icon={<Users className="h-4 w-4 text-green-500" />}>
            Create Battler
          </SidebarLink>
          <SidebarLink href="/admin/data-management" icon={<HardDrive className="h-4 w-4 text-blue-500" />}>
            Data Management
          </SidebarLink>
          <SidebarLink href="/admin/badges" icon={<Award className="h-4 w-4" />}>
            Badges
          </SidebarLink>
          <SidebarLink href="/admin/tags" icon={<Tag className="h-4 w-4" />}>
            Tags
          </SidebarLink>
          <SidebarLink href="/admin/user-badges" icon={<Award className="h-4 w-4" />}>
            User Badges
          </SidebarLink>
          <SidebarLink href="/admin/role-weights" icon={<Sliders className="h-4 w-4" />}>
            Role Weights
          </SidebarLink>
          <SidebarLink href="/admin/community-managers" icon={<Shield className="h-4 w-4 text-amber-500" />}>
            Community Managers
          </SidebarLink>
          <SidebarLink href="/admin/administrators" icon={<UserPlus className="h-4 w-4 text-red-500" />}>
            Administrators
          </SidebarLink>
          <SidebarLink href="/admin/media-users" icon={<UserCheck className="h-4 w-4 text-green-500" />}>
            Media Users
          </SidebarLink>
          <SidebarLink href="/admin/featured-videos" icon={<Video className="h-4 w-4" />}>
            Featured Videos
          </SidebarLink>
          <SidebarLink href="/admin-tools" icon={<Database className="h-4 w-4" />}>
            Admin Tools
          </SidebarLink>
          <SidebarLink href="/analytics" icon={<BarChart className="h-4 w-4" />}>
            Analytics
          </SidebarLink>
          <SidebarLink href="/admin/settings" icon={<Settings className="h-4 w-4" />}>
            Settings
          </SidebarLink>
        </nav>
      </div>
    </div>
  )
}
