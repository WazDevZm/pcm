'use client'

import { useEffect, useState } from 'react'
import { AdminSection } from '@/components/admin/AdminSection'
import { getGalleryItems } from '@/lib/database'
import type { GalleryItem } from '@/lib/supabase'
import { OptimizedImage } from '@/components/ui/optimized-image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function AdminGalleryPage() {
  const [items, setItems] = useState<GalleryItem[]>([])

  useEffect(() => {
    getGalleryItems().then(setItems)
  }, [])

  return (
    <AdminSection title="Gallery" description="Manage ministry photos and albums.">
      <div className="mb-6">
        <Button asChild className="rounded-full bg-navy text-white">
          <Link href="/admin/gallery/upload">Upload Image</Link>
        </Button>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {items.map((item) => (
          <div key={item.id} className="rounded-xl overflow-hidden bg-white ring-1 ring-border">
            <div className="relative h-32">
              <OptimizedImage src={item.image_url} alt={item.title} fill sizes="200px" />
            </div>
            <p className="p-3 text-sm font-medium truncate">{item.title}</p>
          </div>
        ))}
        {items.length === 0 && (
          <p className="col-span-full text-muted-foreground text-center py-8">No gallery items yet.</p>
        )}
      </div>
    </AdminSection>
  )
}
