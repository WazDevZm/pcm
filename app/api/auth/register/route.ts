import { NextRequest, NextResponse } from 'next/server'
import { signUp } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password, name, role } = body
    
    if (!email || !password || !name) {
      return NextResponse.json({ error: 'Email, password, and name are required' }, { status: 400 })
    }

    const data = await signUp(email, password, name, role || 'student')
    
    return NextResponse.json({ 
      success: true,
      user: data.user,
      message: 'Account created successfully'
    })
  } catch (error: any) {
    console.error('Registration error:', error)
    return NextResponse.json({ 
      error: error.message || 'Failed to create account' 
    }, { status: 400 })
  }
}
