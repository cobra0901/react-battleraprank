"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Plus, Trash2, RefreshCw, Save, Database, Users, TagIcon, Award, BarChart } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/hooks/use-toast"

// Mock data types
interface MockBattler {
  id: string
  name: string
  location: string
  image: string
  totalPoints: number
  createdAt: string
}

export default function MockDataManager() {
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const [mockBattlers, setMockBattlers] = useState<MockBattler[]>([
    {
      id: "1",
      name: "Loaded Lux",
      location: "Harlem, NY",
      image: "/placeholder.svg?height=400&width=400",
      totalPoints: 8.7,
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "2",
      name: "Tsu Surf",
      location: "Newark, NJ",
      image: "/placeholder.svg?height=400&width=400",
      totalPoints: 8.5,
      createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "3",
      name: "Geechi Gotti",
      location: "Compton, CA",
      image: "/placeholder.svg?height=400&width=400",
      totalPoints: 8.9,
      createdAt: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ])

  const [newBattler, setNewBattler] = useState({
    name: "",
    location: "",
    totalPoints: 8.0,
  })

  const [roleWeights, setRoleWeights] = useState({
    fan: 1.0,
    media: 2.0,
    battler: 2.5,
    league_owner: 3.0,
    admin: 5.0,
  })

  const [mockDataSettings, setMockDataSettings] = useState({
    generateRandomRatings: true,
    ratingCount: 50,
    ratingVariance: 1.5,
    timeSpan: 30, // days
  })

  const [isGenerating, setIsGenerating] = useState(false)
  const { toast } = useToast()

  const addMockBattler = () => {
    if (!newBattler.name || !newBattler.location) {
      setMessage({
        type: "error",
        text: "Please fill in all required fields",
      })
      return
    }

    const newId = (mockBattlers.length + 1).toString()
    setMockBattlers([
      ...mockBattlers,
      {
        id: newId,
        name: newBattler.name,
        location: newBattler.location,
        image: `/placeholder.svg?height=400&width=400&text=${encodeURIComponent(newBattler.name)}`,
        totalPoints: newBattler.totalPoints,
        createdAt: new Date().toISOString(),
      },
    ])

    setNewBattler({
      name: "",
      location: "",
      totalPoints: 8.0,
    })

    setMessage({
      type: "success",
      text: "Mock battler added successfully",
    })
  }

  const removeMockBattler = (id: string) => {
    setMockBattlers(mockBattlers.filter((battler) => battler.id !== id))
    setMessage({
      type: "success",
      text: "Mock battler removed successfully",
    })
  }

  // Simplified function that directly creates mock data without server calls
  const handleGenerateMockData = () => {
    try {
      setIsGenerating(true)
      setMessage({
        type: "success",
        text: "Generating mock data...",
      })

      // Create mock data directly
      const mockData = {
        topRatedBattlers: [
          { id: "1", name: "Loaded Lux", total_points: 9.2 },
          { id: "2", name: "Rum Nitty", total_points: 9.0 },
          { id: "3", name: "Geechi Gotti", total_points: 8.9 },
          { id: "4", name: "Tsu Surf", total_points: 8.7 },
          { id: "5", name: "JC", total_points: 8.5 },
          { id: "6", name: "K-Shine", total_points: 8.3 },
          { id: "7", name: "Hitman Holla", total_points: 8.2 },
          { id: "8", name: "Charlie Clips", total_points: 8.1 },
          { id: "9", name: "Daylyt", total_points: 8.0 },
          { id: "10", name: "T-Rex", total_points: 7.9 },
        ],
        categoryAverages: [
          { name: "Writing", average: 8.2 },
          { name: "Performance", average: 7.8 },
          { name: "Personal", average: 8.0 },
        ],
        trendData: [
          { month: "Jan", rating: 7.5 },
          { month: "Feb", rating: 7.8 },
          { month: "Mar", rating: 8.0 },
          { month: "Apr", rating: 8.2 },
          { month: "May", rating: 8.5 },
          { month: "Jun", rating: 8.3 },
          { month: "Jul", rating: 8.7 },
          { month: "Aug", rating: 8.9 },
          { month: "Sep", rating: 9.0 },
          { month: "Oct", rating: 9.2 },
        ],
      }

      // Generate default tags
      const defaultTags = [
        {
          id: "1",
          name: "URL",
          description: "Ultimate Rap League",
          isHidden: false,
          category: "League",
          createdAt: new Date(),
        },
        {
          id: "2",
          name: "East Coast",
          description: "Battlers from the East Coast",
          isHidden: false,
          category: "Region",
          createdAt: new Date(),
        },
        {
          id: "3",
          name: "West Coast",
          description: "Battlers from the West Coast",
          isHidden: false,
          category: "Region",
          createdAt: new Date(),
        },
        {
          id: "4",
          name: "Veteran",
          description: "Experienced battlers",
          isHidden: false,
          category: "Experience",
          createdAt: new Date(),
        },
        {
          id: "5",
          name: "Puncher",
          description: "Known for punchlines",
          isHidden: false,
          category: "Style",
          createdAt: new Date(),
        },
        {
          id: "6",
          name: "Lyricist",
          description: "Known for lyrical ability",
          isHidden: false,
          category: "Style",
          createdAt: new Date(),
        },
        {
          id: "7",
          name: "Performance",
          description: "Known for performance",
          isHidden: false,
          category: "Style",
          createdAt: new Date(),
        },
        {
          id: "8",
          name: "Technical",
          description: "Technical rappers",
          isHidden: false,
          category: "Style",
          createdAt: new Date(),
        },
        {
          id: "9",
          name: "lady",
          description: "Female battlers",
          isHidden: true,
          category: "Gender",
          createdAt: new Date(),
        },
        {
          id: "10",
          name: "international",
          description: "Non-US battlers",
          isHidden: true,
          category: "Region",
          createdAt: new Date(),
        },
        {
          id: "11",
          name: "UK",
          description: "United Kingdom battlers",
          isHidden: false,
          category: "Region",
          createdAt: new Date(),
        },
        {
          id: "12",
          name: "QOTR",
          description: "Queen of the Ring",
          isHidden: false,
          category: "League",
          createdAt: new Date(),
        },
        {
          id: "13",
          name: "Don't Flop",
          description: "UK battle league",
          isHidden: false,
          category: "League",
          createdAt: new Date(),
        },
        {
          id: "14",
          name: "Street",
          description: "Street-oriented content",
          isHidden: false,
          category: "Style",
          createdAt: new Date(),
        },
      ]

      // Store in localStorage
      localStorage.setItem("mockAnalyticsData", JSON.stringify(mockData))
      localStorage.setItem("mockTags", JSON.stringify(defaultTags))
      console.log("Mock data stored in localStorage:", mockData)

      setMessage({
        type: "success",
        text: "Mock data generated successfully! Refresh the analytics page to see the results.",
      })

      toast({
        title: "Success",
        description: "Mock data generated successfully!",
      })
    } catch (error) {
      console.error("Error generating mock data:", error)
      setMessage({
        type: "error",
        text: "Failed to generate mock data: " + (error.message || "Unknown error"),
      })

      toast({
        title: "Error",
        description: "Failed to generate mock data",
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const clearMockData = () => {
    if (confirm("Are you sure you want to clear all mock data? This cannot be undone.")) {
      try {
        localStorage.removeItem("mockAnalyticsData")
        localStorage.removeItem("mockTags")
        setMessage({
          type: "success",
          text: "All mock data cleared successfully",
        })

        toast({
          title: "Success",
          description: "All mock data cleared successfully",
        })
      } catch (error) {
        console.error("Error clearing mock data:", error)
        setMessage({
          type: "error",
          text: "Failed to clear mock data: " + (error.message || "Unknown error"),
        })

        toast({
          title: "Error",
          description: "Failed to clear mock data",
          variant: "destructive",
        })
      }
    }
  }

  const saveRoleWeights = () => {
    localStorage.setItem("roleWeights", JSON.stringify(roleWeights))
    setMessage({
      type: "success",
      text: "Role weights saved successfully",
    })

    toast({
      title: "Success",
      description: "Role weights saved successfully",
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Mock Data Manager</h2>
        <div className="flex gap-2">
          <Button variant="outline" onClick={clearMockData}>
            <Trash2 className="w-4 h-4 mr-2" />
            Clear All Mock Data
          </Button>
          <Button onClick={handleGenerateMockData} disabled={isGenerating}>
            <Database className="w-4 h-4 mr-2" />
            {isGenerating ? "Generating..." : "Generate Mock Data"}
          </Button>
        </div>
      </div>

      {message && (
        <Alert
          className={`${message.type === "success" ? "bg-green-900/20 border-green-800" : "bg-red-900/20 border-red-800"}`}
        >
          <AlertTitle className={message.type === "success" ? "text-green-400" : "text-red-400"}>
            {message.type === "success" ? "Success" : "Error"}
          </AlertTitle>
          <AlertDescription className={message.type === "success" ? "text-green-300" : "text-red-300"}>
            {message.text}
          </AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="data-types">
        <TabsList className="mb-6 bg-gray-900 border border-gray-800">
          <TabsTrigger value="data-types">Data Types</TabsTrigger>
          <TabsTrigger value="battlers">Mock Battlers</TabsTrigger>
          <TabsTrigger value="weights">Role Weights</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="data-types">
          <Card>
            <CardHeader>
              <CardTitle>Available Mock Data Types</CardTitle>
              <CardDescription>The following data types will be generated</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="bg-gray-900 p-4 rounded-lg border border-gray-800 flex items-center gap-3">
                  <Users className="w-8 h-8 text-blue-500" />
                  <div>
                    <h3 className="font-medium">Battlers</h3>
                    <p className="text-sm text-gray-400">Top battle rappers with ratings</p>
                  </div>
                </div>

                <div className="bg-gray-900 p-4 rounded-lg border border-gray-800 flex items-center gap-3">
                  <Award className="w-8 h-8 text-amber-500" />
                  <div>
                    <h3 className="font-medium">Ratings</h3>
                    <p className="text-sm text-gray-400">User ratings for battlers</p>
                  </div>
                </div>

                <div className="bg-gray-900 p-4 rounded-lg border border-gray-800 flex items-center gap-3">
                  <TagIcon className="w-8 h-8 text-green-500" />
                  <div>
                    <h3 className="font-medium">Tags</h3>
                    <p className="text-sm text-gray-400">Categories for battlers</p>
                  </div>
                </div>

                <div className="bg-gray-900 p-4 rounded-lg border border-gray-800 flex items-center gap-3">
                  <BarChart className="w-8 h-8 text-purple-500" />
                  <div>
                    <h3 className="font-medium">Analytics</h3>
                    <p className="text-sm text-gray-400">Performance metrics and trends</p>
                  </div>
                </div>

                <div className="bg-gray-900 p-4 rounded-lg border border-gray-800 flex items-center gap-3">
                  <Users className="w-8 h-8 text-red-500" />
                  <div>
                    <h3 className="font-medium">Users</h3>
                    <p className="text-sm text-gray-400">User profiles and roles</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-blue-900/20 border border-blue-800 rounded-lg">
                <p className="text-sm text-blue-300">
                  <strong>Note:</strong> All mock data is stored in your browser's localStorage and will persist until
                  you clear it or clear your browser data.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="battlers">
          <Card>
            <CardHeader>
              <CardTitle>Manage Mock Battlers</CardTitle>
              <CardDescription>Add, edit, or remove mock battlers for testing</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="battlerName">Battler Name</Label>
                    <Input
                      id="battlerName"
                      value={newBattler.name}
                      onChange={(e) => setNewBattler({ ...newBattler, name: e.target.value })}
                      placeholder="Enter battler name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="battlerLocation">Location</Label>
                    <Input
                      id="battlerLocation"
                      value={newBattler.location}
                      onChange={(e) => setNewBattler({ ...newBattler, location: e.target.value })}
                      placeholder="City, State"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="battlerRating">Initial Rating</Label>
                    <div className="flex items-center gap-4">
                      <Slider
                        id="battlerRating"
                        min={0}
                        max={10}
                        step={0.1}
                        value={[newBattler.totalPoints]}
                        onValueChange={(values) => setNewBattler({ ...newBattler, totalPoints: values[0] })}
                        className="flex-1"
                      />
                      <span className="w-10 text-center">{newBattler.totalPoints.toFixed(1)}</span>
                    </div>
                  </div>
                </div>

                <Button onClick={addMockBattler}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Mock Battler
                </Button>

                <div className="border-t border-gray-800 pt-6">
                  <h3 className="text-lg font-medium mb-4">Current Mock Battlers</h3>
                  <div className="space-y-4">
                    {mockBattlers.map((battler) => (
                      <div
                        key={battler.id}
                        className="flex items-center justify-between p-3 bg-gray-900 rounded-md border border-gray-800"
                      >
                        <div>
                          <p className="font-medium">{battler.name}</p>
                          <p className="text-sm text-gray-400">{battler.location}</p>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="px-2 py-1 bg-gray-800 rounded-full text-sm">
                            {battler.totalPoints.toFixed(1)}
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
                            onClick={() => removeMockBattler(battler.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="weights">
          <Card>
            <CardHeader>
              <CardTitle>Role Weights Configuration</CardTitle>
              <CardDescription>
                Adjust the weight of each role to control how much influence their ratings have on the overall score
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label className="flex items-center">
                      <div className="w-3 h-3 rounded-full mr-2 bg-blue-500"></div>
                      Fan
                    </Label>
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        min="0.1"
                        max="10"
                        step="0.1"
                        value={roleWeights.fan}
                        onChange={(e) => setRoleWeights({ ...roleWeights, fan: Number.parseFloat(e.target.value) })}
                        className="w-20"
                      />
                      <span className="text-sm text-gray-400">× weight</span>
                    </div>
                  </div>
                  <Slider
                    min={0.1}
                    max={5}
                    step={0.1}
                    value={[roleWeights.fan]}
                    onValueChange={(values) => setRoleWeights({ ...roleWeights, fan: values[0] })}
                    className="bg-gradient-to-r from-gray-700 to-blue-500"
                  />
                  <p className="text-sm text-gray-400">Battle rap enthusiasts and viewers</p>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label className="flex items-center">
                      <div className="w-3 h-3 rounded-full mr-2 bg-purple-500"></div>
                      Media
                    </Label>
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        min="0.1"
                        max="10"
                        step="0.1"
                        value={roleWeights.media}
                        onChange={(e) => setRoleWeights({ ...roleWeights, media: Number.parseFloat(e.target.value) })}
                        className="w-20"
                      />
                      <span className="text-sm text-gray-400">× weight</span>
                    </div>
                  </div>
                  <Slider
                    min={0.1}
                    max={5}
                    step={0.1}
                    value={[roleWeights.media]}
                    onValueChange={(values) => setRoleWeights({ ...roleWeights, media: values[0] })}
                    className="bg-gradient-to-r from-gray-700 to-purple-500"
                  />
                  <p className="text-sm text-gray-400">Battle rap journalists, bloggers, and content creators</p>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label className="flex items-center">
                      <div className="w-3 h-3 rounded-full mr-2 bg-green-500"></div>
                      Battler
                    </Label>
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        min="0.1"
                        max="10"
                        step="0.1"
                        value={roleWeights.battler}
                        onChange={(e) => setRoleWeights({ ...roleWeights, battler: Number.parseFloat(e.target.value) })}
                        className="w-20"
                      />
                      <span className="text-sm text-gray-400">× weight</span>
                    </div>
                  </div>
                  <Slider
                    min={0.1}
                    max={5}
                    step={0.1}
                    value={[roleWeights.battler]}
                    onValueChange={(values) => setRoleWeights({ ...roleWeights, battler: values[0] })}
                    className="bg-gradient-to-r from-gray-700 to-green-500"
                  />
                  <p className="text-sm text-gray-400">Active battle rappers</p>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label className="flex items-center">
                      <div className="w-3 h-3 rounded-full mr-2 bg-amber-500"></div>
                      League Owner
                    </Label>
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        min="0.1"
                        max="10"
                        step="0.1"
                        value={roleWeights.league_owner}
                        onChange={(e) =>
                          setRoleWeights({ ...roleWeights, league_owner: Number.parseFloat(e.target.value) })
                        }
                        className="w-20"
                      />
                      <span className="text-sm text-gray-400">× weight</span>
                    </div>
                  </div>
                  <Slider
                    min={0.1}
                    max={5}
                    step={0.1}
                    value={[roleWeights.league_owner]}
                    onValueChange={(values) => setRoleWeights({ ...roleWeights, league_owner: values[0] })}
                    className="bg-gradient-to-r from-gray-700 to-amber-500"
                  />
                  <p className="text-sm text-gray-400">Owners and operators of battle rap leagues</p>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label className="flex items-center">
                      <div className="w-3 h-3 rounded-full mr-2 bg-red-500"></div>
                      Admin
                    </Label>
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        min="0.1"
                        max="10"
                        step="0.1"
                        value={roleWeights.admin}
                        onChange={(e) => setRoleWeights({ ...roleWeights, admin: Number.parseFloat(e.target.value) })}
                        className="w-20"
                      />
                      <span className="text-sm text-gray-400">× weight</span>
                    </div>
                  </div>
                  <Slider
                    min={0.1}
                    max={5}
                    step={0.1}
                    value={[roleWeights.admin]}
                    onValueChange={(values) => setRoleWeights({ ...roleWeights, admin: values[0] })}
                    className="bg-gradient-to-r from-gray-700 to-red-500"
                  />
                  <p className="text-sm text-gray-400">Platform administrators</p>
                </div>
              </div>

              <Button onClick={saveRoleWeights}>
                <Save className="w-4 h-4 mr-2" />
                Save Role Weights
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Mock Data Settings</CardTitle>
              <CardDescription>Configure how mock data is generated</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="generateRandomRatings" className="text-base">
                    Generate Random Ratings
                  </Label>
                  <p className="text-sm text-gray-400">
                    Automatically generate random ratings when adding mock battlers
                  </p>
                </div>
                <Switch
                  id="generateRandomRatings"
                  checked={mockDataSettings.generateRandomRatings}
                  onCheckedChange={(checked) =>
                    setMockDataSettings({ ...mockDataSettings, generateRandomRatings: checked })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="ratingCount">Number of Ratings to Generate</Label>
                <div className="flex items-center gap-4">
                  <Slider
                    id="ratingCount"
                    min={10}
                    max={200}
                    step={10}
                    value={[mockDataSettings.ratingCount]}
                    onValueChange={(values) => setMockDataSettings({ ...mockDataSettings, ratingCount: values[0] })}
                    className="flex-1"
                    disabled={!mockDataSettings.generateRandomRatings}
                  />
                  <span className="w-12 text-center">{mockDataSettings.ratingCount}</span>
                </div>
                <p className="text-sm text-gray-400">Number of random ratings to generate per battler</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="ratingVariance">Rating Variance</Label>
                <div className="flex items-center gap-4">
                  <Slider
                    id="ratingVariance"
                    min={0.1}
                    max={3}
                    step={0.1}
                    value={[mockDataSettings.ratingVariance]}
                    onValueChange={(values) => setMockDataSettings({ ...mockDataSettings, ratingVariance: values[0] })}
                    className="flex-1"
                    disabled={!mockDataSettings.generateRandomRatings}
                  />
                  <span className="w-12 text-center">{mockDataSettings.ratingVariance.toFixed(1)}</span>
                </div>
                <p className="text-sm text-gray-400">How much ratings can vary from the battler's base rating</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="timeSpan">Time Span (days)</Label>
                <div className="flex items-center gap-4">
                  <Slider
                    id="timeSpan"
                    min={1}
                    max={90}
                    step={1}
                    value={[mockDataSettings.timeSpan]}
                    onValueChange={(values) => setMockDataSettings({ ...mockDataSettings, timeSpan: values[0] })}
                    className="flex-1"
                    disabled={!mockDataSettings.generateRandomRatings}
                  />
                  <span className="w-12 text-center">{mockDataSettings.timeSpan}</span>
                </div>
                <p className="text-sm text-gray-400">Distribute ratings over this many days in the past</p>
              </div>

              <Button onClick={handleGenerateMockData} disabled={isGenerating}>
                <RefreshCw className="w-4 h-4 mr-2" />
                {isGenerating ? "Generating..." : "Apply Settings & Generate Data"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

