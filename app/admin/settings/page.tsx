"use client"
export const dynamic = "force-dynamic";
import type React from "react"
import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Save } from "lucide-react"

export default function SettingsPage() {
  const [generalSettings, setGeneralSettings] = useState({
    siteName: "Battle Rap Algorithm",
    siteDescription: "Rate and analyze battle rap performances",
    enableRegistration: true,
    requireEmailVerification: true,
    maxRatingsPerDay: 10,
  })

  const [emailSettings, setEmailSettings] = useState({
    smtpServer: "smtp.example.com",
    smtpPort: "587",
    smtpUsername: "notifications@example.com",
    smtpPassword: "••••••••••••",
    fromEmail: "notifications@example.com",
    fromName: "Battle Rap Algorithm",
  })

  const [apiSettings, setApiSettings] = useState({
    enableApi: true,
    rateLimit: 100,
    apiKey: "sk_live_••••••••••••••••••••••••••••••",
  })

  const handleGeneralChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setGeneralSettings((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setEmailSettings((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleApiChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setApiSettings((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  const handleSaveSettings = () => {
    // In a real app, this would save to a database
    console.log("Saving settings...")
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Settings</h1>
        <Button onClick={handleSaveSettings}>
          <Save className="w-4 h-4 mr-2" />
          Save Changes
        </Button>
      </div>

      <Tabs defaultValue="general">
        <TabsList className="mb-6 bg-gray-900 border border-gray-800">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="email">Email</TabsTrigger>
          <TabsTrigger value="api">API</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>Configure basic application settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="siteName">Site Name</Label>
                  <Input
                    id="siteName"
                    name="siteName"
                    value={generalSettings.siteName}
                    onChange={handleGeneralChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="siteDescription">Site Description</Label>
                  <Input
                    id="siteDescription"
                    name="siteDescription"
                    value={generalSettings.siteDescription}
                    onChange={handleGeneralChange}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">User Registration</h3>
                <div className="flex items-center justify-between">
                  <Label htmlFor="enableRegistration">Enable User Registration</Label>
                  <Switch
                    id="enableRegistration"
                    name="enableRegistration"
                    checked={generalSettings.enableRegistration}
                    onCheckedChange={(checked) =>
                      setGeneralSettings((prev) => ({ ...prev, enableRegistration: checked }))
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="requireEmailVerification">Require Email Verification</Label>
                  <Switch
                    id="requireEmailVerification"
                    name="requireEmailVerification"
                    checked={generalSettings.requireEmailVerification}
                    onCheckedChange={(checked) =>
                      setGeneralSettings((prev) => ({ ...prev, requireEmailVerification: checked }))
                    }
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="maxRatingsPerDay">Maximum Ratings Per Day</Label>
                <Input
                  id="maxRatingsPerDay"
                  name="maxRatingsPerDay"
                  type="number"
                  min="1"
                  value={generalSettings.maxRatingsPerDay}
                  onChange={handleGeneralChange}
                />
                <p className="text-sm text-gray-400">
                  Limit the number of ratings a user can submit per day (0 for unlimited)
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="email">
          <Card>
            <CardHeader>
              <CardTitle>Email Settings</CardTitle>
              <CardDescription>Configure email notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="smtpServer">SMTP Server</Label>
                  <Input
                    id="smtpServer"
                    name="smtpServer"
                    value={emailSettings.smtpServer}
                    onChange={handleEmailChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="smtpPort">SMTP Port</Label>
                  <Input id="smtpPort" name="smtpPort" value={emailSettings.smtpPort} onChange={handleEmailChange} />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="smtpUsername">SMTP Username</Label>
                  <Input
                    id="smtpUsername"
                    name="smtpUsername"
                    value={emailSettings.smtpUsername}
                    onChange={handleEmailChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="smtpPassword">SMTP Password</Label>
                  <Input
                    id="smtpPassword"
                    name="smtpPassword"
                    type="password"
                    value={emailSettings.smtpPassword}
                    onChange={handleEmailChange}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="fromEmail">From Email</Label>
                  <Input id="fromEmail" name="fromEmail" value={emailSettings.fromEmail} onChange={handleEmailChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fromName">From Name</Label>
                  <Input id="fromName" name="fromName" value={emailSettings.fromName} onChange={handleEmailChange} />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="api">
          <Card>
            <CardHeader>
              <CardTitle>API Settings</CardTitle>
              <CardDescription>Configure API access and rate limits</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <Label htmlFor="enableApi">Enable API</Label>
                <Switch
                  id="enableApi"
                  name="enableApi"
                  checked={apiSettings.enableApi}
                  onCheckedChange={(checked) => setApiSettings((prev) => ({ ...prev, enableApi: checked }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="rateLimit">API Rate Limit (requests per hour)</Label>
                <Input
                  id="rateLimit"
                  name="rateLimit"
                  type="number"
                  min="1"
                  value={apiSettings.rateLimit}
                  onChange={handleApiChange}
                />
                <p className="text-sm text-gray-400">Limit the number of API requests per hour per API key</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="apiKey">API Key</Label>
                <div className="flex gap-2">
                  <Input
                    id="apiKey"
                    name="apiKey"
                    value={apiSettings.apiKey}
                    onChange={handleApiChange}
                    className="flex-1"
                  />
                  <Button variant="outline">Regenerate</Button>
                </div>
                <p className="text-sm text-gray-400">Use this key to authenticate API requests</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

