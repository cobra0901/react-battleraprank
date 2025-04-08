"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import YouTubeFeature from "@/components/YouTubeFeature"
import { motion } from "framer-motion"
import { useMediaQuery } from "@/hooks/use-mobile"

export default function HeroSection() {
  const [isLoaded, setIsLoaded] = useState(false)
  const isMobile = useMediaQuery("(max-width: 768px)")

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  return (
    <section className="py-8 md:py-16">
      <div className="relative rounded-xl overflow-hidden mb-8">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/College%20Sign-qk16vXvKdAGqpDYo50e0dLG8VD7jOc.png"
            alt="Algorithm Institute of Battle Rap"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-gray-950 via-gray-950/80 to-transparent"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 p-4 md:p-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            {/* Main Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 20 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-amber-500 to-amber-300 bg-clip-text text-transparent">
                ALGORITHM INSTITUTE OF BATTLE RAP
              </h1>
              <p className="text-base sm:text-lg md:text-xl text-gray-300 mb-6 md:mb-8 max-w-xl">
                The Premier Platform for Battle Rap Analysis. Rate, analyze, and discover the metrics behind battle rap
                performances.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  asChild
                  size={isMobile ? "default" : "lg"}
                  className="bg-gradient-to-r from-amber-600 to-amber-800 hover:from-amber-700 hover:to-amber-900 text-white"
                >
                  <Link href="/battlers">
                    Start Rating <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button
                  asChild
                  size={isMobile ? "default" : "lg"}
                  className="bg-gradient-to-r from-gray-700 to-gray-900 hover:from-gray-800 hover:to-gray-950 text-white border border-amber-700/30"
                >
                  <Link href="/analytics">View Analytics</Link>
                </Button>
              </div>
            </motion.div>

            {/* YouTube Feature */}
            {!isMobile && (
              <motion.div
                className="w-full"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: isLoaded ? 1 : 0, scale: isLoaded ? 1 : 0.95 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <div className="aspect-video w-full bg-black/30 backdrop-blur-sm rounded-lg border border-gray-800">
                  <YouTubeFeature />
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* YouTube Feature for mobile - below the hero text */}
      {isMobile && (
        <motion.div
          className="w-full px-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 20 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <div className="aspect-video w-full bg-black/30 backdrop-blur-sm rounded-lg border border-gray-800">
            <YouTubeFeature />
          </div>
        </motion.div>
      )}
    </section>
  )
}

