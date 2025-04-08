"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Shield, Eye, EyeOff, History } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { updateUserPrivacySettings } from "@/lib/user-service"

interface PrivacySettingsProps {
  userId: string
  initialSettings?: UserPrivacySettings
}

export interface UserPrivacySettings {
  visibilityLevel: "low" | "medium" | "high"
  showEmail: boolean
  showRatings: boolean
  showBadges: boolean
  showHistoricalData: boolean
}

const defaultSettings: UserPrivacySettings = {
  visibilityLevel: "medium",
  showEmail: false,
  showRatings: true,
  showBadges: true,
  showHistoricalData: false,
}

export default function PrivacySettings({ userId, initialSettings }: PrivacySettingsProps) {
  const { toast } = useToast()
  const [settings, setSettings] = useState<UserPrivacySettings>(initialSettings || defaultSettings)
  const [isSaving, setIsSaving] = useState(false)

  const handleVisibilityChange = (value: "low" | "medium" | "high") => {
    let newSettings: UserPrivacySettings = {
      ...settings,
      visibilityLevel: value,
    }

    // Automatically adjust other settings based on visibility level
    if (value === "low") {
      newSettings = {
        ...newSettings,
        showRatings: false,
        showBadges: true,
        showHistoricalData: false,
      }
    } else if (value === "medium") {
      newSettings = {
        ...newSettings,
        showRatings: true,
        showBadges: true,
        showHistoricalData: false,
      }
    } else if (value === "high") {
      newSettings = {
        ...newSettings,
        showRatings: true,
        showBadges: true,
        showHistoricalData: true,
      }
    }

    setSettings(newSettings)
  }

  const handleToggleChange = (field: keyof UserPrivacySettings) => {
    setSettings((prev) => ({
      ...prev,
      [field]: !prev[field as keyof UserPrivacySettings],
    }))
  }

  const handleSaveSettings = async () => {
    setIsSaving(true)
    try {
      await updateUserPrivacySettings(userId, settings)
      toast({
        title: "Settings saved",
        description: "Your privacy settings have been updated successfully.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save privacy settings. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Privacy Settings
        </CardTitle>
        <CardDescription>Control who can see your profile information and activity</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Profile Visibility</h3>
          <RadioGroup
            value={settings.visibilityLevel}
            onValueChange={(value) => handleVisibilityChange(value as "low" | "medium" | "high")}
            className="space-y-3"
          >
            <div className="flex items-start space-x-3 rounded-md border border-gray-800 p-3">
              <RadioGroupItem value="low" id="visibility-low" className="mt-1" />
              <div className="space-y-1">
                <Label htmlFor="visibility-low" className="font-medium">
                  <div className="flex items-center gap-2">
                    <EyeOff className="h-4 w-4" />
                    Low Visibility
                  </div>
                </Label>
                <p className="text-sm text-gray-400">
                  Only show basic profile information. Ratings and historical data are hidden.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3 rounded-md border border-gray-800 p-3">
              <RadioGroupItem value="medium" id="visibility-medium" className="mt-1" />
              <div className="space-y-1">
                <Label htmlFor="visibility-medium" className="font-medium">
                  <div className="flex items-center gap-2">
                    <Eye className="h-4 w-4" />
                    Medium Visibility
                  </div>
                </Label>
                <p className="text-sm text-gray-400">
                  Show profile information, current ratings and badges. Historical data remains private.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3 rounded-md border border-gray-800 p-3">
              <RadioGroupItem value="high" id="visibility-high" className="mt-1" />
              <div className="space-y-1">
                <Label htmlFor="visibility-high" className="font-medium">
                  <div className="flex items-center gap-2">
                    <History className="h-4 w-4" />
                    High Visibility
                  </div>
                </Label>
                <p className="text-sm text-gray-400">
                  Full transparency. Show all profile information, ratings, badges, and historical data.
                </p>
              </div>
            </div>
          </RadioGroup>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Detailed Settings</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between rounded-md border border-gray-800 p-3">
              <div className="space-y-0.5">
                <Label className="font-medium">Show Email Address</Label>
                <p className="text-sm text-gray-400">Allow others to see your email address</p>
              </div>
              <Switch
                checked={settings.showEmail}
                onCheckedChange={() => handleToggleChange("showEmail")}
                disabled={settings.visibilityLevel === "low"}
              />
            </div>

            <div className="flex items-center justify-between rounded-md border border-gray-800 p-3">
              <div className="space-y-0.5">
                <Label className="font-medium">Show Ratings</Label>
                <p className="text-sm text-gray-400">Allow others to see your ratings</p>
              </div>
              <Switch
                checked={settings.showRatings}
                onCheckedChange={() => handleToggleChange("showRatings")}
                disabled={settings.visibilityLevel === "low" || settings.visibilityLevel === "high"}
              />
            </div>

            <div className="flex items-center justify-between rounded-md border border-gray-800 p-3">
              <div className="space-y-0.5">
                <Label className="font-medium">Show Badges</Label>
                <p className="text-sm text-gray-400">Allow others to see your badges</p>
              </div>
              <Switch
                checked={settings.showBadges}
                onCheckedChange={() => handleToggleChange("showBadges")}
                disabled={settings.visibilityLevel === "high"}
              />
            </div>

            <div className="flex items-center justify-between rounded-md border border-gray-800 p-3">
              <div className="space-y-0.5">
                <Label className="font-medium">Show Historical Data</Label>
                <p className="text-sm text-gray-400">Allow others to see your historical ratings and activity</p>
              </div>
              <Switch
                checked={settings.showHistoricalData}
                onCheckedChange={() => handleToggleChange("showHistoricalData")}
                disabled={settings.visibilityLevel !== "high"}
              />
            </div>
          </div>
        </div>

        <Button onClick={handleSaveSettings} disabled={isSaving} className="w-full">
          {isSaving ? "Saving..." : "Save Privacy Settings"}
        </Button>
      </CardContent>
    </Card>
  )
}

