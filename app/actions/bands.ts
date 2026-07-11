'use server'

import { revalidatePath } from 'next/cache'
import { getBands, getBandBySlug, getBandAnnouncements, createBandAnnouncement, getBandEvents, createBandEvent, updateBand } from '@/lib/bands'
import { getCurrentUser } from '@/lib/auth'

export async function fetchAllBands() {
  return await getBands()
}

export async function fetchBandBySlug(slug: string) {
  return await getBandBySlug(slug)
}

export async function fetchBandAnnouncements(bandId: string, slug: string) {
  return await getBandAnnouncements(bandId, slug)
}

export async function createBandAnnouncementAction(data: {
  committee_id: string
  title: string
  content: string
  type: 'announcement' | 'meeting' | 'update'
  image_url?: string
}) {
  const user = await getCurrentUser()
  if (!user) {
    throw new Error('Unauthorized')
  }

  const announcement = await createBandAnnouncement({
    ...data,
    author_id: user.id,
    published_at: new Date().toISOString(),
  })
  
  revalidatePath('/bands/[slug]')
  revalidatePath('/band-admin/[slug]')
  
  return announcement
}

export async function fetchBandEvents(bandId: string) {
  return await getBandEvents(bandId)
}

export async function createBandEventAction(data: {
  title: string
  description: string
  date: string
  location: string
  category: 'worship' | 'outreach' | 'study' | 'fellowship' | 'special'
  committee_id: string
}) {
  const user = await getCurrentUser()
  if (!user) {
    throw new Error('Unauthorized')
  }

  const event = await createBandEvent({
    ...data,
    created_by: user.id,
  })
  
  revalidatePath('/bands/[slug]')
  revalidatePath('/band-admin/[slug]')
  
  return event
}

export async function updateBandDetails(bandId: string, data: Partial<{
  description: string
  mission: string
  responsibilities: string
  how_to_join: string
  important_info: string
  meeting_time: string
  meeting_location: string
  leader_name: string
  leader_position: string
  leader_tenure: string
  leader_email: string
  leader_phone: string
  leader_image_url: string
}>) {
  const user = await getCurrentUser()
  if (!user) {
    throw new Error('Unauthorized')
  }

  const band = await updateBand(bandId, data)
  
  revalidatePath('/bands/[slug]')
  revalidatePath('/band-admin/[slug]')
  
  return band
}
