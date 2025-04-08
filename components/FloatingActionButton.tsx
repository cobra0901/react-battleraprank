"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Plus, X, Star, Search, MessageSquare } from "lucide-react"
import Link from "next/link"
import { useMediaQuery } from "@/hooks/use-mobile"

export default function FloatingActionButton() {
  const [isOpen, setIsOpen] = useState(false)
  const isMobile = useMediaQuery("(max-width: 768px)")

  if (!isMobile) return null

  const actions = [
    { icon: <Star className="h-5 w-5" />, label: "Rate", href: "/rate" },
    { icon: <Search className="h-5 w-5" />, label: "Search", href: "/search" },
    { icon: <MessageSquare className="h-5 w-5" />, label: "Discuss", href: "/discuss" },
  ]

  return (
    <div className="fixed right-4 bottom-20 z-40">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="flex flex-col-reverse gap-3 mb-3"
          >
            {actions.map((action, index) => (
              <motion.div
                key={action.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="flex items-center gap-2"
              >
                <Link
                  href={action.href}
                  className="flex items-center justify-center h-12 w-12 rounded-full bg-amber-600 text-white shadow-lg hover:bg-amber-700 transition-colors"
                >
                  {action.icon}
                </Link>
                <span className="bg-gray-900 text-white text-sm py-1 px-3 rounded-full shadow-lg">{action.label}</span>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        className={`h-14 w-14 rounded-full shadow-lg flex items-center justify-center ${
          isOpen ? "bg-gray-700" : "bg-amber-600"
        }`}
        onClick={() => setIsOpen(!isOpen)}
        whileTap={{ scale: 0.95 }}
      >
        <motion.div animate={{ rotate: isOpen ? 45 : 0 }} transition={{ duration: 0.2 }}>
          {isOpen ? <X className="h-6 w-6 text-white" /> : <Plus className="h-6 w-6 text-white" />}
        </motion.div>
      </motion.button>
    </div>
  )
}

