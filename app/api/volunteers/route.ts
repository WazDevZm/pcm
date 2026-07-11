import { NextRequest, NextResponse } from 'next/server'
import { getVolunteers, createVolunteerApplication } from '@/lib/database'
import { getCurrentUser } from '@/lib/auth'

// GET /api/volunteers - Fetch all volunteers
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const committeeId = searchParams.get('committeeId')
    
    const volunteers = await getVolunteers(committeeId || undefined)
    
    return NextResponse.json(volunteers)
  } catch (error) {
    console.error('Error fetching volunteers:', error)
    return NextResponse.json({ error: 'Failed to fetch volunteers' }, { status: 500 })
  }
}

// POST /api/volunteers - Create a volunteer application
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    
    const body = await request.json()
    const volunteer = await createVolunteerApplication({
      ...body,
      user_id: user?.id,
      status: 'pending',
    })
    
    return NextResponse.json(volunteer, { status: 201 })
  } catch (error) {
    console.error('Error creating volunteer application:', error)
    return NextResponse.json({ error: 'Failed to create volunteer application' }, { status: 500 })
  }
}
