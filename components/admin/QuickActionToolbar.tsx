"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useRouter } from "next/navigation"
import { Plus, Users, Tag, Award, Shield, Settings, RefreshCw, Download, Upload } from "lucide-react"

export default function QuickActionToolbar() {
  const router = useRouter()
  const [isRefreshing, setIsRefreshing] = useState(false)

  const handleRefresh = () => {
    setIsRefreshing(true)
    // Simulate refresh delay
    setTimeout(() => {
      router.refresh()
      setIsRefreshing(false)
    }, 1000)
  }

  const actions = [
    {
      icon: <Plus className="h-4 w-4" />,
      label: "Add Battler",
      action: () => router.push("/admin/battlers/new"),
      color: "text-green-500",
    },
    {
      icon: <Users className="h-4 w-4" />,
      label: "Manage Battlers",
      action: () => router.push("/admin/battlers"),
      color: "text-blue-500",
    },
    {
      icon: <Tag className="h-4 w-4" />,
      label: "Manage Tags",
      action: () => router.push("/admin/tags"),
      color: "text-purple-500",
    },
    {
      icon: <Award className="h-4 w-4" />,
      label: "Manage Badges",
      action: () => router.push("/admin/badges"),
      color: "text-amber-500",
    },
    {
      icon: <Shield className="h-4 w-4" />,
      label: "Community Managers",
      action: () => router.push("/admin/community-managers"),
      color: "text-red-500",
    },
    {
      icon: <Settings className="h-4 w-4" />,
      label: "Settings",
      action: () => router.push("/admin/settings"),
      color: "text-gray-400",
    },
    {
      icon: isRefreshing ? <RefreshCw className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />,
      label: "Refresh Data",
      action: handleRefresh,
      color: "text-cyan-500",
    },
    {
      icon: <Download className="h-4 w-4" />,
      label: "Export Data",
      action: () => router.push("/admin-tools?tab=export"),
      color: "text-emerald-500",
    },
    {
      icon: <Upload className="h-4 w-4" />,
      label: "Import Data",
      action: () => router.push("/admin-tools?tab=import"),
      color: "text-orange-500",
    },
  ]

  return (
    <TooltipProvider>
      <Card className="p-2 bg-gray-900 border-gray-800">
        <div className="flex flex-wrap gap-1">
          {actions.map((action, index) => (
            <Tooltip key={index} delayDuration={300}>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="sm" className={`h-9 w-9 p-0 ${action.color}`} onClick={action.action}>
                  {action.icon}
                  <span className="sr-only">{action.label}</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{action.label}</p>
              </TooltipContent>
            </Tooltip>
          ))}
        </div>
      </Card>
    </TooltipProvider>
  )
}

