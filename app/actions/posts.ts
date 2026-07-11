'use server'

import { revalidatePath } from 'next/cache'
import { getPosts, getPost, createPost } from '@/lib/database'
import { getCurrentUser } from '@/lib/auth'

export async function fetchPosts(category?: string, limit?: number) {
  return await getPosts(category, limit)
}

export async function fetchPost(id: string) {
  return await getPost(id)
}

export async function createNewPost(data: {
  title: string
  content: string
  excerpt: string
  category: 'testimony' | 'news' | 'announcement' | 'ministry'
  image_url?: string
}) {
  const user = await getCurrentUser()
  if (!user) {
    throw new Error('Unauthorized')
  }

  const post = await createPost({
    ...data,
    author_id: user.id,
    published_at: new Date().toISOString(),
  })
  
  revalidatePath('/news')
  revalidatePath('/admin/content')
  
  return post
}
