import { NextRequest, NextResponse } from 'next/server'
import { getResources } from '@/lib/database'

// GET /api/resources - Fetch all resources
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type')
    
    const resources = await getResources(type || undefined)
    
    return NextResponse.json(resources)
  } catch (error) {
    console.error('Error fetching resources:', error)
    return NextResponse.json({ error: 'Failed to fetch resources' }, { status: 500 })
  }
}
