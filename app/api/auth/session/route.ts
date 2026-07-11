import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser, getCurrentSession } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    const session = await getCurrentSession()
    
    return NextResponse.json({ 
      user,
      session
    })
  } catch (error: any) {
    console.error('Session error:', error)
    return NextResponse.json({ 
      error: error.message || 'Failed to get session' 
    }, { status: 500 })
  }
}
