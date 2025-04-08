"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

// Define the Battler type based on the database schema
interface Battler {
  id: string
  name: string
  bio?: string | null
  avatar_url?: string | null
  created_by?: string
  created_at?: string
  stats?: Record<string, any>
}

export default function BattlersList() {
  const [battlers, setBattlers] = useState<Battler[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [loadingTimeout, setLoadingTimeout] = useState(false)
  
  useEffect(() => {
    async function fetchBattlers() {
      try {
        console.log("Fetching battlers list...")
        const { data, error } = await supabase
          .from("battlers")
          .select("*")
          .order("name")
        
        if (error) {
          console.error("Supabase error:", error)
          throw error
        }
        
        console.log(`Retrieved ${data?.length || 0} battlers`)
        setBattlers(data || [])
        setError(null)
      } catch (err: any) {
        console.error("Error fetching battlers:", err)
        setError(err.message || "Failed to load battlers. Please try again later.")
      } finally {
        setLoading(false)
      }
    }
    
    // Set timeout to detect if we're stuck in loading state
    const timeoutId = setTimeout(() => {
      if (loading) {
        console.warn("Battlers list loading timed out after 8 seconds")
        setLoadingTimeout(true)
      }
    }, 8000)
    
    fetchBattlers()
    
    return () => clearTimeout(timeoutId)
  }, [])
  
  // Show loading state
  if (loading) {
    return (
      <div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {Array(6).fill(0).map((_, i) => (
            <div key={i} className="bg-gray-900 rounded-lg overflow-hidden border border-gray-800 animate-pulse">
              <div className="aspect-square bg-gray-800"></div>
              <div className="p-3">
                <div className="h-4 bg-gray-800 rounded mb-2"></div>
                <div className="h-3 bg-gray-800 rounded w-2/3"></div>
              </div>
            </div>
          ))}
        </div>
        
        {loadingTimeout && (
          <Alert className="mt-4" variant="default">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Loading is taking longer than expected</AlertTitle>
            <AlertDescription>
              This may indicate a connection issue with the database. Try refreshing the page or visit 
              the <Link href="/diagnostics" className="underline">diagnostics page</Link> to check the system status.
            </AlertDescription>
          </Alert>
        )}
      </div>
    )
  }
  
  // Show error state
  if (error) {
    return (
      <Alert variant="destructive" className="mb-6">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error loading battlers</AlertTitle>
        <AlertDescription>
          {error}
          <div className="mt-2">
            <Link href="/diagnostics" className="text-sm underline">
              Check system status
            </Link>
          </div>
        </AlertDescription>
      </Alert>
    )
  }
  
  // If no battlers, show a friendly message and create button
  if (!battlers || battlers.length === 0) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-semibold mb-4">No battlers found</h2>
        <p className="text-gray-400 mb-6">Looks like there aren't any battlers in the database yet.</p>
        <Link href="/admin/battlers/create">
          <Button className="bg-purple-600 hover:bg-purple-700">
            Create First Battler
          </Button>
        </Link>
      </div>
    )
  }
  
  // Battlers grid
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
      {battlers.map((battler) => (
        <Link
          key={battler.id}
          href={`/battlers/${battler.id}`}
          className="bg-gray-900 rounded-lg overflow-hidden border border-gray-800 hover:border-purple-500 transition-all hover:shadow-lg hover:shadow-purple-900/20"
        >
          <div className="aspect-square relative">
            <Image 
              src={battler.avatar_url || "/placeholder.svg"} 
              alt={battler.name} 
              fill 
              className="object-cover" 
            />
          </div>
          <div className="p-3">
            <h3 className="font-medium">{battler.name}</h3>
          </div>
        </Link>
      ))}
    </div>
  )
}