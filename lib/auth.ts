import { FRONTEND_ONLY } from './config'

export const signIn = async (email: string, password: string) => {
  if (FRONTEND_ONLY) throw new Error('Login is disabled in frontend-only mode.')

  const { supabase } = await import('./supabase')
  if (!supabase) throw new Error('Database not configured')

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })
  if (error) throw error
  return data
}

export const signOut = async () => {
  if (FRONTEND_ONLY) return
  const { supabase } = await import('./supabase')
  if (!supabase) return
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

export const getCurrentUser = async () => {
  if (FRONTEND_ONLY) return null
  const { supabase } = await import('./supabase')
  if (!supabase) return null
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error) throw error
  return user
}

export const getCurrentSession = async () => {
  if (FRONTEND_ONLY) return null
  const { supabase } = await import('./supabase')
  if (!supabase) return null
  const { data: { session }, error } = await supabase.auth.getSession()
  if (error) throw error
  return session
}

export const resetPassword = async (email: string) => {
  if (FRONTEND_ONLY) throw new Error('Password reset is disabled in frontend-only mode.')
  const { supabase } = await import('./supabase')
  if (!supabase) throw new Error('Database not configured')
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${typeof window !== 'undefined' ? window.location.origin : ''}/auth/reset-password`,
  })
  if (error) throw error
}

export const updatePassword = async (password: string) => {
  if (FRONTEND_ONLY) throw new Error('Password update is disabled in frontend-only mode.')
  const { supabase } = await import('./supabase')
  if (!supabase) throw new Error('Database not configured')
  const { error } = await supabase.auth.updateUser({ password })
  if (error) throw error
}
