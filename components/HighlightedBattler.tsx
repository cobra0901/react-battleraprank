"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Star, MapPin, Award, TrendingUp, ChevronLeft, ChevronRight, Filter } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu"
import { getTags, type Tag } from "@/lib/tag-service"

interface Battler {
  id: number
  name: string
  image: string
  location: string
  rating: number
  bio: string
  accolades: string[]
  badges: string[]
  tags: string[]
}

export default function HighlightedBattler() {
  const [battlers, setBattlers] = useState<Battler[]>([])
  const [filteredBattlers, setFilteredBattlers] = useState<Battler[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [tags, setTags] = useState<Tag[]>([])
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [tagCategories, setTagCategories] = useState<Record<string, Tag[]>>({})

  useEffect(() => {
    // Get tags from tag service
    getTags().then((allTags) => {
      setTags(allTags)

      // Group tags by category logic is already handled above, removing redundant code
    })

    // Group tags by category
    // const groupedTags: Record<string, Tag[]> = {}
    // allTags.forEach((tag) => {
    //   const category = tag.category || "Uncategorized"
    //   if (!groupedTags[category]) {
    //     groupedTags[category] = []
    //   }
    //   groupedTags[category].push(tag)
    // })
    // setTagCategories(groupedTags)

    // Mock data for highlighted battlers
    const mockBattlers: Battler[] = [
      {
        id: 1,
        name: "Loaded Lux",
        image: "/placeholder.svg?height=400&width=400",
        location: "Harlem, NY",
        rating: 9.2,
        bio: "Loaded Lux is known for his intricate wordplay, complex schemes, and philosophical approach to battle rap. His performances are often characterized by deeply researched angles and memorable catchphrases.",
        accolades: ["3x Champion of the Year", "Most Quoted Battler", "Highest Rated Performance"],
        badges: ["Wordsmith", "Scheme King", "Crowd Control", "Battle IQ", "Preparation"],
        tags: ["Veteran", "East Coast", "URL", "Lyricist"],
      },
      {
        id: 2,
        name: "Geechi Gotti",
        image: "/placeholder.svg?height=400&width=400",
        location: "Compton, CA",
        rating: 9.0,
        bio: "Geechi Gotti is known for his authentic street content and consistent performances. He's a multiple Champion of the Year winner who brings credibility and relatability to every battle.",
        accolades: ["3x Champion of the Year", "Most Consistent", "Fan Favorite"],
        badges: ["Authentic", "Consistent", "Performance", "Crowd Control"],
        tags: ["West Coast", "URL", "Street"],
      },
      {
        id: 3,
        name: "Rum Nitty",
        image: "/placeholder.svg?height=400&width=400",
        location: "Phoenix, AZ",
        rating: 8.9,
        bio: "Rum Nitty is regarded as one of the best punchers in battle rap history. His ability to craft complex punchlines and deliver them effectively has made him a fan favorite.",
        accolades: ["Puncher of the Year", "Most Quotable", "Performance of the Year"],
        badges: ["Puncher", "Wordplay", "Creativity", "Quotable"],
        tags: ["West Coast", "URL", "Puncher"],
      },
      {
        id: 4,
        name: "40 B.A.R.S.",
        image: "/placeholder.svg?height=400&width=400",
        location: "Philadelphia, PA",
        rating: 8.7,
        bio: "40 B.A.R.S. is known for her technical ability and precise delivery. She combines wordplay with aggressive performance to create memorable moments.",
        accolades: ["Queen of the Ring Champion", "Best Female Performance", "Most Technical"],
        badges: ["Technical", "Wordplay", "Performance", "Preparation"],
        tags: ["East Coast", "QOTR", "lady", "Technical"],
      },
      {
        id: 5,
        name: "Shotgun Suge",
        image: "/placeholder.svg?height=400&width=400",
        location: "Newark, NJ",
        rating: 8.5,
        bio: "Shotgun Suge is known for his aggressive style and commanding stage presence. His physical performance and crowd control make him a formidable opponent.",
        accolades: ["Most Aggressive", "Best Stage Presence", "Fan Favorite"],
        badges: ["Performance", "Aggression", "Stage Presence", "Crowd Control"],
        tags: ["East Coast", "URL", "Performance"],
      },
      {
        id: 6,
        name: "Shox The Rebel",
        image: "/placeholder.svg?height=400&width=400",
        location: "London, UK",
        rating: 8.6,
        bio: "Shox The Rebel is one of the UK's premier battle rappers, known for his precise delivery and punching ability. He combines technical skill with performance to create impactful moments.",
        accolades: ["UK Battle Rapper of the Year", "International Breakthrough", "Technical Excellence"],
        badges: ["Technical", "Puncher", "International", "Precise"],
        tags: ["UK", "Don't Flop", "international", "Technical"],
      },
    ]

    setBattlers(mockBattlers)
    setFilteredBattlers(mockBattlers)
    setIsLoading(false)
  }, [])

  useEffect(() => {
    // Filter battlers based on selected tags
    if (selectedTags.length === 0) {
      setFilteredBattlers(battlers)
    } else {
      const filtered = battlers.filter((battler) => selectedTags.every((tag) => battler.tags.includes(tag)))
      setFilteredBattlers(filtered)
    }

    // Reset current index when filters change
    setCurrentIndex(0)
  }, [selectedTags, battlers])

  const handleTagToggle = (tagName: string) => {
    setSelectedTags((prev) => (prev.includes(tagName) ? prev.filter((t) => t !== tagName) : [...prev, tagName]))
  }

  const nextBattler = () => {
    if (filteredBattlers.length > 1) {
      setCurrentIndex((prev) => (prev + 1) % filteredBattlers.length)
    }
  }

  const prevBattler = () => {
    if (filteredBattlers.length > 1) {
      setCurrentIndex((prev) => (prev - 1 + filteredBattlers.length) % filteredBattlers.length)
    }
  }

  if (isLoading) {
    return (
      <Card className="bg-gray-900 border-gray-800 animate-pulse h-full">
        <CardContent className="p-0 h-96"></CardContent>
      </Card>
    )
  }

  if (filteredBattlers.length === 0) {
    return (
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <Award className="w-5 h-5 mr-2 text-red-400" />
            <h2 className="text-2xl font-bold">Highlighted Battler</h2>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              {Object.entries(tagCategories).map(([category, categoryTags]) => (
                <div key={category}>
                  <DropdownMenuLabel>{category}</DropdownMenuLabel>
                  {categoryTags
                    .filter((tag) => !tag.isHidden)
                    .map((tag) => (
                      <DropdownMenuCheckboxItem
                        key={tag.id}
                        checked={selectedTags.includes(tag.name)}
                        onCheckedChange={() => handleTagToggle(tag.name)}
                      >
                        {tag.name}
                      </DropdownMenuCheckboxItem>
                    ))}
                  <DropdownMenuSeparator />
                </div>
              ))}

              {/* Hidden tags section */}
              <DropdownMenuLabel>Special Categories</DropdownMenuLabel>
              {tags
                .filter((tag) => tag.isHidden)
                .map((tag) => (
                  <DropdownMenuCheckboxItem
                    key={tag.id}
                    checked={selectedTags.includes(tag.name)}
                    onCheckedChange={() => handleTagToggle(tag.name)}
                  >
                    {tag.description || tag.name}
                  </DropdownMenuCheckboxItem>
                ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <Card className="bg-gray-900 border-gray-800 h-full flex items-center justify-center p-8">
          <div className="text-center">
            <p className="text-gray-400 mb-4">No battlers match your selected filters</p>
            <Button variant="outline" onClick={() => setSelectedTags([])}>
              Clear Filters
            </Button>
          </div>
        </Card>
      </div>
    )
  }

  const currentBattler = filteredBattlers[currentIndex]

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <Award className="w-5 h-5 mr-2 text-red-400" />
          <h2 className="text-2xl font-bold">Highlighted Battler</h2>
        </div>

        <div className="flex items-center gap-2">
          {filteredBattlers.length > 1 && (
            <div className="flex items-center gap-1 mr-2">
              <Button variant="outline" size="icon" onClick={prevBattler}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm text-gray-400">
                {currentIndex + 1}/{filteredBattlers.length}
              </span>
              <Button variant="outline" size="icon" onClick={nextBattler}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              {Object.entries(tagCategories).map(([category, categoryTags]) => (
                <div key={category}>
                  <DropdownMenuLabel>{category}</DropdownMenuLabel>
                  {categoryTags
                    .filter((tag) => !tag.isHidden)
                    .map((tag) => (
                      <DropdownMenuCheckboxItem
                        key={tag.id}
                        checked={selectedTags.includes(tag.name)}
                        onCheckedChange={() => handleTagToggle(tag.name)}
                      >
                        {tag.name}
                      </DropdownMenuCheckboxItem>
                    ))}
                  <DropdownMenuSeparator />
                </div>
              ))}

              {/* Hidden tags section */}
              <DropdownMenuLabel>Special Categories</DropdownMenuLabel>
              {tags
                .filter((tag) => tag.isHidden)
                .map((tag) => (
                  <DropdownMenuCheckboxItem
                    key={tag.id}
                    checked={selectedTags.includes(tag.name)}
                    onCheckedChange={() => handleTagToggle(tag.name)}
                  >
                    {tag.description || tag.name}
                  </DropdownMenuCheckboxItem>
                ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <motion.div
        key={currentBattler.id}
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="flex-1"
      >
        <Card className="bg-gray-900 border-gray-800 overflow-hidden h-full">
          <CardContent className="p-0 h-full">
            <div className="flex flex-col md:flex-row h-full">
              {/* Image container - fixed width, not overlapping */}
              <div className="md:w-1/3 relative">
                <div className="aspect-square relative">
                  <Image
                    src={currentBattler.image || "/placeholder.svg"}
                    alt={currentBattler.name}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-4 right-4 bg-gray-900/80 backdrop-blur-sm rounded-full p-2">
                    <div className="flex items-center">
                      <Star className="w-5 h-5 text-blue-500 fill-blue-500 mr-1" />
                      <span className="font-bold text-lg">{currentBattler.rating.toFixed(1)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Content container - separate from image */}
              <div className="md:w-2/3 p-6 flex flex-col">
                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-2 gap-2">
                    <div>
                      <h3 className="text-2xl font-bold">{currentBattler.name}</h3>
                      <p className="text-gray-400 flex items-center">
                        <MapPin className="w-4 h-4 mr-1" />
                        {currentBattler.location}
                      </p>
                    </div>
                    <motion.div
                      initial={{ rotate: 0 }}
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                      className="bg-red-500 rounded-full p-1 self-start"
                    >
                      <TrendingUp className="w-5 h-5 text-gray-900" />
                    </motion.div>
                  </div>

                  <p className="text-gray-300 my-4">{currentBattler.bio}</p>

                  <div className="mb-4">
                    <h4 className="font-medium mb-2">Accolades:</h4>
                    <ul className="list-disc list-inside text-gray-300">
                      {currentBattler.accolades.map((accolade, index) => (
                        <li key={index}>{accolade}</li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Badges:</h4>
                    <div className="flex flex-wrap gap-2">
                      {currentBattler.badges.map((badge) => (
                        <motion.div key={badge} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                          <Badge className="bg-blue-900/30 text-blue-300 border-blue-700">{badge}</Badge>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-4">
                    <h4 className="font-medium mb-2">Categories:</h4>
                    <div className="flex flex-wrap gap-2">
                      {currentBattler.tags
                        .filter((tagName) => {
                          const tag = tags.find((t) => t.name === tagName)
                          return tag && !tag.isHidden
                        })
                        .map((tagName) => (
                          <Badge key={tagName} variant="outline" className="text-gray-300">
                            {tagName}
                          </Badge>
                        ))}
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <Button
                    asChild
                    className="w-full bg-gradient-to-r from-red-600 to-blue-600 hover:from-red-700 hover:to-blue-700"
                  >
                    <Link href={`/battlers/${currentBattler.id}`}>View Full Profile</Link>
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

