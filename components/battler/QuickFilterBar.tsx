"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Filter, X, Loader2 } from "lucide-react"

interface Battler {
  id: string
  name: string
  alias?: string
  avatar_url?: string
  bio?: string
  social_links?: any
  stats?: any
}

interface QuickFilterBarProps {
  onFilterChange: (filters: {
    search: string
    tags: string[]
  }) => void
  battlers?: Battler[]
  isLoading?: boolean
}

export default function QuickFilterBar({ 
  onFilterChange, 
  battlers = [], 
  isLoading = false 
}: QuickFilterBarProps) {
  const [search, setSearch] = useState("")
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [availableTags, setAvailableTags] = useState<string[]>([])
  
  // Extract unique tags from battlers
  useEffect(() => {
    if (battlers && battlers.length > 0) {
      const uniqueTags = new Set<string>()
      
      battlers.forEach(battler => {
        if (battler.stats) {
          Object.keys(battler.stats).forEach(tag => uniqueTags.add(tag))
        }
      })
      
      setAvailableTags(Array.from(uniqueTags))
    }
  }, [battlers])

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSearch = e.target.value
    setSearch(newSearch)
    onFilterChange({ search: newSearch, tags: selectedTags })
  }

  // Toggle tag selection
  const toggleTag = (tag: string) => {
    let newTags: string[]
    
    if (selectedTags.includes(tag)) {
      newTags = selectedTags.filter(t => t !== tag)
    } else {
      newTags = [...selectedTags, tag]
    }
    
    setSelectedTags(newTags)
    onFilterChange({ search, tags: newTags })
  }

  // Clear all filters
  const clearFilters = () => {
    setSearch("")
    setSelectedTags([])
    onFilterChange({ search: "", tags: [] })
  }

  return (
    <div className="bg-gray-900 border border-gray-700 rounded-lg p-4 mb-6">
      <div className="flex flex-col md:flex-row gap-4">
        {/* Search input */}
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input 
            placeholder="Search battlers..." 
            className="pl-10 bg-gray-800 border-gray-700" 
            value={search}
            onChange={handleSearchChange}
          />
        </div>
        
        {/* Filter button */}
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="flex items-center gap-1">
            <Filter className="h-4 w-4" />
            Filter
          </Button>
          
          {/* Reset button only if filters applied */}
          {(search || selectedTags.length > 0) && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="flex items-center gap-1 text-red-400"
              onClick={clearFilters}
            >
              <X className="h-4 w-4" />
              Clear
            </Button>
          )}
          
          {/* Loading indicator */}
          {isLoading && (
            <span className="flex items-center text-gray-400 text-sm">
              <Loader2 className="h-4 w-4 mr-1 animate-spin" />
              Loading...
            </span>
          )}
        </div>
      </div>
      
      {/* Tags row */}
      {availableTags.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {availableTags.map(tag => (
            <Badge 
              key={tag}
              variant={selectedTags.includes(tag) ? "default" : "outline"}
              className={`cursor-pointer ${
                selectedTags.includes(tag) 
                  ? "bg-purple-700 hover:bg-purple-800" 
                  : "bg-transparent hover:bg-gray-800"
              }`}
              onClick={() => toggleTag(tag)}
            >
              {tag}
            </Badge>
          ))}
        </div>
      )}
    </div>
  )
}
