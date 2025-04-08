"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { Loader2, Trash2 } from "lucide-react"
import { useRouter } from "next/navigation"

export default function ClearMockDataButton() {
  const [isClearing, setIsClearing] = useState(false)
  const { toast } = useToast()
  const router = useRouter()
  
  const clearMockData = async () => {
    if (!confirm("This button has been deprecated as we've moved to real data only. Are you sure you want to continue?")) {
      return
    }
    
    setIsClearing(true)
    
    try {
      toast({
        title: "Mock Data Removal Complete",
        description: "The application now uses only real data from the database. No mock data is being used.",
      })
    } catch (error) {
      console.error("Error:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not complete the operation.",
      })
    } finally {
      setIsClearing(false)
      router.refresh()
    }
  }
  
  return (
    <Button 
      variant="destructive" 
      size="sm"
      onClick={clearMockData}
      disabled={isClearing}
    >
      {isClearing ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Processing...
        </>
      ) : (
        <>
          <Trash2 className="mr-2 h-4 w-4" />
          Clear Mock Data (Deprecated)
        </>
      )}
    </Button>
  )
}
