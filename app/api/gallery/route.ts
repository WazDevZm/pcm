import { NextRequest, NextResponse } from 'next/server'
import { getGalleryItems, createGalleryItem } from '@/lib/database'
import { getCurrentUser } from '@/lib/auth'

// GET /api/gallery - Fetch all gallery items
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    
    const items = await getGalleryItems(category || undefined)
    
    return NextResponse.json(items)
  } catch (error) {
    console.error('Error fetching gallery items:', error)
    return NextResponse.json({ error: 'Failed to fetch gallery items' }, { status: 500 })
  }
}

// POST /api/gallery - Create a new gallery item
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const item = await createGalleryItem({
      ...body,
      uploaded_by: user.id,
    })
    
    return NextResponse.json(item, { status: 201 })
  } catch (error) {
    console.error('Error creating gallery item:', error)
    return NextResponse.json({ error: 'Failed to create gallery item' }, { status: 500 })
  }
}
