import Image from 'next/image'
import { MapPin } from 'lucide-react'

export default function SelectedBattler() {
  // This would be dynamic in a real application
  const selectedBattler = {
    name: 'MC Blaze',
    hometown: 'New York City',
    image: '/placeholder.svg',
    totalPoints: 1250,
  }

  return (
    <div className="bg-slate-800 rounded-lg p-6 mb-8 flex flex-col md:flex-row items-center md:items-start gap-6">
      <Image
        src={selectedBattler.image || "/placeholder.svg"}
        alt={selectedBattler.name}
        width={200}
        height={200}
        className="rounded-full border-4 border-purple-500"
      />
      <div className="text-center md:text-left">
        <h2 className="text-3xl font-bold mb-2">{selectedBattler.name}</h2>
        <p className="text-slate-400 flex items-center justify-center md:justify-start mb-4">
          <MapPin className="w-4 h-4 mr-1" />
          {selectedBattler.hometown}
        </p>
        <div className="bg-slate-700 rounded-lg p-4 inline-block">
          <p className="text-sm text-slate-400 mb-1">Total Points</p>
          <p className="text-4xl font-bold text-purple-500">{selectedBattler.totalPoints}</p>
        </div>
      </div>
    </div>
  )
}

