import Link from 'next/link'
import { notFound } from 'next/navigation'
import {
  Calendar,
  MapPin,
  Clock,
  Mail,
  Phone,
  User,
  Megaphone,
  Info,
  Target,
  UserPlus,
} from 'lucide-react'
import { SiteNav } from '@/components/layout/SiteNav'
import { OptimizedImage } from '@/components/ui/optimized-image'
import { Button } from '@/components/ui/button'
import { getBandBySlug, getBandAnnouncements, getBandEvents } from '@/lib/bands'
import { format } from 'date-fns'

type Props = { params: { slug: string } }

export async function generateMetadata({ params }: Props) {
  const band = await getBandBySlug(params.slug)
  if (!band) return { title: 'Band Not Found' }
  return {
    title: `${band.name} | FaithLink`,
    description: band.description,
  }
}

export default async function BandPage({ params }: Props) {
  const band = await getBandBySlug(params.slug)
  if (!band) notFound()

  const [announcements, events] = await Promise.all([
    getBandAnnouncements(band.id, band.slug),
    getBandEvents(band.id),
  ])

  return (
    <div className="min-h-screen bg-[#0B0F12] text-white">
      <div className="relative min-h-[50vh] isolate">
        <div className="absolute inset-0 -z-10 pointer-events-none overflow-hidden">
          <OptimizedImage
            src={band.hero_image_url || '/placeholder.svg'}
            alt={band.name}
            fill
            priority
            className="opacity-50"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/70 to-[#0B0F12]" />
        </div>
        <div className="relative z-20">
          <SiteNav />
        </div>
        <div className="relative z-10 max-w-5xl mx-auto px-6 pt-8 pb-16">
          <Link href="/bands" className="text-sm text-white/60 hover:text-white mb-6 inline-block">
            ← All Bands
          </Link>
          <span className="block mb-3 text-sm text-white/70">{band.focus_area}</span>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-4">{band.name}</h1>
          <p className="text-lg text-white/85 max-w-3xl leading-relaxed">{band.description}</p>
          <div className="flex flex-wrap gap-4 mt-6 text-sm text-white/70">
            <span className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              {band.meeting_time}
            </span>
            <span className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              {band.meeting_location}
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 pb-24 grid lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-10">
          {band.important_info && (
            <section className="rounded-2xl bg-amber-500/10 ring-1 ring-amber-500/30 p-6">
              <div className="flex items-center gap-2 mb-3">
                <Info className="w-5 h-5 text-amber-400" />
                <h2 className="text-lg font-semibold">Important Information</h2>
              </div>
              <p className="text-white/85 leading-relaxed">{band.important_info}</p>
            </section>
          )}

          <section>
            <div className="flex items-center gap-2 mb-6">
              <Megaphone className="w-5 h-5" />
              <h2 className="text-2xl font-bold">Announcements & Meetings</h2>
            </div>
            {announcements.length === 0 ? (
              <p className="text-white/60 rounded-xl bg-white/5 p-6 ring-1 ring-white/10">
                No announcements yet. Check back soon.
              </p>
            ) : (
              <div className="space-y-4">
                {announcements.map((item) => (
                  <article
                    key={item.id}
                    className="rounded-2xl bg-white/5 ring-1 ring-white/10 p-6 hover:bg-white/[0.07] transition-colors"
                  >
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <h3 className="text-lg font-semibold">{item.title}</h3>
                      <span className="shrink-0 text-xs px-2 py-1 rounded-full bg-white/10 capitalize">
                        {item.type}
                      </span>
                    </div>
                    <p className="text-white/75 leading-relaxed whitespace-pre-wrap">{item.content}</p>
                    <p className="text-xs text-white/50 mt-3">
                      {format(new Date(item.published_at), 'MMMM d, yyyy')}
                    </p>
                    {item.image_url && (
                      <div className="relative mt-4 h-48 rounded-xl overflow-hidden">
                        <OptimizedImage src={item.image_url} alt="" fill sizes="(max-width: 768px) 100vw, 66vw" />
                      </div>
                    )}
                  </article>
                ))}
              </div>
            )}
          </section>

          <section>
            <div className="flex items-center gap-2 mb-6">
              <Calendar className="w-5 h-5" />
              <h2 className="text-2xl font-bold">Upcoming Events</h2>
            </div>
            {events.length === 0 ? (
              <p className="text-white/60 rounded-xl bg-white/5 p-6 ring-1 ring-white/10">
                No upcoming events scheduled for this band.
              </p>
            ) : (
              <div className="space-y-4">
                {events.map((event) => (
                  <div
                    key={event.id}
                    className="rounded-2xl bg-white/5 ring-1 ring-white/10 p-6 flex flex-col sm:flex-row gap-4"
                  >
                    <div className="shrink-0 text-center sm:w-20 rounded-xl bg-[#0f2d6e]/40 p-3">
                      <span className="block text-2xl font-bold">
                        {format(new Date(event.date), 'd')}
                      </span>
                      <span className="text-xs uppercase text-white/70">
                        {format(new Date(event.date), 'MMM')}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{event.title}</h3>
                      <p className="text-white/70 text-sm mt-1">{event.description}</p>
                      <p className="text-white/50 text-xs mt-2 flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {event.location} · {format(new Date(event.date), 'h:mm a')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          <section className="space-y-6">
            <div className="flex items-center gap-2">
              <Target className="w-5 h-5" />
              <h2 className="text-2xl font-bold">Mission & Responsibilities</h2>
            </div>
            {band.mission && (
              <div className="rounded-2xl bg-white/5 ring-1 ring-white/10 p-6">
                <h3 className="font-semibold mb-2">Our Mission</h3>
                <p className="text-white/80 leading-relaxed">{band.mission}</p>
              </div>
            )}
            {band.responsibilities && (
              <div className="rounded-2xl bg-white/5 ring-1 ring-white/10 p-6">
                <h3 className="font-semibold mb-2">Responsibilities</h3>
                <p className="text-white/80 leading-relaxed">{band.responsibilities}</p>
              </div>
            )}
            {band.how_to_join && (
              <div className="rounded-2xl bg-white/5 ring-1 ring-white/10 p-6">
                <div className="flex items-center gap-2 mb-2">
                  <UserPlus className="w-5 h-5" />
                  <h3 className="font-semibold">How to Join</h3>
                </div>
                <p className="text-white/80 leading-relaxed">{band.how_to_join}</p>
              </div>
            )}
          </section>

          {band.activities?.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold mb-4">Activities</h2>
              <ul className="grid sm:grid-cols-2 gap-2">
                {band.activities.map((activity) => (
                  <li
                    key={activity}
                    className="px-4 py-2 rounded-lg bg-white/5 ring-1 ring-white/10 text-sm text-white/80"
                  >
                    {activity}
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>

        <aside className="space-y-6">
          <div className="rounded-2xl bg-white/5 ring-1 ring-white/10 p-6 sticky top-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <User className="w-5 h-5" />
              Band Leadership
            </h2>
            <div className="relative w-24 h-24 rounded-full overflow-hidden mx-auto mb-4 ring-2 ring-white/20">
              <OptimizedImage
                src={band.leader_image_url || '/placeholder-user.svg'}
                alt={band.leader_name || 'Band leader'}
                fill
                sizes="96px"
                objectFit="cover"
              />
            </div>
            <p className="text-center font-semibold text-lg">{band.leader_name}</p>
            <p className="text-center text-white/70 text-sm">{band.leader_position}</p>
            {band.leader_tenure && (
              <p className="text-center text-white/50 text-xs mt-1">{band.leader_tenure}</p>
            )}
            <div className="mt-6 space-y-3 text-sm">
              {band.leader_email && (
                <a
                  href={`mailto:${band.leader_email}`}
                  className="flex items-center gap-2 text-white/80 hover:text-white"
                >
                  <Mail className="w-4 h-4 shrink-0" />
                  {band.leader_email}
                </a>
              )}
              {band.leader_phone && (
                <a
                  href={`tel:${band.leader_phone}`}
                  className="flex items-center gap-2 text-white/80 hover:text-white"
                >
                  <Phone className="w-4 h-4 shrink-0" />
                  {band.leader_phone}
                </a>
              )}
            </div>
            <Button asChild className="w-full mt-6 bg-white text-black hover:bg-white/90 rounded-full">
              <Link href={`mailto:${band.leader_email || 'ministry@cbusda.org'}`}>Contact Leader</Link>
            </Button>
          </div>
        </aside>
      </div>
    </div>
  )
}
