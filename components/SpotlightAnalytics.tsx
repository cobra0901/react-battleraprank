"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "@/components/ui/chart"
import { BarChartIcon as ChartSquare } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

interface AnalyticsData {
  title: string
  description: string
  chartData: any[]
  dataKey: string
  color: string
}

export default function SpotlightAnalytics() {
  const [analytics, setAnalytics] = useState<AnalyticsData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    // Mock data for analytics
    const mockAnalytics: AnalyticsData[] = [
      {
        title: "Top Performing Attributes",
        description: "Highest rated attributes across all battlers",
        chartData: [
          { name: "Wordplay", value: 8.7 },
          { name: "Delivery", value: 8.5 },
          { name: "Authenticity", value: 8.9 },
          { name: "Battle IQ", value: 9.1 },
          { name: "Crowd Control", value: 8.3 },
        ],
        dataKey: "value",
        color: "#8B5CF6",
      },
      {
        title: "Most Improved Battlers",
        description: "Battlers with the biggest rating increases",
        chartData: [
          { name: "Geechi Gotti", value: 0.8 },
          { name: "Tay Roc", value: 0.6 },
          { name: "Chess", value: 0.5 },
          { name: "Rum Nitty", value: 0.4 },
          { name: "JC", value: 0.3 },
        ],
        dataKey: "value",
        color: "#10B981",
      },
      {
        title: "Most Assigned Badges",
        description: "Most frequently assigned badges by the community",
        chartData: [
          { name: "Wordsmith", value: 342 },
          { name: "Puncher", value: 287 },
          { name: "Performance", value: 256 },
          { name: "Consistent", value: 198 },
          { name: "Crowd Control", value: 176 },
        ],
        dataKey: "value",
        color: "#F59E0B",
      },
    ]

    setAnalytics(mockAnalytics)
    setIsLoading(false)
  }, [])

  const nextAnalytic = () => {
    setActiveIndex((prev) => (prev + 1) % analytics.length)
  }

  const prevAnalytic = () => {
    setActiveIndex((prev) => (prev - 1 + analytics.length) % analytics.length)
  }

  if (isLoading) {
    return (
      <Card className="bg-gray-900 border-gray-800 animate-pulse">
        <CardContent className="p-4 h-96"></CardContent>
      </Card>
    )
  }

  if (analytics.length === 0) return null

  const currentAnalytic = analytics[activeIndex]

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <ChartSquare className="w-5 h-5 mr-2 text-cyan-400" />
          <h2 className="text-2xl font-bold">Spotlight Analytics</h2>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={prevAnalytic}>
            Previous
          </Button>
          <Button variant="outline" size="sm" onClick={nextAnalytic}>
            Next
          </Button>
        </div>
      </div>

      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle>{currentAnalytic.title}</CardTitle>
              <p className="text-sm text-gray-400 mt-1">{currentAnalytic.description}</p>
            </div>
            <Badge variant="outline" className="bg-gray-800">
              {activeIndex + 1} / {analytics.length}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={currentAnalytic.chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="name" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1F2937",
                    borderColor: "#374151",
                    color: "#E5E7EB",
                  }}
                />
                <Bar dataKey={currentAnalytic.dataKey} fill={currentAnalytic.color} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-end mt-4">
            <Button asChild variant="ghost" size="sm">
              <Link href="/analytics">View Full Analytics</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

