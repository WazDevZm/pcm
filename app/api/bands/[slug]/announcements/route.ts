import { NextRequest, NextResponse } from 'next/server'
import { getBandBySlug, getBandAnnouncements, createBandAnnouncement } from '@/lib/bands'
import { getCurrentUser } from '@/lib/auth'

// GET /api/bands/[slug]/announcements - Fetch band announcements
export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const band = await getBandBySlug(params.slug)
    if (!band) {
      return NextResponse.json({ error: 'Band not found' }, { status: 404 })
    }

    const announcements = await getBandAnnouncements(band.id, params.slug)
    return NextResponse.json(announcements)
  } catch (error) {
    console.error('Error fetching announcements:', error)
    return NextResponse.json({ error: 'Failed to fetch announcements' }, { status: 500 })
  }
}

// POST /api/bands/[slug]/announcements - Create a band announcement
export async function POST(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const band = await getBandBySlug(params.slug)
    if (!band) {
      return NextResponse.json({ error: 'Band not found' }, { status: 404 })
    }

    const body = await request.json()
    const announcement = await createBandAnnouncement({
      ...body,
      committee_id: band.id,
      author_id: user.id,
      published_at: new Date().toISOString(),
    })
    
    return NextResponse.json(announcement, { status: 201 })
  } catch (error) {
    console.error('Error creating announcement:', error)
    return NextResponse.json({ error: 'Failed to create announcement' }, { status: 500 })
  }
}
