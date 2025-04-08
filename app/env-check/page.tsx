"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertCircle, ArrowLeft } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import Link from "next/link"

export default function EnvCheck() {
  const [envVars, setEnvVars] = useState<{[key: string]: string | null}>({
    NEXT_PUBLIC_SUPABASE_URL: null,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: null,
  })
  
  const [hasMissingVars, setHasMissingVars] = useState(false)
  
  useEffect(() => {
    // Check environment variables
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    
    setEnvVars({
      NEXT_PUBLIC_SUPABASE_URL: url || null,
      NEXT_PUBLIC_SUPABASE_ANON_KEY: key ? "****" + key.substring(key.length - 5) : null,
    })
    
    setHasMissingVars(!url || !key)
    
    // Log to console for debugging
    console.log("Environment Check:")
    console.log(`NEXT_PUBLIC_SUPABASE_URL: ${url ? "Set" : "Missing"}`)
    console.log(`NEXT_PUBLIC_SUPABASE_ANON_KEY: ${key ? "Set" : "Missing"}`)
  }, [])
  
  return (
    <div className="container mx-auto px-4 py-8">
      <Link href="/diagnostics" className="flex items-center text-blue-500 hover:text-blue-600 mb-4">
        <ArrowLeft className="h-4 w-4 mr-1" />
        Back to Diagnostics
      </Link>
      
      <h1 className="text-2xl font-bold mb-6">Environment Variables Check</h1>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Supabase Configuration</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-2">
              <div className="font-medium">NEXT_PUBLIC_SUPABASE_URL:</div>
              <div>
                {envVars.NEXT_PUBLIC_SUPABASE_URL ? (
                  <span className="text-green-500 font-mono">
                    {envVars.NEXT_PUBLIC_SUPABASE_URL.substring(0, 20)}...
                  </span>
                ) : (
                  <span className="text-red-500 font-mono">Not set</span>
                )}
              </div>
              
              <div className="font-medium">NEXT_PUBLIC_SUPABASE_ANON_KEY:</div>
              <div>
                {envVars.NEXT_PUBLIC_SUPABASE_ANON_KEY ? (
                  <span className="text-green-500 font-mono">
                    {envVars.NEXT_PUBLIC_SUPABASE_ANON_KEY}
                  </span>
                ) : (
                  <span className="text-red-500 font-mono">Not set</span>
                )}
              </div>
            </div>
            
            {hasMissingVars && (
              <Alert variant="destructive" className="mt-4">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Missing Environment Variables</AlertTitle>
                <AlertDescription>
                  <p className="mb-2">The application cannot connect to Supabase because one or more environment variables are missing.</p>
                  <div className="text-sm">
                    <p className="font-semibold">To fix this:</p>
                    <ol className="list-decimal ml-4 mt-1 space-y-1">
                      <li>Create or edit the <code>.env.local</code> file in the root of your project</li>
                      <li>Add the following variables:
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
            )}
          </div>
        </CardContent>
      </Card>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Network Connectivity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium mb-2">Test Network Connectivity:</h3>
              <p className="text-sm text-gray-400 mb-4">
                If Supabase environment variables are set correctly but you're still having connection issues,
                it may be due to network problems or your Supabase project configuration.
              </p>
              
              <div className="space-y-2">
                <p className="text-sm">Try these troubleshooting steps:</p>
                <ol className="list-decimal ml-4 text-sm space-y-1">
                  <li>Check if your internet connection is working properly</li>
                  <li>Verify that your Supabase project is active (not paused)</li>
                  <li>Confirm that your API keys are correct</li>
                  <li>Check if your Supabase project has Row Level Security (RLS) policies that might be restricting access</li>
                  <li>Try a different browser or clear your browser cache</li>
                </ol>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Button asChild className="mt-4">
        <Link href="/diagnostics">Return to Diagnostics</Link>
      </Button>
    </div>
  )
}
