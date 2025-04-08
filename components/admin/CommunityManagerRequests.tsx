"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Check, X, Loader2 } from "lucide-react"
import { getCommunityManagerRequests, reviewCommunityManagerRequest } from "@/lib/user-service"
import { useAuth } from "@/contexts/auth-context"

interface CommunityManagerRequest {
  id: string
  userId: string
  reason: string
  status: "pending" | "approved" | "rejected"
  createdAt: string
  reviewedAt?: string
  reviewedBy?: string
}

export default function CommunityManagerRequests() {
  const { user } = useAuth()
  const [requests, setRequests] = useState<CommunityManagerRequest[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedRequest, setSelectedRequest] = useState<CommunityManagerRequest | null>(null)
  const [dialogAction, setDialogAction] = useState<"approve" | "reject" | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const data = await getCommunityManagerRequests()
        setRequests(data)
      } catch (error) {
        console.error("Error fetching community manager requests:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchRequests()
  }, [])

  const handleApprove = (request: CommunityManagerRequest) => {
    setSelectedRequest(request)
    setDialogAction("approve")
  }

  const handleReject = (request: CommunityManagerRequest) => {
    setSelectedRequest(request)
    setDialogAction("reject")
  }

  const handleConfirm = async () => {
    if (!selectedRequest || !dialogAction || !user) return

    setIsProcessing(true)

    try {
      await reviewCommunityManagerRequest(
        selectedRequest.id,
        dialogAction === "approve" ? "approved" : "rejected",
        user.id,
      )

      // Update the local state
      setRequests((prev) =>
        prev.map((req) =>
          req.id === selectedRequest.id
            ? {
                ...req,
                status: dialogAction === "approve" ? "approved" : "rejected",
                reviewedAt: new Date().toISOString(),
                reviewedBy: user.id,
              }
            : req,
        ),
      )

      setSelectedRequest(null)
      setDialogAction(null)
    } catch (error) {
      console.error("Error reviewing request:", error)
    } finally {
      setIsProcessing(false)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge className="bg-yellow-900/30 text-yellow-400 border-yellow-700">Pending</Badge>
      case "approved":
        return <Badge className="bg-green-900/30 text-green-400 border-green-700">Approved</Badge>
      case "rejected":
        return <Badge className="bg-red-900/30 text-red-400 border-red-700">Rejected</Badge>
      default:
        return null
    }
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Community Manager Requests</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center py-8">
            <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Community Manager Requests</CardTitle>
        </CardHeader>
        <CardContent>
          {requests.length === 0 ? (
            <p className="text-center py-8 text-gray-400">No requests found</p>
          ) : (
            <div className="space-y-4">
              {requests.map((request) => (
                <Card key={request.id} className="bg-gray-800 border-gray-700">
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-medium">User ID: {request.userId}</span>
                          {getStatusBadge(request.status)}
                        </div>
                        <p className="text-sm text-gray-300 mb-4">{request.reason}</p>
                        <p className="text-xs text-gray-400">
                          Requested on {new Date(request.createdAt).toLocaleDateString()}
                        </p>
                        {request.reviewedAt && (
                          <p className="text-xs text-gray-400">
                            Reviewed on {new Date(request.reviewedAt).toLocaleDateString()} by {request.reviewedBy}
                          </p>
                        )}
                      </div>

                      {request.status === "pending" && (
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-green-600 text-green-500 hover:bg-green-900/20"
                            onClick={() => handleApprove(request)}
                          >
                            <Check className="w-4 h-4 mr-1" />
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-red-600 text-red-500 hover:bg-red-900/20"
                            onClick={() => handleReject(request)}
                          >
                            <X className="w-4 h-4 mr-1" />
                            Reject
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <AlertDialog open={!!selectedRequest && !!dialogAction} onOpenChange={() => setSelectedRequest(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{dialogAction === "approve" ? "Approve Request" : "Reject Request"}</AlertDialogTitle>
            <AlertDialogDescription>
              {dialogAction === "approve"
                ? "This will grant community manager privileges to this user. They will be able to add battlers to the platform."
                : "This will reject the user's request for community manager privileges."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isProcessing}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirm}
              disabled={isProcessing}
              className={dialogAction === "approve" ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : dialogAction === "approve" ? (
                "Approve"
              ) : (
                "Reject"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

