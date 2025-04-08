import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get("code")
  const type = requestUrl.searchParams.get("type")
  
  console.log("Auth callback received with type:", type)

  if (code) {
    const cookieStore = cookies()
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore })

    // Exchange the code for a session
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (error) {
      console.error("Error exchanging code for session:", error)
      return NextResponse.redirect(new URL("/auth/error?message=" + encodeURIComponent(error.message), request.url))
    }

    // If this was an email confirmation (signup), show a success message
    if (type === "signup") {
      return NextResponse.redirect(new URL("/auth/welcome", request.url))
    }

    // If this was a password reset
    if (type === "recovery") {
      return NextResponse.redirect(new URL("/auth/reset-password", request.url))
    }
  }

  // URL to redirect to after sign in process completes
  return NextResponse.redirect(new URL("/", request.url))
}
