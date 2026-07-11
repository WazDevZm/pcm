import { NextRequest, NextResponse } from 'next/server'
import { getBands } from '@/lib/bands'

// GET /api/bands - Fetch all bands
export async function GET() {
  try {
    const bands = await getBands()
    return NextResponse.json(bands)
  } catch (error) {
    console.error('Error fetching bands:', error)
    return NextResponse.json({ error: 'Failed to fetch bands' }, { status: 500 })
  }
}
