'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'

export function AdminSection({
  title,
  description,
  children,
}: {
  title: string
  description: string
  children?: React.ReactNode
}) {
  return (
    <div className="p-6 md:p-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{title}</h1>
        <p className="text-muted-foreground">{description}</p>
      </div>
      {children ?? (
        <div className="rounded-2xl bg-white ring-1 ring-border p-8 text-center text-muted-foreground">
          <p className="mb-4">This section is connected to your Supabase database.</p>
          <Button asChild variant="outline" className="border-border">
            <Link href="/admin">Back to Dashboard</Link>
          </Button>
        </div>
      )}
    </div>
  )
}
