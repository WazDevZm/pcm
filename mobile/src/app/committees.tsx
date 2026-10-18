import { router, Stack } from 'expo-router';
import { View } from 'react-native';

import {
  Button,
  Card,
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
import { photo } from '@/data/images';
import { useAsync } from '@/hooks/useAsync';
import { getBands, getCommittees } from '@/lib/api';
import type { Band } from '@/lib/types';
import { colors, space } from '@/theme';

const BAND_ICONS: Record<string, IconName> = {
  'bible-study-band': 'book-outline',
  'publicity-committee': 'megaphone-outline',
  'welfare-band': 'heart-outline',
  'health-band': 'pulse-outline',
  'witnessing-band': 'people-outline',
};

function MeetingInfo({ team }: { team: Band }) {
  if (!team.meeting_time && !team.meeting_location) return null;
  return (
    <Row gap={6}>
      <Ionicons name="time-outline" size={15} color={colors.textMuted} />
      <Txt variant="small" color={colors.textMuted} style={{ flex: 1 }}>
        {[team.meeting_time, team.meeting_location].filter(Boolean).join(' · ')}
      </Txt>
    </Row>
  );
}

export default function CommitteesScreen() {
  const state = useAsync(async () => {
    const [bands, committees] = await Promise.all([getBands(), getCommittees()]);
    return { bands, committees };
  });
  const bands = state.data?.bands ?? [];
  const committees = state.data?.committees ?? [];

  return (
    <Screen padded={false} refreshing={state.refreshing} onRefresh={state.refresh}>
      <Stack.Screen options={{ title: 'Committees & Bands' }} />
      <PhotoHeader
        image={photo('kcm_0669')}
        eyebrow="Serve together"
        title="Committees & Bands"
        subtitle="Join one of our ministry teams and use your gifts to serve God and build His kingdom on campus."
      />
      <View style={{ paddingHorizontal: space.lg, gap: space.lg }}>
        <OfflineNotice />
        {state.error ? <Notice tone="error">{state.error}</Notice> : null}

        <SectionHeader eyebrow="Ministry bands" title="Find your band" />
        {state.loading && !state.data ? (
          <Loading />
        ) : (
          bands.map((band) => (
            <Card key={band.id} onPress={() => router.push(`/bands/${band.slug}`)} style={{ gap: space.sm }}>
              <Row gap={space.md}>
                <IconTile icon={BAND_ICONS[band.slug] ?? 'people-outline'} />
                <View style={{ flex: 1 }}>
                  <Txt variant="h3">{band.name}</Txt>
                  <Txt variant="small" color={colors.navy}>
                    {band.focus_area}
                  </Txt>
                </View>
              </Row>
              <Txt color={colors.textMuted} numberOfLines={3}>
                {band.description}
              </Txt>
              <MeetingInfo team={band} />
              <Txt variant="small" color={colors.navy} style={{ fontWeight: '700' }}>
                View band page →
              </Txt>
            </Card>
          ))
        )}

        {committees.length ? (
          <>
            <SectionHeader eyebrow="Ministry teams" title="Other committees" />
            {committees.map((c) => (
              <Card key={c.id} style={{ gap: space.sm }}>
                <Txt variant="h3">{c.name}</Txt>
                {c.focus_area ? (
                  <Txt variant="small" color={colors.navy}>
                    {c.focus_area}
                  </Txt>
                ) : null}
                {c.description ? <Txt color={colors.textMuted}>{c.description}</Txt> : null}
                {c.activities?.length ? (
                  <View style={{ gap: 2 }}>
                    {c.activities.map((a) => (
                      <Txt key={a} variant="small" color={colors.textMuted}>
                        • {a}
                      </Txt>
                    ))}
                  </View>
                ) : null}
                <MeetingInfo team={c} />
              </Card>
            ))}
          </>
        ) : null}

        <Card style={{ gap: space.md, alignItems: 'center' }}>
          <Txt variant="h2" center>
            Ready to serve?
          </Txt>
          <Txt color={colors.textMuted} center>
            Every member has unique gifts that can contribute to our ministry. Find your place and make a difference.
          </Txt>
          <Button label="Get involved" icon="hand-left-outline" href="/get-involved" style={{ alignSelf: 'stretch' }} />
          <Button label="Contact leadership" variant="secondary" icon="mail-outline" href="/contact" style={{ alignSelf: 'stretch' }} />
        </Card>
      </View>
    </Screen>
  );
}
