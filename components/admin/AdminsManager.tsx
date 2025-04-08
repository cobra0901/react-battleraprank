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
import { getUsersByRole, addAdmin, removeAdmin } from "@/lib/user-service"
import type { UserProfile } from "@/types/auth-types"

export default function AdminsManager() {
  const [admins, setAdmins] = useState<UserProfile[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [email, setEmail] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        const data = await getUsersByRole("admin")
        setAdmins(data)
      } catch (error) {
        console.error("Error fetching admins:", error)
        setError("Failed to fetch administrators")
      } finally {
        setIsLoading(false)
      }
    }

    fetchAdmins()
  }, [])

  const handleAddAdmin = async () => {
    if (!email) return

    setIsSubmitting(true)
    setError("")
    setSuccess("")

    try {
      const newAdmin = await addAdmin(email)
      setAdmins((prev) => [...prev, newAdmin])
      setSuccess(`${email} has been successfully added as an administrator`)
      setIsDialogOpen(false)
      setEmail("")
    } catch (error: any) {
      console.error("Error adding admin:", error)
      setError(error.message || "Failed to add admin")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleRemoveAdmin = async (userId: string, adminEmail: string) => {
    if (!confirm(`Are you sure you want to remove ${adminEmail} as an administrator?`)) {
      return
    }

    setError("")
    setSuccess("")

    try {
      await removeAdmin(userId)
      setAdmins((prev) => prev.filter((admin) => admin.id !== userId))
      setSuccess(`${adminEmail} has been removed as an administrator`)
    } catch (error: any) {
      console.error("Error removing admin:", error)
      setError(error.message || "Failed to remove administrator")
    }
  }

  const filteredAdmins = admins.filter((admin) => {
    const searchLower = searchQuery.toLowerCase()
    return (
      admin.email?.toLowerCase().includes(searchLower) ||
      admin.full_name?.toLowerCase().includes(searchLower)
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

        <div className="flex items-center mb-6 gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search administrators..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button onClick={() => setIsDialogOpen(true)}>
            <UserPlus className="mr-2 h-4 w-4" />
            Add Administrator
          </Button>
        </div>

        {isLoading ? (
          <p className="text-center py-4">Loading administrators...</p>
        ) : filteredAdmins.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Email</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAdmins.map((admin) => (
                <TableRow key={admin.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Shield className="h-4 w-4 text-amber-500" />
                      {admin.email}
                    </div>
                  </TableCell>
                  <TableCell>{admin.full_name || "--"}</TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveAdmin(admin.id, admin.email || "")}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <p className="text-center py-4 text-muted-foreground">
            No administrators found.
          </p>
        )}

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Administrator</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  placeholder="user@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button onClick={handleAddAdmin} disabled={!email || isSubmitting}>
                {isSubmitting ? "Adding..." : "Add Administrator"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  )
}
