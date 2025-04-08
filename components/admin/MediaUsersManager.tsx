"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Search, CheckCircle, XCircle } from "lucide-react"
import { getUsersByRole, confirmMediaUser } from "@/lib/user-service"
import type { UserProfile } from "@/types/auth-types"

export default function MediaUsersManager() {
  const [mediaUsers, setMediaUsers] = useState<UserProfile[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    const fetchMediaUsers = async () => {
      try {
        const data = await getUsersByRole("media")
        setMediaUsers(data)
      } catch (error) {
        console.error("Error fetching media users:", error)
        setError("Failed to fetch media users")
      } finally {
        setIsLoading(false)
      }
    }

    fetchMediaUsers()
  }, [])

  const handleConfirmUser = async (userId: string, userEmail: string) => {
    setError("")
    setSuccess("")

    try {
      const updatedUser = await confirmMediaUser(userId)
      setMediaUsers((prev) => 
        prev.map((user) => user.id === userId ? updatedUser : user)
      )
      setSuccess(`${userEmail} has been confirmed as a media user`)
    } catch (error: any) {
      console.error("Error confirming media user:", error)
      setError(error.message || "Failed to confirm media user")
    }
  }

  const filteredUsers = mediaUsers.filter((user) => {
    const searchLower = searchQuery.toLowerCase()
    return (
      user.email?.toLowerCase().includes(searchLower) ||
      user.full_name?.toLowerCase().includes(searchLower)
    )
  })

  return (
    <Card>
      <CardContent className="pt-6">
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        {success && (
          <Alert className="mb-4 bg-green-900 border-green-800">
            <CheckCircle className="h-4 w-4 mr-2" />
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}

        <div className="relative flex-1 mb-6">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search media users..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {isLoading ? (
          <p className="text-center py-4">Loading media users...</p>
        ) : filteredUsers.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Email</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.full_name || "--"}</TableCell>
                  <TableCell>
                    {user.roles?.media_confirmed ? (
                      <Badge className="bg-green-700">Confirmed</Badge>
                    ) : (
                      <Badge variant="outline">Pending</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    {!user.roles?.media_confirmed && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleConfirmUser(user.id, user.email || "")}
                      >
                        <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                        Confirm
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <p className="text-center py-4 text-muted-foreground">
            No media users found.
          </p>
        )}
      </CardContent>
    </Card>
  )
}
