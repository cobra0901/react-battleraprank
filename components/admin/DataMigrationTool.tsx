"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { AlertCircle, Database, Trash2, Download, Upload } from "lucide-react"
import { clearMockData, exportData, importData } from "@/lib/migration-service"

export default function DataMigrationTool() {
  const [activeTab, setActiveTab] = useState("cleanup")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const [options, setOptions] = useState({
    clearBattlers: true,
    clearUsers: false,
    clearRatings: true,
    clearBadges: false,
    clearContent: true,
    preserveAdmins: true,
  })

  const handleOptionChange = (option: keyof typeof options) => {
    setOptions((prev) => ({ ...prev, [option]: !prev[option] }))
  }

  const handleClearMockData = async () => {
    setIsLoading(true)
    setError("")
    setSuccess("")

    try {
      await clearMockData(options)
      setSuccess("Mock data cleared successfully!")
      // Force a page refresh to show updated data
      window.location.reload()
    } catch (error) {
      console.error("Error clearing mock data:", error)
      setError("Failed to clear mock data. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleExportData = async () => {
    setIsLoading(true)
    setError("")
    setSuccess("")

    try {
      const data = await exportData()

      // Create a download link
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `battle-rap-export-${new Date().toISOString().split("T")[0]}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      setSuccess("Data exported successfully!")
    } catch (error) {
      console.error("Error exporting data:", error)
      setError("Failed to export data. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleImportData = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return

    setIsLoading(true)
    setError("")
    setSuccess("")

    try {
      const file = e.target.files[0]
      const reader = new FileReader()

      reader.onload = async (event) => {
        try {
          const data = JSON.parse(event.target?.result as string)
          await importData(data)
          setSuccess("Data imported successfully!")
        } catch (error) {
          console.error("Error importing data:", error)
          setError("Failed to import data. Please check the file format.")
        } finally {
          setIsLoading(false)
        }
      }

      reader.readAsText(file)
    } catch (error) {
      console.error("Error reading file:", error)
      setError("Failed to read file. Please try again.")
      setIsLoading(false)
    }
  }

  return (
    <Card className="bg-gray-900 border-gray-800">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Database className="w-5 h-5 text-blue-500 mr-2" />
          Data Migration Tool
        </CardTitle>
        <CardDescription>Manage your application data for production</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="bg-green-900/20 border-green-800 text-green-400">
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="bg-gray-800 border border-gray-700">
            <TabsTrigger value="cleanup">
              <Trash2 className="w-4 h-4 mr-2" />
              Cleanup
            </TabsTrigger>
            <TabsTrigger value="export">
              <Download className="w-4 h-4 mr-2" />
              Export
            </TabsTrigger>
            <TabsTrigger value="import">
              <Upload className="w-4 h-4 mr-2" />
              Import
            </TabsTrigger>
          </TabsList>

          <TabsContent value="cleanup" className="mt-4">
            <div className="space-y-4">
              <Alert className="bg-amber-900/20 border-amber-800 text-amber-400">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Warning: This will permanently delete mock data from the database. This action cannot be undone.
                </AlertDescription>
              </Alert>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="clearBattlers" className="cursor-pointer">
                    Clear Battlers
                  </Label>
                  <Switch
                    id="clearBattlers"
                    checked={options.clearBattlers}
                    onCheckedChange={() => handleOptionChange("clearBattlers")}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="clearUsers" className="cursor-pointer">
                    Clear Users
                  </Label>
                  <Switch
                    id="clearUsers"
                    checked={options.clearUsers}
                    onCheckedChange={() => handleOptionChange("clearUsers")}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="clearRatings" className="cursor-pointer">
                    Clear Ratings
                  </Label>
                  <Switch
                    id="clearRatings"
                    checked={options.clearRatings}
                    onCheckedChange={() => handleOptionChange("clearRatings")}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="clearBadges" className="cursor-pointer">
                    Clear Badges
                  </Label>
                  <Switch
                    id="clearBadges"
                    checked={options.clearBadges}
                    onCheckedChange={() => handleOptionChange("clearBadges")}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="clearContent" className="cursor-pointer">
                    Clear Content
                  </Label>
                  <Switch
                    id="clearContent"
                    checked={options.clearContent}
                    onCheckedChange={() => handleOptionChange("clearContent")}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="preserveAdmins" className="cursor-pointer">
                    Preserve Admin Accounts
                  </Label>
                  <Switch
                    id="preserveAdmins"
                    checked={options.preserveAdmins}
                    onCheckedChange={() => handleOptionChange("preserveAdmins")}
                  />
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="export" className="mt-4">
            <div className="space-y-4">
              <p className="text-sm text-gray-400">
                Export all data from the database to a JSON file. This can be used for backup or migration purposes.
              </p>

              <Button onClick={handleExportData} disabled={isLoading} className="w-full">
                <Download className="w-4 h-4 mr-2" />
                {isLoading ? "Exporting..." : "Export Data"}
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="import" className="mt-4">
            <div className="space-y-4">
              <Alert className="bg-amber-900/20 border-amber-800 text-amber-400">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Warning: Importing data will overwrite existing data. Make sure to backup your data first.
                </AlertDescription>
              </Alert>

              <p className="text-sm text-gray-400">
                Import data from a JSON file. The file should be in the same format as the exported data.
              </p>

              <Label htmlFor="importFile" className="cursor-pointer">
                <div className="flex items-center justify-center w-full h-32 border-2 border-dashed border-gray-700 rounded-lg hover:border-gray-500 transition-colors">
                  <div className="flex flex-col items-center">
                    <Upload className="w-8 h-8 text-gray-400 mb-2" />
                    <p className="text-sm text-gray-400">Click to select a file or drag and drop</p>
                  </div>
                </div>
                <input
                  id="importFile"
                  type="file"
                  accept=".json"
                  className="hidden"
                  onChange={handleImportData}
                  disabled={isLoading}
                />
              </Label>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter>
        {activeTab === "cleanup" && (
          <Button variant="destructive" onClick={handleClearMockData} disabled={isLoading} className="w-full">
            <Trash2 className="w-4 h-4 mr-2" />
            {isLoading ? "Clearing..." : "Clear Mock Data"}
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}
