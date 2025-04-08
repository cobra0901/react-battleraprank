"use client"

import { useState } from "react"
import { CheckCircle, XCircle } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface BadgeItem {
  badge: string
  description: string
}

interface BadgeSectionProps {
  title: string
  badges: BadgeItem[]
  isPositive: boolean
  selectedBadges: string[]
  onSelectBadge: (badge: string, isPositive: boolean) => void
}

export default function BadgeSection({ title, badges, isPositive, selectedBadges, onSelectBadge }: BadgeSectionProps) {
  // Track which badge is being hovered
  const [hoveredBadge, setHoveredBadge] = useState<string | null>(null)

  // Get color scheme based on positive/negative
  const getColorScheme = (isSelected: boolean) => {
    if (isPositive) {
      return isSelected
        ? "bg-green-100 text-green-800 border-green-500 shadow-md shadow-green-900/30"
        : "bg-gray-800 text-gray-300 border-gray-700 hover:bg-green-900/20 hover:border-green-700"
    } else {
      return isSelected
        ? "bg-red-100 text-red-800 border-red-500 shadow-md shadow-red-900/30"
        : "bg-gray-800 text-gray-300 border-gray-700 hover:bg-red-900/20 hover:border-red-700"
    }
  }

  return (
    <div data-testid="badge-section">
      <h3 
        className={`text-lg font-semibold mb-4 flex items-center ${isPositive ? "text-green-500" : "text-red-500"}`}
        data-testid={`badge-section-title-${isPositive ? 'positive' : 'negative'}`}
      >
        {isPositive ? <CheckCircle className="w-5 h-5 mr-2" /> : <XCircle className="w-5 h-5 mr-2" />}
        {title}
      </h3>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3" data-testid="badge-grid">
        {badges.map((badgeItem) => {
          const isSelected = selectedBadges.includes(badgeItem.badge)
          const isHovered = hoveredBadge === badgeItem.badge

          return (
            <TooltipProvider key={badgeItem.badge}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div
                    data-testid={`badge-item-${badgeItem.badge.replace(/\s+/g, '-').toLowerCase()}`}
                    data-badge-name={badgeItem.badge}
                    data-selected={isSelected}
                    data-positive={isPositive}
                    className={`
                      relative cursor-pointer p-4 rounded-lg border-2 transition-all duration-300 h-full
                      transform hover:scale-105 active:scale-95
                      ${getColorScheme(isSelected)}
                    `}
                    onClick={() => onSelectBadge(badgeItem.badge, isPositive)}
                    onMouseEnter={() => setHoveredBadge(badgeItem.badge)}
                    onMouseLeave={() => setHoveredBadge(null)}
                  >
                    <div className="flex flex-col items-center text-center">
                      <span className="text-base font-medium mb-2" data-testid={`badge-text-${badgeItem.badge.replace(/\s+/g, '-').toLowerCase()}`}>{badgeItem.badge}</span>

                      {/* Show a preview of description on hover */}
                      {isHovered && <p className="text-xs text-gray-400 line-clamp-2">{badgeItem.description}</p>}

                      {/* Selection indicator */}
                      {isSelected && (
                        <div
                          className={`absolute -top-2 -right-2 rounded-full p-1 
                            ${isPositive ? "bg-green-500" : "bg-red-500"}`}
                          data-testid={`badge-selected-indicator-${badgeItem.badge.replace(/\s+/g, '-').toLowerCase()}`}
                        >
                          {isPositive ? (
                            <CheckCircle className="w-4 h-4 text-white" />
                          ) : (
                            <XCircle className="w-4 h-4 text-white" />
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </TooltipTrigger>
                <TooltipContent side="top" className="max-w-xs">
                  <p>{badgeItem.description}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )
        })}
      </div>
    </div>
  )
}
