import { NextRequest, NextResponse } from 'next/server'
import { getCounselingRequests, createCounselingRequest } from '@/lib/database'
import { getCurrentUser } from '@/lib/auth'

// GET /api/counseling - Fetch all counseling requests
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    
    const requests = await getCounselingRequests(status || undefined)
    
    return NextResponse.json(requests)
  } catch (error) {
    console.error('Error fetching counseling requests:', error)
    return NextResponse.json({ error: 'Failed to fetch counseling requests' }, { status: 500 })
  }
}

// POST /api/counseling - Create a counseling request
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    
    const body = await request.json()
    const counselingRequest = await createCounselingRequest({
      ...body,
      user_id: user?.id,
      status: 'pending',
    })
    
    return NextResponse.json(counselingRequest, { status: 201 })
  } catch (error) {
    console.error('Error creating counseling request:', error)
    return NextResponse.json({ error: 'Failed to create counseling request' }, { status: 500 })
  }
}
