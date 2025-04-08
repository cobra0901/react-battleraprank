"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Trash2, Search, UserPlus, Shield, CheckCircle, XCircle } from "lucide-react"
import { getCommunityManagers, addCommunityManager, removeCommunityManager } from "@/lib/user-service"
import type { UserProfile } from "@/types/auth-types"

export default function CommunityManagersManager() {
  const [managers, setManagers] = useState<UserProfile[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [email, setEmail] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    const fetchManagers = async () => {
      try {
        const data = await getCommunityManagers()
        setManagers(data)
      } catch (error) {
        console.error("Error fetching community managers:", error)
        setError("Failed to fetch community managers")
      } finally {
        setIsLoading(false)
      }
    }

    fetchManagers()
  }, [])

  const handleAddManager = async () => {
    if (!email) return

    setIsSubmitting(true)
    setError("")
    setSuccess("")

    try {
      const newManager = await addCommunityManager(email)
      // if (newManager && typeof newManager === "object" && newManager !== null) {
      //   setManagers((prev) => [...prev, newManager])
      // } else {
      //   setError("Failed to add community manager. Invalid response.")
      // }
      setIsDialogOpen(false)
      setEmail("")
      setSuccess(`${email} has been added as a community manager`)
    } catch (error) {
      console.error("Error adding community manager:", error)
      setError("Failed to add community manager. Make sure the user exists.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleRemoveManager = async (userId: string) => {
    setError("")
    setSuccess("")

    try {
      await removeCommunityManager(userId)
      setManagers((prev) => prev.filter((manager) => manager.id !== userId))
      setSuccess("Community manager removed successfully")
    } catch (error) {
      console.error("Error removing community manager:", error)
      setError("Failed to remove community manager")
    }
  }

  const filteredManagers = searchQuery
    ? managers.filter(
        (manager) =>
          (manager.displayName?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false) ||
          manager.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (manager.username && manager.username.toLowerCase().includes(searchQuery.toLowerCase())),
      )
    : managers

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Community Managers</h2>
        <Button onClick={() => setIsDialogOpen(true)}>
          <UserPlus className="w-4 h-4 mr-2" />
          Add Manager
        </Button>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="bg-green-900/20 border-green-800 text-green-400">
          <CheckCircle className="h-4 w-4 mr-2" />
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <Input
          placeholder="Search managers..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 bg-gray-800 border-gray-700"
        />
      </div>

      <Card className="bg-gray-900 border-gray-800">
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-6 text-center text-gray-400">Loading community managers...</div>
          ) : filteredManagers.length === 0 ? (
            <div className="p-6 text-center text-gray-400">
              {searchQuery ? "No managers match your search" : "No community managers found"}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Verified</TableHead>
                  <TableHead>Added Battlers</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredManagers.map((manager) => (
                  <TableRow key={manager.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center">
                        <Shield className="w-4 h-4 text-amber-500 mr-2" />
                        {manager.displayName}
                        {manager.username && <span className="text-gray-400 ml-2">@{manager.username}</span>}
                      </div>
                    </TableCell>
                    <TableCell>{manager.email}</TableCell>
                    <TableCell>
                      {manager.verified ? (
                        <Badge className="bg-green-900/30 text-green-400 border-green-700">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Verified
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-amber-400 border-amber-700">
                          <XCircle className="w-3 h-3 mr-1" />
                          Not Verified
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>{manager.addedBattlers?.length || 0} battlers</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-400 hover:text-red-300"
                        onClick={() => handleRemoveManager(manager.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-gray-900 border-gray-800">
          <DialogHeader>
            <DialogTitle>Add Community Manager</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">User Email</Label>
              <Input
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter user email"
                className="bg-gray-800 border-gray-700"
              />
              <p className="text-xs text-gray-400">The user must already have an account in the system.</p>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button onClick={handleAddManager} disabled={isSubmitting || !email}>
              {isSubmitting ? "Adding..." : "Add Manager"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

