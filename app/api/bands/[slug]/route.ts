import { NextRequest, NextResponse } from 'next/server'
import { getBandBySlug } from '@/lib/bands'

// GET /api/bands/[slug] - Fetch a single band by slug
export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const band = await getBandBySlug(params.slug)
    
    if (!band) {
      return NextResponse.json({ error: 'Band not found' }, { status: 404 })
    }
    
    return NextResponse.json(band)
  } catch (error) {
    console.error('Error fetching band:', error)
    return NextResponse.json({ error: 'Failed to fetch band' }, { status: 500 })
  }
}
