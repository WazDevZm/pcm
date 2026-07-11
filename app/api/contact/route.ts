import { NextResponse } from 'next/server'
import { FRONTEND_ONLY } from '@/lib/config'

export async function POST(request: Request) {
  if (FRONTEND_ONLY) {
    return NextResponse.json({
      success: true,
      message: 'Frontend-only mode — message acknowledged locally.',
    })
  }

  try {
    const body = await request.json()
    const { createServerSupabase } = await import('@/lib/supabase-server')
    const supabase = createServerSupabase()

    if (!supabase) {
      return NextResponse.json(
        { error: 'Database not configured.' },
        { status: 503 }
      )
    }

    const { error } = await supabase.from('contact_submissions').insert({
      name: body.name,
      email: body.email,
      subject: body.subject || 'General Inquiry',
      message: body.message,
    })

    if (error) throw error
    return NextResponse.json({ success: true })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to send message'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
