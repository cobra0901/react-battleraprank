"use client"

import { useState } from "react"
import AttributeSlider from "./AttributeSlider"
import BadgeSection from "./BadgeSection"

export default function PerformanceSection() {
  const [delivery, setDelivery] = useState(5)
  const [stagePresence, setStagePresence] = useState(5)
  const [crowdControl, setCrowdControl] = useState(5)
  const [showmanship, setShowmanship] = useState(5)

  const positiveBadges = ["Charismatic", "Energetic", "Crowd Favorite", "Voice Control"]
  const negativeBadges = ["Chokes", "Monotone", "Low Energy", "Stage Fright"]

  return (
    <section className="mb-12">
      <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-cyan-500 bg-clip-text text-transparent">
        Performance
      </h2>
      <p className="text-gray-300 mb-6">Delivery, cadence, and stage presence</p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <AttributeSlider
          title="Delivery"
          description="Clarity, timing, and emphasis in speech"
          tooltipContent="The effectiveness of vocal delivery and articulation"
          value={delivery}
          onChange={setDelivery}
          gradientFrom="blue-500"
          gradientTo="cyan-500"
        />
        <AttributeSlider
          title="Stage Presence"
          description="Commanding attention and energy on stage"
          tooltipContent="The ability to captivate and engage the audience"
          value={stagePresence}
          onChange={setStagePresence}
          gradientFrom="blue-500"
          gradientTo="cyan-500"
        />
        <AttributeSlider
          title="Crowd Control"
          description="Ability to engage and manipulate audience reactions"
          tooltipContent="Skill in eliciting and managing audience responses"
          value={crowdControl}
          onChange={setCrowdControl}
          gradientFrom="blue-500"
          gradientTo="cyan-500"
        />
        <AttributeSlider
          title="Showmanship"
          description="Entertainment value and performance artistry"
          tooltipContent="The overall entertainment factor and artistic presentation"
          value={showmanship}
          onChange={setShowmanship}
          gradientFrom="blue-500"
          gradientTo="cyan-500"
        />
      </div>
      <h3 className="text-xl font-semibold mb-4">Performance Badges</h3>
      <div className="flex flex-col md:flex-row gap-8">
        <BadgeSection title="Positive" badges={positiveBadges} isPositive={true} />
        <BadgeSection title="Negative" badges={negativeBadges} isPositive={false} />
      </div>
    </section>
  )
}

