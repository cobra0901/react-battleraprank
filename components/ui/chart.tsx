"use client"

import type React from "react"
import { useEffect, useRef } from "react"
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer as RechartsResponsiveContainer,
  LineChart as RechartsLineChart,
  Line,
} from "recharts"

export { Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Line }

// Custom wrapper to handle ResizeObserver errors
const ChartContainer = ({ children, ...props }: React.ComponentProps<typeof RechartsResponsiveContainer>) => {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // This helps prevent the ResizeObserver loop error
    const handleError = (event: ErrorEvent) => {
      if (event.message.includes("ResizeObserver loop")) {
        // Prevent the error from being logged to console
        event.stopImmediatePropagation()
      }
    }

    window.addEventListener("error", handleError as EventListener)
    return () => window.removeEventListener("error", handleError as EventListener)
  }, [])

  return (
    <div ref={containerRef} style={{ width: "100%", height: "100%" }}>
      <RechartsResponsiveContainer {...props}>{children}</RechartsResponsiveContainer>
    </div>
  )
}

export { ChartContainer, ChartContainer as ResponsiveContainer }

export const BarChart = ({ children, ...props }: any) => {
  return <RechartsBarChart {...props}>{children}</RechartsBarChart>
}

export const LineChart = ({ children, ...props }: any) => {
  return <RechartsLineChart {...props}>{children}</RechartsLineChart>
}

// Add ChartTooltip and ChartTooltipContent components
export const ChartTooltip = ({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div className="absolute pointer-events-none rounded-md border bg-background p-2 shadow-md" {...props}>
      {children}
    </div>
  )
}

export const ChartTooltipContent = ({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div className="text-xs" {...props}>
      {children}
    </div>
  )
}

