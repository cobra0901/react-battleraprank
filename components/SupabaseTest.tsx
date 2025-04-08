"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function SupabaseTest() {
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading")
  const [message, setMessage] = useState("")
  const [sessionInfo, setSessionInfo] = useState<any>(null)
  const [emailSignInStatus, setEmailSignInStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [emailSignInMessage, setEmailSignInMessage] = useState("")

  // Test Supabase connection on component mount
  useEffect(() => {
    async function testConnection() {
      try {
        // Simple query to test connection
        const { data, error } = await supabase.from("auth").select("*").limit(1)

        if (error) {
          console.error("Supabase connection error:", error)
          setStatus("error")
          setMessage(`Connection error: ${error.message}`)
          return
        }

        // Check session
        const { data: sessionData } = await supabase.auth.getSession()
        setSessionInfo(sessionData.session)

        setStatus("success")
        setMessage("Supabase connection successful!")
      } catch (err: any) {
        console.error("Unexpected error:", err)
        setStatus("error")
        setMessage(`Unexpected error: ${err.message}`)
      }
    }

    testConnection()
  }, [])

  // Test email sign in
  const testEmailSignIn = async () => {
    setEmailSignInStatus("loading")
    try {
      // Use a test email - this won't actually create an account
      // but will test if the auth API is working
      const { error } = await supabase.auth.signInWithOtp({
        email: "test@example.com",
      })

      if (error) {
        console.error("Email sign in error:", error)
        setEmailSignInStatus("error")
        setEmailSignInMessage(`Email sign in error: ${error.message}`)
        return
      }

      setEmailSignInStatus("success")
      setEmailSignInMessage("Email sign in API is working! (No actual email was sent)")
    } catch (err: any) {
      console.error("Unexpected error:", err)
      setEmailSignInStatus("error")
      setEmailSignInMessage(`Unexpected error: ${err.message}`)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Supabase Connection Test</CardTitle>
        <CardDescription>Testing if Supabase is properly configured</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <h3 className="text-lg font-medium">Connection Status:</h3>
          <div
            className={`p-3 rounded-md ${
              status === "loading"
                ? "bg-yellow-900/30 text-yellow-400"
                : status === "success"
                  ? "bg-green-900/30 text-green-400"
                  : "bg-red-900/30 text-red-400"
            }`}
          >
            {status === "loading" ? "Testing connection..." : message}
          </div>
        </div>

        {status === "success" && (
          <div className="space-y-2">
            <h3 className="text-lg font-medium">Session Info:</h3>
            <div className="p-3 bg-gray-800 rounded-md">
              {sessionInfo ? (
                <pre className="text-xs overflow-auto">{JSON.stringify(sessionInfo, null, 2)}</pre>
              ) : (
                <p>No active session</p>
              )}
            </div>
          </div>
        )}

        <div className="space-y-2">
          <h3 className="text-lg font-medium">Test Email Auth API:</h3>
          <Button onClick={testEmailSignIn} disabled={emailSignInStatus === "loading"} className="w-full">
            {emailSignInStatus === "loading" ? "Testing..." : "Test Email Auth"}
          </Button>

          {emailSignInStatus !== "idle" && (
            <div
              className={`p-3 rounded-md mt-2 ${
                emailSignInStatus === "loading"
                  ? "bg-yellow-900/30 text-yellow-400"
                  : emailSignInStatus === "success"
                    ? "bg-green-900/30 text-green-400"
                    : "bg-red-900/30 text-red-400"
              }`}
            >
              {emailSignInMessage}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

