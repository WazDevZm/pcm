import { NextRequest, NextResponse } from 'next/server'
import { getCommittees } from '@/lib/database'

// GET /api/committees - Fetch all committees
export async function GET() {
  try {
    const committees = await getCommittees()
    return NextResponse.json(committees)
  } catch (error) {
    console.error('Error fetching committees:', error)
    return NextResponse.json({ error: 'Failed to fetch committees' }, { status: 500 })
  }
}
