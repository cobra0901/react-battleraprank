"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import { Home, Users, Menu, Search, Trophy } from "lucide-react"

export default function MobileToolbar() {
  const pathname = usePathname()
  const [isVisible, setIsVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)

  // Hide toolbar when scrolling down, show when scrolling up
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY

      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false)
      } else {
        setIsVisible(true)
      }

      setLastScrollY(currentScrollY)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [lastScrollY])

  const isActive = (path: string) => {
    if (path === "/" && pathname !== "/") {
      return false
    }
    return pathname.startsWith(path)
  }

  const navItems = [
    { href: "/", label: "Home", icon: <Home className="w-5 h-5" /> },
    { href: "/battlers", label: "Battlers", icon: <Users className="w-5 h-5" /> },
    { href: "/search", label: "Search", icon: <Search className="w-5 h-5" /> },
    { href: "/leaderboard", label: "Leaders", icon: <Trophy className="w-5 h-5" /> },
    { href: "/menu", label: "Menu", icon: <Menu className="w-5 h-5" /> },
  ]

  return (
    <motion.div
      className="fixed bottom-0 left-0 right-0 z-50 md:hidden"
      initial={{ y: 0 }}
      animate={{ y: isVisible ? 0 : 100 }}
      transition={{ duration: 0.3 }}
    >
      <div className="bg-gray-900/90 backdrop-blur-md border-t border-gray-800 px-2 py-3">
        <div className="flex justify-around items-center">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href === "/menu" ? "#" : item.href}
              prefetch={item.href !== "/menu"}
              onClick={
                item.href === "/menu" ? () => document.getElementById("mobile-menu-trigger")?.click() : undefined
              }
              className={`flex flex-col items-center justify-center px-2 py-1 rounded-lg ${
                isActive(item.href) ? "text-amber-400" : "text-gray-400 hover:text-gray-200"
              }`}
            >
              {item.icon}
              <span className="text-xs mt-1">{item.label}</span>
              {isActive(item.href) && (
                <motion.div
                  layoutId="bottomNavIndicator"
                  className="absolute bottom-1 h-1 w-10 bg-amber-500 rounded-full"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
            </Link>
          ))}
        </div>
      </div>
    </motion.div>
  )
}
