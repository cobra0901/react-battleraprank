"use client"

import Link from "next/link"
import Image from "next/image"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"
import BattlersList from "@/components/battler/BattlersList"
import ClientQuickFilterWrapper from "@/components/battler/ClientQuickFilterWrapper"
import CreateBattlerButton from "@/components/battler/CreateBattlerButton"
import { supabase } from "@/lib/supabase"

export default function BattlersPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">All Battlers</h1>
        <CreateBattlerButton />
      </div>
      
      {/* Add the QuickFilterBar component wrapped in a client component */}
      <div className="mb-6">
        <ClientQuickFilterWrapper />
      </div>
      
      {/* BattlersList is now a client component with its own loading state */}
      <BattlersList />
    </div>
  )
}
