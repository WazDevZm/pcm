'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { AdminSection } from '@/components/admin/AdminSection'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { createEvent } from '@/lib/database'
import { useAuth } from '@/components/auth/AuthProvider'
import { toast } from 'sonner'

export default function NewEventPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    title: '',
    description: '',
    date: '',
    location: '',
    category: 'fellowship' as const,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return
    setLoading(true)
    try {
      await createEvent({
        title: form.title,
        description: form.description,
        date: new Date(form.date).toISOString(),
        location: form.location,
        category: form.category,
        created_by: user.id,
      })
      toast.success('Event created')
      router.push('/admin/events')
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to create event')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AdminSection title="Create Event" description="Add a new ministry event.">
      <form onSubmit={handleSubmit} className="max-w-lg space-y-4">
        <Input
          placeholder="Title"
          value={form.title}
          onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
          className="bg-white border-border"
          required
        />
        <Textarea
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
          className="bg-white border-border"
          required
        />
        <Input
          type="datetime-local"
          value={form.date}
          onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
          className="bg-white border-border"
          required
        />
        <Input
          placeholder="Location"
          value={form.location}
          onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
          className="bg-white border-border"
          required
        />
        <Button type="submit" disabled={loading} className="rounded-full bg-navy text-white">
          Create event
        </Button>
      </form>
    </AdminSection>
  )
}
