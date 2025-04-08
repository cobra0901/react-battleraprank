import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs"

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  // Check if the user is authenticated
  if (!session) {
    // If accessing admin routes, redirect to login
    if (req.nextUrl.pathname.startsWith("/admin")) {
      const redirectUrl = new URL("/auth/login", req.url)
      redirectUrl.searchParams.set("redirect", req.nextUrl.pathname)
      return NextResponse.redirect(redirectUrl)
    }
  } else {
    // Check if the user is an admin for admin routes
    const isAdmin = session.user.email?.endsWith("@admin.com")
    if (req.nextUrl.pathname.startsWith("/admin") && !isAdmin) {
      return NextResponse.redirect(new URL("/", req.url))
    }
  }

  return res
}

export const config = {
  matcher: ["/admin/:path*", "/profile/:path*", "/my-ratings/:path*"],
}

