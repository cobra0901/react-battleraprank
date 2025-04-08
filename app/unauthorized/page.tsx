import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ShieldAlert, Home } from "lucide-react"

export default function UnauthorizedPage() {
  return (
    <div className="container mx-auto flex flex-col items-center justify-center py-20">
      <ShieldAlert className="w-16 h-16 text-red-500 mb-4" />
      <h1 className="text-3xl font-bold mb-2">Access Denied</h1>
      <p className="text-xl text-muted-foreground mb-8">
        You don&apos;t have permission to access this page.
      </p>
      <p className="max-w-lg text-center mb-8">
        If you believe you should have access, please contact an administrator. 
        Only administrators, community managers, league owners, and approved media 
        personnel can create and manage battlers.
      </p>
      <div className="flex space-x-4">
        <Button asChild>
          <Link href="/">
            <Home className="w-4 h-4 mr-2" />
            Return Home
          </Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/auth/login">Login Again</Link>
        </Button>
      </div>
    </div>
  )
}
