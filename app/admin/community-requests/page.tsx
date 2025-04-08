export const dynamic = "force-dynamic";
import type { Metadata } from "next"
import CommunityManagerRequests from "@/components/admin/CommunityManagerRequests"

export const metadata: Metadata = {
  title: "Community Manager Requests | Admin",
  description: "Review and manage community manager requests",
}

export default function CommunityRequestsPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Community Manager Requests</h1>
      <CommunityManagerRequests />
    </div>
  )
}

