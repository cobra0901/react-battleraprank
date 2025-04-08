import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Slider } from '@/components/ui/slider'

export default function RatingSection() {
  const [lyricism, setLyricism] = useState(50)
  const [performance, setPerformance] = useState(50)
  const [presence, setPresence] = useState(50)

  return (
    <div className="bg-slate-800 rounded-lg p-6 mb-8">
      <Tabs defaultValue="attributes">
        <TabsList className="mb-4">
          <TabsTrigger value="attributes">Attributes</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>
        <TabsContent value="attributes">
          <div className="space-y-6">
            <AttributeSlider
              label="Lyricism"
              value={lyricism}
              onChange={setLyricism}
              description="Wordplay, metaphors, and overall lyrical complexity"
            />
            <AttributeSlider
              label="Performance"
              value={performance}
              onChange={setPerformance}
              description="Stage presence, delivery, and crowd interaction"
            />
            <AttributeSlider
              label="Presence"
              value={presence}
              onChange={setPresence}
              description="Overall impact and memorability of the performance"
            />
          </div>
        </TabsContent>
        <TabsContent value="analytics">
          {/* Add analytics content here */}
          <p>Analytics content coming soon...</p>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function AttributeSlider({ label, value, onChange, description }: { label: string; value: number; onChange: (value: number) => void; description: string }) {
  return (
    <div>
      <div className="flex justify-between mb-2">
        <label className="font-medium">{label}</label>
        <span className="text-sm text-slate-400">{value}</span>
      </div>
      <Slider
        min={0}
        max={100}
        step={1}
        value={[value]}
        onValueChange={(values) => onChange(values[0])}
        className="mb-2"
      />
      <p className="text-sm text-slate-400">{description}</p>
    </div>
  )
}

