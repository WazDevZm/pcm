/* eslint-disable @next/next/no-img-element -- posters are exported to PNG with html-to-image, which needs plain <img> */
import type { CSSProperties, ReactNode } from 'react'

/**
 * Studio poster templates. Each renders at a fixed pixel size (1080 wide) so the PNG export
 * matches the preview exactly. Branding is locked: the CBU SDA PCM shield and the ministry's
 * full name only — no other logos.
 */

export const MINISTRY_LINES = ['The Copperbelt University', 'SDA Public Campus Ministries'] as const

export const NAVY = '#0f2d6e'
export const NAVY_DEEP = '#0a1f4d'
export const GOLD = '#d9a441'
export const INK = '#0B0F12'

export type FormatId = 'portrait' | 'square' | 'story'
export const FORMATS: Record<FormatId, { label: string; w: number; h: number; hint: string }> = {
  portrait: { label: 'Portrait', w: 1080, h: 1350, hint: 'Instagram & Facebook feed' },
  square: { label: 'Square', w: 1080, h: 1080, hint: 'WhatsApp & feed' },
  story: { label: 'Story', w: 1080, h: 1920, hint: 'WhatsApp status & stories' },
}

export const STUDIO_PHOTOS = [
  { id: 'group', label: 'Group', src: '/Slider/KCM_0549.jpg' },
  { id: 'smiles', label: 'Smiles', src: '/Slider/KCM_0669.jpg' },
  { id: 'study', label: 'Study', src: '/Features/KCM_0729.jpg' },
  { id: 'campus', label: 'Campus', src: '/Features/KCM_0741.jpg' },
  { id: 'circle', label: 'Together', src: '/Slider/KCM_0681.jpg' },
  { id: 'friends', label: 'Friends', src: '/Slider/KCM_0799.jpg' },
  { id: 'line', label: 'Line-up', src: '/Slider/KCM_0822.jpg' },
] as const

export type Background = { kind: 'brand' } | { kind: 'photo'; src: string; focus: number }

export type FieldType = 'text' | 'textarea' | 'image' | 'background'
export interface Field {
  key: string
  label: string
  type: FieldType
  placeholder?: string
  hint?: string
  /** Shorter text fits the design; shown as a soft limit */
  max?: number
}

export interface PosterState {
  values: Record<string, string>
  background: Background
  format: FormatId
  /** Where the ministry name sits next to the shield */
  brandLayout: 'side' | 'below'
}

// ───────────────────────── Shared pieces ─────────────────────────

const serif = 'var(--font-serif), Georgia, serif'
const sans = 'var(--font-sans), -apple-system, "Helvetica Neue", Arial, sans-serif'

function MinistryMark({ layout, align = 'left' }: { layout: 'side' | 'below'; align?: 'left' | 'center' }) {
  const name = (
    <div style={{ fontFamily: sans, fontWeight: 800, fontSize: 21, lineHeight: 1.3, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#fff', textAlign: layout === 'below' ? 'center' : 'left' }}>
      {MINISTRY_LINES[0]}
      <br />
      <span style={{ color: 'rgba(255,255,255,0.78)' }}>{MINISTRY_LINES[1]}</span>
    </div>
  )
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: layout === 'below' ? 'column' : 'row',
        alignItems: 'center',
        justifyContent: layout === 'below' || align === 'center' ? 'center' : 'flex-start',
        gap: layout === 'below' ? 16 : 22,
      }}
    >
      <img src="/pcm-shield.png" alt="" style={{ height: layout === 'below' ? 112 : 96, width: 'auto' }} />
      {name}
    </div>
  )
}

function Backdrop({ bg, tint = 'bottom', brand }: { bg: Background; tint?: 'bottom' | 'full'; brand: ReactNode }) {
  if (bg.kind === 'photo' && bg.src) {
    return (
      <>
        <img
          src={bg.src}
          alt=""
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: `50% ${bg.focus}%` }}
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              tint === 'full'
                ? 'linear-gradient(180deg, rgba(10,31,77,0.78) 0%, rgba(10,31,77,0.62) 40%, rgba(10,31,77,0.92) 100%)'
                : 'linear-gradient(180deg, rgba(10,31,77,0.55) 0%, rgba(10,31,77,0.25) 28%, rgba(10,31,77,0.80) 58%, rgba(10,31,77,0.97) 100%)',
          }}
        />
      </>
    )
  }
  return <>{brand}</>
}

function Verse({ text, reference, align = 'center', size = 38 }: { text?: string; reference?: string; align?: 'center' | 'left'; size?: number }) {
  if (!text) return null
  return (
    <div style={{ textAlign: align, maxWidth: 860, margin: align === 'center' ? '0 auto' : 0 }}>
      <div style={{ fontFamily: serif, fontStyle: 'italic', fontWeight: 400, fontSize: size, lineHeight: 1.35, color: 'rgba(255,255,255,0.92)' }}>
        “{text}”
      </div>
      {reference && (
        <div style={{ marginTop: 14, fontFamily: sans, fontWeight: 800, fontSize: 22, letterSpacing: '0.16em', textTransform: 'uppercase', color: GOLD }}>
          {reference}
        </div>
      )}
    </div>
  )
}

function Frame({ state, children, style }: { state: PosterState; children: ReactNode; style?: CSSProperties }) {
  const { w, h } = FORMATS[state.format]
  return (
    <div
      style={{
        position: 'relative',
        width: w,
        height: h,
        overflow: 'hidden',
        background: NAVY,
        color: '#fff',
        fontFamily: sans,
        ...style,
      }}
    >
      {children}
    </div>
  )
}

const Spacer = () => <div style={{ flex: 1 }} />
const Page = ({ children, pad = 80 }: { children: ReactNode; pad?: number }) => (
  <div style={{ position: 'absolute', inset: 0, padding: pad, display: 'flex', flexDirection: 'column' }}>{children}</div>
)

/** Scales type for the square format, which has less height to work with */
const k = (state: PosterState) => (state.format === 'square' ? 0.82 : state.format === 'story' ? 1.08 : 1)

// ───────────────────────── Brand backgrounds ─────────────────────────

function SunriseBg() {
  return (
    <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(180deg, ${NAVY_DEEP} 0%, ${NAVY} 55%, #1d3f86 100%)` }}>
      <svg width="100%" height="100%" viewBox="0 0 1080 1350" preserveAspectRatio="xMidYMax slice" style={{ position: 'absolute', inset: 0 }}>
        <defs>
          <radialGradient id="sun" cx="50%" cy="100%" r="60%">
            <stop offset="0" stopColor={GOLD} stopOpacity="0.55" />
            <stop offset="0.45" stopColor={GOLD} stopOpacity="0.12" />
            <stop offset="1" stopColor={GOLD} stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect width="1080" height="1350" fill="url(#sun)" />
        {[260, 380, 500, 620, 740].map((r, i) => (
          <circle key={r} cx="540" cy="1350" r={r} fill="none" stroke={GOLD} strokeOpacity={0.22 - i * 0.035} strokeWidth="2" />
        ))}
        {Array.from({ length: 13 }).map((_, i) => {
          const a = Math.PI + (Math.PI * (i + 1)) / 14
          return (
            <line key={i} x1={540 + Math.cos(a) * 300} y1={1350 + Math.sin(a) * 300} x2={540 + Math.cos(a) * 980} y2={1350 + Math.sin(a) * 980} stroke={GOLD} strokeOpacity="0.07" strokeWidth="3" />
          )
        })}
      </svg>
    </div>
  )
}

function SabbathBg() {
  const stars = Array.from({ length: 46 }).map((_, i) => ({
    x: (i * 233) % 1080,
    y: (i * 97) % 640,
    r: (i % 3) + 1,
    o: 0.25 + ((i * 37) % 50) / 100,
  }))
  return (
    <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(180deg, ${INK} 0%, ${NAVY_DEEP} 42%, ${NAVY} 70%, #6d5326 100%)` }}>
      <svg width="100%" height="100%" viewBox="0 0 1080 1350" preserveAspectRatio="xMidYMax slice" style={{ position: 'absolute', inset: 0 }}>
        <defs>
          <radialGradient id="dusk" cx="50%" cy="100%" r="70%">
            <stop offset="0" stopColor={GOLD} stopOpacity="0.85" />
            <stop offset="0.35" stopColor={GOLD} stopOpacity="0.25" />
            <stop offset="1" stopColor={GOLD} stopOpacity="0" />
          </radialGradient>
        </defs>
        {stars.map((s, i) => (
          <circle key={i} cx={s.x} cy={s.y} r={s.r} fill="#fff" opacity={s.o} />
        ))}
        <rect width="1080" height="1350" fill="url(#dusk)" />
        <path d="M0 1240 Q 270 1200 540 1222 T 1080 1230 V1350 H0Z" fill={INK} opacity="0.55" />
      </svg>
    </div>
  )
}

function PrayerBg() {
  return (
    <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(900px 700px at 80% 10%, rgba(217,164,65,0.20), transparent 60%), linear-gradient(160deg, ${NAVY} 0%, ${NAVY_DEEP} 60%, ${INK} 100%)` }}>
      <svg width="100%" height="100%" viewBox="0 0 1080 1350" preserveAspectRatio="xMidYMid slice" style={{ position: 'absolute', inset: 0 }}>
        {Array.from({ length: 9 }).map((_, i) => (
          <circle key={i} cx="900" cy="150" r={120 + i * 110} fill="none" stroke="#fff" strokeOpacity={0.06 - i * 0.005} strokeWidth="2" />
        ))}
      </svg>
    </div>
  )
}

function VespersBg() {
  return <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(180deg, ${NAVY} 0%, ${NAVY_DEEP} 100%)` }} />
}

// ───────────────────────── Templates ─────────────────────────

function NewWeek({ state }: { state: PosterState }) {
  const v = state.values
  const s = k(state)
  return (
    <Frame state={state}>
      <Backdrop bg={state.background} brand={<SunriseBg />} />
      <Page>
        <MinistryMark layout={state.brandLayout} align="center" />
        <Spacer />
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontFamily: serif, fontStyle: 'italic', color: GOLD, fontSize: 120 * s, lineHeight: 1 }}>{v.greeting}</div>
          <div style={{ fontFamily: serif, fontWeight: 700, fontSize: 196 * s, lineHeight: 0.92, letterSpacing: '-0.03em', marginTop: 8 }}>{v.title}</div>
          {v.message && (
            <div style={{ margin: '44px auto 0', maxWidth: 820, fontSize: 36 * s, lineHeight: 1.4, color: 'rgba(255,255,255,0.88)' }}>{v.message}</div>
          )}
        </div>
        <div style={{ height: 56 * s }} />
        <div style={{ width: 120, height: 4, background: GOLD, margin: '0 auto 44px', borderRadius: 4 }} />
        <Verse text={v.verse} reference={v.reference} size={36 * s} />
        <Spacer />
      </Page>
    </Frame>
  )
}

function Sabbath({ state }: { state: PosterState }) {
  const v = state.values
  const s = k(state)
  return (
    <Frame state={state}>
      <Backdrop bg={state.background} brand={<SabbathBg />} tint="full" />
      <Page>
        <MinistryMark layout={state.brandLayout} align="center" />
        <Spacer />
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontFamily: serif, fontStyle: 'italic', color: GOLD, fontSize: 128 * s, lineHeight: 1 }}>{v.greeting}</div>
          <div style={{ fontFamily: serif, fontWeight: 700, fontSize: 210 * s, lineHeight: 0.92, letterSpacing: '-0.03em', marginTop: 4 }}>{v.title}</div>
          {v.subtitle && (
            <div style={{ marginTop: 36, fontSize: 38 * s, lineHeight: 1.35, color: 'rgba(255,255,255,0.88)' }}>{v.subtitle}</div>
          )}
        </div>
        <div style={{ height: 64 * s }} />
        <Verse text={v.verse} reference={v.reference} size={36 * s} />
        <Spacer />
        {v.detail && (
          <div style={{ alignSelf: 'center', padding: '20px 40px', borderRadius: 999, border: `2px solid ${GOLD}`, fontWeight: 800, fontSize: 28 * s, letterSpacing: '0.04em', color: '#fff', background: 'rgba(11,15,18,0.35)' }}>
            {v.detail}
          </div>
        )}
      </Page>
    </Frame>
  )
}

function Prayer({ state }: { state: PosterState }) {
  const v = state.values
  const s = k(state)
  const days = (v.days || '').split(/[·,|]/).map((d) => d.trim()).filter(Boolean)
  return (
    <Frame state={state}>
      <Backdrop bg={state.background} brand={<PrayerBg />} tint="full" />
      <Page>
        <MinistryMark layout={state.brandLayout} />
        <Spacer />
        <div style={{ fontFamily: sans, fontWeight: 800, fontSize: 26 * s, letterSpacing: '0.22em', textTransform: 'uppercase', color: GOLD }}>{v.host}</div>
        <div style={{ fontFamily: serif, fontWeight: 700, fontSize: 250 * s, lineHeight: 0.9, letterSpacing: '-0.04em', color: GOLD, marginTop: 18 }}>{v.time}</div>
        <div style={{ fontFamily: serif, fontWeight: 700, fontSize: 118 * s, lineHeight: 0.98, letterSpacing: '-0.02em', marginTop: 10 }}>{v.title}</div>
        {days.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14, marginTop: 44 * s }}>
            {days.map((d) => (
              <span key={d} style={{ padding: '14px 30px', borderRadius: 999, background: '#fff', color: NAVY, fontWeight: 800, fontSize: 30 * s }}>{d}</span>
            ))}
          </div>
        )}
        {v.venue && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 18, marginTop: 32 * s, fontSize: 36 * s, fontWeight: 700 }}>
            <svg width={40 * s} height={40 * s} viewBox="0 0 24 24" fill="none" stroke={GOLD} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s7-6.2 7-12a7 7 0 1 0-14 0c0 5.8 7 12 7 12Z" /><circle cx="12" cy="10" r="2.6" /></svg>
            {v.venue}
          </div>
        )}
        <div style={{ height: 52 * s }} />
        <Verse text={v.verse} reference={v.reference} align="left" size={34 * s} />
        <Spacer />
        {v.note && (
          <div style={{ paddingTop: 26, borderTop: '2px solid rgba(255,255,255,0.18)', fontWeight: 800, fontSize: 24 * s, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.75)' }}>{v.note}</div>
        )}
      </Page>
    </Frame>
  )
}

function Vespers({ state }: { state: PosterState }) {
  const v = state.values
  const s = k(state)
  const photoSize = 300 * s
  const details = [
    ['M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z', v.date],
    ['M12 6v6l4 2M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0Z', v.time],
    ['M12 22s7-6.2 7-12a7 7 0 1 0-14 0c0 5.8 7 12 7 12Zm0-9.4a2.6 2.6 0 1 0 0-5.2 2.6 2.6 0 0 0 0 5.2Z', v.venue],
  ].filter(([, t]) => t)
  return (
    <Frame state={state}>
      <Backdrop bg={state.background} brand={<VespersBg />} tint="full" />
      <Page>
        <MinistryMark layout={state.brandLayout} />
        <Spacer />
        <div style={{ fontFamily: sans, fontWeight: 800, fontSize: 30 * s, letterSpacing: '0.24em', textTransform: 'uppercase', color: GOLD }}>{v.day}</div>
        <div style={{ fontFamily: serif, fontWeight: 700, fontSize: 200 * s, lineHeight: 0.9, letterSpacing: '-0.035em', marginTop: 8 }}>{v.title}</div>
        {v.topic && (
          <div style={{ fontFamily: serif, fontStyle: 'italic', fontSize: 58 * s, lineHeight: 1.12, color: GOLD, marginTop: 22, maxWidth: 920 }}>“{v.topic}”</div>
        )}
        <div style={{ display: 'flex', alignItems: 'center', gap: 34, marginTop: 48 * s }}>
          <div style={{ width: photoSize, height: photoSize * 1.12, flex: 'none', borderRadius: `${photoSize / 2}px ${photoSize / 2}px 28px 28px`, border: `6px solid ${GOLD}`, overflow: 'hidden', background: NAVY_DEEP, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {v.presenterPhoto ? (
              <img src={v.presenterPhoto} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: `50% ${v.presenterFocus || 30}%` }} />
            ) : (
              <span style={{ fontFamily: serif, fontWeight: 700, fontSize: photoSize * 0.38, color: GOLD }}>
                {(v.presenter || '?').replace(/^(Pastor|Pr\.?|Elder|Dr\.?|Mr\.?|Mrs\.?|Ms\.?|Bro\.?|Sis\.?)\s+/i, '').split(/\s+/).map((p) => p[0]).slice(0, 2).join('')}
              </span>
            )}
          </div>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontFamily: sans, fontWeight: 800, fontSize: 22 * s, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.7)' }}>{v.presenterLabel || 'Presenter'}</div>
            <div style={{ fontFamily: serif, fontWeight: 700, fontSize: 62 * s, lineHeight: 1.05, marginTop: 10 }}>{v.presenter}</div>
            {v.presenterRole && <div style={{ fontSize: 30 * s, marginTop: 10, color: 'rgba(255,255,255,0.85)' }}>{v.presenterRole}</div>}
          </div>
        </div>
        <Spacer />
        {details.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '18px 40px', paddingTop: 30, borderTop: '2px solid rgba(255,255,255,0.2)' }}>
            {details.map(([icon, text]) => (
              <div key={icon} style={{ display: 'flex', alignItems: 'center', gap: 14, fontSize: 32 * s, fontWeight: 700 }}>
                <svg width={34 * s} height={34 * s} viewBox="0 0 24 24" fill="none" stroke={GOLD} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d={icon} /></svg>
                {text}
              </div>
            ))}
          </div>
        )}
      </Page>
    </Frame>
  )
}

// ───────────────────────── Registry ─────────────────────────

export interface Template {
  id: string
  name: string
  blurb: string
  fields: Field[]
  defaults: Record<string, string>
  background: Background
  render: (props: { state: PosterState }) => ReactNode
}

const verseFields: Field[] = [
  { key: 'verse', label: 'Bible verse', type: 'textarea', max: 120, hint: 'Leave empty to hide' },
  { key: 'reference', label: 'Verse reference', type: 'text', placeholder: 'e.g. Psalm 23:1' },
]

const vespersFields: Field[] = [
  { key: 'topic', label: 'Topic / theme', type: 'text', max: 40 },
  { key: 'presenter', label: 'Presenter’s name', type: 'text', max: 30 },
  { key: 'presenterRole', label: 'Presenter’s title or church', type: 'text', max: 40, hint: 'Optional' },
  { key: 'presenterPhoto', label: 'Presenter’s photo', type: 'image', hint: 'A clear head-and-shoulders photo works best' },
  { key: 'date', label: 'Date', type: 'text', placeholder: 'e.g. Wed 29 Oct' },
  { key: 'time', label: 'Time', type: 'text', placeholder: 'e.g. 18:00' },
  { key: 'venue', label: 'Venue', type: 'text' },
  { key: 'background', label: 'Background photo', type: 'background', hint: 'Choose one of ours or upload a photo of people' },
]

export const TEMPLATES: Template[] = [
  {
    id: 'new-week',
    name: 'Happy New Week',
    blurb: 'Sunday or Monday greeting with a verse',
    fields: [
      { key: 'greeting', label: 'Greeting', type: 'text', max: 12 },
      { key: 'title', label: 'Headline', type: 'text', max: 12 },
      { key: 'message', label: 'Message', type: 'textarea', max: 110 },
      ...verseFields,
      { key: 'background', label: 'Background', type: 'background' },
    ],
    defaults: {
      greeting: 'Happy',
      title: 'New Week',
      message: 'May this week be full of God’s grace, purpose and new beginnings.',
      verse: 'His mercies are new every morning: great is thy faithfulness.',
      reference: 'Lamentations 3:23',
    },
    background: { kind: 'brand' },
    render: NewWeek,
  },
  {
    id: 'sabbath',
    name: 'Happy Sabbath',
    blurb: 'Friday-evening and Sabbath greeting',
    fields: [
      { key: 'greeting', label: 'Greeting', type: 'text', max: 12 },
      { key: 'title', label: 'Headline', type: 'text', max: 10 },
      { key: 'subtitle', label: 'Line under the headline', type: 'text', max: 60 },
      ...verseFields,
      { key: 'detail', label: 'Service times (optional)', type: 'text', max: 50, placeholder: 'e.g. Divine Service · 10:00' },
      { key: 'background', label: 'Background', type: 'background' },
    ],
    defaults: {
      greeting: 'Happy',
      title: 'Sabbath',
      subtitle: 'A day to rest, worship and be renewed',
      verse: 'Remember the sabbath day, to keep it holy.',
      reference: 'Exodus 20:8',
      detail: 'Join us for worship this Sabbath',
    },
    background: { kind: 'brand' },
    render: Sabbath,
  },
  {
    id: 'prayer',
    name: '19:30 Prayer Meetings',
    blurb: 'Prayer Band · Sunday to Tuesday',
    fields: [
      { key: 'host', label: 'Hosted by', type: 'text', max: 30 },
      { key: 'time', label: 'Time', type: 'text', max: 6 },
      { key: 'title', label: 'Headline', type: 'text', max: 20 },
      { key: 'days', label: 'Days', type: 'text', hint: 'Separate days with ·  or commas' },
      { key: 'venue', label: 'Venue', type: 'text', max: 40 },
      ...verseFields,
      { key: 'note', label: 'Footer note', type: 'text', max: 40 },
      { key: 'background', label: 'Background', type: 'background' },
    ],
    defaults: {
      host: 'The Prayer Band',
      time: '19:30',
      title: 'Prayer Meetings',
      days: 'Sunday · Monday · Tuesday',
      venue: 'Mechanical Engineering Workshop',
      verse: 'Pray without ceasing.',
      reference: '1 Thessalonians 5:17',
      note: 'Every week · All are welcome',
    },
    background: { kind: 'brand' },
    render: Prayer,
  },
  {
    id: 'vespers-wednesday',
    name: 'Wednesday Vespers',
    blurb: 'Midweek vespers with the presenter’s photo',
    fields: vespersFields,
    defaults: {
      day: 'Wednesday',
      title: 'Vespers',
      topic: 'Walking in the Light',
      presenter: 'Presenter’s Name',
      presenterRole: 'Guest speaker',
      presenterLabel: 'Presenter',
      date: 'Wed 29 Oct',
      time: '18:00',
      venue: 'Ministry Center',
    },
    background: { kind: 'photo', src: '/Slider/KCM_0549.jpg', focus: 35 },
    render: Vespers,
  },
  {
    id: 'vespers-friday',
    name: 'Friday Vespers',
    blurb: 'Welcome the Sabbath with the presenter’s photo',
    fields: vespersFields,
    defaults: {
      day: 'Friday',
      title: 'Vespers',
      topic: 'Enter His Rest',
      presenter: 'Presenter’s Name',
      presenterRole: 'Guest speaker',
      presenterLabel: 'Presenter',
      date: 'Fri 31 Oct',
      time: '18:00',
      venue: 'Ministry Center',
    },
    background: { kind: 'photo', src: '/Slider/KCM_0822.jpg', focus: 40 },
    render: Vespers,
  },
]

export function initialState(t: Template): PosterState {
  return { values: { ...t.defaults }, background: t.background, format: 'portrait', brandLayout: 'side' }
}
