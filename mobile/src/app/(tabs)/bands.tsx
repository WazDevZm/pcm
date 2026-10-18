import { Image } from 'expo-image';
import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { LinearGradientOverlay } from '@/components/overlay';
import { Card, EmptyState, Ionicons, ListRow, Loading, Notice, OfflineNotice, Row, Screen, Txt } from '@/components/ui';
import { resolveImage } from '@/data/images';
import { useAsync } from '@/hooks/useAsync';
import { getBands } from '@/lib/api';
import { colors, radius, space } from '@/theme';

export default function BandsScreen() {
  const bands = useAsync(getBands);
  const list = bands.data ?? [];

  return (
    <Screen refreshing={bands.refreshing} onRefresh={bands.refresh}>
      <Txt color={colors.textMuted}>
        Ministry bands are where students serve together. Find yours, meet the team, and join in.
      </Txt>
      <OfflineNotice />
      {bands.error ? <Notice tone="error">{bands.error}</Notice> : null}
      {bands.loading && !bands.data ? (
        <Loading label="Loading bands" />
      ) : list.length ? (
        list.map((band, i) => (
          <Card key={band.id} onPress={() => router.push(`/bands/${band.slug}`)} style={styles.card}>
            <View style={styles.photo}>
              <Image
                source={resolveImage(band.hero_image_url, i)}
                style={StyleSheet.absoluteFill}
                contentFit="cover"
                transition={200}
                accessibilityLabel={band.name}
              />
              <LinearGradientOverlay from={0.05} to={0.85} />
              <View style={styles.photoBody}>
                <Txt variant="label" color={colors.gold}>
                  {band.focus_area}
                </Txt>
                <Txt variant="h2" color={colors.white} style={{ marginTop: 4 }}>
                  {band.name}
                </Txt>
              </View>
            </View>
            <View style={{ padding: space.lg, gap: space.sm }}>
              <Txt color={colors.textMuted} numberOfLines={3}>
                {band.description}
              </Txt>
              <Row gap={6}>
                <Ionicons name="time-outline" size={15} color={colors.navy} />
                <Txt variant="small" color={colors.navy} style={{ fontWeight: '600', flex: 1 }}>
                  {band.meeting_time}
                </Txt>
                <Ionicons name="arrow-forward" size={18} color={colors.navy} />
              </Row>
            </View>
          </Card>
        ))
      ) : !bands.error ? (
        <EmptyState icon="people-outline" title="No bands yet" body="Ministry bands will appear here soon." />
      ) : null}

      <View style={{ borderRadius: radius.lg, overflow: 'hidden', borderWidth: StyleSheet.hairlineWidth, borderColor: colors.border }}>
        <ListRow
          icon="git-network-outline"
          title="Committees & bands overview"
          subtitle="Every ministry team at The Haven"
          href="/committees"
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  card: { padding: 0, overflow: 'hidden' },
  photo: { height: 170, backgroundColor: colors.navyDeep },
  photoBody: { flex: 1, justifyContent: 'flex-end', padding: space.lg },
});
