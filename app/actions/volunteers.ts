'use server'

import { revalidatePath } from 'next/cache'
import { getVolunteers, createVolunteerApplication } from '@/lib/database'
import { getCurrentUser } from '@/lib/auth'

export async function fetchVolunteers(committeeId?: string) {
  return await getVolunteers(committeeId)
}

export async function createVolunteerApplicationAction(data: {
  committee_id: string
  role: string
  skills: string[]
  availability: string
  commitment_hours: number
}) {
  const user = await getCurrentUser()
  
  const volunteer = await createVolunteerApplication({
    ...data,
    user_id: user?.id || 'anonymous',
  })
  
  revalidatePath('/admin/volunteers')
  
  return volunteer
}
