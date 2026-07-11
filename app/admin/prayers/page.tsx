'use client'

import { useEffect, useState } from 'react'
import { AdminSection } from '@/components/admin/AdminSection'
import { getPrayerRequests } from '@/lib/database'
import type { PrayerRequest } from '@/lib/supabase'

export default function AdminPrayersPage() {
  const [requests, setRequests] = useState<PrayerRequest[]>([])

  useEffect(() => {
    getPrayerRequests('active').then(setRequests)
  }, [])

  return (
    <AdminSection title="Prayer Requests" description="Review and pray over submitted requests.">
      <div className="space-y-4">
        {requests.map((req) => (
          <div key={req.id} className="rounded-xl bg-white/5 ring-1 ring-white/10 p-5">
            <p className="text-white/90 leading-relaxed">{req.request}</p>
            <p className="text-xs text-white/50 mt-3">
              {req.is_anonymous ? 'Anonymous' : req.requester_name} · {req.category}
            </p>
          </div>
        ))}
        {requests.length === 0 && <p className="text-white/50 text-center py-8">No active prayer requests.</p>}
      </div>
    </AdminSection>
  )
}
