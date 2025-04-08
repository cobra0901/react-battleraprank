"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, XCircle, RefreshCw } from "lucide-react"

export default function SupabaseConnectionTest() {
  const [isConnected, setIsConnected] = useState<boolean | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const testConnection = async () => {
    setIsLoading(true)
    setError(null)

    try {
      // Simple query to test connection
      const { data, error } = await supabase.from("role_weights").select("*").limit(1)

      if (error) throw error

      setIsConnected(true)
    } catch (err: any) {
      setIsConnected(false)
      setError(err.message || "Failed to connect to Supabase")
      console.error("Connection error:", err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    testConnection()
  }, [])

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Supabase Connection Test</CardTitle>
        <CardDescription>Testing connection to your Supabase project</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center space-y-4">
        {isLoading ? (
          <div className="flex items-center space-x-2">
            <RefreshCw className="h-5 w-5 animate-spin text-muted-foreground" />
            <p>Testing connection...</p>
          </div>
        ) : isConnected === true ? (
          <div className="flex items-center space-x-2 text-green-500">
            <CheckCircle className="h-6 w-6" />
            <p>Successfully connected to Supabase!</p>
          </div>
        ) : isConnected === false ? (
          <div className="flex flex-col space-y-2">
            <div className="flex items-center space-x-2 text-red-500">
              <XCircle className="h-6 w-6" />
              <p>Failed to connect to Supabase</p>
            </div>
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-md text-sm text-red-800">{error}</div>
            )}
          </div>
        ) : null}
      </CardContent>
      <CardFooter>
        <Button onClick={testConnection} disabled={isLoading} className="w-full">
          {isLoading ? (
            <>
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              Testing...
            </>
          ) : (
            "Test Connection Again"
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}

