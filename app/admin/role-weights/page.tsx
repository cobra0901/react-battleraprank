"use client"
export const dynamic = "force-dynamic";
import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { getRoleWeights, updateRoleWeight, resetRoleWeightsToDefault } from "@/lib/role-weight-service"
import { AlertCircle, Save, RefreshCw } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import type { RoleWeight } from "@/types/auth-types"

export default function RoleWeightsPage() {
  const [roleWeights, setRoleWeights] = useState<RoleWeight[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isResetting, setIsResetting] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  // useEffect(() => {
  //   const fetchWeights = async () => {
  //     const weights = await getRoleWeights()
  //     const roleWeightsArray = Object.entries(weights).map(([role, weight]) => ({
  //       role: role as string, // Replace 'string' with the correct type if available
  //       weight,
  //       displayName: role, // Replace with actual display name if available
  //       color: "gray", // Replace with actual color if available
  //       description: "", // Replace with actual description if available
  //     }))
  //     setRoleWeights(roleWeightsArray)
  //     setIsLoading(false)
  //   }

  //   fetchWeights()
  // }, [])

  const handleWeightChange = (role: string, value: number) => {
    setRoleWeights((prev) => prev.map((rw) => (rw.role === role ? { ...rw, weight: value } : rw)))
  }

  const handleSave = async () => {
    setIsSaving(true)
    setMessage(null)

    try {
      // Save each weight
      const promises = roleWeights.map((rw) => updateRoleWeight(rw.role, rw.weight))

      const results = await Promise.all(promises)
      const hasError = results.some((r) => !r.success)

      if (hasError) {
        setMessage({
          type: "error",
          text: "There was an error saving some weights. Please try again.",
        })
      } else {
        setMessage({
          type: "success",
          text: "Role weights saved successfully!",
        })
      }
    } catch (error) {
      setMessage({
        type: "error",
        text: "An unexpected error occurred. Please try again.",
      })
    } finally {
      setIsSaving(false)
    }
  }

  // const handleReset = async () => {
  //   setIsResetting(true)
  //   setMessage(null)

  //   try {
  //     const { success, error } = await resetRoleWeightsToDefault()

  //     if (success) {
  //       const weights = await getRoleWeights()
  //       setRoleWeights(weights)
  //       setMessage({
  //         type: "success",
  //         text: "Role weights reset to default values.",
  //       })
  //     } else {
  //       setMessage({
  //         type: "error",
  //         text: "Failed to reset weights. Please try again.",
  //       })
  //     }
  //   } catch (error) {
  //     setMessage({
  //       type: "error",
  //       text: "An unexpected error occurred. Please try again.",
  //     })
  //   } finally {
  //     setIsResetting(false)
  //   }
  // }

  if (isLoading) {
    return (
      <div className="p-8">
        <h1 className="text-3xl font-bold mb-8">Role Weights</h1>
        <Card>
          <CardContent className="p-8 flex justify-center">
            <p>Loading role weights...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Role Weights</h1>
        <div className="flex gap-4">
          <Button variant="outline" disabled={isSaving || isResetting}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Reset to Default
          </Button>
          <Button onClick={handleSave} disabled={isSaving || isResetting}>
            <Save className="w-4 h-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </div>

      {message && (
        <Alert
          className={`mb-6 ${message.type === "success" ? "bg-green-900/20 border-green-800" : "bg-red-900/20 border-red-800"}`}
        >
          <AlertCircle className={`h-4 w-4 ${message.type === "success" ? "text-green-400" : "text-red-400"}`} />
          <AlertTitle className={message.type === "success" ? "text-green-400" : "text-red-400"}>
            {message.type === "success" ? "Success" : "Error"}
          </AlertTitle>
          <AlertDescription className={message.type === "success" ? "text-green-300" : "text-red-300"}>
            {message.text}
          </AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Manage Role Weights</CardTitle>
          <CardDescription>
            Adjust the weight of each role to control how much influence their ratings have on the overall score. Higher
            weights give more influence to ratings from users with that role.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {roleWeights.map((roleWeight) => (
            <div key={roleWeight.role} className="space-y-2">
              <div className="flex justify-between items-center">
                <Label className="flex items-center">
                  <div className={`w-3 h-3 rounded-full mr-2 bg-${roleWeight.color}-500`}></div>
                  {roleWeight.displayName}
                </Label>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    min="0.1"
                    max="10"
                    step="0.1"
                    value={roleWeight.weight}
                    onChange={(e) => handleWeightChange(roleWeight.role, Number.parseFloat(e.target.value))}
                    className="w-20"
                  />
                  <span className="text-sm text-gray-400">× weight</span>
                </div>
              </div>
              <Slider
                min={0.1}
                max={5}
                step={0.1}
                value={[roleWeight.weight]}
                onValueChange={(values) => handleWeightChange(roleWeight.role, values[0])}
                className={`bg-gradient-to-r from-gray-700 to-${roleWeight.color}-500`}
              />
              <p className="text-sm text-gray-400">{roleWeight.description}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}

