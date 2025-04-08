"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { getSupabaseBrowser } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { UsersRound, Search, UserPlus } from "lucide-react"

interface User {
  id: string
  email: string
  display_name: string | null
  roles: {
    admin?: boolean
    community_manager?: boolean
    media?: boolean
    league_owner?: boolean
    fan?: boolean
  }
}

interface ManageManagersFormProps {
  initialUsers: User[]
}

export default function ManageManagersForm({ initialUsers }: ManageManagersFormProps) {
  const [users, setUsers] = useState<User[]>(initialUsers)
  const [newManagerEmail, setNewManagerEmail] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  
  const router = useRouter()
  const supabase = getSupabaseBrowser()
  const { toast } = useToast()

  // Filter users based on search query
  const filteredUsers = users.filter((user) => {
    const searchLower = searchQuery.toLowerCase()
    return (
      user.email.toLowerCase().includes(searchLower) ||
      (user.display_name && user.display_name.toLowerCase().includes(searchLower))
    )
  })

  // Function to add a new community manager
  async function addCommunityManager(e: React.FormEvent) {
    e.preventDefault()
    
    if (!newManagerEmail) {
      toast({
        title: "Error",
        description: "Please enter an email address",
        variant: "destructive",
      })
      return
    }
    
    setIsSubmitting(true)
    
    try {
      // Call the Supabase function to make a user a community manager
      const { data, error } = await supabase.rpc(
        "make_community_manager",
        { target_email: newManagerEmail }
      )
      
      if (error) {
        throw error
      }
      
      if (data === true) {
        // Refresh the user list
        const { data: updatedUsers, error: usersError } = await supabase
          .from("user_profiles")
          .select("id, email, display_name, roles")
          .order("email", { ascending: true })
          
        if (!usersError && updatedUsers) {
          setUsers(updatedUsers)
        }
        
        toast({
          title: "Success",
          description: `${newManagerEmail} has been made a community manager`,
        })
        
        setNewManagerEmail("")
      } else {
        toast({
          title: "Error",
          description: "User not found or you don't have permission",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error making community manager:", error)
      toast({
        title: "Error",
        description: "Failed to update user role",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }
  
  // Function to change a user's role
  async function changeUserRole(userId: string, newRoles: { admin?: boolean, community_manager?: boolean, media?: boolean, league_owner?: boolean, fan?: boolean }) {
    try {
      const { error } = await supabase
        .from("user_profiles")
        .update({ roles: newRoles, updated_at: new Date().toISOString() })
        .eq("id", userId)
        
      if (error) {
        throw error
      }
      
      // Update local state
      setUsers(users.map(user => 
        user.id === userId ? { ...user, roles: newRoles } : user
      ))
      
      toast({
        title: "Role updated",
        description: "The user's role has been successfully changed",
      })
      
    } catch (error) {
      console.error("Error changing role:", error)
      toast({
        title: "Error",
        description: "Failed to update role",
        variant: "destructive",
      })
    }
  }
  
  // Function to get badge color based on role
  function getRoleBadgeVariant(roles: { admin?: boolean, community_manager?: boolean, media?: boolean, league_owner?: boolean, fan?: boolean }) {
    if (roles.admin) return "destructive" as const
    if (roles.community_manager) return "default" as const
    if (roles.league_owner) return "secondary" as const
    if (roles.media) return "outline" as const
    return "secondary" as const
  }

  return (
    <div className="space-y-8">
      {/* Add new manager form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <UserPlus className="mr-2 h-5 w-5" />
            Add New Community Manager
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={addCommunityManager} className="flex gap-4">
            <div className="flex-1">
              <Label htmlFor="email" className="sr-only">Email</Label>
              <Input
                id="email"
                placeholder="Enter user's email address"
                type="email"
                value={newManagerEmail}
                onChange={(e) => setNewManagerEmail(e.target.value)}
                required
              />
            </div>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Adding..." : "Add Manager"}
            </Button>
          </form>
        </CardContent>
      </Card>
      
      {/* Existing users table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <UsersRound className="mr-2 h-5 w-5" />
              Manage Users
            </div>
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search users..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Email</TableHead>
                  <TableHead>Display Name</TableHead>
                  <TableHead>Current Role</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center p-4 text-muted-foreground">
                      No users found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.display_name || "—"}</TableCell>
                      <TableCell>
                        <Badge variant={getRoleBadgeVariant(user.roles)}>
                          {user.roles.admin ? "Admin" : user.roles.community_manager ? "Community Manager" : user.roles.league_owner ? "League Owner" : user.roles.media ? "Media" : "User"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Select
                          defaultValue={user.roles.admin ? "admin" : user.roles.community_manager ? "community_manager" : user.roles.league_owner ? "league_owner" : user.roles.media ? "media" : "user"}
                          onValueChange={(value) => {
                            switch (value) {
                              case "admin":
                                changeUserRole(user.id, { admin: true, community_manager: false, media: false, league_owner: false, fan: false })
                                break
                              case "community_manager":
                                changeUserRole(user.id, { admin: false, community_manager: true, media: false, league_owner: false, fan: false })
                                break
                              case "league_owner":
                                changeUserRole(user.id, { admin: false, community_manager: false, media: false, league_owner: true, fan: false })
                                break
                              case "media":
                                changeUserRole(user.id, { admin: false, community_manager: false, media: true, league_owner: false, fan: false })
                                break
                              default:
                                changeUserRole(user.id, { admin: false, community_manager: false, media: false, league_owner: false, fan: true })
                            }
                          }}
                          disabled={user.email === "taskmasterpeace@gmail.com"} // Prevent changing admin
                        >
                          <SelectTrigger className="w-36">
                            <SelectValue placeholder="Select role" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="admin">Admin</SelectItem>
                            <SelectItem value="community_manager">Community Manager</SelectItem>
                            <SelectItem value="league_owner">League Owner</SelectItem>
                            <SelectItem value="media">Media</SelectItem>
                            <SelectItem value="user">User</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
