"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from "@/components/ui/chart"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { AlertCircle, RefreshCw, Loader2 } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import Link from "next/link"

export default function AnalyticsPage() {
  // State hooks for data management
  const [battlers, setBattlers] = useState<any[]>([])
  const [selectedBattler, setSelectedBattler] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [loadingTimeout, setLoadingTimeout] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  // State for statistics from database
  const [userCount, setUserCount] = useState<number>(0)
  const [ratingsCount, setRatingsCount] = useState<number>(0)
  const [battlesCount, setBattlesCount] = useState<number>(0)
  const [hasData, setHasData] = useState(false)

  // Load battlers from Supabase
  useEffect(() => {
    async function loadRealData() {
      try {
        console.log("Loading analytics data...")
        
        // Load battlers
        const { data: battlersData, error: battlersError } = await supabase
          .from("battlers")
          .select("id, name")
          .order("name")
        
        if (battlersError) {
          console.error("Error loading battlers:", battlersError.message)
          setError("Failed to load battlers: " + battlersError.message)
        } else if (battlersData && battlersData.length > 0) {
          console.log(`Loaded ${battlersData.length} battlers`)
          setBattlers(battlersData)
          setSelectedBattler(battlersData[0].id)
        }
        
        // Load user count
        const { count: userCountResult, error: userCountError } = await supabase
          .from("user_profiles")
          .select("*", { count: 'exact', head: true })
        
        if (userCountError) {
          console.error("Error loading user count:", userCountError.message)
        } else {
          console.log(`Loaded user count: ${userCountResult}`)
          setUserCount(userCountResult || 0)
        }
        
        // Load ratings count
        const { count: ratingsCountResult, error: ratingsCountError } = await supabase
          .from("ratings")
          .select("*", { count: 'exact', head: true })
        
        if (ratingsCountError) {
          console.error("Error loading ratings count:", ratingsCountError.message)
        } else {
          console.log(`Loaded ratings count: ${ratingsCountResult}`)
          setRatingsCount(ratingsCountResult || 0)
        }
        
        // Load battles count
        const { count: battlesCountResult, error: battlesCountError } = await supabase
          .from("battles")
          .select("*", { count: 'exact', head: true })
        
        if (battlesCountError) {
          console.error("Error loading battles count:", battlesCountError.message)
        } else {
          console.log(`Loaded battles count: ${battlesCountResult}`)
          setBattlesCount(battlesCountResult || 0)
        }
        
        // Determine if we have enough data to show analytics
        setHasData(
          (battlersData?.length || 0) > 0 && 
          (userCountResult || 0) > 0 && 
          (ratingsCountResult || 0) > 0
        )
      } catch (error: any) {
        console.error("Error loading analytics data:", error)
        setError(error.message || "An unexpected error occurred while loading analytics data")
      } finally {
        setIsLoading(false)
      }
    }
    
    // Set timeout to detect if loading takes too long
    const timeoutId = setTimeout(() => {
      if (isLoading) {
        console.warn("Analytics loading timed out after 10 seconds")
        setLoadingTimeout(true)
      }
    }, 10000)
    
    loadRealData()
    
    return () => clearTimeout(timeoutId)
  }, [])
  
  // Function to handle refresh
  const handleRefresh = () => {
    setIsLoading(true)
    setLoadingTimeout(false)
    setError(null)
    
    // Restart the data load
    const loadData = async () => {
      try {
        // ...same loading logic as above...
        // For brevity, I'm calling the same effect logic
        const { data: battlersData } = await supabase
          .from("battlers")
          .select("id, name")
          .order("name")
          
        if (battlersData && battlersData.length > 0) {
          setBattlers(battlersData)
          setSelectedBattler(battlersData[0].id)
        }
        
        // Get counts for overview
        const { count: userCount } = await supabase
          .from("user_profiles")
          .select("*", { count: 'exact', head: true })
          
        const { count: ratingsCount } = await supabase
          .from("ratings")
          .select("*", { count: 'exact', head: true })
          
        const { count: battlesCount } = await supabase
          .from("battles")
          .select("*", { count: 'exact', head: true })
          
        setUserCount(userCount || 0)
        setRatingsCount(ratingsCount || 0)
        setBattlesCount(battlesCount || 0)
        
        setHasData(
          (battlersData?.length || 0) > 0 && 
          (userCount || 0) > 0 && 
          (ratingsCount || 0) > 0
        )
      } catch (error: any) {
        console.error("Error refreshing data:", error)
        setError(error.message || "Failed to refresh data")
      } finally {
        setIsLoading(false)
      }
    }
    
    loadData()
  }

  // Function to render the no data message
  const renderNoDataMessage = () => (
    <Alert variant="destructive" className="mb-6">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>No Analytics Data Available</AlertTitle>
      <AlertDescription>
        There isn't enough real data in the database to display meaningful analytics.
        Add more users, battles, and ratings to see analytics here.
      </AlertDescription>
    </Alert>
  )

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
        {!isLoading && (
          <Button onClick={handleRefresh} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh Data
          </Button>
        )}
      </div>

      {isLoading ? (
        <div>
          <div className="flex justify-center py-8">
            <div className="flex flex-col items-center">
              <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
              <p className="text-muted-foreground">Loading analytics data...</p>
            </div>
          </div>
          
          {loadingTimeout && (
            <Alert className="mt-8" variant="default">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Loading is taking longer than expected</AlertTitle>
              <AlertDescription>
                This may indicate a connection issue with the database. Try refreshing the page or visit 
                the <Link href="/diagnostics" className="underline">diagnostics page</Link> to check the system status.
              </AlertDescription>
            </Alert>
          )}
        </div>
      ) : error ? (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error loading analytics</AlertTitle>
          <AlertDescription>
            {error}
            <div className="mt-2">
              <Link href="/diagnostics" className="text-sm underline">
                Check system status
              </Link>
            </div>
          </AlertDescription>
        </Alert>
      ) : (
        <Tabs defaultValue="overview">
          <TabsList className="mb-8 bg-gray-900 border border-gray-800">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="battler">Battler Analysis</TabsTrigger>
            <TabsTrigger value="community">Community</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            {!hasData && renderNoDataMessage()}
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-xl">Total Users</CardTitle>
                  <CardDescription>Platform users</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{userCount}</div>
                  <p className="text-gray-400 text-sm">Actual count from database</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-xl">Total Ratings</CardTitle>
                  <CardDescription>Battle ratings submitted</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{ratingsCount}</div>
                  <p className="text-gray-400 text-sm">Actual count from database</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-xl">Battlers Count</CardTitle>
                  <CardDescription>Total battlers in database</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{battlers.length}</div>
                  <p className="text-gray-400 text-sm">Actual count from database</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-xl">Battles Count</CardTitle>
                  <CardDescription>Total battles recorded</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{battlesCount}</div>
                  <p className="text-gray-400 text-sm">Actual count from database</p>
                </CardContent>
              </Card>
            </div>
            
            {hasData ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Battle Categories</CardTitle>
                    <CardDescription>Distribution of battle types</CardDescription>
                  </CardHeader>
                  <CardContent className="h-80">
                    <div className="flex h-full items-center justify-center">
                      <p className="text-gray-400">Real data coming soon</p>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Rating Trend</CardTitle>
                    <CardDescription>Average rating over time</CardDescription>
                  </CardHeader>
                  <CardContent className="h-80">
                    <div className="flex h-full items-center justify-center">
                      <p className="text-gray-400">Real data coming soon</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : null}
          </TabsContent>

          <TabsContent value="battler">
            {!hasData ? (
              renderNoDataMessage()
            ) : (
              <>
                <div className="mb-6 flex justify-end">
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Performance by Category</CardTitle>
                      <CardDescription>Ratings across different categories</CardDescription>
                    </CardHeader>
                    <CardContent className="h-80">
                      <div className="flex h-full items-center justify-center">
                        <p className="text-gray-400">Real data coming soon</p>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>Historical Performance</CardTitle>
                      <CardDescription>Rating trends over time</CardDescription>
                    </CardHeader>
                    <CardContent className="h-80">
                      <div className="flex h-full items-center justify-center">
                        <p className="text-gray-400">Real data coming soon</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Battle History</CardTitle>
                    <CardDescription>Past battles and ratings</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex h-[200px] items-center justify-center">
                      <p className="text-gray-400">Real data coming soon</p>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
          </TabsContent>

          <TabsContent value="community">
            {!hasData ? (
              renderNoDataMessage()
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="md:col-span-2">
                  <CardHeader>
                    <CardTitle>Community Stats</CardTitle>
                    <CardDescription>User and rating statistics</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                      <div>
                        <h3 className="text-lg font-semibold mb-2">Total Users</h3>
                        <p className="text-3xl font-bold">{userCount}</p>
                        <p className="text-gray-400 text-sm">from database</p>
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-semibold mb-2">Total Ratings</h3>
                        <p className="text-3xl font-bold">{ratingsCount}</p>
                        <p className="text-gray-400 text-sm">from database</p>
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-semibold mb-2">Avg. Rating</h3>
                        <p className="text-3xl font-bold">-</p>
                        <p className="text-gray-400 text-sm">real data coming soon</p>
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-semibold mb-2">Active Users</h3>
                        <p className="text-3xl font-bold">-</p>
                        <p className="text-gray-400 text-sm">real data coming soon</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Most Active User Roles</CardTitle>
                    <CardDescription>Distribution of user roles</CardDescription>
                  </CardHeader>
                  <CardContent className="h-80">
                    <div className="flex h-full items-center justify-center">
                      <p className="text-gray-400">Real data coming soon</p>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Rating Distribution</CardTitle>
                    <CardDescription>Breakdown of ratings by score range</CardDescription>
                  </CardHeader>
                  <CardContent className="h-80">
                    <div className="flex h-full items-center justify-center">
                      <p className="text-gray-400">Real data coming soon</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>
        </Tabs>
      )}
    </div>
  )
}
