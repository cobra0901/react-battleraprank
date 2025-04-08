"use client"
export const dynamic = "force-dynamic";
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { useRouter, useSearchParams } from "next/navigation"
import { Suspense } from "react"
import ErrorHandler from "./ErrorHandler"


export default function ErrorPage() {
  const router = useRouter()

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-64px)]">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center mb-4">
            <h1 className="text-3xl font-bold text-amber-500">ALGORITHM INSTITUTE</h1>
          </div>
          <CardTitle className="text-2xl text-center">Authentication Error</CardTitle>
          <CardDescription className="text-center">
            Something went wrong during the authentication process
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center">
            <Suspense fallback={<div>Loading error...</div>}>
              <ErrorHandler />
            </Suspense>

            <div className="flex justify-center mt-4">
              <Button
                variant="default"
                onClick={() => router.push("/auth/login")}
                className="mx-2"
              >
                Back to Login
              </Button>
              <Button
                variant="outline"
                onClick={() => router.push("/")}
                className="mx-2"
              >
                Home
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
