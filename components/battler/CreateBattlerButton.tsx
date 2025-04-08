"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { supabase } from "@/lib/supabase"

export default function CreateBattlerButton() {
  const { user } = useAuth()
  const [canCreateBattler, setCanCreateBattler] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function checkPermission() {
      if (!user) {
        setCanCreateBattler(false)
        setIsLoading(false)
        return
      }

      try {
        // Get user role from profiles table
        const { data: profile, error } = await supabase
          .from("user_profiles")
          .select("roles, email")
          .eq("id", user.id)
          .single()

        if (error || !profile) {
          console.error("Error fetching user profile:", error)
          setCanCreateBattler(false)
          return
        }

        // Check if user is taskmasterpeace (by email)
        const isTaskmasterpeace = profile.email?.toLowerCase() === "taskmasterpeace@gmail.com"
        
        // Only community managers, taskmasterpeace, and confirmed media can create battlers
        const hasPermission = isTaskmasterpeace || 
                             profile.roles?.community_manager === true || 
                             (profile.roles?.media === true && profile.roles?.media_confirmed === true)
        
        setCanCreateBattler(hasPermission)
      } catch (err) {
        console.error("Error checking permissions:", err)
        setCanCreateBattler(false)
      } finally {
        setIsLoading(false)
      }
    }

    checkPermission()
  }, [user])

  // Don't render anything if loading or user doesn't have permission
  if (isLoading) return null
  if (!canCreateBattler) return null

  return (
    <Button asChild className="ml-auto">
      <Link href="/admin/battlers/create">
        <PlusCircle className="mr-2 h-4 w-4" />
        Create Battler
      </Link>
    </Button>
  )
}
