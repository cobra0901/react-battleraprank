"use client"
import { Slider } from "@/components/ui/slider"
import { Info } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface AttributeSliderProps {
  title: string
  description: string
  tooltipContent: string
  value: number
  onChange: (value: number) => void
  gradientFrom: string
  gradientTo: string
}

export default function AttributeSlider({
  title,
  description,
  tooltipContent,
  value,
  onChange,
  gradientFrom,
  gradientTo,
}: AttributeSliderProps) {
  return (
    <div className="bg-gray-800 rounded-lg p-4">
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center">
          <h3 className="font-semibold mr-2">{title}</h3>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Info className="w-4 h-4 text-gray-400" />
              </TooltipTrigger>
              <TooltipContent>
                <p>{tooltipContent}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <span className="px-2 py-1 bg-gray-700 rounded-full text-sm">{value}</span>
      </div>
      <p className="text-sm text-gray-400 mb-2">{description}</p>
      <Slider
        min={0}
        max={10}
        step={1}
        value={[value]}
        onValueChange={(values) => onChange(values[0])}
        className={`w-full h-2 bg-gradient-to-r from-${gradientFrom} to-${gradientTo}`}
      />
    </div>
  )
}

