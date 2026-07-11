'use client'

import { useEffect, useState } from 'react'
import { AdminSection } from '@/components/admin/AdminSection'
import { getCounselingRequests } from '@/lib/database'
import type { Counseling } from '@/lib/supabase'

export default function AdminCounselingPage() {
  const [requests, setRequests] = useState<Counseling[]>([])

  useEffect(() => {
    getCounselingRequests('pending').then(setRequests)
  }, [])

  return (
    <AdminSection title="Counseling Requests" description="Schedule and manage counseling appointments.">
      <div className="space-y-4">
        {requests.map((r) => (
          <div key={r.id} className="rounded-xl bg-white/5 ring-1 ring-white/10 p-5">
            <p className="font-medium">{r.name}</p>
            <p className="text-sm text-white/60">{r.email} · {r.service_type}</p>
            <p className="text-white/80 mt-2 text-sm">{r.message}</p>
          </div>
        ))}
      </div>
    </AdminSection>
  )
}
