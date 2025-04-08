"use client"

import { useState, useEffect } from "react"
import QuickFilterBar from "./QuickFilterBar"
import { supabase } from "@/lib/supabase"

interface Battler {
  id: string
  name: string
  alias?: string
  avatar_url?: string
  bio?: string
  social_links?: any
  stats?: any
  // Add any other properties your battlers have
}

interface ClientQuickFilterWrapperProps {
  // initialBattlers: Battler[]
}

export default function ClientQuickFilterWrapper(/*{ initialBattlers }: ClientQuickFilterWrapperProps*/) {
  const [battlers, setBattlers] = useState<Battler[]>([])
  const [filteredBattlers, setFilteredBattlers] = useState<Battler[]>([])
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    async function loadBattlers() {
      try {
        const { data, error } = await supabase
          .from("battlers")
          .select("*")
          .order("name")
        
        if (error) {
          console.error("Error loading battlers for filter:", error)
          setBattlers([])
        } else {
          setBattlers(data || [])
          setFilteredBattlers(data || [])
        }
      } catch (error) {
        console.error("Exception loading battlers for filter:", error)
        setBattlers([])
      } finally {
        setLoading(false)
      }
    }
    
    loadBattlers()
  }, [])
  
  // Add this function to handle filter changes
  const handleFilterChange = (filters: { search: string; tags: string[] }) => {
    const { search, tags } = filters
    
    // Filter the battlers based on the search term and selected tags
    const filtered = battlers.filter(battler => {
      const matchesSearch = search === "" || 
        battler.name.toLowerCase().includes(search.toLowerCase()) ||
        (battler.alias && battler.alias.toLowerCase().includes(search.toLowerCase()))
      
      // For tags, we'd need to implement this based on how tags are stored
      // This is just a placeholder for now
      const matchesTags = tags.length === 0 // || tags.some(tag => battler.tags?.includes(tag))
      
      return matchesSearch && matchesTags
    })
    
    setFilteredBattlers(filtered)
    console.log("Filters changed:", filters, "Found:", filtered.length)
  }

  // Initially we'll pass an empty array until data is loaded
  return (
    <QuickFilterBar 
      battlers={filteredBattlers} 
      isLoading={loading}
      onFilterChange={handleFilterChange}
    />
  )
}
