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
import { UserPlus } from "lucide-react"
import SimpleGoogleButton from "@/components/auth/SimpleGoogleButton"
import RoleSelector from "@/components/auth/RoleSelector"
import type { UserRoles } from "@/types/auth-types"

export default function SignupPage() {
  const router = useRouter()
  const { signUp, saveUserProfile } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [roles, setRoles] = useState<UserRoles>({
    fan: true,
    media: false,
    battler: false,
    league_owner: false,
    admin: false,
    community_manager: false
  })
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [step, setStep] = useState(1)

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault()

    // Validate passwords match
    if (password !== confirmPassword) {
      setError("Passwords do not match")
      return
    }

    // Validate password strength
    if (password.length < 8) {
      setError("Password must be at least 8 characters long")
      return
    }
    
    setError("")
    setStep(2)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")
    setIsLoading(true)

    try {
      console.log("Submitting signup with roles:", JSON.stringify(roles));
      const { data, error } = await signUp(email, password, roles)
      if (data?.user) {
        console.log("Saving user profile for", data.user.id, data.user.email);
        
        await saveUserProfile(data.user.id, data.user.email, roles);
      }
      console.log(email, password, roles);
      
      
      if (error) {
        console.error("Signup error:", error);
        setError(error.message || "Database error saving new user")
      } else {
        setSuccess("Registration successful! Please check your email to confirm your account.")
        router.push("/auth/welcome") 
        setEmail("")
        setPassword("")
        setConfirmPassword("")
        setRoles({
          fan: true,
          media: false,
          battler: false,
          league_owner: false,
          admin: false,
          community_manager: false
        })
        setStep(1)
      }
    } catch (err: any) {
      console.error("Caught exception during signup:", err);
      setError(err.message || "An error occurred during registration")
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
          <CardTitle className="text-2xl text-center">Create an Account</CardTitle>
          <CardDescription className="text-center">
            {step === 1
              ? "Sign up to rate and analyze battle rap performances"
              : "Tell us about your role in the battle rap community"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <div className="p-3 text-sm bg-red-900/30 border border-red-800 text-red-400 rounded-md">{error}</div>
          )}
          {success && (
            <div className="p-3 text-sm bg-green-900/30 border border-green-800 text-green-400 rounded-md">
              {success}
            </div>
          )}

          {step === 1 ? (
            <>
              <SimpleGoogleButton />

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-gray-700"></span>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
                </div>
              </div>

              <form onSubmit={handleNextStep} className="space-y-4">
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
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <p className="text-xs text-gray-400">Password must be at least 8 characters long</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                >
                  Continue
                </Button>
              </form>
            </>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <RoleSelector roles={roles} onChange={setRoles} />

              <div className="flex justify-between gap-4 mt-6">
                <Button type="button" variant="outline" onClick={() => setStep(1)}>
                  Back
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    "Creating account..."
                  ) : (
                    <>
                      <UserPlus className="w-4 h-4 mr-2" />
                      Sign Up
                    </>
                  )}
                </Button>
              </div>
            </form>
          )}
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <p className="text-center text-sm text-gray-400">
            Already have an account?{" "}
            <Link href="/auth/login" className="text-purple-400 hover:text-purple-300">
              Login
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}
