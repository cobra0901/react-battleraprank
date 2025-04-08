"use client"

import { createClient } from "@supabase/supabase-js"
import { supabase } from "@/lib/supabase"

// In a real app, this would use a proper authentication system
// This is a simplified version for demonstration purposes

const ADMIN_USERNAME = "admin"
const ADMIN_PASSWORD = "password123"
const AUTH_COOKIE = "battle_rap_admin_auth"

// Client-side authentication functions
export async function login(username: string, password: string): Promise<boolean> {
  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    // Using localStorage instead of cookies for client-side auth
    localStorage.setItem(AUTH_COOKIE, "authenticated")
    return true
  }
  return false
}

export async function logout(): Promise<void> {
  localStorage.removeItem(AUTH_COOKIE)
}

export async function isAuthenticated(): Promise<boolean> {
  const authValue = localStorage.getItem(AUTH_COOKIE)
  return authValue === "authenticated"
}

export async function sendVerificationEmail(email: string): Promise<void> {
  // In a real app, this would send an email with a verification code
  // For now, we'll just simulate it
  console.log(`Sending verification email to ${email}`)

  // In a real app, you would generate a code, store it in the database,
  // and send it to the user's email

  // For demo purposes, we'll just return
  return Promise.resolve()
}

export async function verifyEmail(userId: string, code: string): Promise<{ success: boolean }> {
  // In a real app, this would verify the code against what's stored in the database
  // For now, we'll just simulate a successful verification
  console.log(`Verifying email for user ${userId} with code ${code}`)

  // Mock verification logic - for demo, any code that's 6 digits will work
  const isValidCode = /^\d{6}$/.test(code)

  if (isValidCode) {
    // In a real app, you would update the user's verified status in the database
    // For demo purposes, we'll just return success
    return { success: true }
  }

  return { success: false }
}
