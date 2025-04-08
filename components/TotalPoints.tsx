"use client"

import { useState, useEffect } from "react"

export default function TotalPoints() {
  const [totalPoints, setTotalPoints] = useState(0)

  // In a real application, you would calculate this based on all ratings and badges
  useEffect(() => {
    // Simulating point calculation
    const calculatedPoints = Math.floor(Math.random() * 1000)
    setTotalPoints(calculatedPoints)
  }, [])

  return (
    <div className="fixed top-16 right-4 bg-gray-800 p-4 rounded-lg shadow-lg z-50">
      <p className="text-sm text-gray-400 mb-1">Total Points</p>
      <p className="text-3xl font-bold">{totalPoints}</p>
    </div>
  )
}

