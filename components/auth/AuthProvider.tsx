'use client'

import { createContext, useContext } from 'react'
import { FRONTEND_ONLY } from '@/lib/config'

export type AuthUser = { id: string; email?: string } | null

export type UserProfile = {
  id: string
  email: string
  name: string
  role: 'student' | 'leader' | 'admin'
  phone?: string
  created_at: string
  updated_at: string
} | null

interface AuthContextType {
  user: AuthUser
  profile: UserProfile
  loading: boolean
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  loading: false,
  signOut: async () => {},
})

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

/** Frontend-only auth stub — no Supabase */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const value: AuthContextType = {
    user: null,
    profile: null,
    loading: false,
    signOut: async () => {},
  }

  if (!FRONTEND_ONLY) {
    // Supabase auth can be re-enabled by setting FRONTEND_ONLY = false
    // and restoring the previous AuthProvider implementation.
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
