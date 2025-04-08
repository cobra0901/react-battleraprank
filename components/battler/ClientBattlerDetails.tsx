"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import AttributesTab from "@/components/battler/AttributesTab"
import AnalyticsTab from "@/components/battler/AnalyticsTab"

// Type for battler data
interface Battler {
  id: string
  name: string
  alias?: string
  bio?: string
  avatar_url?: string
  social_links?: any
  stats?: any
  created_at?: string
  updated_at?: string
}

interface ClientBattlerDetailsProps {
  battler: Battler
}

export default function ClientBattlerDetails({ battler }: ClientBattlerDetailsProps) {
  return (
    <Tabs defaultValue="attributes" className="mt-8">
      <TabsList className="w-full border-b rounded-none justify-start mb-4 bg-transparent">
        <TabsTrigger value="attributes" className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary">
          Attributes
        </TabsTrigger>
        <TabsTrigger value="analytics" className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary">
          Analytics
        </TabsTrigger>
        <TabsTrigger value="battles" className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary">
          Battles
        </TabsTrigger>
      </TabsList>
      <TabsContent value="attributes">
        <AttributesTab battlerId={battler.id} />
      </TabsContent>
      <TabsContent value="analytics">
        <AnalyticsTab battlerId={battler.id} />
      </TabsContent>
      <TabsContent value="battles">
        <div className="bg-gray-900/50 p-6 rounded-lg">
          <p className="text-center text-gray-400">Coming soon! Battle history will be displayed here.</p>
        </div>
      </TabsContent>
    </Tabs>
  )
}
