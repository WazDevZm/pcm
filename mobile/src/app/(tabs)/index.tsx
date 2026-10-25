import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Dimensions, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { HavenWordmark, PcmEndorsement, PcmShield } from '@/components/brand';
import { LinearGradientOverlay } from '@/components/overlay';
import { Button, Card, IconTile, Ionicons, SectionHeader, Txt, type IconName } from '@/components/ui';
import { HERO_IMAGES } from '@/data/images';
import { POSTERS } from '@/data/posters';
import { useAsync } from '@/hooks/useAsync';
import { getEvents } from '@/lib/api';
import { BRAND } from '@/lib/brand';
import { formatDateTime } from '@/lib/format';
import { useAuth } from '@/providers/AuthProvider';
import { colors, radius, space } from '@/theme';

const { height: SCREEN_H, width: SCREEN_W } = Dimensions.get('window');

const QUICK_LINKS: { icon: IconName; label: string; href: Parameters<typeof router.push>[0] }[] = [
  { icon: 'heart-outline', label: 'Prayer', href: '/prayer' },
  { icon: 'chatbubbles-outline', label: 'Counseling', href: '/counseling' },
  { icon: 'newspaper-outline', label: 'News', href: '/news' },
  { icon: 'images-outline', label: 'Gallery', href: '/gallery' },
  { icon: 'book-outline', label: 'Resources', href: '/resources' },
  { icon: 'hand-left-outline', label: 'Get involved', href: '/get-involved' },
];

const FEATURES: { icon: IconName; title: string; body: string }[] = [
  { icon: 'book-outline', title: 'Biblical teaching', body: 'Weekly Scripture study and discipleship led by experienced leaders.' },
  { icon: 'people-outline', title: 'A welcoming family', body: 'A Christ-centred home for students from every background on campus.' },
  { icon: 'gift-outline', title: 'Always free', body: 'Worship, Bible study and fellowship — open to every student.' },
  { icon: 'sunny-outline', title: 'Campus outreach', body: "Carry God's love through service, evangelism and practical care." },
];

const JOURNEY = [
  { step: '01', title: 'Worship', body: 'Sabbath worship and praise together.', href: '/events' as const },
  { step: '02', title: 'Study', body: "Go deeper in God's Word in small groups.", href: '/bands/bible-study-band' as const },
  { step: '03', title: 'Belong', body: 'Build friendships that last beyond campus.', href: '/programs' as const },
  { step: '04', title: 'Serve', body: 'Find your place in a ministry band.', href: '/bands' as const },
];

const FAQS = [
  {
    q: 'What does The Haven offer?',
    a: 'Sabbath worship, Bible studies, prayer ministry, evangelism training, counseling, and five ministry bands: Bible Study, Welfare, Health, Witnessing and Publicity.',
  },
  { q: 'How do I join?', a: 'Come to any weekly gathering, or open a band in the Bands tab and tap "Join this band".' },
  {
    q: 'Is counseling confidential?',
    a: 'Yes. Our pastoral team offers confidential spiritual guidance for academic, personal and faith concerns.',
  },
  { q: 'How do I get baptised?', a: "Talk to a leader after worship or send us a message — we'll walk with you through Bible study and preparation." },
];

function HeroSlider() {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setIndex((i) => (i + 1) % HERO_IMAGES.length), 5500);
    return () => clearInterval(t);
  }, []);
  return (
    <>
      {HERO_IMAGES.map((src, i) => (
        <Image
          key={i}
          source={src}
          style={[StyleSheet.absoluteFill, { opacity: i === index ? 1 : 0 }]}
          contentFit="cover"
          transition={900}
          priority={i === 0 ? 'high' : 'normal'}
        />
      ))}
      <LinearGradientOverlay from={0.35} to={0.95} />
    </>
  );
}

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const { profile } = useAuth();
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const events = useAsync(() => getEvents({ upcoming: true }));

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.light }} contentContainerStyle={{ paddingBottom: space.xxxl }}>
      {/* Hero — the big image stays front and centre */}
      <View style={{ height: Math.max(560, SCREEN_H * 0.82), backgroundColor: colors.navyDeep }}>
        <HeroSlider />
        <View style={[styles.heroTop, { paddingTop: insets.top + space.sm }]}>
          <View style={styles.brandRow}>
            <HavenWordmark size={24} tone="white" />
            <View style={styles.brandDivider} />
            <PcmShield height={34} />
          </View>
          <Pressable
            onPress={() => router.push(profile ? '/account' : '/login')}
            hitSlop={10}
            accessibilityLabel={profile ? 'Your account' : 'Sign in'}
            style={styles.heroAvatar}>
            <Ionicons name={profile ? 'person' : 'person-outline'} size={18} color={colors.white} />
          </Pressable>
        </View>
        <View style={styles.heroBody}>
          <Txt variant="label" color={colors.gold} style={{ marginBottom: space.sm }}>
            {profile ? `Welcome back, ${profile.name.split(' ')[0]}` : BRAND.tagline}
          </Txt>
          <Txt style={styles.heroTitle}>
            Find your place at <Txt style={[styles.heroTitle, styles.heroAccent]}>The Haven</Txt>
          </Txt>
          <Txt color="rgba(255,255,255,0.82)" style={{ fontSize: 16, lineHeight: 24, marginTop: space.md }}>
            A shelter on campus for worship, Bible study, real friendship and service that carries Christ&apos;s light
            beyond the classroom.
          </Txt>
          <View style={{ flexDirection: 'row', gap: space.sm, marginTop: space.xl }}>
            <Button label="Join a band" variant="gold" href="/bands" style={{ flex: 1 }} />
            <Button label="This week" variant="light" href="/events" style={{ flex: 1 }} />
          </View>
          <View style={styles.stats}>
            {[
              ['5', 'Ministry bands'],
              ['Weekly', 'Worship & study'],
              ['Free', 'For every student'],
            ].map(([v, l]) => (
              <View key={l}>
                <Txt style={{ color: colors.white, fontSize: 20, fontWeight: '800' }}>{v}</Txt>
                <Txt variant="small" color="rgba(255,255,255,0.6)">
                  {l}
                </Txt>
              </View>
            ))}
          </View>
        </View>
      </View>

      {/* Quick links */}
      <View style={styles.quickGrid}>
        {QUICK_LINKS.map((q) => (
          <Pressable
            key={q.label}
            onPress={() => router.push(q.href)}
            style={({ pressed }) => [styles.quickItem, pressed && { opacity: 0.7 }]}
            accessibilityRole="button">
            <IconTile icon={q.icon} />
            <Txt variant="small" style={{ fontWeight: '600' }} center>
              {q.label}
            </Txt>
          </Pressable>
        ))}
      </View>

      {/* What's on — posters */}
      <View style={[styles.section, { backgroundColor: colors.dark, paddingVertical: space.xxl }]}>
        <View style={{ paddingHorizontal: space.lg }}>
          <SectionHeader eyebrow="What's on" title="Every week at The Haven" dark action={{ label: 'Posters', href: '/posters' }} />
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          snapToInterval={SCREEN_W * 0.62 + space.md}
          decelerationRate="fast"
          contentContainerStyle={{ paddingHorizontal: space.lg, gap: space.md, marginTop: space.lg }}>
          {POSTERS.map((p) => (
            <Pressable key={p.id} onPress={() => router.push('/posters')} accessibilityLabel={p.title}>
              <Image source={p.image} style={styles.poster} contentFit="cover" />
            </Pressable>
          ))}
        </ScrollView>
      </View>

      {/* Upcoming events */}
      <View style={[styles.section, { paddingHorizontal: space.lg, gap: space.md }]}>
        <SectionHeader eyebrow="Coming up" title="Upcoming events" action={{ label: 'All', href: '/events' }} />
        {(events.data ?? []).slice(0, 3).map((e) => (
          <Card key={e.id} onPress={() => router.push(`/events/${e.id}`)}>
            <Txt variant="small" color={colors.navy} style={{ fontWeight: '700' }}>
              {formatDateTime(e.date)}
            </Txt>
            <Txt variant="h3" style={{ marginTop: 4 }}>
              {e.title}
            </Txt>
            <Txt variant="small" color={colors.textMuted}>
              {e.location}
            </Txt>
          </Card>
        ))}
        {!events.loading && !(events.data ?? []).length ? (
          <Card>
            <Txt color={colors.textMuted}>
              New events are posted every week. Check back soon, or join a band to hear first.
            </Txt>
          </Card>
        ) : null}
      </View>

      {/* Why join */}
      <View style={[styles.section, { paddingHorizontal: space.lg, gap: space.md }]}>
        <SectionHeader eyebrow="Why join us" title="Grow in Christ on campus" />
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: space.md }}>
          {FEATURES.map((f) => (
            <Card key={f.title} style={{ width: (SCREEN_W - space.lg * 2 - space.md) / 2, gap: space.sm }}>
              <IconTile icon={f.icon} />
              <Txt variant="h3">{f.title}</Txt>
              <Txt variant="small" color={colors.textMuted}>
                {f.body}
              </Txt>
            </Card>
          ))}
        </View>
      </View>

      {/* Journey */}
      <View style={[styles.section, { paddingHorizontal: space.lg, gap: space.md }]}>
        <SectionHeader eyebrow="Your path" title="Your faith journey" />
        {JOURNEY.map((j) => (
          <Card key={j.step} onPress={() => router.push(j.href)} style={{ flexDirection: 'row', gap: space.lg, alignItems: 'center' }}>
            <Txt style={{ fontSize: 28, fontWeight: '800', color: colors.navySoft, width: 44 }}>{j.step}</Txt>
            <View style={{ flex: 1 }}>
              <Txt variant="h3">{j.title}</Txt>
              <Txt variant="small" color={colors.textMuted}>
                {j.body}
              </Txt>
            </View>
            <Ionicons name="arrow-forward" size={18} color={colors.navy} />
          </Card>
        ))}
      </View>

      {/* CTA */}
      <View style={{ paddingHorizontal: space.lg, marginTop: space.xxl }}>
        <View style={styles.cta}>
          <Txt variant="label" color={colors.gold}>
            Rooted in Scripture
          </Txt>
          <Txt variant="h1" color={colors.white} center>
            Ready to take the next step?
          </Txt>
          <Txt color="rgba(255,255,255,0.8)" center>
            New to faith or growing deeper — there&apos;s a place for you here.
          </Txt>
          <Button label={profile ? 'Your account' : 'Sign in with Google'} variant="gold" href={profile ? '/account' : '/login'} style={{ alignSelf: 'stretch', marginTop: space.sm }} />
        </View>
      </View>

      {/* FAQ */}
      <View style={[styles.section, { paddingHorizontal: space.lg, gap: space.sm }]}>
        <SectionHeader eyebrow="FAQ" title="Common questions" />
        {FAQS.map((f, i) => {
          const open = openFaq === i;
          return (
            <Card key={f.q} onPress={() => setOpenFaq(open ? null : i)} style={{ gap: space.sm }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: space.md }}>
                <Txt style={{ flex: 1, fontWeight: '700' }}>{f.q}</Txt>
                <Ionicons name={open ? 'chevron-up' : 'chevron-down'} size={18} color={colors.navy} />
              </View>
              {open ? <Txt color={colors.textMuted}>{f.a}</Txt> : null}
            </Card>
          );
        })}
        <Button label="Contact us" variant="secondary" icon="mail-outline" href="/contact" style={{ marginTop: space.sm }} />
      </View>

      <View style={{ alignItems: 'center', gap: space.sm, marginTop: space.xxl, paddingHorizontal: space.lg }}>
        <PcmEndorsement />
        <Txt variant="small" color={colors.textFaint} center>
          {BRAND.name} · {BRAND.location}
        </Txt>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  brandRow: { flexDirection: 'row', alignItems: 'center', gap: space.md },
  brandDivider: { width: StyleSheet.hairlineWidth * 2, height: 28, backgroundColor: 'rgba(255,255,255,0.3)' },
  heroTop: {
    position: 'absolute',
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: space.lg,
  },
  heroAvatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.14)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.25)',
  },
  heroBody: { flex: 1, justifyContent: 'flex-end', padding: space.lg, paddingBottom: space.xxl },
  heroTitle: { fontFamily: 'Fraunces_700Bold', fontSize: 42, lineHeight: 48, color: colors.white, letterSpacing: -0.8 },
  heroAccent: { fontFamily: 'Fraunces_400Regular_Italic', color: colors.gold },
  stats: {
    flexDirection: 'row',
    gap: space.xl,
    marginTop: space.xl,
    paddingTop: space.lg,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(255,255,255,0.25)',
  },
  quickGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: -space.xl,
    marginHorizontal: space.lg,
    backgroundColor: colors.white,
    borderRadius: radius.xl,
    paddingVertical: space.md,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
  },
  quickItem: { width: '33.33%', alignItems: 'center', gap: 6, paddingVertical: space.md },
  section: { marginTop: space.xxl },
  poster: { width: SCREEN_W * 0.62, aspectRatio: 1080 / 1350, borderRadius: radius.lg },
  cta: {
    backgroundColor: colors.navy,
    borderRadius: radius.xl,
    padding: space.xl,
    alignItems: 'center',
    gap: space.sm,
  },
});
