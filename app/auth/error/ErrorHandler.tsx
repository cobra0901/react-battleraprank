'use client'

import { useSearchParams } from "next/navigation"

export default function ErrorHandler() {
  const searchParams = useSearchParams()
  const message = searchParams.get("message") || "Something went wrong"

  return (
    <div className="p-4 text-center">
      <h1 className="text-2xl font-bold text-red-500">Auth Error</h1>
      <p className="mt-2 text-gray-400">{message}</p>
    </div>
  )
}
