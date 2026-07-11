'use server'

import { revalidatePath } from 'next/cache'
import { getEvents, getEvent, createEvent, registerForEvent } from '@/lib/database'
import { getCurrentUser } from '@/lib/auth'

export async function fetchEvents(category?: string, upcoming?: boolean) {
  return await getEvents(category, upcoming)
}

export async function fetchEvent(id: string) {
  return await getEvent(id)
}

export async function createNewEvent(data: {
  title: string
  description: string
  date: string
  end_date?: string
  location: string
  max_attendees?: number
  category: 'worship' | 'outreach' | 'study' | 'fellowship' | 'special'
  image_url?: string
  committee_id?: string
}) {
  const user = await getCurrentUser()
  if (!user) {
    throw new Error('Unauthorized')
  }

  const event = await createEvent({
    ...data,
    created_by: user.id,
  })
  
  revalidatePath('/events')
  revalidatePath('/admin/events')
  
  return event
}

export async function registerForEventById(eventId: string) {
  const user = await getCurrentUser()
  if (!user) {
    throw new Error('Unauthorized')
  }

  const registration = await registerForEvent(eventId, user.id)
  
  revalidatePath('/events')
  
  return registration
}
