import { Image } from 'expo-image';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Linking, Pressable, StyleSheet, View } from 'react-native';

import { EventCard } from '@/components/content/EventCard';
import {
  Badge,
  Button,
  Card,
  EmptyState,
  IconTile,
  Ionicons,
  Loading,
  Notice,
  OfflineNotice,
  PhotoHeader,
  Row,
  Screen,
  SectionHeader,
  Txt,
  type IconName,
} from '@/components/ui';
import { resolveImage } from '@/data/images';
import { useAsync } from '@/hooks/useAsync';
import {
  getBandAnnouncements,
  getBandBySlug,
  getBandMemberCount,
  getEvents,
  getMyBandIds,
  isLocalBand,
  joinBand,
  leaveBand,
} from '@/lib/api';
import { errorMessage, formatLongDate } from '@/lib/format';
import { useAuth } from '@/providers/AuthProvider';
import { colors, space } from '@/theme';

function TextBlock({ icon, title, body }: { icon: IconName; title: string; body: string }) {
  return (
    <Card style={{ gap: space.sm }}>
      <Row gap={space.md}>
        <IconTile icon={icon} />
        <Txt variant="h3" style={{ flex: 1 }}>
          {title}
        </Txt>
      </Row>
      <Txt color={colors.textMuted}>{body}</Txt>
    </Card>
  );
}

function ContactLink({ icon, label, url }: { icon: IconName; label: string; url: string }) {
  return (
    <Pressable
      onPress={() => Linking.openURL(url)}
      accessibilityRole="link"
      accessibilityLabel={label}
      hitSlop={6}
      style={({ pressed }) => [{ flexDirection: 'row', alignItems: 'center', gap: space.sm }, pressed && { opacity: 0.6 }]}>
      <Ionicons name={icon} size={18} color={colors.navy} />
      <Txt color={colors.navy} style={{ fontWeight: '600', flex: 1 }}>
        {label}
      </Txt>
    </Pressable>
  );
}

export default function BandDetailScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const { user } = useAuth();
  const [busy, setBusy] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  const state = useAsync(async () => {
    const band = await getBandBySlug(String(slug));
    if (!band) return null;
    const local = isLocalBand(band);
    const [announcements, events, memberCount, myBands] = await Promise.all([
      getBandAnnouncements(band),
      local ? Promise.resolve([]) : getEvents({ upcoming: true, committeeId: band.id }),
      local ? Promise.resolve(0) : getBandMemberCount(band.id),
      user && !local ? getMyBandIds(user.id) : Promise.resolve([] as string[]),
    ]);
    return { band, announcements, events, memberCount, isMember: myBands.includes(band.id) };
  }, [slug, user?.id]);

  const data = state.data;

  const toggleMembership = async () => {
    if (!data) return;
    if (!user) {
      router.push('/login');
      return;
    }
    setActionError(null);
    setBusy(true);
    try {
      if (data.isMember) {
        await leaveBand(data.band.id, user.id);
        state.setData({ ...data, isMember: false, memberCount: Math.max(0, data.memberCount - 1) });
      } else {
        await joinBand(data.band.id, user.id);
        state.setData({ ...data, isMember: true, memberCount: data.memberCount + 1 });
      }
    } catch (e) {
      setActionError(errorMessage(e));
    } finally {
      setBusy(false);
    }
  };

  if (state.loading && !data) {
    return (
      <>
        <Stack.Screen options={{ title: 'Band' }} />
        <Loading label="Loading band" />
      </>
    );
  }

  if (!data) {
    return (
      <Screen>
        <Stack.Screen options={{ title: 'Band' }} />
        {state.error ? (
          <Notice tone="error">{state.error}</Notice>
        ) : (
          <EmptyState
            icon="people-outline"
            title="Band not found"
            body="This band may have been renamed or removed."
            action={<Button label="All bands" variant="secondary" href="/bands" />}
          />
        )}
      </Screen>
    );
  }

  const { band, announcements, events, memberCount, isMember } = data;
  const local = isLocalBand(band);

  return (
    <Screen padded={false} refreshing={state.refreshing} onRefresh={state.refresh}>
      <Stack.Screen options={{ title: band.name }} />
      <PhotoHeader
        image={resolveImage(band.hero_image_url, 0)}
        eyebrow={band.focus_area}
        title={band.name}
        subtitle={band.description}
        height={340}
      />

      <View style={{ paddingHorizontal: space.lg, gap: space.lg }}>
        <OfflineNotice />

        <Card style={{ gap: space.md }}>
          <Row gap={space.md}>
            <IconTile icon="time-outline" />
            <View style={{ flex: 1 }}>
              <Txt variant="small" color={colors.textMuted}>
                Meets
              </Txt>
              <Txt style={{ fontWeight: '600' }}>{band.meeting_time}</Txt>
            </View>
          </Row>
          <Row gap={space.md}>
            <IconTile icon="location-outline" />
            <View style={{ flex: 1 }}>
              <Txt variant="small" color={colors.textMuted}>
                Where
              </Txt>
              <Txt style={{ fontWeight: '600' }}>{band.meeting_location}</Txt>
            </View>
          </Row>
          {!local ? (
            <Row gap={space.md}>
              <IconTile icon="people-outline" />
              <View style={{ flex: 1 }}>
                <Txt variant="small" color={colors.textMuted}>
                  Members
                </Txt>
                <Txt style={{ fontWeight: '600' }}>
                  {memberCount} {memberCount === 1 ? 'member' : 'members'}
                </Txt>
              </View>
            </Row>
          ) : null}
        </Card>

        {local ? (
          <Notice>Joining in the app opens once this band is set up online. Until then, follow the steps under “How to join”.</Notice>
        ) : (
          <View style={{ gap: space.sm }}>
            {isMember ? <Badge label="You're a member" tone="success" /> : null}
            {actionError ? <Notice tone="error">{actionError}</Notice> : null}
            <Button
              label={!user ? 'Sign in to join' : isMember ? 'Leave band' : 'Join this band'}
              icon={isMember ? 'exit-outline' : 'person-add-outline'}
              variant={isMember ? 'danger' : 'primary'}
              onPress={toggleMembership}
              loading={busy}
            />
          </View>
        )}

        {band.important_info ? <Notice>{band.important_info}</Notice> : null}

        {band.mission ? <TextBlock icon="flag-outline" title="Our mission" body={band.mission} /> : null}
        {band.responsibilities ? (
          <TextBlock icon="list-outline" title="Responsibilities" body={band.responsibilities} />
        ) : null}

        {band.activities?.length ? (
          <View style={{ gap: space.sm }}>
            <Txt variant="h2">Activities</Txt>
            <View style={styles.activities}>
              {band.activities.map((a) => (
                <View key={a} style={styles.activity}>
                  <Ionicons name="checkmark-circle" size={16} color={colors.navy} />
                  <Txt variant="small" style={{ fontWeight: '600' }}>
                    {a}
                  </Txt>
                </View>
              ))}
            </View>
          </View>
        ) : null}

        {band.how_to_join ? <TextBlock icon="person-add-outline" title="How to join" body={band.how_to_join} /> : null}

        {band.leader_name || band.leader_position ? (
          <Card style={{ gap: space.md }}>
            <Txt variant="label" color={colors.navy}>
              Band leadership
            </Txt>
            <Row gap={space.md}>
              {band.leader_image_url ? (
                <Image
                  source={resolveImage(band.leader_image_url)}
                  style={styles.avatar}
                  contentFit="cover"
                  accessibilityLabel={band.leader_name ?? 'Band leader'}
                />
              ) : (
                <View style={[styles.avatar, styles.avatarEmpty]}>
                  <Ionicons name="person" size={26} color={colors.navy} />
                </View>
              )}
              <View style={{ flex: 1 }}>
                {band.leader_name ? <Txt variant="h3">{band.leader_name}</Txt> : null}
                {band.leader_position ? (
                  <Txt variant="small" color={colors.textMuted}>
                    {band.leader_position}
                  </Txt>
                ) : null}
                {band.leader_tenure ? (
                  <Txt variant="small" color={colors.textFaint}>
                    {band.leader_tenure}
                  </Txt>
                ) : null}
              </View>
            </Row>
            {band.leader_email ? (
              <ContactLink icon="mail-outline" label={band.leader_email} url={`mailto:${band.leader_email}`} />
            ) : null}
            {band.leader_phone ? (
              <ContactLink icon="call-outline" label={band.leader_phone} url={`tel:${band.leader_phone}`} />
            ) : null}
          </Card>
        ) : null}

        <SectionHeader eyebrow="Latest" title="Announcements" />
        {announcements.length ? (
          announcements.map((a) => (
            <Card key={a.id} style={{ gap: space.sm }}>
              <Row style={{ alignItems: 'flex-start' }}>
                <Txt variant="h3" style={{ flex: 1 }}>
                  {a.title}
                </Txt>
                <Badge label={a.type} tone="gold" />
              </Row>
              <Txt color={colors.textMuted}>{a.content}</Txt>
              {a.image_url ? (
                <Image source={resolveImage(a.image_url)} style={styles.announcementImage} contentFit="cover" />
              ) : null}
              <Txt variant="small" color={colors.textFaint}>
                {formatLongDate(a.published_at)}
              </Txt>
            </Card>
          ))
        ) : (
          <Card>
            <Txt color={colors.textMuted}>No announcements yet. Check back soon.</Txt>
          </Card>
        )}

        {!local ? (
          <>
            <SectionHeader eyebrow="Coming up" title="Band events" />
            {events.length ? (
              events.map((e, i) => <EventCard key={e.id} event={e} index={i} compact />)
            ) : (
              <Card>
                <Txt color={colors.textMuted}>No upcoming events scheduled for this band.</Txt>
              </Card>
            )}
          </>
        ) : null}

        <Button label="All bands" variant="ghost" icon="arrow-back" onPress={() => router.navigate('/bands')} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  activities: { flexDirection: 'row', flexWrap: 'wrap', gap: space.sm },
  activity: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: space.md,
    paddingVertical: space.sm,
    borderRadius: 999,
    backgroundColor: colors.navySoft,
  },
  avatar: { width: 64, height: 64, borderRadius: 32 },
  avatarEmpty: { backgroundColor: colors.navySoft, alignItems: 'center', justifyContent: 'center' },
  announcementImage: { width: '100%', height: 180, borderRadius: 12 },
});
