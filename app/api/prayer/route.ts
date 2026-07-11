import { NextResponse } from 'next/server'
import { FRONTEND_ONLY } from '@/lib/config'

export async function POST(request: Request) {
  if (FRONTEND_ONLY) {
    return NextResponse.json({
      success: true,
      message: 'Frontend-only mode — prayer request acknowledged locally.',
    })
  }

  try {
    const body = await request.json()
    const { createServerSupabase } = await import('@/lib/supabase-server')
    const supabase = createServerSupabase()

    if (!supabase) {
      return NextResponse.json(
        { error: 'Database not configured. Set Supabase environment variables.' },
        { status: 503 }
      )
    }

    const { data, error } = await supabase.from('prayer_requests').insert({
      request: body.message,
      requester_name: body.anonymous ? null : body.name,
      requester_email: body.anonymous ? null : body.email,
      is_anonymous: Boolean(body.anonymous),
      category: body.category || 'personal',
      status: 'active',
    })

    if (error) throw error
    return NextResponse.json({ success: true, data })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to submit prayer request'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
