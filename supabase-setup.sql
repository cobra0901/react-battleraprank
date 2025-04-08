-- STEP 1: Ensure user_profiles table is correctly created with proper columns
CREATE TABLE IF NOT EXISTS public.user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    display_name TEXT,
    username TEXT UNIQUE,
    roles JSONB NOT NULL DEFAULT '{"fan": true, "media": false, "battler": false, "league_owner": false, "admin": false, "community_manager": false}'::jsonb,
    verified BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    avatar_url TEXT,
    bio TEXT,
    social_links JSONB DEFAULT '{}'::jsonb
);

-- STEP 2: Enable RLS on user_profiles
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- STEP 3: Create RLS policies for user_profiles
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.user_profiles;
CREATE POLICY "Public profiles are viewable by everyone" 
ON public.user_profiles FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can insert their own profile" ON public.user_profiles;
CREATE POLICY "Users can insert their own profile" 
ON public.user_profiles FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Users can update their own profile" ON public.user_profiles;
CREATE POLICY "Users can update their own profile" 
ON public.user_profiles FOR UPDATE USING (auth.uid() = id);

-- STEP 4: Create or replace the handle_new_user function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (
    id, 
    email, 
    display_name, 
    username, 
    roles, 
    verified,
    created_at,
    updated_at,
    avatar_url,
    bio,
    social_links
  )
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    'user_' || SUBSTRING(NEW.id::text, 1, 8),
    '{"fan": true, "media": false, "battler": false, "league_owner": false, "admin": false, "community_manager": false}'::jsonb,
    false,
    NOW(),
    NOW(),
    NULL,
    NULL,
    '{}'::jsonb
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- STEP 5: Create or replace the auth trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.handle_new_user();

-- Create a function to check if a user has a specific role
CREATE OR REPLACE FUNCTION public.check_user_role(
    target_role TEXT,
    user_id UUID DEFAULT auth.uid()
)
RETURNS BOOLEAN AS $$
DECLARE
    user_roles JSONB;
BEGIN
    SELECT roles INTO user_roles FROM public.user_profiles WHERE id = user_id;
    
    -- Admin role has all permissions
    IF user_roles->>'admin' = 'true' THEN
        RETURN TRUE;
    END IF;
    
    -- Check for the specific requested role
    IF user_roles ? target_role AND user_roles->>target_role = 'true' THEN
        RETURN TRUE;
    END IF;
    
    RETURN FALSE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- STEP 6: Create battlers table if it doesn't exist (this was referenced in the ConnectionTester)
CREATE TABLE IF NOT EXISTS public.battlers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    alias TEXT,
    bio TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    avatar_url TEXT,
    social_links JSONB DEFAULT '{}'::jsonb,
    stats JSONB DEFAULT '{}'::jsonb
);

-- Create policies to allow authenticated users with appropriate roles to create battlers
CREATE POLICY create_battlers_policy ON public.battlers
    FOR INSERT
    TO authenticated
    WITH CHECK (
        check_user_role('admin') OR 
        check_user_role('community_manager') OR
        (check_user_role('media')) OR
        check_user_role('league_owner')
    );

-- STEP 7: Create leagues table
CREATE TABLE IF NOT EXISTS public.leagues (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    logo_url TEXT,
    owner_id UUID REFERENCES auth.users(id),
    social_links JSONB DEFAULT '{}'::jsonb
);

-- STEP 8: Create battles table
CREATE TABLE IF NOT EXISTS public.battles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    league_id UUID REFERENCES public.leagues(id),
    event_name TEXT,
    battle_date DATE,
    video_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    description TEXT,
    status TEXT DEFAULT 'published'
);

-- STEP 9: Create battle_participants table (for many-to-many relationship)
CREATE TABLE IF NOT EXISTS public.battle_participants (
    battle_id UUID REFERENCES public.battles(id) ON DELETE CASCADE,
    battler_id UUID REFERENCES public.battlers(id) ON DELETE CASCADE,
    PRIMARY KEY (battle_id, battler_id)
);

-- STEP 10: Create ratings table
CREATE TABLE IF NOT EXISTS public.ratings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    battle_id UUID REFERENCES public.battles(id) ON DELETE CASCADE,
    battler_id UUID REFERENCES public.battlers(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL,
    comment TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, battle_id, battler_id)
);

-- STEP 11: Create badges table
CREATE TABLE IF NOT EXISTS public.badges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL UNIQUE,
    description TEXT,
    category TEXT NOT NULL, 
    is_positive BOOLEAN DEFAULT true,
    icon TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- STEP 12: Create battler_badges table (for many-to-many relationship)
CREATE TABLE IF NOT EXISTS public.battler_badges (
    battler_id UUID REFERENCES public.battlers(id) ON DELETE CASCADE,
    badge_id UUID REFERENCES public.badges(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    PRIMARY KEY (battler_id, badge_id, user_id)
);

-- Create a function to make a user a community manager
CREATE OR REPLACE FUNCTION public.make_community_manager(
    target_email TEXT,
    user_id UUID DEFAULT auth.uid()
)
RETURNS BOOLEAN AS $$
DECLARE
    user_roles JSONB;
BEGIN
    -- First check if the current user is an admin
    SELECT roles INTO user_roles FROM public.user_profiles WHERE id = user_id;
    
    -- Only admin can make someone a community manager
    IF user_roles->>'admin' != 'true' AND user_id != (SELECT id FROM public.user_profiles WHERE email = 'taskmasterpeace@gmail.com') THEN
        RETURN FALSE;
    END IF;
    
    -- Update the target user to be a community manager
    UPDATE public.user_profiles 
    SET roles = roles || '{"community_manager": true}'::jsonb, updated_at = NOW()
    WHERE email = target_email;
    
    -- Check if the update was successful
    IF FOUND THEN
        RETURN TRUE;
    ELSE
        RETURN FALSE;
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to set the admin role (only for taskmasterpeace@gmail.com)
CREATE OR REPLACE FUNCTION public.set_admin_role()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.email = 'taskmasterpeace@gmail.com' THEN
        NEW.roles := '{"admin": true, "fan": true, "media": false, "battler": false, "league_owner": false, "community_manager": false}'::jsonb;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a trigger to set admin role automatically for taskmasterpeace@gmail.com
CREATE TRIGGER set_admin_role_trigger
BEFORE INSERT OR UPDATE ON public.user_profiles
FOR EACH ROW
EXECUTE FUNCTION public.set_admin_role();

-- Ensure the initial admin exists
INSERT INTO public.user_profiles (id, email, display_name, roles)
SELECT id, email, email, '{"admin": true, "fan": true, "media": false, "battler": false, "league_owner": false, "community_manager": false}'::jsonb
FROM auth.users 
WHERE email = 'taskmasterpeace@gmail.com'
ON CONFLICT (id) DO UPDATE 
SET roles = '{"admin": true, "fan": true, "media": false, "battler": false, "league_owner": false, "community_manager": false}'::jsonb, updated_at = NOW();

-- Give access to public schema to the anon role
GRANT USAGE ON SCHEMA public TO anon;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO anon;

-- Give access to public schema to the service_role
GRANT USAGE ON SCHEMA public TO service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO service_role;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO service_role;

-- Give access to public schema to the authenticated role
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO authenticated;

-- STEP 20: Create a function to delete all battlers (needed for admin data cleanup)
CREATE OR REPLACE FUNCTION public.delete_all_battlers()
RETURNS void AS $$
BEGIN
    DELETE FROM public.battlers;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
