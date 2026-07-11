import { NextRequest, NextResponse } from 'next/server'
import { getEvents, createEvent } from '@/lib/database'
import { getCurrentUser } from '@/lib/auth'

// GET /api/events - Fetch all events
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const upcoming = searchParams.get('upcoming') === 'true'
    
    const events = await getEvents(category || undefined, upcoming)
    
    return NextResponse.json(events)
  } catch (error) {
    console.error('Error fetching events:', error)
    return NextResponse.json({ error: 'Failed to fetch events' }, { status: 500 })
  }
}

// POST /api/events - Create a new event
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const event = await createEvent({
      ...body,
      created_by: user.id,
    })
    
    return NextResponse.json(event, { status: 201 })
  } catch (error) {
    console.error('Error creating event:', error)
    return NextResponse.json({ error: 'Failed to create event' }, { status: 500 })
  }
}
