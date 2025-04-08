import type { Metadata } from "next"
import RequestCommunityManagerForm from "@/components/auth/RequestCommunityManagerForm"

export const metadata: Metadata = {
  title: "Request Community Manager Privileges | Alt Battle Rap Algorithm",
  description: "Request to become a community manager and help maintain the Alt Battle Rap Algorithm",
}

export default function RequestCommunityManagerPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Request Community Manager Privileges</h1>

      <div className="max-w-2xl mx-auto">
        <RequestCommunityManagerForm />
      </div>
    </div>
  )
}

