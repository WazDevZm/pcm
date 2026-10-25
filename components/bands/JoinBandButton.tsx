'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Check, UserPlus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/components/auth/AuthProvider'
import { supabase } from '@/lib/supabase'

/** Join / leave a band — writes committee_members, same as the app (mobile/src/lib/api.ts) */
export function JoinBandButton({ bandId, slug }: { bandId: string; slug: string }) {
  const { user, loading } = useAuth()
  const [member, setMember] = useState<boolean | null>(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  // Built-in bands (no Supabase row yet) have non-UUID ids
  const live = /^[0-9a-f-]{36}$/i.test(bandId) && Boolean(supabase)

  useEffect(() => {
    if (!user || !live || !supabase) return setMember(null)
    let active = true
    supabase
      .from('committee_members')
      .select('committee_id')
      .eq('committee_id', bandId)
      .eq('user_id', user.id)
      .maybeSingle()
      .then(({ data }) => active && setMember(Boolean(data)))
    return () => {
      active = false
    }
  }, [user, bandId, live])

  if (loading) return <Button size="lg" variant="gold" className="w-full" disabled>Join this band</Button>

  if (!user) {
    return (
      <Button asChild size="lg" variant="gold" className="w-full">
        <Link href={`/login?next=/bands/${slug}`}>
          <UserPlus /> Sign in to join
        </Link>
      </Button>
    )
  }

  if (!live) {
    return <p className="text-sm text-muted-foreground">Joining online opens once this band is set up. Until then, follow “How to join”.</p>
  }

  const toggle = async () => {
    if (!supabase) return
    setBusy(true)
    setError('')
    const { error } = member
      ? await supabase.from('committee_members').delete().eq('committee_id', bandId).eq('user_id', user.id)
      : await supabase.from('committee_members').insert({ committee_id: bandId, user_id: user.id, role: 'member' })
    if (error) setError(error.message)
    else setMember(!member)
    setBusy(false)
  }

  return (
    <div className="space-y-2">
      <Button size="lg" variant={member ? 'outline' : 'gold'} className="w-full" disabled={busy || member === null} onClick={toggle}>
        {member ? <Check /> : <UserPlus />}
        {busy ? 'Saving…' : member ? 'You’re a member · Leave' : 'Join this band'}
      </Button>
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  )
}
