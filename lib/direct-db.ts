"use server"

import { Pool } from 'pg'
import { cache } from 'react'

// In a production app, use environment variables for these
const connectionString = process.env.SUPABASE_DIRECT_URL

// Create connection pool
let pool: Pool | null = null

function getPool() {
  if (!pool && connectionString) {
    pool = new Pool({
      connectionString,
      ssl: { rejectUnauthorized: false },
    })
  }
  return pool
}

export async function executeSQL(query: string, params: any[] = []): Promise<any> {
  const pool = getPool()
  
  if (!pool) {
    console.error("No connection pool available. Check SUPABASE_DIRECT_URL env variable.")
    throw new Error("Database connection failed")
  }
  
  const client = await pool.connect()
  try {
    const result = await client.query(query, params)
    return result.rows
  } catch (error) {
    console.error("SQL execution error:", error)
    throw error
  } finally {
    client.release()
  }
}

export const clearAllBattlers = cache(async () => {
  try {
    // This bypasses RLS policies since it runs as a direct SQL query
    return await executeSQL('DELETE FROM public.battlers')
  } catch (error) {
    console.error("Failed to clear battlers:", error)
    throw error
  }
})

export const clearAllContent = cache(async () => {
  try {
    return await executeSQL('DELETE FROM public.content_links')
  } catch (error) {
    console.error("Failed to clear content:", error)
    throw error
  }
})

export const clearAllRatings = cache(async () => {
  try {
    return await executeSQL('DELETE FROM public.ratings')
  } catch (error) {
    console.error("Failed to clear ratings:", error)
    throw error
  }
})

export const createBattler = cache(async (
  name: string, 
  alias: string | null, 
  bio: string | null, 
  avatar_url: string | null, 
  created_by: string
) => {
  try {
    return await executeSQL(
      'INSERT INTO public.battlers (name, alias, bio, avatar_url, created_by) VALUES ($1, $2, $3, $4, $5) RETURNING *', 
      [name, alias, bio, avatar_url, created_by]
    )
  } catch (error) {
    console.error("Failed to create battler:", error)
    throw error
  }
})

export async function createBattlerDirect(name: string, alias: string | null, bio: string | null, avatar_url: string | null, created_by: string): Promise<any> {
  try {
    const result = await executeSQL(
      'INSERT INTO public.battlers (name, alias, bio, avatar_url, created_by) VALUES ($1, $2, $3, $4, $5) RETURNING *', 
      [name, alias, bio, avatar_url, created_by]
    );
    return result[0]; // Return the first row which should be the inserted battler
  } catch (error) {
    console.error("Failed to create battler:", error);
    throw error;
  }
}
