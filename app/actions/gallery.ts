'use server'

import { revalidatePath } from 'next/cache'
import { getGalleryItems, createGalleryItem } from '@/lib/database'
import { getCurrentUser } from '@/lib/auth'

export async function fetchGalleryItems(category?: string) {
  return await getGalleryItems(category)
}

export async function createGalleryItemAction(data: {
  title: string
  description: string
  image_url: string
  category: 'worship' | 'events' | 'outreach' | 'fellowship' | 'baptisms'
  event_date: string
  location: string
  attendees?: number
}) {
  const user = await getCurrentUser()
  if (!user) {
    throw new Error('Unauthorized')
  }

  const item = await createGalleryItem({
    ...data,
    uploaded_by: user.id,
  })
  
  revalidatePath('/gallery')
  revalidatePath('/admin/gallery')
  
  return item
}
