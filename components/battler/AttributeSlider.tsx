"use client"
import { Slider } from "@/components/ui/slider"
import { Info } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface AttributeSliderProps {
  title: string
  description: string
  value: number
  onChange: (value: number) => void
  gradientFrom: string
  gradientTo: string
}

export default function AttributeSlider({
  title,
  description,
  value,
  onChange,
  gradientFrom,
  gradientTo,
}: AttributeSliderProps) {
  // Get color based on value
  const getColor = () => {
    if (value < 3) return "text-red-500"
    if (value < 5) return "text-orange-500"
    if (value < 7) return "text-yellow-500"
    if (value < 9) return "text-green-500"
    return "text-emerald-500"
  }

  return (
    <div className="bg-gray-900 rounded-lg p-4 border border-gray-800">
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center">
          <h3 className="font-semibold mr-2">{title}</h3>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Info className="w-4 h-4 text-gray-400" />
              </TooltipTrigger>
              <TooltipContent>
                <p>{description}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <span className={`px-2 py-1 bg-gray-800 rounded-full text-sm font-medium ${getColor()}`}>
          {value.toFixed(1)}
        </span>
      </div>
      <p className="text-sm text-gray-400 mb-3">{description}</p>
      <Slider
        min={0}
        max={10}
        step={0.1}
        value={[value]}
        onValueChange={(values) => onChange(values[0])}
        className="w-full"
      />
    </div>
  )
}

