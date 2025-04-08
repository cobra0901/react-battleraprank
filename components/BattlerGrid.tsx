import Image from 'next/image'

const battlers = [
  { id: 1, name: 'MC Blaze', image: '/placeholder.svg' },
  { id: 2, name: 'Lyrical Genius', image: '/placeholder.svg' },
  { id: 3, name: 'Flow Master', image: '/placeholder.svg' },
  // Add more battlers as needed
]

export default function BattlerGrid() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8">
      {battlers.map((battler) => (
        <div
          key={battler.id}
          className="bg-slate-800 rounded-lg p-2 hover:ring-2 hover:ring-purple-500 transition-all cursor-pointer"
        >
          <Image
            src={battler.image || "/placeholder.svg"}
            alt={battler.name}
            width={100}
            height={100}
            className="w-full aspect-square object-cover rounded-md mb-2"
          />
          <p className="text-center text-sm font-medium truncate">{battler.name}</p>
        </div>
      ))}
    </div>
  )
}

