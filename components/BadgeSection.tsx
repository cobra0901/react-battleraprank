"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle } from "lucide-react"

interface BadgeSectionProps {
  title: string
  badges: string[]
  isPositive: boolean
}

export default function BadgeSection({ title, badges, isPositive }: BadgeSectionProps) {
  const [selectedBadges, setSelectedBadges] = useState<string[]>([])

  const toggleBadge = (badge: string) => {
    setSelectedBadges((prev) => (prev.includes(badge) ? prev.filter((b) => b !== badge) : [...prev, badge]))
  }

  const baseClasses = "cursor-pointer transition-all duration-300"
  const positiveClasses = "border-green-600 hover:bg-green-600 hover:bg-opacity-20"
  const negativeClasses = "border-red-600 hover:bg-red-600 hover:bg-opacity-20"

  return (
    <div>
      <h3 className={`text-lg font-semibold mb-2 flex items-center ${isPositive ? "text-green-500" : "text-red-500"}`}>
        {isPositive ? <CheckCircle className="w-5 h-5 mr-2" /> : <XCircle className="w-5 h-5 mr-2" />}
        {title}
      </h3>
      <div className="grid grid-cols-2 gap-2">
        {badges.map((badge) => (
          <Badge
            key={badge}
            variant="outline"
            className={`
              ${baseClasses}
              ${isPositive ? positiveClasses : negativeClasses}
              ${selectedBadges.includes(badge) ? (isPositive ? "bg-green-600 bg-opacity-20" : "bg-red-600 bg-opacity-20") : ""}
            `}
            onClick={() => toggleBadge(badge)}
          >
            {badge}
            {selectedBadges.includes(badge) && <span className="ml-2">{isPositive ? "✓" : "✗"}</span>}
          </Badge>
        ))}
      </div>
    </div>
  )
}

