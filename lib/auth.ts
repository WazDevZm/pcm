import { FRONTEND_ONLY } from './config'

export const signUp = async (
  email: string,
  password: string,
  name: string,
  role: 'student' | 'leader' = 'student'
) => {
  if (FRONTEND_ONLY) throw new Error('Sign up is disabled in frontend-only mode.')

  const { supabase } = await import('./supabase')
  const { createUser } = await import('./database')
  if (!supabase) throw new Error('Database not configured')

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { name, role } },
  })

  if (error) throw error

  if (data.user) {
    await createUser({
      id: data.user.id,
      email,
      name,
      role,
    })
  }

  return data
}

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

export const onAuthStateChange = () => {
  return { data: { subscription: { unsubscribe: () => {} } } }
}
