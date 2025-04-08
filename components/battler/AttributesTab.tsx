"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import AttributeSlider from "@/components/battler/AttributeSlider"
import BadgeSection from "@/components/battler/BadgeSection"
import { getWritingBadges, getPerformanceBadges, getPersonalBadges, getAttributesByCategory } from "@/lib/data-service"
import { supabase } from "@/lib/supabase"

interface AttributesTabProps {
  battlerId: string
}

export default function AttributesTab({ battlerId }: AttributesTabProps) {
  // State for all attribute ratings
  const [ratings, setRatings] = useState<Record<string, number>>({})

  // State for selected badges
  const [selectedBadges, setSelectedBadges] = useState<{
    positive: string[]
    negative: string[]
  }>({
    positive: [],
    negative: [],
  })

  // State for badges and attributes
  const [writingBadges, setWritingBadges] = useState<any[]>([])
  const [performanceBadges, setPerformanceBadges] = useState<any[]>([])
  const [personalBadges, setPersonalBadges] = useState<any[]>([])

  const [writingAttributes, setWritingAttributes] = useState<any[]>([])
  const [performanceAttributes, setPerformanceAttributes] = useState<any[]>([])
  const [personalAttributes, setPersonalAttributes] = useState<any[]>([])

  // Fetch badges and attributes
  useEffect(() => {
    // Create a non-async function to call inside useEffect
    const fetchData = () => {
      // Fetch badges
      Promise.all([
        getWritingBadges(),
        getPerformanceBadges(),
        getPersonalBadges(),
        getAttributesByCategory("Writing"),
        getAttributesByCategory("Performance"),
        getAttributesByCategory("Personal")
      ])
      .then(([writingData, performanceData, personalData, writingAttrs, performanceAttrs, personalAttrs]) => {
        setWritingBadges(writingData);
        setPerformanceBadges(performanceData);
        setPersonalBadges(personalData);
        
        setWritingAttributes(writingAttrs);
        setPerformanceAttributes(performanceAttrs);
        setPersonalAttributes(personalAttrs);
        
        // Initialize ratings
        const initialRatings: Record<string, number> = {};
        [...writingAttrs, ...performanceAttrs, ...personalAttrs].forEach((attr) => {
          initialRatings[attr.attribute] = 5.0;
        });
        
        setRatings(initialRatings);
      })
      .catch(error => {
        console.error("Error fetching badges and attributes:", error);
      });
    };
    
    fetchData();
  }, [])

  // Calculate total points whenever ratings change
  useEffect(() => {
    if (Object.keys(ratings).length === 0) return

    // Calculate average of all ratings
    const total = Object.values(ratings).reduce((sum, val) => sum + val, 0)
    const average = total / Object.values(ratings).length

    // Update parent component
    // updateTotalPoints(average)
  }, [ratings])

  // Update badges in parent component when selected badges change
  useEffect(() => {
    // updateBadges(selectedBadges)
  }, [selectedBadges])

  // Handle rating change
  const handleRatingChange = (attribute: string, value: number) => {
    setRatings((prev) => ({
      ...prev,
      [attribute]: value,
    }))
  }

  // Handle badge selection
  const handleBadgeSelect = (badge: string, isPositive: boolean) => {
    setSelectedBadges((prev) => {
      const type = isPositive ? "positive" : "negative"

      // If already selected, remove it
      if (prev[type].includes(badge)) {
        return {
          ...prev,
          [type]: prev[type].filter((b) => b !== badge),
        }
      }

      // Otherwise add it
      return {
        ...prev,
        [type]: [...prev[type], badge],
      }
    })
  }

  return (
    <div>
      <Tabs defaultValue="writing">
        <TabsList className="mb-6 bg-gray-900 border border-gray-800">
          <TabsTrigger value="writing">Writing</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="personal">Personal</TabsTrigger>
        </TabsList>

        <TabsContent value="writing">
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent">
              Writing
            </h2>
            <p className="text-gray-300 mb-6">Ability to write impactful and complex rhymes</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {writingAttributes.map((attr) => (
                <AttributeSlider
                  key={attr.attribute}
                  title={attr.attribute}
                  description={attr.description}
                  value={ratings[attr.attribute] || 5.0}
                  onChange={(value) => handleRatingChange(attr.attribute, value)}
                  gradientFrom="indigo-500"
                  gradientTo="purple-500"
                />
              ))}
            </div>

            <h3 className="text-xl font-semibold mb-4">Writing Badges</h3>
            <div className="space-y-8">
              <BadgeSection
                title="Positive"
                badges={writingBadges
                  .filter((b) => b.isPositive)
                  .map((b) => ({ badge: b.badge, description: b.description }))}
                isPositive={true}
                selectedBadges={selectedBadges.positive}
                onSelectBadge={handleBadgeSelect}
              />
              <BadgeSection
                title="Negative"
                badges={writingBadges
                  .filter((b) => !b.isPositive)
                  .map((b) => ({ badge: b.badge, description: b.description }))}
                isPositive={false}
                selectedBadges={selectedBadges.negative}
                onSelectBadge={handleBadgeSelect}
              />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="performance">
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-cyan-500 bg-clip-text text-transparent">
              Performance
            </h2>
            <p className="text-gray-300 mb-6">Delivery, cadence, and stage presence</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {performanceAttributes.map((attr) => (
                <AttributeSlider
                  key={attr.attribute}
                  title={attr.attribute}
                  description={attr.description}
                  value={ratings[attr.attribute] || 5.0}
                  onChange={(value) => handleRatingChange(attr.attribute, value)}
                  gradientFrom="blue-500"
                  gradientTo="cyan-500"
                />
              ))}
            </div>

            <h3 className="text-xl font-semibold mb-4">Performance Badges</h3>
            <div className="space-y-8">
              <BadgeSection
                title="Positive"
                badges={performanceBadges
                  .filter((b) => b.isPositive)
                  .map((b) => ({ badge: b.badge, description: b.description }))}
                isPositive={true}
                selectedBadges={selectedBadges.positive}
                onSelectBadge={handleBadgeSelect}
              />
              <BadgeSection
                title="Negative"
                badges={performanceBadges
                  .filter((b) => !b.isPositive)
                  .map((b) => ({ badge: b.badge, description: b.description }))}
                isPositive={false}
                selectedBadges={selectedBadges.negative}
                onSelectBadge={handleBadgeSelect}
              />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="personal">
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
              Personal
            </h2>
            <p className="text-gray-300 mb-6">Character, reputation, and battle approach</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {personalAttributes.map((attr) => (
                <AttributeSlider
                  key={attr.attribute}
                  title={attr.attribute}
                  description={attr.description}
                  value={ratings[attr.attribute] || 5.0}
                  onChange={(value) => handleRatingChange(attr.attribute, value)}
                  gradientFrom="amber-500"
                  gradientTo="orange-500"
                />
              ))}
            </div>

            <h3 className="text-xl font-semibold mb-4">Personal Badges</h3>
            <div className="space-y-8">
              <BadgeSection
                title="Positive"
                badges={personalBadges
                  .filter((b) => b.isPositive)
                  .map((b) => ({ badge: b.badge, description: b.description }))}
                isPositive={true}
                selectedBadges={selectedBadges.positive}
                onSelectBadge={handleBadgeSelect}
              />
              <BadgeSection
                title="Negative"
                badges={personalBadges
                  .filter((b) => !b.isPositive)
                  .map((b) => ({ badge: b.badge, description: b.description }))}
                isPositive={false}
                selectedBadges={selectedBadges.negative}
                onSelectBadge={handleBadgeSelect}
              />
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
