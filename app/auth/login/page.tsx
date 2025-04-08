"use client"
import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { LogIn } from "lucide-react"
import SimpleGoogleButton from "@/components/auth/SimpleGoogleButton"

export default function LoginPage() {
  const router = useRouter()
  const { signIn } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    setSuccess("")

    try {
      console.log("Attempting to sign in with email:", email)
      const { error } = await signIn(email, password)
      if (error) {
        // Special handling for unverified emails
        if (error.message?.includes('Email not confirmed')) {
          setError("Please verify your email before logging in. Check your inbox for a confirmation link.")
        } else {
          setError(error.message || "Failed to sign in")
        }
      } else {
        setSuccess("Signed in successfully!")
        router.push("/")
      }
    } catch (err: any) {
      console.error("Sign in error:", err)
      setError(err.message || "An unexpected error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-64px)]">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center mb-4">
            <h1 className="text-3xl font-bold text-amber-500">ALGORITHM INSTITUTE</h1>
          </div>
          <CardTitle className="text-2xl text-center">Login</CardTitle>
          <CardDescription className="text-center">Enter your credentials to access your account</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <div className="p-3 text-sm bg-red-900/30 border border-red-800 text-red-400 rounded-md">{error}</div>
          )}
          {success && (
            <div className="p-3 text-sm bg-green-900/30 border border-green-800 text-green-400 rounded-md">{success}</div>
          )}

          <SimpleGoogleButton />

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-700"></span>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="your.email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link href="/auth/forgot-password" className="text-xs text-amber-400 hover:text-amber-300">
                  Forgot password?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-amber-600 to-amber-800 hover:from-amber-700 hover:to-amber-900"
              disabled={isLoading}
            >
              {isLoading ? (
                "Logging in..."
              ) : (
                <>
                  <LogIn className="w-4 h-4 mr-2" />
                  Login
                </>
              )}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <p className="text-center text-sm text-gray-400">
            Don't have an account?{" "}
            <Link href="/auth/signup" className="text-amber-400 hover:text-amber-300">
              Sign up
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}
