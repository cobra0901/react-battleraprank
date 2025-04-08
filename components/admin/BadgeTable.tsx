"use client"

import { useState } from "react"
import { Badge as BadgeUI } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import type { Badge } from "@/lib/data-service"
import { CheckCircle, XCircle, Plus, Save, X } from "lucide-react"

interface BadgeTableProps {
  badges: Badge[]
  category: string
}

export default function BadgeTable({ badges, category }: BadgeTableProps) {
  const [isAdding, setIsAdding] = useState(false)
  const [newBadge, setNewBadge] = useState({
    badge: "",
    description: "",
    isPositive: true,
  })

  const positiveBadges = badges.filter((badge) => badge.isPositive)
  const negativeBadges = badges.filter((badge) => !badge.isPositive)

  const handleAddBadge = () => {
    // In a real app, this would save to a database
    setIsAdding(false)
    setNewBadge({
      badge: "",
      description: "",
      isPositive: true,
    })
  }

  return (
    <div>
      <div className="flex justify-end mb-4">
        {!isAdding ? (
          <Button onClick={() => setIsAdding(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Badge
          </Button>
        ) : (
          <div className="w-full bg-gray-900 p-4 rounded-md border border-gray-800">
            <h3 className="text-lg font-medium mb-4">Add New Badge</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Badge Name</label>
                  <Input
                    value={newBadge.badge}
                    onChange={(e) => setNewBadge({ ...newBadge, badge: e.target.value })}
                    placeholder="Enter badge name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Type</label>
                  <div className="flex gap-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        checked={newBadge.isPositive}
                        onChange={() => setNewBadge({ ...newBadge, isPositive: true })}
                        className="mr-2"
                      />
                      Positive
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        checked={!newBadge.isPositive}
                        onChange={() => setNewBadge({ ...newBadge, isPositive: false })}
                        className="mr-2"
                      />
                      Negative
                    </label>
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <Textarea
                  value={newBadge.description}
                  onChange={(e) => setNewBadge({ ...newBadge, description: e.target.value })}
                  placeholder="Enter badge description"
                  rows={3}
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsAdding(false)}>
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
                <Button onClick={handleAddBadge}>
                  <Save className="w-4 h-4 mr-2" />
                  Save Badge
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h3 className="text-lg font-semibold mb-4 flex items-center text-green-500">
            <CheckCircle className="w-5 h-5 mr-2" />
            Positive Badges
          </h3>
          <div className="space-y-4">
            {positiveBadges.map((badge, index) => (
              <div
                key={index}
                className="bg-gray-900 p-4 rounded-md border border-gray-800 hover:border-green-700 transition-all"
              >
                <div className="flex justify-between items-start mb-2">
                  <BadgeUI className="px-3 py-2 text-base bg-green-900/30 text-green-400 border-green-700">
                    {badge.badge}
                  </BadgeUI>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      Edit
                    </Button>
                  </div>
                </div>
                <p className="text-sm text-gray-400">{badge.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-4 flex items-center text-red-500">
            <XCircle className="w-5 h-5 mr-2" />
            Negative Badges
          </h3>
          <div className="space-y-4">
            {negativeBadges.map((badge, index) => (
              <div
                key={index}
                className="bg-gray-900 p-4 rounded-md border border-gray-800 hover:border-red-700 transition-all"
              >
                <div className="flex justify-between items-start mb-2">
                  <BadgeUI className="px-3 py-2 text-base bg-red-900/30 text-red-400 border-red-700">
                    {badge.badge}
                  </BadgeUI>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      Edit
                    </Button>
                  </div>
                </div>
                <p className="text-sm text-gray-400">{badge.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

