"use client"

import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/auth-context"
import { useState } from "react"

interface GoogleSignInButtonProps {
  redirectTo?: string
  className?: string
}

export default function GoogleSignInButton({ redirectTo, className }: GoogleSignInButtonProps) {
  const { signInWithGoogle } = useAuth()
  const [isLoading, setIsLoading] = useState(false)

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true)
      await signInWithGoogle(redirectTo)
      // The page will redirect, so we don't need to handle success here
    } catch (error) {
      console.error("Error signing in with Google:", error)
      setIsLoading(false) // Reset loading state if there's an error
      // You could also add error handling UI here
    }
  }

  return (
    <Button
      type="button"
      variant="outline"
      onClick={handleGoogleSignIn}
      disabled={isLoading}
      className={`w-full flex items-center justify-center gap-2 ${className}`}
    >
      {isLoading ? (
        "Connecting..."
      ) : (
        <>
          <svg viewBox="0 0 24 24" width="16" height="16" xmlns="http://www.w3.org/2000/svg">
            <g transform="matrix(1, 0, 0, 1, 0, 0)">
              <path
                d="M21.35,11.1H12.18V13.83H18.69C18.36,17.64 15.19,19.27 12.19,19.27C8.36,19.27 5,16.25 5,12C5,7.9 8.2,4.73 12.2,4.73C15.29,4.73 17.1,6.7 17.1,6.7L19,4.72C19,4.72 16.56,2 12.1,2C6.42,2 2.03,6.8 2.03,12C2.03,17.05 6.16,22 12.25,22C17.6,22 21.5,18.33 21.5,12.91C21.5,11.76 21.35,11.1 21.35,11.1V11.1Z"
                fill="currentColor"
              />
            </g>
          </svg>
          Sign in with Google
        </>
      )}
    </Button>
  )
}

