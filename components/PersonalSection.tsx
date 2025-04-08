"use client"

import { useState } from "react"
import AttributeSlider from "./AttributeSlider"
import BadgeSection from "./BadgeSection"

export default function PersonalSection() {
  const [authenticity, setAuthenticity] = useState(5)
  const [preparation, setPreparation] = useState(5)
  const [adaptability, setAdaptability] = useState(5)

  const positiveBadges = ["Battle IQ", "Respectable", "Consistent", "Growth"]
  const negativeBadges = ["Predictable", "Disrespectful", "Inconsistent", "Reputation Carrier"]

  return (
    <section className="mb-12">
      <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
        Personal
      </h2>
      <p className="text-gray-300 mb-6">Character, reputation, and battle approach</p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <AttributeSlider
          title="Authenticity"
          description="Genuineness and believability of content"
          tooltipContent="The perceived sincerity and truthfulness in performance"
          value={authenticity}
          onChange={setAuthenticity}
          gradientFrom="amber-500"
          gradientTo="orange-500"
        />
        <AttributeSlider
          title="Preparation"
          description="Research and battle-specific content"
          tooltipContent="The level of preparation and tailored material for each battle"
          value={preparation}
          onChange={setPreparation}
          gradientFrom="amber-500"
          gradientTo="orange-500"
        />
        <AttributeSlider
          title="Adaptability"
          description="Ability to adjust to opponent and circumstances"
          tooltipContent="Flexibility in approach and responsiveness to the battle situation"
          value={adaptability}
          onChange={setAdaptability}
          gradientFrom="amber-500"
          gradientTo="orange-500"
        />
      </div>
      <h3 className="text-xl font-semibold mb-4">Personal Badges</h3>
      <div className="flex flex-col md:flex-row gap-8">
        <BadgeSection title="Positive" badges={positiveBadges} isPositive={true} />
        <BadgeSection title="Negative" badges={negativeBadges} isPositive={false} />
      </div>
    </section>
  )
}

