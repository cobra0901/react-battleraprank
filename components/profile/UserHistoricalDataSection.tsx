"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { getUserHistoricalData } from "@/lib/stats-service"
import { History, TrendingUp, Award } from "lucide-react"

interface UserHistoricalDataSectionProps {
  userId: string
}

export default function UserHistoricalDataSection({ userId }: UserHistoricalDataSectionProps) {
  const [historicalData, setHistoricalData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchHistoricalData = async () => {
      try {
        const data = await getUserHistoricalData(userId)
        setHistoricalData(data)
      } catch (error) {
        console.error("Error fetching historical data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchHistoricalData()
  }, [userId])

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!historicalData) {
    return <div className="text-center py-12 text-gray-400">No historical data available</div>
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="activity">
        <TabsList className="bg-gray-900 border border-gray-800">
          <TabsTrigger value="activity">
            <History className="h-4 w-4 mr-2" />
            Activity
          </TabsTrigger>
          <TabsTrigger value="ratings">
            <TrendingUp className="h-4 w-4 mr-2" />
            Rating Trends
          </TabsTrigger>
          <TabsTrigger value="achievements">
            <Award className="h-4 w-4 mr-2" />
            Achievements
          </TabsTrigger>
        </TabsList>

        <TabsContent value="activity" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>User Activity</CardTitle>
              <CardDescription>Historical activity data over time</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={historicalData.activity}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis
                      dataKey="date"
                      stroke="hsl(var(--muted-foreground))"
                      tickFormatter={(value) =>
                        new Date(value).toLocaleDateString(undefined, { month: "short", year: "2-digit" })
                      }
                    />
                    <YAxis stroke="hsl(var(--muted-foreground))" />
                    {/* <ChartTooltip content={(props) => <ChartTooltipContent {...props} />} /> */}
                    <Legend />
                    <Line type="monotone" dataKey="ratings" stroke="var(--color-ratings)" activeDot={{ r: 8 }} />
                    <Line type="monotone" dataKey="comments" stroke="var(--color-comments)" />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ratings" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Rating Trends</CardTitle>
              <CardDescription>How your ratings have changed over time</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={historicalData.ratingTrends}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis
                      dataKey="date"
                      stroke="hsl(var(--muted-foreground))"
                      tickFormatter={(value) =>
                        new Date(value).toLocaleDateString(undefined, { month: "short", year: "2-digit" })
                      }
                    />
                    <YAxis stroke="hsl(var(--muted-foreground))" />
                    {/* <ChartTooltip content={(props) => <ChartTooltipContent {...props} />} /> */}
                    <Legend />
                    <Line type="monotone" dataKey="average" stroke="var(--color-average)" activeDot={{ r: 8 }} />
                    <Line type="monotone" dataKey="consistency" stroke="var(--color-consistency)" />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="achievements" className="pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Badges Earned</CardTitle>
                <CardDescription>Timeline of badges earned</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {historicalData.achievements.badges.map((badge: any, index: number) => (
                    <div key={index} className="flex items-start gap-4 border-b border-gray-800 pb-4 last:border-0">
                      <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                        <Award className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-medium">{badge.name}</h4>
                        <p className="text-sm text-gray-400">{badge.description}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          Earned on {new Date(badge.date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Milestones</CardTitle>
                <CardDescription>Important achievements and milestones</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {historicalData.achievements.milestones.map((milestone: any, index: number) => (
                    <div key={index} className="flex items-start gap-4 border-b border-gray-800 pb-4 last:border-0">
                      <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                        <TrendingUp className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-medium">{milestone.title}</h4>
                        <p className="text-sm text-gray-400">{milestone.description}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          Achieved on {new Date(milestone.date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

