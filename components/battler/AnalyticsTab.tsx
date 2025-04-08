"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "@/components/ui/chart"

// Mock data for analytics
const battlers = [
  { id: "1", name: "Loaded Lux" },
  { id: "2", name: "Tsu Surf" },
  { id: "3", name: "Geechi Gotti" },
  { id: "4", name: "Rum Nitty" },
]

const myRatings = {
  writing: {
    Wordplay: 8.5,
    Punchlines: 7.2,
    Schemes: 9.0,
    Angles: 8.8,
  },
  performance: {
    Delivery: 7.5,
    "Stage Presence": 8.0,
    "Crowd Control": 7.8,
    Showmanship: 7.2,
  },
  personal: {
    Authenticity: 9.2,
    "Battle IQ": 9.5,
    Preparation: 9.0,
    Consistency: 8.0,
  },
}

const communityRatings = {
  writing: {
    Wordplay: 8.2,
    Punchlines: 7.5,
    Schemes: 8.7,
    Angles: 8.5,
  },
  performance: {
    Delivery: 7.8,
    "Stage Presence": 7.5,
    "Crowd Control": 7.3,
    Showmanship: 7.0,
  },
  personal: {
    Authenticity: 8.8,
    "Battle IQ": 9.2,
    Preparation: 8.7,
    Consistency: 7.8,
  },
}

interface AnalyticsTabProps {
  battlerId: string
}

export default function AnalyticsTab({ battlerId }: AnalyticsTabProps) {
  const [selectedBattler, setSelectedBattler] = useState(battlerId)

  // Transform data for charts
  const transformDataForChart = (category: "writing" | "performance" | "personal") => {
    return Object.entries(myRatings[category]).map(([name, value]) => ({
      name,
      "My Rating": value,
      "Community Average": communityRatings[category][name as keyof (typeof communityRatings)[typeof category]],
    }))
  }

  const writingData = transformDataForChart("writing")
  const performanceData = transformDataForChart("performance")
  const personalData = transformDataForChart("personal")

  return (
    <div>
      <div className="mb-6 flex flex-col sm:flex-row justify-between gap-4">
        <h2 className="text-2xl font-bold">Analytics</h2>
        <Select value={selectedBattler} onValueChange={setSelectedBattler}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Select battler" />
          </SelectTrigger>
          <SelectContent>
            {battlers.map((battler) => (
              <SelectItem key={battler.id} value={battler.id}>
                {battler.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Tabs defaultValue="my-ratings">
        <TabsList className="mb-6 bg-gray-900 border border-gray-800">
          <TabsTrigger value="my-ratings">My Ratings</TabsTrigger>
          <TabsTrigger value="community">Community Ratings</TabsTrigger>
          <TabsTrigger value="comparison">Comparison</TabsTrigger>
        </TabsList>

        <TabsContent value="my-ratings">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Writing</CardTitle>
                <CardDescription>Your ratings for writing attributes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={writingData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis domain={[0, 10]} />
                      <Tooltip />
                      <Bar dataKey="My Rating" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Performance</CardTitle>
                <CardDescription>Your ratings for performance attributes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={performanceData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis domain={[0, 10]} />
                      <Tooltip />
                      <Bar dataKey="My Rating" fill="#82ca9d" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Personal</CardTitle>
                <CardDescription>Your ratings for personal attributes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={personalData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis domain={[0, 10]} />
                      <Tooltip />
                      <Bar dataKey="My Rating" fill="#ffc658" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="community">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Writing</CardTitle>
                <CardDescription>Community ratings for writing attributes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={writingData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis domain={[0, 10]} />
                      <Tooltip />
                      <Bar dataKey="Community Average" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Performance</CardTitle>
                <CardDescription>Community ratings for performance attributes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={performanceData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis domain={[0, 10]} />
                      <Tooltip />
                      <Bar dataKey="Community Average" fill="#82ca9d" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Personal</CardTitle>
                <CardDescription>Community ratings for personal attributes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={personalData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis domain={[0, 10]} />
                      <Tooltip />
                      <Bar dataKey="Community Average" fill="#ffc658" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="comparison">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Writing Comparison</CardTitle>
                <CardDescription>Your ratings vs. Community average</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={writingData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis domain={[0, 10]} />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="My Rating" fill="#8884d8" />
                      <Bar dataKey="Community Average" fill="#82ca9d" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Performance Comparison</CardTitle>
                <CardDescription>Your ratings vs. Community average</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={performanceData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis domain={[0, 10]} />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="My Rating" fill="#8884d8" />
                      <Bar dataKey="Community Average" fill="#82ca9d" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Personal Comparison</CardTitle>
                <CardDescription>Your ratings vs. Community average</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={personalData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis domain={[0, 10]} />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="My Rating" fill="#8884d8" />
                      <Bar dataKey="Community Average" fill="#82ca9d" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

