"use client"

import { useState } from "react"
import AttributeSlider from "./AttributeSlider"
import BadgeSection from "./BadgeSection"

export default function LyricismSection() {
  const [wordPlay, setWordPlay] = useState(5)
  const [writingAbility, setWritingAbility] = useState(5)
  const [rhymeComplexity, setRhymeComplexity] = useState(5)

  const positiveBadges = ["Wordsmith", "Pen Game", "Scheme King/Queen", "Unpredictable"]
  const negativeBadges = ["Basic Bars", "Recycler", "One-Dimensional", "Overhyped"]

  return (
    <section className="mb-12">
      <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent">
        Lyricism
      </h2>
      <p className="text-gray-300 mb-6">Ability to write impactful and complex rhymes</p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <AttributeSlider
          title="Word Play"
          description="Cleverness using language"
          tooltipContent="The ability to manipulate words and phrases for clever or humorous effect"
          value={wordPlay}
          onChange={setWordPlay}
          gradientFrom="red-500"
          gradientTo="green-500"
        />
        <AttributeSlider
          title="Writing Ability"
          description="Crafting coherent verses and schemes"
          tooltipContent="Skill in constructing well-structured and impactful verses"
          value={writingAbility}
          onChange={setWritingAbility}
          gradientFrom="red-500"
          gradientTo="green-500"
        />
        <AttributeSlider
          title="Rhyme Complexity"
          description="Intricacy of rhyme patterns and structure"
          tooltipContent="The sophistication and variety of rhyme schemes employed"
          value={rhymeComplexity}
          onChange={setRhymeComplexity}
          gradientFrom="red-500"
          gradientTo="green-500"
        />
      </div>
      <h3 className="text-xl font-semibold mb-4">Writing & Rapping Badges</h3>
      <div className="flex flex-col md:flex-row gap-8">
        <BadgeSection title="Positive" badges={positiveBadges} isPositive={true} />
        <BadgeSection title="Negative" badges={negativeBadges} isPositive={false} />
      </div>
    </section>
  )
}

