"use client"

import type React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Mic, Video, Users, Award, Info, Badge } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import type { UserRoles } from "@/types/auth-types"

interface RoleSelectorProps {
  roles: UserRoles
  onChange: (roles: UserRoles) => void
}

export default function RoleSelector({ roles, onChange }: RoleSelectorProps) {
  const handleRoleChange = (role: keyof UserRoles) => {
    onChange({
      ...roles,
      [role]: !roles[role],
    })
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Select Your Role(s)</h3>
      <p className="text-sm text-gray-400 mb-4">Choose all that apply. You can update these later in your profile.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <RoleCard
          title="Fan"
          description="Battle rap enthusiast and viewer"
          icon={<Users className="h-5 w-5 text-blue-400" />}
          checked={roles.fan}
          onChange={() => handleRoleChange("fan")}
          color="blue"
          isDefault
          badge={false}
        />

        <RoleCard
          title="Media"
          description="Journalist, blogger, or content creator"
          icon={<Video className="h-5 w-5 text-purple-400" />}
          checked={roles.media}
          onChange={() => handleRoleChange("media")}
          color="purple"
          requiresVerification
          badge={true}
        />

        <RoleCard
          title="Battler"
          description="Active battle rapper"
          icon={<Mic className="h-5 w-5 text-green-400" />}
          checked={roles.battler}
          onChange={() => handleRoleChange("battler")}
          color="green"
          requiresVerification
          badge={true}
        />

        <RoleCard
          title="League Owner"
          description="Owner or operator of a battle rap league"
          icon={<Award className="h-5 w-5 text-red-400" />}
          checked={roles.league_owner}
          onChange={() => handleRoleChange("league_owner")}
          color="red"
          requiresVerification
          badge={true}
        />
      </div>
    </div>
  )
}

interface RoleCardProps {
  title: string
  description: string
  icon: React.ReactNode
  checked: boolean
  onChange: () => void
  color: string
  isDefault?: boolean
  requiresVerification?: boolean
  badge?: boolean
}

function RoleCard({
  title,
  description,
  icon,
  checked,
  onChange,
  color,
  isDefault,
  requiresVerification,
  badge,
}: RoleCardProps) {
  // Create a handler function for the card click to prevent multiple onChange calls
  const handleCardClick = (e: React.MouseEvent) => {
    // Prevent calling onChange if the click was on the checkbox (which has its own handler)
    if (!(e.target instanceof HTMLInputElement)) {
      onChange();
    }
  };
  
  return (
    <Card
      className={`border ${checked ? `border-${color}-500 bg-${color}-900/20` : "border-gray-800"} 
        hover:border-${color}-500/70 transition-colors cursor-pointer`}
      onClick={handleCardClick}
    >
      <CardContent className="p-4">
        <div className="flex items-start space-x-3">
          <Checkbox
            id={`role-${title.toLowerCase()}`}
            checked={checked}
            // Don't use the onCheckedChange handler as it's causing the infinite loop
            // The card click will handle the role change
            className={`mt-1 data-[state=checked]:bg-${color}-500 data-[state=checked]:border-${color}-500`}
          />
          <div className="flex-1">
            <div className="flex items-center">
              <Label
                htmlFor={`role-${title.toLowerCase()}`}
                className="text-base font-medium cursor-pointer flex items-center"
              >
                {icon}
                <span className="ml-2">{title}</span>
                {isDefault && (
                  <span className="ml-2 text-xs bg-blue-900/50 text-blue-300 px-2 py-0.5 rounded-full">Default</span>
                )}
                {badge && (
                  <span className="ml-2 text-xs bg-yellow-900/50 text-yellow-300 px-2 py-0.5 rounded-full flex items-center">
                    <Badge className="h-3 w-3 mr-1" />
                    Badge
                  </span>
                )}
                {requiresVerification && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="h-4 w-4 ml-2 text-gray-400" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="text-xs">Requires verification by admins</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
              </Label>
            </div>
            <p className="text-sm text-gray-400 mt-1">{description}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
