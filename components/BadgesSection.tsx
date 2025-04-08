import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { CheckCircle, XCircle } from 'lucide-react'

const positiveBadges = [
  'Wordsmith', 'Crowd Control', 'Punchline King', 'Freestyle Master',
  'Storyteller', 'Multisyllabic Rhymer', 'Battle Veteran', 'Innovator'
]

const negativeBadges = [
  'Choke Artist', 'One-Dimensional', 'Predictable', 'Poor Time Management',
  'Weak Delivery', 'Recycled Material', 'Stage Fright', 'Inconsistent'
]

export default function BadgesSection() {
  const [selectedPositive, setSelectedPositive] = useState<string[]>([])
  const [selectedNegative, setSelectedNegative] = useState<string[]>([])

  const toggleBadge = (badge: string, isPositive: boolean) => {
    const currentSelected = isPositive ? selectedPositive : selectedNegative
    const setSelected = isPositive ? setSelectedPositive : setSelectedNegative

    if (currentSelected.includes(badge)) {
      setSelected(currentSelected.filter((b) => b !== badge))
    } else {
      setSelected([...currentSelected, badge])
    }
  }

  return (
    <div className="bg-slate-800 rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-4">Badges</h2>
      <div className="grid md:grid-cols-2 gap-6">
        {/* <BadgeColumn
          title="Positive Badges"
          badges={positiveBadges}
          selectedBadges={selectedPositive}
          onToggle={(badge) => toggleBadge(badge, true)}
          icon={<CheckCircle className="w-4 h-4 text-green-500" />}
        />
        <BadgeColumn
          title="Negative Badges"
          badges={negativeBadges}
          selectedBadges={selectedNegative}
          onToggle={(badge) => toggleBadge(badge, false)}
          icon={<XCircle className="w-4 h-4 text-red-500" />}
        /> */}
      </div>
    </div>
  )
}

// function BadgeColumn({ title, badges, selectedBadges, onToggle, icon }) {
//   return (
//     <div>
//       <h3 className="text-lg font-semibold mb-2 flex items-center">
//         {icon}
//         <span className="ml-2">{title}</span>
//         <Badge variant="secondary" className="ml-2">{selectedBadges.length}</Badge>
//       </h3>
//       <div className="grid grid-cols-2 gap-2">
//         {badges.map((badge) => (
//           <Badge
//             key={badge}
//             variant={selectedBadges.includes(badge) ? 'default' : 'outline'}
//             className="cursor-pointer"
//             onClick={() => onToggle(badge)}
//           >
//             {badge}
//           </Badge>
//         ))}
//       </div>
//     </div>
//   )
// }
function BadgeColumn(){
  return (
    <div>
      Hello world
    </div>
  )
}

