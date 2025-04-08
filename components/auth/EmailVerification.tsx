"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, AlertCircle, Mail } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { sendVerificationEmail, verifyEmail } from "@/lib/auth-service"

export default function EmailVerification() {
  const { user, userProfile } = useAuth()
  const [verificationCode, setVerificationCode] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [emailSent, setEmailSent] = useState(false)

  const handleSendVerification = async () => {
    if (!user) return

    setIsSubmitting(true)
    setError("")

    try {
      await sendVerificationEmail(user.email!)
      setEmailSent(true)
      setSuccess("Verification email sent! Please check your inbox.")
    } catch (error) {
      console.error("Error sending verification email:", error)
      setError("Failed to send verification email. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleVerify = async () => {
    if (!user || !verificationCode) return

    setIsSubmitting(true)
    setError("")

    try {
      const result = await verifyEmail(user.id, verificationCode)

      if (result.success) {
        setSuccess("Email verified successfully!")
      } else {
        setError("Invalid verification code. Please try again.")
      }
    } catch (error) {
      console.error("Error verifying email:", error)
      setError("Failed to verify email. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!user || !userProfile) {
    return null
  }

  if (userProfile.verified) {
    return (
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="flex items-center">
            <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
            Email Verified
          </CardTitle>
          <CardDescription>Your email has been verified</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-400">
            Your email address ({user.email}) has been verified. You have full access to all features.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-gray-900 border-gray-800">
      <CardHeader>
        <CardTitle className="flex items-center">
          <AlertCircle className="w-5 h-5 text-amber-500 mr-2" />
          Verify Your Email
        </CardTitle>
        <CardDescription>Verify your email to unlock all features</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="bg-green-900/20 border-green-800 text-green-400">
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}

        <p className="text-sm text-gray-400">
          Your email address ({user.email}) needs to be verified. Please click the button below to receive a
          verification code.
        </p>

        {emailSent ? (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="verificationCode">Verification Code</Label>
              <Input
                id="verificationCode"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                placeholder="Enter the code from your email"
                className="bg-gray-800 border-gray-700"
              />
            </div>

            <Button onClick={handleVerify} disabled={isSubmitting || !verificationCode} className="w-full">
              {isSubmitting ? "Verifying..." : "Verify Email"}
            </Button>
          </div>
        ) : (
          <Button onClick={handleSendVerification} disabled={isSubmitting} className="w-full">
            <Mail className="w-4 h-4 mr-2" />
            {isSubmitting ? "Sending..." : "Send Verification Email"}
          </Button>
        )}
      </CardContent>
    </Card>
  )
}

