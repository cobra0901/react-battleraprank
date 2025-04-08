export const dynamic = "force-dynamic";
import type React from "react"
import { redirect } from "next/navigation"
import AdminSidebar from "@/components/admin/AdminSidebar"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Check if user is authenticated and is an admin
  const supabase = createServerComponentClient({ cookies })
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect("/auth/login?redirect=/admin")
  }

  // Check if user is an admin
  const isAdmin = session.user.email?.endsWith("@admin.com")
  if (!isAdmin) {
    redirect("/")
  }

  return (
    <div className="flex min-h-screen bg-gray-950">
      <AdminSidebar />
      <div className="flex-1 p-8">{children}</div>
    </div>
  )
}

