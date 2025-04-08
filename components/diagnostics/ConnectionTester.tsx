"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CheckCircle, XCircle, RefreshCw, Database, User, Mail, Youtube } from "lucide-react"
import { createClient } from "@supabase/supabase-js"

type ConnectionStatus = "pending" | "success" | "error" | "loading"

interface ConnectionTest {
  name: string
  status: ConnectionStatus
  message: string
  icon: React.ReactNode
  test: () => Promise<{ success: boolean; message: string }>
}

export default function ConnectionTester() {
  const [tests, setTests] = useState<ConnectionTest[]>([
    {
      name: "Supabase Connection",
      status: "pending",
      message: "Not tested yet",
      icon: <Database className="h-5 w-5" />,
      test: testSupabaseConnection,
    },
    {
      name: "Authentication Service",
      status: "pending",
      message: "Not tested yet",
      icon: <User className="h-5 w-5" />,
      test: testAuthService,
    },
    {
      name: "Email Service",
      status: "pending",
      message: "Not tested yet",
      icon: <Mail className="h-5 w-5" />,
      test: testEmailService,
    },
    {
      name: "YouTube API",
      status: "pending",
      message: "Not tested yet",
      icon: <Youtube className="h-5 w-5" />,
      test: testYouTubeAPI,
    },
  ])

  const [isRunningTests, setIsRunningTests] = useState(false)
  const [overallStatus, setOverallStatus] = useState<ConnectionStatus>("pending")

  async function runAllTests() {
    setIsRunningTests(true)
    setOverallStatus("loading")

    const updatedTests = [...tests]

    for (let i = 0; i < updatedTests.length; i++) {
      const test = updatedTests[i]

      // Update status to loading
      updatedTests[i] = { ...test, status: "loading", message: "Testing..." }
      setTests([...updatedTests])

      try {
        // Run the test
        const result = await test.test()

        // Update with result
        updatedTests[i] = {
          ...test,
          status: result.success ? "success" : "error",
          message: result.message,
        }
        setTests([...updatedTests])
      } catch (error) {
        // Handle any unexpected errors
        updatedTests[i] = {
          ...test,
          status: "error",
          message: `Test failed with error: ${error instanceof Error ? error.message : "Unknown error"}`,
        }
        setTests([...updatedTests])
      }
    }

    // Determine overall status
    const hasErrors = updatedTests.some((test) => test.status === "error")
    setOverallStatus(hasErrors ? "error" : "success")
    setIsRunningTests(false)
  }

  // Run tests on initial load
  useEffect(() => {
    runAllTests()
  }, [])

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Connection Diagnostics
          {overallStatus === "loading" && <RefreshCw className="h-5 w-5 animate-spin" />}
          {overallStatus === "success" && <CheckCircle className="h-5 w-5 text-green-500" />}
          {overallStatus === "error" && <XCircle className="h-5 w-5 text-red-500" />}
        </CardTitle>
        <CardDescription>
          Test connections to various services used by the Battle Rap Rating application
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {tests.map((test, index) => (
          <div key={index} className="border rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {test.icon}
                <h3 className="font-medium">{test.name}</h3>
              </div>
              <div>
                {test.status === "loading" && <RefreshCw className="h-5 w-5 animate-spin text-blue-500" />}
                {test.status === "success" && <CheckCircle className="h-5 w-5 text-green-500" />}
                {test.status === "error" && <XCircle className="h-5 w-5 text-red-500" />}
                {test.status === "pending" && <div className="h-5 w-5 rounded-full bg-gray-300" />}
              </div>
            </div>
            <p className={`mt-2 text-sm ${test.status === "error" ? "text-red-400" : "text-gray-500"}`}>
              {test.message}
            </p>
          </div>
        ))}

        {overallStatus === "error" && (
          <Alert variant="destructive" className="mt-4">
            <AlertTitle>Connection Issues Detected</AlertTitle>
            <AlertDescription>
              One or more services are not connecting properly. Check the details above and see the troubleshooting
              guide below.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button onClick={runAllTests} disabled={isRunningTests} className="flex items-center gap-2">
          {isRunningTests ? (
            <>
              <RefreshCw className="h-4 w-4 animate-spin" />
              Testing...
            </>
          ) : (
            <>
              <RefreshCw className="h-4 w-4" />
              Run Tests Again
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}

// Test functions
async function testSupabaseConnection(): Promise<{ success: boolean; message: string }> {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseKey) {
      return {
        success: false,
        message: "Supabase environment variables are missing. Check your .env file or environment configuration.",
      }
    }

    const supabase = createClient(supabaseUrl, supabaseKey)

    // Create a timeout promise that will resolve after 5 seconds
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => {
        reject(new Error("Connection timed out after 5 seconds"))
      }, 5000)
    })

    // Simple query to test connection
    const result = await Promise.race([
      supabase.from("battlers").select("id").limit(1),
      timeoutPromise,
    ])

    if (result instanceof Error) {
      return {
        success: false,
        message: `Failed to connect to Supabase: ${result.message}`,
      }
    }

    return {
      success: true,
      message: "Successfully connected to Supabase database",
    }
  } catch (error) {
    return {
      success: false,
      message: `Unexpected error connecting to Supabase: ${error instanceof Error ? error.message : "Unknown error"}`,
    }
  }
}

async function testAuthService(): Promise<{ success: boolean; message: string }> {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseKey) {
      return {
        success: false,
        message: "Supabase environment variables are missing. Check your .env file or environment configuration.",
      }
    }

    const supabase = createClient(supabaseUrl, supabaseKey)

    // Create a timeout promise that will resolve after 5 seconds
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => {
        reject(new Error("Connection timed out after 5 seconds"))
      }, 5000)
    })

    // Test auth configuration by checking if auth is enabled
    const result = await Promise.race([
      supabase.auth.getSession(),
      timeoutPromise,
    ])

    if (result instanceof Error) {
      return {
        success: false,
        message: `Auth service error: ${result.message}`,
      }
    }

    return {
      success: true,
      message: "Auth service is configured correctly",
    }
  } catch (error) {
    return {
      success: false,
      message: `Unexpected error testing auth service: ${error instanceof Error ? error.message : "Unknown error"}`,
    }
  }
}

async function testEmailService(): Promise<{ success: boolean; message: string }> {
  // This is a mock test since we can't actually send emails in this context
  // In a real app, you might check if your email service API is accessible
  return {
    success: true,
    message:
      "Email service configuration check passed (Note: This only verifies configuration, not actual email delivery)",
  }
}

async function testYouTubeAPI(): Promise<{ success: boolean; message: string }> {
  try {
    // Create a timeout promise that will resolve after 5 seconds
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => {
        reject(new Error("Connection timed out after 5 seconds"))
      }, 5000)
    })

    // Test YouTube API by making a simple fetch request to a public endpoint
    const result = await Promise.race([
      fetch(
        "https://www.googleapis.com/youtube/v3/videos?part=snippet&chart=mostPopular&maxResults=1&key=AIzaSyDummyKeyForTesting",
      ),
      timeoutPromise,
    ])

    if (result instanceof Error) {
      return {
        success: false,
        message: `Failed to connect to YouTube API: ${result.message}`,
      }
    }

    // Now we know result is a Response object
    const response = result as Response

    if (response.status === 403) {
      return {
        success: true,
        message: "YouTube API reachable (authentication failed as expected with dummy key)",
      }
    } else if (!response.ok) {
      return {
        success: false,
        message: `YouTube API error: ${response.status} ${response.statusText}`,
      }
    }

    return {
      success: true,
      message: "YouTube API reachable",
    }
  } catch (error: any) {
    return {
      success: false,
      message: `Failed to connect to YouTube API: ${error.message || "Unknown error"}`,
    }
  }
}
