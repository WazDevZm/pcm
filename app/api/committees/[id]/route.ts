import { NextRequest, NextResponse } from 'next/server'
import { getCommittee, joinCommittee } from '@/lib/database'
import { getCurrentUser } from '@/lib/auth'

// GET /api/committees/[id] - Fetch a single committee
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const committee = await getCommittee(params.id)
    
    if (!committee) {
      return NextResponse.json({ error: 'Committee not found' }, { status: 404 })
    }
    
    return NextResponse.json(committee)
  } catch (error) {
    console.error('Error fetching committee:', error)
    return NextResponse.json({ error: 'Failed to fetch committee' }, { status: 500 })
  }
}

// POST /api/committees/[id]/join - Join a committee
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const membership = await joinCommittee(params.id, user.id, 'member')
    
    return NextResponse.json(membership, { status: 201 })
  } catch (error) {
    console.error('Error joining committee:', error)
    return NextResponse.json({ error: 'Failed to join committee' }, { status: 500 })
  }
}
