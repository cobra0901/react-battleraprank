"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Database, Info } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"

export default function MockDataManager() {
  const { toast } = useToast()

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Database className="mr-2" /> 
            Data Management
          </CardTitle>
          <CardDescription>
            Tools for managing application data
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert className="mb-6">
            <Info className="h-4 w-4" />
            <AlertTitle>Mock Data Manager Deprecated</AlertTitle>
            <AlertDescription>
              The application now uses only real data from the database. 
              Mock data features have been deprecated and removed.
              <div className="mt-4">
                <Link href="/admin">
                  <Button variant="outline" size="sm">
                    Return to Admin Dashboard
                  </Button>
                </Link>
              </div>
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  )
}
