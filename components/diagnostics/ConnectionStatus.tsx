"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Loader2, CheckCircle, XCircle, RefreshCw, AlertCircle } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { useAuth } from "@/contexts/auth-context"
import Link from "next/link"

export default function ConnectionStatus() {
  const [databaseStatus, setDatabaseStatus] = useState<"loading" | "connected" | "error">("loading")
  const [authStatus, setAuthStatus] = useState<"loading" | "authenticated" | "unauthenticated" | "error">("loading")
  const [errorDetails, setErrorDetails] = useState<string | null>(null)
  const [authError, setAuthError] = useState<string | null>(null)
  const [userRoles, setUserRoles] = useState<any>(null)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [checkedEnvVars, setCheckedEnvVars] = useState(false)
  const [envVarsStatus, setEnvVarsStatus] = useState<{url: boolean, key: boolean}>({url: false, key: false})
  
  const { user, userProfile, isLoading } = useAuth()

  // First, check environment variables before attempting any connection
  useEffect(() => {
    if (!checkedEnvVars) {
      const url = process.env.NEXT_PUBLIC_SUPABASE_URL
      const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      
      setEnvVarsStatus({
        url: !!url,
        key: !!key
      })
      
      console.log(`Environment variables check - URL: ${!!url}, Key: ${!!key}`)
      setCheckedEnvVars(true)
      
      // If environment variables are missing, set error state immediately
      if (!url || !key) {
        setDatabaseStatus("error")
        setErrorDetails("Supabase environment variables are missing. Check your .env.local file.")
      }
    }
  }, [checkedEnvVars])

  const checkDatabase = async () => {
    try {
      // Skip the check if env vars are not set
      if (!envVarsStatus.url || !envVarsStatus.key) {
        console.log("Skipping connection test due to missing environment variables")
        return
      }
      
      setDatabaseStatus("loading")
      console.log("Testing Supabase connection...")
      
      // Simple test using fetch instead of Supabase client
      const testUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/battlers?limit=1`
      
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 5000)
      
      try {
        const response = await fetch(testUrl, {
          method: 'GET',
          headers: {
            'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
            'Content-Type': 'application/json'
          },
          signal: controller.signal
        })
        
        clearTimeout(timeoutId)
        
        if (response.ok) {
          console.log("Basic Supabase connection successful")
          setDatabaseStatus("connected")
          setErrorDetails(null)
        } else {
          const errorText = await response.text()
          console.error("Supabase connection error:", response.status, errorText)
          setDatabaseStatus("error")
          setErrorDetails(`HTTP ${response.status}: ${errorText || "Unknown error"}`)
        }
      } catch (fetchError: any) {
        clearTimeout(timeoutId)
        
        if (fetchError.name === 'AbortError') {
          console.error("Supabase connection timeout")
          setDatabaseStatus("error") 
          setErrorDetails("Connection timed out after 5 seconds")
        } else {
          console.error("Fetch error:", fetchError)
          setDatabaseStatus("error")
          setErrorDetails(fetchError.message || "Unknown fetch error")
        }
      }
    } catch (err: any) {
      console.error("Unexpected error in checkDatabase:", err)
      setDatabaseStatus("error")
      setErrorDetails(err.message || "Unknown error occurred")
    }
  }

  const checkAuth = async () => {
    try {
      if (isLoading) {
        console.log("Auth context still loading, skipping auth check")
        return
      }
      
      setAuthStatus("loading")
      
      if (user) {
        console.log("User is authenticated:", user.email)
        setAuthStatus("authenticated")
        
        if (userProfile) {
          console.log("User profile found with roles:", userProfile.roles)
          setUserRoles(userProfile.roles)
        } else {
          console.log("No user profile found")
        }
      } else {
        console.log("No authenticated user found")
        setAuthStatus("unauthenticated")
      }
    } catch (err: any) {
      console.error("Auth check error:", err)
      setAuthError(err.message || "Unknown auth error")
      setAuthStatus("error")
    }
  }

  const refreshStatus = async () => {
    setIsRefreshing(true)
    
    try {
      await checkDatabase()
      await checkAuth()
    } finally {
      setIsRefreshing(false)
    }
  }

  useEffect(() => {
    // Run the checks automatically when the component mounts
    if (checkedEnvVars && (envVarsStatus.url && envVarsStatus.key)) {
      checkDatabase()
    }
    
    if (!isLoading) {
      checkAuth()
    }
    
    // Set a timer to handle the case where the checks never complete
    const timeoutId = setTimeout(() => {
      if (databaseStatus === "loading") {
        console.error("Database connection check timed out after 10 seconds")
        setDatabaseStatus("error")
        setErrorDetails("Connection check timed out after 10 seconds. Please check your network connection and Supabase configuration.")
      }
      
      if (authStatus === "loading" && !isLoading) {
        console.error("Auth status check timed out after 10 seconds")
        setAuthStatus("error")
        setAuthError("Authentication check timed out. This may indicate an issue with the Supabase authentication service.")
      }
    }, 10000)
    
    return () => clearTimeout(timeoutId)
  }, [isLoading, checkedEnvVars, envVarsStatus])

  const resetAndRetry = () => {
    setDatabaseStatus("loading")
    setAuthStatus("loading")
    setErrorDetails(null)
    setAuthError(null)
    checkDatabase()
    if (!isLoading) {
      checkAuth()
    }
  }

  const getMissingEnvHelp = () => {
    return (
      <Alert variant="destructive" className="mt-4">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Missing Environment Variables</AlertTitle>
        <AlertDescription>
          <p className="mb-2">The application cannot connect to Supabase because environment variables are missing.</p>
          <div className="text-sm">
            <p className="font-semibold">To fix this:</p>
            <ol className="list-decimal ml-4 mt-1 space-y-1">
              <li>Make sure you have a <code>.env.local</code> file in the root of your project</li>
              <li>The file should contain the following variables:
                <pre className="bg-gray-800 p-2 rounded mt-1 text-xs overflow-x-auto">
                  NEXT_PUBLIC_SUPABASE_URL=your_supabase_url{"\n"}
                  NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
                </pre>
              </li>
              <li>Restart your development server after adding these variables</li>
            </ol>
          </div>
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <Card className="shadow-lg">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl flex justify-between items-center">
          <span>System Connection Status</span>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={resetAndRetry}
            disabled={isRefreshing}
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span className="ml-1">Retry</span>
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        {!envVarsStatus.url || !envVarsStatus.key ? (
          getMissingEnvHelp()
        ) : (
          <>
            {errorDetails && (
              <Alert variant="destructive">
                <AlertDescription className="font-mono text-xs overflow-auto">{errorDetails}</AlertDescription>
              </Alert>
            )}
    
            <div className="space-y-4 mt-4">
              <div className="grid grid-cols-3 gap-4 items-center">
                <span className="text-sm font-medium">Database Connection:</span>
                <div className="col-span-2">
                  {databaseStatus === "loading" ? (
                    <div className="flex items-center">
                      <Loader2 className="h-3 w-3 mr-2 animate-spin" />
                      <span className="text-sm">checking...</span>
                    </div>
                  ) : databaseStatus === "connected" ? (
                    <Badge variant="outline" className="bg-green-600 text-white">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Connected
                    </Badge>
                  ) : (
                    <Badge variant="destructive">
                      <XCircle className="h-3 w-3 mr-1" />
                      Error
                    </Badge>
                  )}
                </div>
              </div>
    
              <div className="grid grid-cols-3 gap-4 items-center">
                <span className="text-sm font-medium">Authentication:</span>
                <div className="col-span-2">
                  {authStatus === "loading" || isLoading ? (
                    <div className="flex items-center">
                      <Loader2 className="h-3 w-3 mr-2 animate-spin" />
                      <span className="text-sm">checking...</span>
                    </div>
                  ) : authStatus === "authenticated" ? (
                    <Badge variant="outline" className="bg-green-600 text-white">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Authenticated as {user?.email}
                    </Badge>
                  ) : authStatus === "error" ? (
                    <Badge variant="destructive">
                      <XCircle className="h-3 w-3 mr-1" />
                      Error
                    </Badge>
                  ) : (
                    <Badge variant="secondary">
                      Not authenticated
                    </Badge>
                  )}
                </div>
              </div>
    
              {userRoles && (
                <div className="grid grid-cols-3 gap-4 items-center">
                  <span className="text-sm font-medium">User Roles:</span>
                  <div className="col-span-2">
                    <div className="flex flex-wrap gap-1">
                      {userRoles.is_superadmin && (
                        <Badge className="bg-purple-600">Super Admin</Badge>
                      )}
                      {userRoles.is_admin && (
                        <Badge className="bg-blue-600">Admin</Badge>
                      )}
                      {userRoles.is_community_manager && (
                        <Badge className="bg-green-600">Community Manager</Badge>
                      )}
                      {userRoles.is_creator && (
                        <Badge className="bg-yellow-600">Creator</Badge>
                      )}
                      {userRoles.media_confirmed && (
                        <Badge className="bg-orange-600">Media User</Badge>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
    
            {databaseStatus === "error" && (
              <div className="mt-6 text-sm">
                <h3 className="font-semibold">Troubleshooting Steps:</h3>
                <ol className="list-decimal ml-4 mt-2 space-y-1 text-muted-foreground">
                  <li>Check your internet connection</li>
                  <li>Verify Supabase environment variables in <code>.env.local</code></li>
                  <li>Restart the development server with <code>npm run dev</code></li>
                  <li>Check if your Supabase project is active (not paused)</li>
                  <li>Verify that your IP address is not restricted by Supabase</li>
                </ol>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  )
}
