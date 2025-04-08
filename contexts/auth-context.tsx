"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { getSupabaseBrowser } from "@/lib/supabase"
import { useRouter } from "next/navigation"
import type { Session, User } from "@supabase/supabase-js"
import type { UserProfile, UserRole, UserRoles, SocialLinks } from "@/types/auth-types"

interface AuthContextType {
  user: User | null
  session: Session | null
  userProfile: UserProfile | null
  isLoading: boolean
  signIn: (email: string, password: string) => Promise<{ error: any }>
  signUp: (email: string, password: string, roles: UserRoles) => Promise<{ error: any; data: any }>
  saveUserProfile: (email: string, password: string, roles: UserRoles) => Promise<{ error: any; data: any }>
  signInWithGoogle: (redirectTo?: string) => Promise<void>
  signOut: () => Promise<void>
  updateUserRoles: (roles: UserRoles) => Promise<{ error: any }>
  hasRole: (role: UserRole) => boolean
  refreshProfile: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// MOCK DATA FOR TESTING - REMOVE IN PRODUCTION
const MOCK_MODE = false; // Set to false when ready to use real Supabase
const MOCK_USER_ID = "mock-user-123";
const mockUser = MOCK_MODE ? {
  id: MOCK_USER_ID,
  email: "mock@example.com",
  aud: "authenticated",
  role: "",
} as User : null;

const mockSession = MOCK_MODE ? {
  access_token: "mock-token",
  refresh_token: "mock-refresh-token",
  expires_at: Date.now() + 3600000,
  user: mockUser,
} as Session : null;

// Create a mock user profile with proper types
const mockUserProfile: UserProfile = {
  id: MOCK_USER_ID,
  email: "mock@example.com",
  displayName: "MockUser",
  username: "mockuser",
  roles: {
    fan: true,
    media: true,
    battler: false,
    league_owner: false,
    admin: false,
    community_manager: false
  },
  verified: true,
  createdAt: new Date().toISOString(),
  socialLinks: {} as SocialLinks
};

// Function to create a mock signup user response
const mockSignupUser = (email: string, roles: UserRoles) => {
  // Create a proper mock user with all required fields
  const mockSignupUserObj = {
    ...mockUser,
    email: email,
    id: MOCK_USER_ID,
    app_metadata: {},
    user_metadata: {},
    created_at: new Date().toISOString()
  } as User;
  
  // Create a mock data response
  const mockData = {
    user: mockSignupUserObj
  };
  
  return mockData;
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(mockUser)
  const [session, setSession] = useState<Session | null>(mockSession)
  const [userProfile, setUserProfile] = useState<UserProfile | null>(mockUserProfile)
  const [isLoading, setIsLoading] = useState(true) // Start with loading true
  const [initialLoadDone, setInitialLoadDone] = useState(false)
  const router = useRouter()

  useEffect(() => {
    if (MOCK_MODE) {
      setIsLoading(false);
      setInitialLoadDone(true);
      return;
    }

    async function getSession() {
      setIsLoading(true)
      try {
        console.log("Getting auth session...")
        const { data: { session }, error } = await getSupabaseBrowser().auth.getSession()
        
        if (error) {
          console.error("Error getting session:", error)
          setIsLoading(false) 
          setInitialLoadDone(true)
          return
        }

        if (session) {
          console.log("Session found, user:", session.user.email)
          setSession(session)
          setUser(session.user)

          // Fetch the user profile
          await fetchUserProfile(session.user.id)
        } else {
          console.log("No session found")
          // No session, so no need to fetch profile
          setIsLoading(false)
          setInitialLoadDone(true)
        }
      } catch (error) {
        console.error("Exception getting session:", error)
        setIsLoading(false)
        setInitialLoadDone(true)
      }
    }

    // Set a timeout to ensure loading state doesn't get stuck
    const timeout = setTimeout(() => {
      if (isLoading) {
        console.warn("Auth loading timed out after 5 seconds")
        setIsLoading(false)
        setInitialLoadDone(true)
      }
    }, 50000) // Increased timeout to 5 seconds

    getSession()

    // Set up the auth state listener
    const { data } = getSupabaseBrowser().auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event)
      setSession(session)
      setUser(session?.user ?? null)

      if (session?.user) {
        await fetchUserProfile(session.user.id)
      } else {
        setUserProfile(null)
        setIsLoading(false)
        setInitialLoadDone(true)
      }
    })

    // Cleanup
    return () => {
      clearTimeout(timeout)
      data.subscription.unsubscribe()
    }
  }, [])

  const fetchUserProfile = async (userId: string) => {
    try {
      console.log("Fetching user profile for:", userId)
      const { data, error } = await getSupabaseBrowser()
        .from("user_profiles")
        .select("*")
        .eq("id", userId)
        .single()

      if (error) {
        console.error("Error fetching user profile:", error)
        setIsLoading(false)
        setInitialLoadDone(true)
        return
      }

      if (data) {
        console.log("User profile found:", data.email)
        // Make sure roles are properly initialized
        if (!data.roles) {
          data.roles = {
            fan: true,
            media: false,
            battler: false,
            league_owner: false,
            admin: false,
            community_manager: false,
            media_confirmed: false
          }
        }
        
        // Special case for taskmasterpeace
        if (data.email === 'taskmasterpeace@gmail.com') {
          console.log("Setting special roles for taskmasterpeace")
          data.roles.admin = true
          data.roles.community_manager = true
        }
        
        setUserProfile(data as UserProfile)
      } else {
        console.log("No user profile found, creating default")
        // Create a default profile if none exists
        await createDefaultUserProfile(userId)
      }
    } catch (error) {
      console.error("Exception fetching user profile:", error)
    } finally {
      setIsLoading(false)
      setInitialLoadDone(true)
    }
  }
  
  const createDefaultUserProfile = async (userId: string) => {
    try {
      const supabase = getSupabaseBrowser()
      const { data: userData } = await supabase.auth.getUser()
      
      if (!userData.user) return
      
      const defaultRoles: UserRoles = {
        fan: true,
        media: false,
        battler: false,
        league_owner: false,
        admin: false,
        community_manager: false,
        media_confirmed: false
      }
      
      // Special case for taskmasterpeace
      if (userData.user.email === 'taskmasterpeace@gmail.com') {
        defaultRoles.admin = true
        defaultRoles.community_manager = true
      }
      
      const newProfile: Partial<UserProfile> = {
        id: userId,
        email: userData.user.email || '',
        displayName: userData.user.user_metadata.full_name || '',
        username: userData.user.email?.split('@')[0] || '',
        roles: defaultRoles
      }
      
      const { data, error } = await supabase
        .from('user_profiles')
        .insert([newProfile])
        .select()
      
      if (error) {
        console.error('Error creating user profile:', error)
      } else if (data && data.length > 0) {
        setUserProfile(data[0] as UserProfile)
      }
    } catch (error) {
      console.error('Error creating default profile:', error)
    }
  }

  const signIn = async (email: string, password: string) => {
    if (MOCK_MODE) {
      console.log("MOCK: Signing in with", email, password);
      setUser(mockUser);
      setSession(mockSession);
      setUserProfile(mockUserProfile);
      router.refresh();
      return { error: null };
    }
  
    try {
      const { data, error } = await getSupabaseBrowser().auth.signInWithPassword({
        email,
        password,
      });
  
      if (error) {
        console.error("❌ Sign in failed:", error);
        return { error };
      }
  
      // ✅ Set state from successful login
      // setUser(data.user);
      // setSession(data.session);
  
      // optional: fetch and set user profile here
      const { data: profile } = await getSupabaseBrowser().from("user_profiles").select("*").eq("id", data.user.id).single();
      setUserProfile(profile);
  
      router.refresh();
      return { error: null };
    } catch (error) {
      console.error("Sign in failed:", error);
      return { error };
    }
  };
  

  const signUp = async (email: string, password: string, roles: UserRoles) => {
    if (MOCK_MODE) {
      const mockData = mockSignupUser(email, roles)
      return { data: mockData, error: null };
    }

    try {
      console.log("Attempting to sign up with email:", email);
      console.log("Roles being used:", JSON.stringify(roles));
      
      const { data, error } = await getSupabaseBrowser().auth.signUp({
        email,
        password,
        options: {
          data: {
            roles: roles,
          },
        },
      })

      if (error) {
        console.error("Supabase auth signup error:", error);
        return { data: null, error: error };
      }

      if (!data || !data.user) {
        console.error("No user data returned from signup");
        return { data: null, error: new Error("No user data returned from signup") };
      }

      console.log("✅ Signup successful:");
      console.log("🧑‍💻 User ID:", data.user.id);
      console.log("📧 Email:", data.user.email);
      console.log("🔑 Access Token:", data.session?.access_token);
      console.log("🔁 Refresh Token:", data.session?.refresh_token);      
      
      return { data, error: null };
    } catch (error) {
      console.error("Sign up failed:", error);
      return { data: null, error };
    }
  }

  const saveUserProfile = async (
    userId: string,
    email: string,
    roles: UserRoles
  ): Promise<{ data: any; error: any }> => {
    const supabase = getSupabaseBrowser();
  
    await new Promise((res) => setTimeout(res, 300)); // optional delay
  
    const { error, data } = await supabase.from("user_profiles").insert([
      {
        id: userId,
        email,
        display_name: email.split("@")[0],
        roles,
      },
    ]);
  
    if (error) {
      console.error("❌ Insert into user_profiles failed:", error);
    } else {
      console.log("✅ user_profiles insert:", data);
    }
  
    return { data, error };
  };
  
  

  const signInWithGoogle = async (redirectTo?: string) => {
    if (MOCK_MODE) {
      console.log("MOCK: Signing in with Google");
      setUser(mockUser);
      setSession(mockSession);
      setUserProfile(mockUserProfile);
      router.refresh();
      return;
    }

    try {
      const { error } = await getSupabaseBrowser().auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: redirectTo || window.location.origin,
        },
      })

      if (error) {
        console.error("Error signing in with Google:", error)
      }
    } catch (error) {
      console.error("Exception signing in with Google:", error);
    }
  }

  const signOut = async () => {
    if (MOCK_MODE) {
      console.log("MOCK: Signing out");
      setUser(null);
      setSession(null);
      setUserProfile(null);
      router.refresh();
      router.push("/");
      return;
    }

    try {
      await getSupabaseBrowser().auth.signOut()

      setUser(null);
      setSession(null);
      setUserProfile(null);
      
      router.refresh()
      router.push("/")
    } catch (error) {
      console.error("Error signing out:", error);
    }
  }

  const updateUserRoles = async (roles: UserRoles) => {
    if (MOCK_MODE) {
      console.log("MOCK: Updating roles to", roles);
      if (userProfile) {
        const updatedProfile: UserProfile = {
          ...userProfile,
          roles: roles
        };
        setUserProfile(updatedProfile);
      }
      return { error: null };
    }

    if (!user) return { error: new Error("User not authenticated") }

    try {
      const { error } = await getSupabaseBrowser().from("user_profiles").update({ roles }).eq("id", user.id)

      if (!error && userProfile) {
        const updatedProfile: UserProfile = {
          ...userProfile,
          roles: roles
        };
        setUserProfile(updatedProfile);
      }

      return { error }
    } catch (error) {
      console.error("Error updating user roles:", error);
      return { error };
    }
  }

  // Add a manual refresh profile function
  const refreshProfile = async () => {
    if (!user) return
    setIsLoading(true)
    await fetchUserProfile(user.id)
  }

  const hasRole = (role: UserRole): boolean => {
    if (!userProfile || !userProfile.roles) return false
    
    // Special case for taskmasterpeace
    if (userProfile.email === 'taskmasterpeace@gmail.com' && (role === 'admin' || role === 'community_manager')) {
      return true
    }
    
    return userProfile.roles[role] === true
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        userProfile,
        isLoading: isLoading && !initialLoadDone, // Only show loading on initial load
        signIn,
        signUp,
        signInWithGoogle,
        signOut,
        updateUserRoles,
        hasRole,
        refreshProfile,
        saveUserProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
