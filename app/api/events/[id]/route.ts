import { NextRequest, NextResponse } from 'next/server'
import { getEvent, registerForEvent } from '@/lib/database'
import { getCurrentUser } from '@/lib/auth'

// GET /api/events/[id] - Fetch a single event
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const event = await getEvent(params.id)
    
    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 })
    }
    
    return NextResponse.json(event)
  } catch (error) {
    console.error('Error fetching event:', error)
    return NextResponse.json({ error: 'Failed to fetch event' }, { status: 500 })
  }
}

// POST /api/events/[id]/register - Register for an event
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const registration = await registerForEvent(params.id, user.id)
    
    return NextResponse.json(registration, { status: 201 })
  } catch (error) {
    console.error('Error registering for event:', error)
    return NextResponse.json({ error: 'Failed to register for event' }, { status: 500 })
  }
}
