Thought for 2 seconds### Battle Rap Rating - Project Structure Documentation

## 1. Directory Structure Overview

```plaintext
battle-rap-rating/
+-- app/                    # Next.js App Router pages and layouts
+-- components/             # React components organized by feature
+-- contexts/               # React context providers
+-- hooks/                  # Custom React hooks
+-- lib/                    # Utility functions and services
+-- public/                 # Static assets
+-- supabase/               # Supabase migrations and types
+-- types/                  # TypeScript type definitions
+-- middleware.ts           # Next.js middleware for auth protection
+-- tailwind.config.ts      # Tailwind CSS configuration
+-- package.json            # Project dependencies
```

## 2. App Directory (Routes)

The `app` directory follows Next.js App Router structure:

```plaintext
app/
+-- layout.tsx              # Root layout with providers
+-- page.tsx                # Homepage
+-- admin/                  # Admin section
¦   +-- layout.tsx          # Admin layout with sidebar
¦   +-- page.tsx            # Admin dashboard
¦   +-- battlers/           # Battler management
¦   +-- badges/             # Badge management
¦   +-- role-weights/       # Role weights management
¦   +-- settings/           # Admin settings
¦   +-- tags/               # Tags management
¦   +-- user-badges/        # User badges management
¦   +-- community-managers/ # Community manager management
¦   +-- featured-videos/    # Featured videos management
+-- auth/                   # Authentication routes
¦   +-- callback/           # OAuth callback handler
¦   +-- login/              # Login page
¦   +-- signup/             # Signup page
+-- battlers/               # Public battler pages
¦   +-- page.tsx            # Battlers listing
¦   +-- [id]/               # Individual battler page
+-- analytics/              # Analytics pages
+-- leaderboard/            # Leaderboard pages
+-- my-ratings/             # User's ratings
+-- profile/                # User profiles
¦   +-- [username]/         # Individual profile page
+-- admin-tools/            # Admin tools page
+-- diagnostics/            # System diagnostics
+-- globals.css             # Global CSS
```

## 3. Components Directory

Components are organized by feature and functionality:

```plaintext
components/
+-- admin/                  # Admin-specific components
¦   +-- AdminSidebar.tsx
¦   +-- BadgeTable.tsx
¦   +-- BattlerForm.tsx
¦   +-- CommunityManagersManager.tsx
¦   +-- DataMigrationTool.tsx
¦   +-- DeleteBattlerButton.tsx
¦   +-- MockDataManager.tsx
¦   +-- QuickActionToolbar.tsx
¦   +-- TagManager.tsx
¦   +-- UserBadgeManager.tsx
+-- analytics/              # Analytics components
¦   +-- RoleBasedAnalytics.tsx
+-- auth/                   # Authentication components
¦   +-- EmailVerification.tsx
¦   +-- GoogleSignInButton.tsx
¦   +-- RequestCommunityManagerForm.tsx
¦   +-- RoleSelector.tsx
¦   +-- SimpleGoogleButton.tsx
+-- battler/                # Battler-related components
¦   +-- AnalyticsTab.tsx
¦   +-- AttributesTab.tsx
¦   +-- AttributeSlider.tsx
¦   +-- BadgeSection.tsx
¦   +-- QuickStatsWidget.tsx
+-- leaderboard/            # Leaderboard components
¦   +-- TopContributorCards.tsx
¦   +-- UserLeaderboard.tsx
¦   +-- UserStatsOverview.tsx
+-- notifications/          # Notification components
¦   +-- NotificationCenter.tsx
+-- profile/                # Profile components
¦   +-- AddContentDialog.tsx
¦   +-- ContentLinkManager.tsx
¦   +-- EditProfileDialog.tsx
¦   +-- MediaContentSection.tsx
¦   +-- PrivacySettings.tsx
¦   +-- SocialLinksSection.tsx
¦   +-- UserAddedBattlersSection.tsx
¦   +-- UserBadgesSection.tsx
¦   +-- UserHistoricalDataSection.tsx
¦   +-- UserProfileHeader.tsx
¦   +-- UserRatingsSection.tsx
¦   +-- YouTubeChannelManager.tsx
¦   +-- YouTubeVideoSection.tsx
+-- ui/                     # shadcn/ui components
¦   +-- alert-dialog.tsx
¦   +-- button.tsx
¦   +-- card.tsx
¦   +-- chart.tsx
¦   +-- dropdown-menu.tsx
¦   +-- label.tsx
¦   +-- sheet.tsx
¦   +-- switch.tsx
¦   +-- textarea.tsx
+-- AttributeSlider.tsx     # Rating components
+-- BadgesSection.tsx
+-- BadgeSection.tsx
+-- BattlerGrid.tsx
+-- CommunityPulse.tsx
+-- FloatingActionButton.tsx
+-- Header.tsx
+-- HeroSection.tsx
+-- HighlightedBattler.tsx
+-- KeyboardShortcutsHelper.tsx
+-- LyricismSection.tsx
+-- MediaHighlight.tsx
+-- MobileNavbar.tsx
+-- MobileToolbar.tsx
+-- PerformanceSection.tsx
+-- PersonalSection.tsx
+-- RankingSystem.tsx
+-- RatingSection.tsx
+-- SelectedBattler.tsx
+-- SpotlightAnalytics.tsx
+-- SupabaseConnectionTest.tsx
+-- SupabaseTest.tsx
+-- TotalPoints.tsx
+-- TrendingBattlers.tsx
+-- YouTubeCarousel.tsx
```

## 4. Lib Directory (Services and Utilities)

```plaintext
lib/
+-- auth-service.ts         # Authentication functions
+-- badge-service.ts        # Badge management
+-- content-service.ts      # Content management
+-- data-service.ts         # Data fetching and manipulation
+-- migration-service.ts    # Data migration utilities
+-- mock-analytics-service.ts # Mock data for analytics
+-- mock-data-service.ts    # Mock data generation
+-- rating-service.ts       # Rating submission and calculation
+-- role-weight-service.ts  # Role weight management
+-- stats-service.ts        # Statistics calculations
+-- supabase.ts             # Supabase client initialization
+-- tag-service.ts          # Tag management
+-- upload-service.ts       # File upload utilities
+-- user-service.ts         # User profile management
+-- utils.ts                # General utilities
+-- youtube-service.ts      # YouTube API integration
```

## 5. Database Schema

### Battlers Table

```sql
CREATE TABLE battlers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  location TEXT,
  image TEXT,
  banner TEXT,
  tags TEXT[] DEFAULT '{}',
  total_points FLOAT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  added_by UUID REFERENCES auth.users(id),
  added_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**Notes**: Stores battler profiles with their basic information and metadata.

### Ratings Table

```sql
CREATE TABLE ratings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  battler_id UUID REFERENCES battlers(id) NOT NULL,
  category TEXT NOT NULL,
  attribute TEXT NOT NULL,
  value FLOAT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, battler_id, category, attribute)
);
```

**Notes**: Stores individual ratings given by users for specific battler attributes.

### Battler Attributes Table

```sql
CREATE TABLE battler_attributes (
  battler_id UUID REFERENCES battlers(id) NOT NULL,
  category TEXT NOT NULL,
  attribute TEXT NOT NULL,
  overall_average FLOAT DEFAULT 0,
  fan_average FLOAT DEFAULT 0,
  media_average FLOAT DEFAULT 0,
  battler_average FLOAT DEFAULT 0,
  league_owner_average FLOAT DEFAULT 0,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (battler_id, category, attribute)
);
```

**Notes**: Stores pre-calculated averages for battler attributes by different user roles.

### Badges Table

```sql
CREATE TABLE badges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category TEXT NOT NULL,
  badge TEXT NOT NULL,
  description TEXT,
  is_positive BOOLEAN DEFAULT TRUE,
  UNIQUE(category, badge)
);
```

**Notes**: Defines available badges that can be assigned to battlers.

### User Badges Table

```sql
CREATE TABLE user_badges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  badge_id UUID REFERENCES badges(id) NOT NULL,
  count INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, badge_id)
);
```

**Notes**: Tracks badges assigned to users and their frequency.

### User Profiles Table

```sql
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  email TEXT UNIQUE NOT NULL,
  display_name TEXT,
  username TEXT UNIQUE,
  roles JSONB DEFAULT '{"fan": true, "media": false, "battler": false, "league_owner": false, "admin": false, "community_manager": false}',
  verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  bio TEXT,
  location TEXT,
  website TEXT,
  profile_image TEXT,
  banner_image TEXT,
  social_links JSONB DEFAULT '{}',
  battler_id UUID REFERENCES battlers(id),
  league_id UUID,
  media_outlet TEXT,
  followers INTEGER DEFAULT 0,
  following INTEGER DEFAULT 0,
  badges TEXT[] DEFAULT '{}',
  privacy_settings JSONB DEFAULT '{"visibilityLevel": "medium", "showEmail": false, "showRatings": true, "showBadges": true, "showHistoricalData": false}',
  added_battlers UUID[] DEFAULT '{}'
);
```

**Notes**: Extended user profile information beyond Supabase Auth.

### Role Weights Table

```sql
CREATE TABLE role_weights (
  role TEXT PRIMARY KEY,
  weight FLOAT NOT NULL,
  display_name TEXT NOT NULL,
  description TEXT,
  color TEXT
);
```

**Notes**: Defines the weight of each user role for calculating weighted averages.

### Content Links Table

```sql
CREATE TABLE content_links (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  url TEXT NOT NULL,
  display_name TEXT NOT NULL,
  type TEXT NOT NULL,
  thumbnail TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  likes INTEGER DEFAULT 0,
  views INTEGER DEFAULT 0
);
```

**Notes**: Stores links to external content (videos, articles, etc.) shared by users.

### Featured Videos Table

```sql
CREATE TABLE featured_videos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  youtube_id TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  thumbnail TEXT,
  published_at TIMESTAMP WITH TIME ZONE,
  added_by UUID REFERENCES auth.users(id),
  added_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  position INTEGER,
  is_active BOOLEAN DEFAULT TRUE
);
```

**Notes**: Stores featured YouTube videos for the homepage.

### Tags Table

```sql
CREATE TABLE tags (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT UNIQUE NOT NULL,
  category TEXT,
  color TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**Notes**: Defines tags that can be applied to battlers.

### Community Manager Requests Table

```sql
CREATE TABLE community_manager_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  reason TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  reviewed_by UUID REFERENCES auth.users(id),
  UNIQUE(user_id, status)
);
```

**Notes**: Tracks requests from users to become community managers.

## 6. Server Actions

Server Actions are used for data mutations. Here are the key server actions:

### Rating Submission

```typescript
// lib/rating-service.ts
"use server"

export async function submitRating(
  userId: string,
  battlerId: string,
  category: string,
  attribute: string,
  value: number,
): Promise<{ success: boolean; error?: any }> {
  // Check if rating already exists
  const { data: existingRating } = await supabase
    .from("ratings")
    .select("*")
    .eq("userId", userId)
    .eq("battlerId", battlerId)
    .eq("category", category)
    .eq("attribute", attribute)
    .single()

  if (existingRating) {
    // Update existing rating
    const { error } = await supabase
      .from("ratings")
      .update({
        value,
        updatedAt: new Date().toISOString(),
      })
      .eq("id", existingRating.id)

    if (error) {
      console.error("Error updating rating:", error)
      return { success: false, error }
    }
  } else {
    // Create new rating
    const { error } = await supabase.from("ratings").insert({
      userId,
      battlerId,
      category,
      attribute,
      value,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    })

    if (error) {
      console.error("Error creating rating:", error)
      return { success: false, error }
    }
  }

  // Recalculate battler's weighted average for this attribute
  await recalculateWeightedAverage(battlerId, category, attribute)

  return { success: true }
}
```

### User Profile Update

```typescript
// lib/user-service.ts
"use server"

export async function updateUserProfile(userId: string, data: Partial<UserProfile>): Promise<UserProfile> {
  const { data: updatedUser, error } = await supabase
    .from("user_profiles")
    .update(data)
    .eq("id", userId)
    .select("*")
    .single()

  if (error) {
    console.error("Error updating user profile:", error)
    throw error
  }

  return updatedUser as UserProfile
}
```

### Battler Management

```typescript
// lib/data-service.ts
"use server"

export async function createBattler(battler: Omit<Battler, "id" | "createdAt">): Promise<Battler> {
  const { data, error } = await supabase
    .from("battlers")
    .insert({
      name: battler.name,
      location: battler.location,
      image: battler.image,
      banner: battler.banner,
      tags: battler.tags,
      totalPoints: battler.totalPoints,
      addedBy: battler.addedBy,
      addedAt: new Date().toISOString(),
    })
    .select("*")
    .single()

  if (error) {
    console.error("Error creating battler:", error)
    throw error
  }

  return data as Battler
}
```

## 7. Middleware

The middleware handles authentication and route protection:

```typescript
// middleware.ts
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
```

## 8. Authentication Context

The auth context provides authentication state throughout the application:

```typescript
// contexts/auth-context.tsx
"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import type { User, Session } from "@supabase/supabase-js"

interface AuthContextType {
  user: User | null
  session: Session | null
  isLoading: boolean
  signIn: (email: string, password: string) => Promise<{ error: any }>
  signUp: (email: string, password: string, roles: UserRoles) => Promise<{ data: any; error: any }>
  signOut: () => Promise<void>
  // Additional auth methods...
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const supabase = createClientComponentClient()

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setSession(session)
      setUser(session?.user ?? null)
      setIsLoading(false)
    }

    getSession()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      setUser(session?.user ?? null)
      setIsLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [supabase.auth])

  const signIn = async (email: string, password: string) => {
    return await supabase.auth.signInWithPassword({ email, password })
  }

  const signUp = async (email: string, password: string, roles: UserRoles) => {
    return await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { roles }
      }
    })
  }

  const signOut = async () => {
    await supabase.auth.signOut()
  }

  // Additional auth methods...

  return (
    <AuthContext.Provider value={{ user, session, isLoading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
```

## 9. Key Features and Implementation Notes

1. **Role-Based Weighted Ratings**

1. Different user roles (fan, media, battler, league owner) have different weights in the rating system
2. Weighted averages are calculated and stored for efficient querying



2. **Badge System**

1. Positive and negative badges can be assigned to battlers
2. Badges are categorized by writing, performance, and personal attributes



3. **Community Management**

1. Users can request to become community managers
2. Admins can approve or reject these requests
3. Community managers have special privileges for content moderation



4. **Analytics**

1. Role-based analytics show how different user types rate battlers
2. Historical data tracking shows battler performance over time



5. **Content Integration**

1. YouTube videos can be featured on the homepage
2. Users can share their content (videos, articles, podcasts)



6. **Mobile Responsiveness**

1. Mobile-specific components (MobileToolbar, MobileNavbar)
2. Responsive design throughout the application



7. **Admin Tools**

1. Comprehensive admin dashboard
2. Data management tools for battlers, badges, tags, etc.
3. System monitoring and diagnostics





## 10. Environment Variables

```plaintext
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

This document provides a comprehensive overview of the Battle Rap Rating application structure and architecture. Use it as a roadmap for understanding and extending the application.