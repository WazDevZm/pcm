import Link from 'next/link'
import Image from 'next/image'
import { BookOpen, Megaphone, Heart, Activity, Users, ArrowRight, Clock } from 'lucide-react'
import { MinistryPageShell } from '@/components/layout/MinistryPageShell'
import { MinistryContent } from '@/components/layout/MinistryContent'
import { Button } from '@/components/ui/button'
import { cardClass, cardHoverClass } from '@/components/ui/haven'
import { getBands } from '@/lib/bands'
import { resolveImage } from '@/lib/site-images'
import { cn } from '@/lib/utils'

const iconMap: Record<string, typeof BookOpen> = {
  'bible-study-band': BookOpen,
  'publicity-committee': Megaphone,
  'welfare-band': Heart,
  'health-band': Activity,
  'witnessing-band': Users,
}

/** Re-read bands from Supabase at most once a minute */
export const revalidate = 60

export const metadata = {
  title: 'Bands & Committees | The Haven',
  description: 'Explore ministry bands and committees at The Haven.',
}

export default async function BandsPage() {
  const bands = await getBands()

  return (
    <MinistryPageShell
      heroImage="/Slider/KCM_0669.jpg"
      eyebrow="Find your place"
      title="Ministry bands"
      subtitle="Each band serves a unique role in our campus ministry. Open a band to see announcements, events and leaders — and join in."
    >
      <MinistryContent>
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {bands.map((band, i) => {
              const Icon = iconMap[band.slug ?? ''] ?? Users
              return (
                <Link
                  key={band.id}
                  href={`/bands/${band.slug}`}
                  className={cn(cardClass, cardHoverClass, 'group overflow-hidden flex flex-col')}
                >
                  <div className="relative h-44 bg-navy-deep">
                    <Image
                      src={resolveImage(band.hero_image_url, i)}
                      alt=""
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                    />
                    <div className="absolute inset-0 photo-overlay" />
                    <div className="absolute bottom-4 left-4 right-4 flex items-center gap-3 text-white">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/15 backdrop-blur text-gold">
                        <Icon className="h-5 w-5" />
                      </span>
                      <h2 className="text-xl leading-tight">{band.name}</h2>
                    </div>
                  </div>
                  <div className="p-5 flex flex-col flex-1">
                    <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3 flex-1">{band.description}</p>
                    <div className="mt-4 flex items-center justify-between gap-3">
                      <span className="flex items-center gap-1.5 text-[13px] font-semibold text-navy min-w-0">
                        <Clock className="h-3.5 w-3.5 shrink-0" />
                        <span className="truncate">{band.meeting_time}</span>
                      </span>
                      <ArrowRight className="h-4 w-4 text-navy shrink-0 transition-transform group-hover:translate-x-1" />
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>

          <div className="mt-14 rounded-[2rem] bg-navy px-6 py-12 text-center text-white">
            <p className="eyebrow text-gold">Not sure yet?</p>
            <h2 className="mt-3 text-2xl md:text-3xl">Which band is right for me?</h2>
            <p className="mt-3 text-white/75 max-w-xl mx-auto">
              Come to Sabbath worship and talk to any band leader, or send us a message and we&apos;ll help you find your fit.
            </p>
            <Button asChild variant="gold" size="lg" className="mt-7">
              <Link href="/#contact">Talk to the ministry team</Link>
            </Button>
          </div>
        </div>
      </MinistryContent>
    </MinistryPageShell>
  )
}
