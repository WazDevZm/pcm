import { NextRequest, NextResponse } from 'next/server'
import { getBandBySlug, getBandEvents, createBandEvent } from '@/lib/bands'
import { getCurrentUser } from '@/lib/auth'

// GET /api/bands/[slug]/events - Fetch band events
export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const band = await getBandBySlug(params.slug)
    if (!band) {
      return NextResponse.json({ error: 'Band not found' }, { status: 404 })
    }

    const events = await getBandEvents(band.id)
    return NextResponse.json(events)
  } catch (error) {
    console.error('Error fetching band events:', error)
    return NextResponse.json({ error: 'Failed to fetch band events' }, { status: 500 })
  }
}

// POST /api/bands/[slug]/events - Create a band event
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
    const event = await createBandEvent({
      ...body,
      committee_id: band.id,
      created_by: user.id,
    })
    
    return NextResponse.json(event, { status: 201 })
  } catch (error) {
    console.error('Error creating band event:', error)
    return NextResponse.json({ error: 'Failed to create band event' }, { status: 500 })
  }
}
