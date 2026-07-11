'use server'

import { revalidatePath } from 'next/cache'
import { getCounselingRequests, createCounselingRequest } from '@/lib/database'
import { getCurrentUser } from '@/lib/auth'

export async function fetchCounselingRequests(status?: string) {
  return await getCounselingRequests(status)
}

export async function createCounselingRequestAction(data: {
  name: string
  email: string
  phone?: string
  service_type: 'personal' | 'relationship' | 'academic' | 'crisis'
  preferred_counselor?: string
  message: string
}) {
  const user = await getCurrentUser()
  
  const counselingRequest = await createCounselingRequest({
    ...data,
    user_id: user?.id || 'anonymous',
  })
  
  revalidatePath('/counseling')
  revalidatePath('/admin/counseling')
  
  return counselingRequest
}
