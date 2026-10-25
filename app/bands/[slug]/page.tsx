import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, Calendar, MapPin, Clock, Mail, Phone, Megaphone, Info, Target, UserPlus, ListChecks } from 'lucide-react'
import { MinistryPageShell } from '@/components/layout/MinistryPageShell'
import { MinistryContent } from '@/components/layout/MinistryContent'
import { OptimizedImage } from '@/components/ui/optimized-image'
import { Badge, Card, EmptyState, IconTile, cardClass } from '@/components/ui/haven'
import { JoinBandButton } from '@/components/bands/JoinBandButton'
import { getBandBySlug, getBandAnnouncements, getBandEvents, getBands } from '@/lib/bands'
import { resolveImage } from '@/lib/site-images'
import { format } from 'date-fns'
import { cn } from '@/lib/utils'

type Props = { params: { slug: string } }

export async function generateMetadata({ params }: Props) {
  const band = await getBandBySlug(params.slug)
  if (!band) return { title: 'Band Not Found' }
  return {
    title: `${band.name} | The Haven`,
    description: band.description,
  }
}

function initials(name?: string | null) {
  return (name || '?')
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0])
    .join('')
    .toUpperCase()
}

function SectionTitle({ icon, children }: { icon: typeof Calendar; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 mb-5">
      <IconTile icon={icon} />
      <h2 className="text-2xl text-ink">{children}</h2>
    </div>
  )
}

export default async function BandPage({ params }: Props) {
  const band = await getBandBySlug(params.slug)
  if (!band) notFound()

  const [announcements, events, bands] = await Promise.all([
    getBandAnnouncements(band.id, band.slug),
    getBandEvents(band.id),
    getBands(),
  ])
  const index = Math.max(0, bands.findIndex((b) => b.slug === band.slug))

  return (
    <MinistryPageShell
      heroImage={resolveImage(band.hero_image_url, index)}
      eyebrow={band.focus_area || 'Ministry band'}
      title={band.name}
      subtitle={band.description}
      heroExtra={
        <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm text-white/80">
          <span className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-gold" /> {band.meeting_time}
          </span>
          <span className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-gold" /> {band.meeting_location}
          </span>
        </div>
      }
    >
      <MinistryContent>
        <div className="max-w-6xl mx-auto">
          <Link href="/bands" className="inline-flex items-center gap-1.5 text-sm font-semibold text-navy hover:text-navy-deep mb-8">
            <ArrowLeft className="h-4 w-4" /> All bands
          </Link>

          <div className="grid lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2 space-y-12">
              {band.important_info && (
                <div className="flex gap-3 rounded-2xl bg-gold-soft p-5 text-gold-ink">
                  <Info className="h-5 w-5 mt-0.5 shrink-0" />
                  <div>
                    <p className="font-bold">Important</p>
                    <p className="mt-1 leading-relaxed">{band.important_info}</p>
                  </div>
                </div>
              )}

              <section>
                <SectionTitle icon={Megaphone}>Announcements</SectionTitle>
                {announcements.length === 0 ? (
                  <Card className="p-0">
                    <EmptyState icon={Megaphone} title="No announcements yet" body="Band leaders post updates here and in the app." />
                  </Card>
                ) : (
                  <div className="space-y-4">
                    {announcements.map((item) => (
                      <Card key={item.id}>
                        <div className="flex items-start justify-between gap-4">
                          <h3 className="text-lg font-bold text-ink">{item.title}</h3>
                          <Badge tone={item.type === 'meeting' ? 'gold' : 'navy'}>{item.type}</Badge>
                        </div>
                        <p className="mt-2 text-muted-foreground leading-relaxed whitespace-pre-wrap">{item.content}</p>
                        <p className="mt-3 text-xs font-semibold text-navy">
                          {format(new Date(item.published_at), 'MMMM d, yyyy')}
                        </p>
                        {item.image_url && (
                          <div className="relative mt-4 h-56 rounded-xl overflow-hidden">
                            <OptimizedImage src={item.image_url} alt="" fill sizes="(max-width: 768px) 100vw, 66vw" />
                          </div>
                        )}
                      </Card>
                    ))}
                  </div>
                )}
              </section>

              <section>
                <SectionTitle icon={Calendar}>Upcoming events</SectionTitle>
                {events.length === 0 ? (
                  <Card className="p-0">
                    <EmptyState icon={Calendar} title="Nothing scheduled yet" body="New band events show up here as soon as they're posted." />
                  </Card>
                ) : (
                  <div className="space-y-4">
                    {events.map((event) => (
                      <Card key={event.id} className="flex gap-4">
                        <div className="flex h-16 w-16 shrink-0 flex-col items-center justify-center rounded-2xl bg-navy text-white">
                          <span className="eyebrow !text-[10px] text-gold">{format(new Date(event.date), 'MMM')}</span>
                          <span className="font-serif text-2xl leading-none">{format(new Date(event.date), 'd')}</span>
                        </div>
                        <div className="min-w-0">
                          <h3 className="font-bold text-ink">{event.title}</h3>
                          <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{event.description}</p>
                          <p className="mt-2 flex items-center gap-1.5 text-xs font-semibold text-navy">
                            <MapPin className="h-3.5 w-3.5" />
                            {event.location} · {format(new Date(event.date), 'h:mm a')}
                          </p>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </section>

              {(band.mission || band.responsibilities || band.how_to_join) && (
                <section>
                  <SectionTitle icon={Target}>Mission & how to join</SectionTitle>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {band.mission && (
                      <Card>
                        <h3 className="font-bold text-ink mb-2">Our mission</h3>
                        <p className="text-muted-foreground leading-relaxed">{band.mission}</p>
                      </Card>
                    )}
                    {band.responsibilities && (
                      <Card>
                        <h3 className="font-bold text-ink mb-2">Responsibilities</h3>
                        <p className="text-muted-foreground leading-relaxed">{band.responsibilities}</p>
                      </Card>
                    )}
                    {band.how_to_join && (
                      <Card className="sm:col-span-2 bg-navy-soft border-transparent">
                        <h3 className="font-bold text-navy mb-2 flex items-center gap-2">
                          <UserPlus className="h-5 w-5" /> How to join
                        </h3>
                        <p className="text-ink/80 leading-relaxed">{band.how_to_join}</p>
                      </Card>
                    )}
                  </div>
                </section>
              )}

              {band.activities?.length > 0 && (
                <section>
                  <SectionTitle icon={ListChecks}>Activities</SectionTitle>
                  <ul className="flex flex-wrap gap-2">
                    {band.activities.map((activity) => (
                      <li key={activity} className="rounded-full border border-border bg-white px-4 py-2 text-sm font-medium text-ink">
                        {activity}
                      </li>
                    ))}
                  </ul>
                </section>
              )}
            </div>

            <aside>
              <div className={cn(cardClass, 'p-6 lg:sticky lg:top-24 space-y-6')}>
                <JoinBandButton bandId={band.id} slug={band.slug ?? params.slug} />

                <div className="border-t border-border pt-6">
                  <p className="eyebrow text-navy mb-4">Band leader</p>
                  <div className="flex items-center gap-4">
                    {band.leader_image_url && !band.leader_image_url.endsWith('.svg') ? (
                      <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-2xl">
                        <OptimizedImage src={band.leader_image_url} alt={band.leader_name || 'Band leader'} fill sizes="64px" />
                      </div>
                    ) : (
                      <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-navy font-serif text-xl text-white">
                        {initials(band.leader_name)}
                      </span>
                    )}
                    <div className="min-w-0">
                      <p className="font-bold text-ink">{band.leader_name || 'To be announced'}</p>
                      <p className="text-sm text-muted-foreground">{band.leader_position}</p>
                      {band.leader_tenure && <p className="text-xs text-muted-foreground mt-0.5">{band.leader_tenure}</p>}
                    </div>
                  </div>
                  <div className="mt-5 space-y-2.5 text-sm">
                    {band.leader_email && (
                      <a href={`mailto:${band.leader_email}`} className="flex items-center gap-2 text-navy font-medium hover:underline break-all">
                        <Mail className="h-4 w-4 shrink-0" /> {band.leader_email}
                      </a>
                    )}
                    {band.leader_phone && (
                      <a href={`tel:${band.leader_phone}`} className="flex items-center gap-2 text-navy font-medium hover:underline">
                        <Phone className="h-4 w-4 shrink-0" /> {band.leader_phone}
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </MinistryContent>
    </MinistryPageShell>
  )
}
