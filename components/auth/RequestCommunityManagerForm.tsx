"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, Loader2 } from "lucide-react"
import { requestCommunityManagerRole } from "@/lib/user-service"
import { useAuth } from "@/contexts/auth-context"

export default function RequestCommunityManagerForm() {
  const { user } = useAuth()
  const [reason, setReason] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user) {
      setError("You must be logged in to request community manager privileges")
      return
    }

    if (!reason.trim()) {
      setError("Please provide a reason for your request")
      return
    }

    setIsSubmitting(true)
    setError("")

    try {
      await requestCommunityManagerRole(user.id, reason)
      setIsSubmitted(true)
    } catch (err) {
      setError("Failed to submit request. Please try again later.")
      console.error("Error submitting community manager request:", err)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSubmitted) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Request Submitted</CardTitle>
          <CardDescription>Your request for community manager privileges has been submitted</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-6">
            <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
            <p className="text-center">
              Thank you for your interest in becoming a community manager. We'll review your request and get back to you
              soon.
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <form onSubmit={handleSubmit}>
        <CardHeader>
          <CardTitle>Request Community Manager Privileges</CardTitle>
          <CardDescription>
            Community managers can add battlers to the Alt Battle Rap Algorithm and help maintain the platform
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <p className="text-sm text-gray-400">
              Please explain why you'd like to become a community manager and what qualifies you for this role:
            </p>
            <Textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="I've been following battle rap for X years and have knowledge of..."
              className="min-h-[120px]"
              required
            />
          </div>

          <div className="text-sm text-gray-400">
            <p>As a community manager, you'll be able to:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Add new battlers to the platform</li>
              <li>Update battler information</li>
              <li>Help maintain the quality of the Alt Battle Rap Algorithm</li>
            </ul>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Submitting...
              </>
            ) : (
              "Submit Request"
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}

