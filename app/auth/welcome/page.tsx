"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"

export default function WelcomePage() {
  const router = useRouter()
  const [isVerified, setIsVerified] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkSession = async () => {
      const { data, error } = await supabase.auth.getSession()
      
      if (error) {
        console.error("Error checking session:", error)
        setIsLoading(false)
        return
      }
      
      if (data.session) {
        // Get the user metadata to see if they're verified
        const { data: userData } = await supabase.auth.getUser()
        
        if (userData.user) {
          const emailVerified = userData.user.email_confirmed_at != null
          console.log("Email verified:", emailVerified)
          setIsVerified(emailVerified)
        }
      }
      
      setIsLoading(false)
    }
    
    checkSession()
  }, [])

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-64px)]">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center mb-4">
            <h1 className="text-3xl font-bold text-amber-500">ALGORITHM INSTITUTE</h1>
          </div>
          <CardTitle className="text-2xl text-center">Welcome!</CardTitle>
          <CardDescription className="text-center">
            {isLoading ? "Checking verification status..." : 
              isVerified ? "Your email has been confirmed. You can now sign in." : 
              "Please check your email to confirm your account."}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center">
            {isVerified ? (
              <div className="p-3 text-sm bg-green-900/30 border border-green-800 text-green-400 rounded-md mb-4">
                Your email has been successfully verified!
              </div>
            ) : (
              <div className="p-3 text-sm bg-yellow-900/30 border border-yellow-800 text-yellow-400 rounded-md mb-4">
                You need to confirm your email before signing in.
                <br />Check your inbox and click the confirmation link.
              </div>
            )}
            
            <div className="flex justify-center mt-4">
              <Button 
                variant="default" 
                onClick={() => router.push("/auth/login")}
                className="mx-2"
              >
                Go to Login
              </Button>
              {!isVerified && (
                <Button 
                  variant="outline"
                  onClick={() => router.refresh()}
                  className="mx-2"
                >
                  Refresh Status
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
