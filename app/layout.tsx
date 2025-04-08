import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import Header from "@/components/Header"
import MobileToolbar from "@/components/MobileToolbar"
import FloatingActionButton from "@/components/FloatingActionButton"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/contexts/auth-context"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Battle Rap Algorithm",
  description: "Rate and analyze battle rap performances",
  generator: 'v0dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} bg-gray-950 text-white min-h-screen pb-16 md:pb-0`}>
        <AuthProvider>
          <ThemeProvider attribute="class" defaultTheme="dark">
            <Header />
            <main className="pt-16">{children}</main>
            <MobileToolbar />
            <FloatingActionButton />
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  )
}