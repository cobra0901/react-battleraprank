"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "@/components/ui/chart"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, Info } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import type { UserRole, RoleWeight } from "@/types/auth-types"
import { getRoleWeights, getTopBattlersByRole } from "@/lib/analytics-service"

interface RoleBasedAnalyticsProps {
  defaultRole?: UserRole
  defaultCategory?: string
  defaultAttribute?: string
}

export default function RoleBasedAnalytics({
  defaultRole = "fan",
  defaultCategory,
  defaultAttribute,
}: RoleBasedAnalyticsProps) {
  const [selectedRole, setSelectedRole] = useState<UserRole>(defaultRole)
  const [selectedCategory, setSelectedCategory] = useState<string>(defaultCategory || "Writing")
  const [selectedAttribute, setSelectedAttribute] = useState<string>(defaultAttribute || "")
  const [topBattlers, setTopBattlers] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [roleWeights, setRoleWeights] = useState<RoleWeight[]>([])
  const [hasData, setHasData] = useState(false)

  // Categories and attributes
  const categories = ["Writing", "Performance", "Personal"]
  const attributes = {
    Writing: ["Wordplay", "Punchlines", "Schemes", "Angles"],
    Performance: ["Delivery", "Stage Presence", "Crowd Control", "Showmanship"],
    Personal: ["Authenticity", "Battle IQ", "Preparation", "Consistency"],
  }

  // Load role weights
  useEffect(() => {
    async function loadRoleWeights() {
      try {
        const weights = await getRoleWeights()
        setRoleWeights(weights)
      } catch (error) {
        console.error("Error loading role weights:", error)
      }
    }
    
    loadRoleWeights()
  }, [])

  // Load top battlers for selected role/category
  useEffect(() => {
    async function loadTopBattlers() {
      setIsLoading(true)
      try {
        const data = await getTopBattlersByRole(
          selectedRole, 
          selectedCategory, 
          selectedAttribute === 'all' ? undefined : selectedAttribute,
          10
        )
        
        setTopBattlers(data)
        setHasData(data.length > 0)
      } catch (error) {
        console.error("Error loading top battlers:", error)
        setTopBattlers([])
      } finally {
        setIsLoading(false)
      }
    }
    
    loadTopBattlers()
  }, [selectedRole, selectedCategory, selectedAttribute])

  // Helper functions for role display
  const getRoleColor = (role: UserRole): string => {
    const roleWeight = roleWeights.find((rw) => rw.role === role)
    return roleWeight?.color || "gray"
  }

  const getRoleDisplayName = (role: UserRole): string => {
    const roleWeight = roleWeights.find((rw) => rw.role === role)
    return roleWeight?.displayName || role
  }

  if (isLoading && roleWeights.length === 0) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <h2 className="text-2xl font-bold">Role-Based Analytics</h2>
        <div className="flex flex-col sm:flex-row gap-4">
          <Select value={selectedRole} onValueChange={(value) => setSelectedRole(value as UserRole)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select role" />
            </SelectTrigger>
            <SelectContent>
              {roleWeights.map((role) => (
                <SelectItem key={role.role} value={role.role}>
                  <div className="flex items-center">
                    <div className={`w-2 h-2 rounded-full bg-${role.color}-500 mr-2`}></div>
                    {role.displayName}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedAttribute} onValueChange={setSelectedAttribute} disabled={!selectedCategory}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All attributes" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All attributes</SelectItem>
              {selectedCategory &&
                attributes[selectedCategory as keyof typeof attributes].map((attribute) => (
                  <SelectItem key={attribute} value={attribute}>
                    {attribute}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {!hasData && !isLoading ? (
        <Alert className="mb-6">
          <Info className="h-4 w-4" />
          <AlertTitle>Role-Based Analytics</AlertTitle>
          <AlertDescription>
            This feature will display battler rankings weighted by different user roles.
            Currently, there isn't enough real data to show meaningful results.
            As more users rate battles, this section will populate with real analytics.
          </AlertDescription>
        </Alert>
      ) : null}

      <Card>
        <CardHeader>
          <CardTitle>
            Top Battlers by {getRoleDisplayName(selectedRole)} Ratings
            {selectedCategory && ` - ${selectedCategory}`}
            {selectedAttribute && selectedAttribute !== 'all' && ` (${selectedAttribute})`}
          </CardTitle>
          <CardDescription>
            Battlers with highest ratings from {getRoleDisplayName(selectedRole)} users
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="h-96 flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : !hasData ? (
            <div className="h-96 flex items-center justify-center">
              <p className="text-gray-400">No data available for the selected criteria yet.</p>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={topBattlers} margin={{ top: 20, right: 30, left: 20, bottom: 70 }} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis type="number" domain={[0, 10]} stroke="#9CA3AF" />
                    <YAxis
                      dataKey="battlerName"
                      type="category"
                      width={150}
                      stroke="#9CA3AF"
                      tick={{ fill: "#E5E7EB" }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1F2937",
                        borderColor: "#374151",
                        color: "#E5E7EB",
                      }}
                      formatter={(value: any) => [`${value.toFixed(1)}`, "Rating"]}
                    />
                    <Bar dataKey="rating" fill={`var(--${getRoleColor(selectedRole)}-500)`} radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {topBattlers.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {topBattlers.map((battler, index) => (
                    <Link key={battler.battlerId} href={`/battlers/${battler.battlerId}`} className="block">
                      <Card className="hover:border-purple-500 transition-colors">
                        <CardContent className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="relative w-12 h-12 rounded-full overflow-hidden bg-gray-800">
                              {battler.battlerImage && (
                                <Image
                                  src={battler.battlerImage}
                                  alt={battler.battlerName}
                                  fill
                                  className="object-cover"
                                />
                              )}
                            </div>
                            <div className="flex-1">
                              <h3 className="font-medium">{battler.battlerName}</h3>
                            </div>
                            <div
                              className={`px-3 py-2 rounded-full bg-${getRoleColor(selectedRole)}-900/30 text-${getRoleColor(selectedRole)}-400 font-bold`}
                            >
                              {battler.rating.toFixed(1)}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
