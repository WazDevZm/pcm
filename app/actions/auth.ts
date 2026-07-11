'use server'

import { revalidatePath } from 'next/cache'
import { signIn, signUp, signOut, getCurrentUser, getCurrentSession } from '@/lib/auth'

export async function loginUser(email: string, password: string) {
  return await signIn(email, password)
}

export async function registerUser(email: string, password: string, name: string, role: 'student' | 'leader' = 'student') {
  return await signUp(email, password, name, role)
}

export async function logoutUser() {
  await signOut()
  revalidatePath('/')
}

export async function getCurrentAuthUser() {
  return await getCurrentUser()
}

export async function getCurrentAuthSession() {
  return await getCurrentSession()
}
