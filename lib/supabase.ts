import { createClient } from "@supabase/supabase-js"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

// Log Supabase connection information for debugging
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Log the status of environment variables (without exposing actual keys)
console.log(`Supabase URL available: ${!!supabaseUrl}`)
console.log(`Supabase Anon Key available: ${!!supabaseAnonKey}`)

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn("Warning: Supabase environment variables not properly set. Using fallback values for development only.")
}

// Create the Supabase client with better error handling
export const supabase = createClient(
  supabaseUrl || "https://mock-supabase-url.supabase.co", 
  supabaseAnonKey || "mock-supabase-anon-key",
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
    global: {
      // Add fetch error handling
      fetch: (...args) => {
        return fetch(...args).catch(err => {
          console.error("Supabase fetch error:", err)
          throw err
        })
      }
    }
  }
)

// For client components, use this function with better error logging
export function getSupabaseBrowser() {
  try {
    return createClientComponentClient()
  } catch (err) {
    console.error("Error creating Supabase client component:", err)
    throw err
  }
}

// Google OAuth URL helper - must be used in client components
export const signInWithGoogle = async (redirectTo?: string) => {
  try {
    const redirectURL = redirectTo ? `${window.location.origin}${redirectTo}` : `${window.location.origin}/`

    return getSupabaseBrowser().auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: redirectURL,
      },
    })
  } catch (err) {
    console.error("Error during Google sign-in:", err)
    throw err
  }
}
