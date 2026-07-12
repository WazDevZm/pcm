import Link from 'next/link'
import { BookOpen, Megaphone, Heart, Activity, Users } from 'lucide-react'
import { MinistryPageShell } from '@/components/layout/MinistryPageShell'
import { HomeFooter } from '@/components/home/HomeFooter'
import { ScrollToBottom } from '@/components/ui/scroll-to-bottom'
import { OptimizedImage } from '@/components/ui/optimized-image'
import { Button } from '@/components/ui/button'
import { getBands } from '@/lib/bands'

const iconMap: Record<string, typeof BookOpen> = {
  'bible-study-band': BookOpen,
  'publicity-committee': Megaphone,
  'welfare-band': Heart,
  'health-band': Activity,
  'witnessing-band': Users,
}

export const metadata = {
  title: 'Bands & Committees | FaithLink',
  description: 'Explore ministry bands and committees at FaithLink.',
}

export default async function BandsPage() {
  const bands = await getBands()

  return (
    <MinistryPageShell
      heroImage="/Slider/KCM_0669.jpg"
      title="Bands & Committees"
      subtitle="Each band serves a unique role in our campus ministry. Select a band to view announcements, events, leadership, and how you can get involved."
    >
      <ScrollToBottom targetId="bands-content" label="Scroll" />
      <section id="bands-content" className="py-12 px-6 max-w-7xl mx-auto -mt-8 rounded-t-3xl bg-[#0B0F12]">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {bands.map((band) => {
            const Icon = iconMap[band.slug ?? ''] ?? Users
            return (
              <Link
                key={band.id}
                href={`/bands/${band.slug}`}
                className="group rounded-2xl bg-white/5 ring-1 ring-white/10 overflow-hidden hover:bg-white/10 hover:ring-white/20 transition-all"
              >
                <div className="relative h-40 bg-gradient-to-br from-[#0f2d6e]/60 to-black/60">
                  {band.hero_image_url && (
                    <OptimizedImage
                      src={band.hero_image_url}
                      alt={band.name}
                      fill
                      className="opacity-60 group-hover:opacity-80 transition-opacity"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  )}
                  <div className="absolute bottom-4 left-4 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white/10 ring-1 ring-white/20 flex items-center justify-center">
                      <Icon className="w-5 h-5" />
                    </div>
                    <h2 className="text-xl font-semibold">{band.name}</h2>
                  </div>
                </div>
                <div className="p-6">
                  <p className="text-white/70 text-sm line-clamp-3 mb-4">{band.description}</p>
                  <p className="text-xs text-white/50">
                    Meets: {band.meeting_time} · {band.meeting_location}
                  </p>
                </div>
              </Link>
            )
          })}
        </div>

        <div className="mt-16 text-center rounded-3xl bg-white/5 ring-1 ring-white/10 p-10">
          <h2 className="text-2xl font-bold mb-4">Not sure which band to join?</h2>
          <p className="text-white/70 mb-6 max-w-xl mx-auto">
            Attend Sabbath worship and speak with any band leader, or contact our ministry office for guidance.
          </p>
          <Button asChild className="bg-white text-black hover:bg-white/90 rounded-full">
            <Link href="/support">Contact Ministry Team</Link>
          </Button>
        </div>
      </section>
      <HomeFooter />
    </MinistryPageShell>
  )
}
