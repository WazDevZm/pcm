import Link from 'next/link'
import { getBands } from '@/lib/bands'
import { AdminSection } from '@/components/admin/AdminSection'
import { Button } from '@/components/ui/button'

export default async function AdminBandsPage() {
  const bands = await getBands()

  return (
    <AdminSection
      title="Bands & Committees"
      description="Manage all ministry bands. Band leaders use the Band Admin portal for day-to-day updates."
    >
      <div className="grid gap-4 md:grid-cols-2">
        {bands.map((band) => (
          <div
            key={band.id}
            className="rounded-2xl bg-white/5 ring-1 ring-white/10 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
          >
            <div>
              <h2 className="font-semibold text-lg">{band.name}</h2>
              <p className="text-sm text-white/60">{band.slug}</p>
            </div>
            <div className="flex gap-2">
              <Button asChild size="sm" variant="outline" className="border-white/20">
                <Link href={`/bands/${band.slug}`}>View</Link>
              </Button>
              <Button asChild size="sm" className="bg-white text-black">
                <Link href={`/band-admin/${band.slug}`}>Manage</Link>
              </Button>
            </div>
          </div>
        ))}
      </div>
    </AdminSection>
  )
}
