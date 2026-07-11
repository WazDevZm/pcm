'use client'

import { useEffect, useState } from 'react'
import { AdminSection } from '@/components/admin/AdminSection'
import { getVolunteers } from '@/lib/database'

export default function AdminVolunteersPage() {
  const [volunteers, setVolunteers] = useState<Awaited<ReturnType<typeof getVolunteers>>>([])

  useEffect(() => {
    getVolunteers().then(setVolunteers).catch(() => setVolunteers([]))
  }, [])

  return (
    <AdminSection title="Volunteers" description="Review volunteer applications and assignments.">
      <div className="space-y-3">
        {volunteers.map((v: { id: string; role: string; status: string; user?: { name: string } }) => (
          <div key={v.id} className="rounded-xl bg-white/5 p-4 ring-1 ring-white/10">
            <p className="font-medium">{v.user?.name ?? 'Unknown'}</p>
            <p className="text-sm text-white/60">
              {v.role} · {v.status}
            </p>
          </div>
        ))}
      </div>
    </AdminSection>
  )
}
