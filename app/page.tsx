"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/contexts/auth-context"
import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"

// Define the Battler type based on the actual database schema
interface Battler {
  id: string
  name: string
  image?: string | null
}

export default function HomePage() {
  const { user, isLoading } = useAuth()
  const [featuredBattlers, setFeaturedBattlers] = useState<Battler[]>([])
  const [loadingBattlers, setLoadingBattlers] = useState(true)
  const [loadingError, setLoadingError] = useState(false)

  // Load battlers from Supabase
  useEffect(() => {
    async function loadFeaturedBattlers() {
      try {
        const { data, error } = await supabase
          .from("battlers")
          .select("id, name, image")
          .order("name")
          .limit(6) // Just get the first 6 battlers
        
        if (error) {
          console.error("Error loading featured battlers:", error.message || "Unknown error")
          // Don't set error state here to maintain consistent flow
          return
        }
        
        setFeaturedBattlers(data || [])
      } catch (err) {
        console.error("Failed to load featured battlers:", err)
        // Don't set error state here to maintain consistent flow
      } finally {
        // Always set loadingBattlers to false whether there's data or not
        setLoadingBattlers(false)
      }
    }
    
    // Set a timeout to stop loading after 3 seconds max
    const timeout = setTimeout(() => {
      if (loadingBattlers) {
        setLoadingBattlers(false)
      }
    }, 3000);
    
    loadFeaturedBattlers()
    
    return () => clearTimeout(timeout)
  }, [])

  return (
    <div className="container mx-auto px-4 py-8">
      <section className="flex flex-col items-center text-center mb-16">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">Battle Rap Algorithm</h1>
        <p className="text-xl md:text-2xl text-gray-400 max-w-3xl mb-8">
          The ultimate platform to rate, rank, and discuss battle rap performances
        </p>
        {isLoading ? (
          <div className="flex justify-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : user ? (
          <div className="flex gap-4">
            <Button asChild size="lg">
              <Link href="/battlers">Explore Battlers</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/leaderboard">View Leaderboard</Link>
            </Button>
          </div>
        ) : (
          <div className="flex gap-4">
            <Button asChild size="lg">
              <Link href="/auth/login">Log In</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/auth/signup">Sign Up</Link>
            </Button>
          </div>
        )}
      </section>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle>Rate Battles</CardTitle>
            <CardDescription>Give your opinion on battle performances</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-gray-400">
              Rate battlers across different attributes and contribute to the community-driven ranking system.
            </p>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full" asChild>
              <Link href="/battles">View Battles</Link>
            </Button>
          </CardFooter>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle>Track Stats</CardTitle>
            <CardDescription>Dive into detailed battle rap statistics</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-gray-400">
              Explore win percentages, performance metrics, and historical data for all your favorite battlers.
            </p>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full" asChild>
              <Link href="/analytics">View Stats</Link>
            </Button>
          </CardFooter>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle>Join the Community</CardTitle>
            <CardDescription>Connect with other battle rap enthusiasts</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-gray-400">
              Discuss battles, share opinions, and connect with fans, media, and even your favorite battlers.
            </p>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full" asChild>
              <Link href="/auth/signup">Get Started</Link>
            </Button>
          </CardFooter>
        </Card>
      </section>

      <section className="text-center mb-16">
        <h2 className="text-3xl font-bold mb-6">Featured Battlers</h2>
        
        {/* Show loading skeletons while loading */}
        {loadingBattlers ? (
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-4">
            {Array(6).fill(0).map((_, index) => (
              <div 
                key={index}
                className="bg-gray-900 rounded-lg p-4 border border-gray-800 animate-pulse"
              >
                <div className="aspect-square rounded-full bg-gray-800 mb-2"></div>
                <div className="h-4 bg-gray-800 rounded"></div>
              </div>
            ))}
          </div>
        ) : featuredBattlers.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-4">
            {featuredBattlers.map((battler) => (
              <Link
                key={battler.id}
                href={`/battlers/${battler.id}`}
                className="bg-gray-900 rounded-lg p-4 border border-gray-800 hover:border-purple-500 transition-all"
              >
                <div className="aspect-square rounded-full bg-gray-800 mb-2">
                  {battler.image && (
                    <Image 
                      src={battler.image} 
                      alt={battler.name} 
                      width={100} 
                      height={100} 
                      className="w-full h-full object-cover rounded-full"
                    />
                  )}
                </div>
                <p className="font-medium">{battler.name}</p>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-4">
            <p className="text-gray-400 mb-4">No battlers found yet. Get started by creating your first battler!</p>
            <div className="mt-4">
              <Button asChild>
                <Link href="/admin/battlers/create">Create Battler</Link>
              </Button>
            </div>
          </div>
        )}
      </section>
    </div>
  )
}
