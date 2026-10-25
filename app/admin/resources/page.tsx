'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { AdminSection } from '@/components/admin/AdminSection'
import { getResources } from '@/lib/database'
import type { Resource } from '@/lib/supabase'
import { Button } from '@/components/ui/button'

export default function AdminResourcesPage() {
  const [resources, setResources] = useState<Resource[]>([])

  useEffect(() => {
    getResources().then(setResources)
  }, [])

  return (
    <AdminSection title="Resources" description="Bible studies, sermons, and ministry materials.">
      <Button asChild className="mb-6 rounded-full bg-navy text-white">
        <Link href="/admin/resources/new">Add Resource</Link>
      </Button>
      <ul className="space-y-3">
        {resources.map((r) => (
          <li key={r.id} className="rounded-xl bg-white ring-1 ring-border p-4">
            <p className="font-medium">{r.title}</p>
            <p className="text-sm text-muted-foreground">{r.type} · {r.author}</p>
          </li>
        ))}
      </ul>
    </AdminSection>
  )
}
