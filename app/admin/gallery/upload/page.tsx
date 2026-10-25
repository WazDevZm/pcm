'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { AdminSection } from '@/components/admin/AdminSection'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { createGalleryItem } from '@/lib/database'
import { uploadMedia } from '@/lib/data/admin'
import { useAuth } from '@/components/auth/AuthProvider'
import { toast } from 'sonner'

export default function GalleryUploadPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    title: '',
    description: '',
    category: 'events' as const,
    location: 'Campus',
    event_date: new Date().toISOString().slice(0, 16),
  })
  const [imageUrl, setImageUrl] = useState('')

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    try {
      const url = await uploadMedia(file, 'gallery')
      setImageUrl(url)
      toast.success('Image uploaded')
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Upload failed')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !imageUrl) return
    setLoading(true)
    try {
      await createGalleryItem({
        title: form.title,
        description: form.description,
        image_url: imageUrl,
        category: form.category,
        event_date: new Date(form.event_date).toISOString(),
        location: form.location,
        uploaded_by: user.id,
      })
      toast.success('Gallery item created')
      router.push('/admin/gallery')
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to save')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AdminSection title="Upload Gallery Image" description="Add a new photo to the ministry gallery.">
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
        />
        <Input type="file" accept="image/*" onChange={handleFile} className="bg-white border-border" />
        <Button type="submit" disabled={loading || !imageUrl} className="rounded-full bg-navy text-white">
          Save to gallery
        </Button>
      </form>
    </AdminSection>
  )
}
