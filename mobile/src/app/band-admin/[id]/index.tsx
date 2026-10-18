import { router, Stack, useLocalSearchParams } from 'expo-router';
import { View } from 'react-native';

import { BandGate } from '@/components/admin/BandGate';
import { ActionRow, confirmAction, humanize, MenuGroup, StatTile, TileGrid, useBusy } from '@/components/admin/kit';
import { Badge, Button, Card, EmptyState, ListRow, Loading, Notice, Screen, Txt } from '@/components/ui';
import { useAsync } from '@/hooks/useAsync';
import { deleteBandAnnouncement, deleteEvent, getBandAnnouncements, getBandMemberCount, getEvents } from '@/lib/api';
import { formatDateTime, timeAgo } from '@/lib/format';
import type { Band } from '@/lib/types';
import { useAuth } from '@/providers/AuthProvider';
import { colors, space } from '@/theme';

function Dashboard({ band }: { band: Band }) {
  const { isAdmin } = useAuth();
  const { data, error, loading, refreshing, refresh } = useAsync(
    async () => {
      const [members, announcements, events] = await Promise.all([
        getBandMemberCount(band.id),
        getBandAnnouncements(band),
        getEvents({ upcoming: true, committeeId: band.id }),
      ]);
      return { members, announcements, events };
    },
    [band.id]
  );
  const [busy, run] = useBusy();

  const removeAnnouncement = (id: string, title: string) =>
    confirmAction('Delete announcement?', `“${title}” will be removed from the band page.`, 'Delete', async () => {
      if (await run(id, () => deleteBandAnnouncement(id))) refresh();
    });

  const removeEvent = (id: string, title: string) =>
    confirmAction('Delete event?', `“${title}” and its RSVPs will be removed.`, 'Delete', async () => {
      if (await run(id, () => deleteEvent(id))) refresh();
    });

  return (
    <Screen refreshing={refreshing} onRefresh={refresh}>
      <Stack.Screen options={{ title: band.name }} />
      {error ? <Notice tone="error">{error}</Notice> : null}

      <TileGrid>
        <StatTile
          icon="people-outline"
          label="Members"
          value={data?.members ?? '–'}
          onPress={() => router.push({ pathname: '/band-admin/[id]/members', params: { id: band.id } })}
        />
        <StatTile icon="calendar-outline" label="Upcoming events" value={data?.events.length ?? '–'} />
      </TileGrid>

      <MenuGroup title="Band">
        {[
          <ListRow
            key="e"
            icon="create-outline"
            title="Edit band page"
            subtitle="Mission, meeting time, leader details"
            href={{ pathname: '/band-admin/[id]/edit', params: { id: band.id } }}
          />,
          <ListRow
            key="m"
            icon="people-outline"
            title="Members"
            href={{ pathname: '/band-admin/[id]/members', params: { id: band.id } }}
          />,
          ...(isAdmin
            ? [
                <ListRow
                  key="a"
                  icon="shield-checkmark-outline"
                  title="Band admins"
                  subtitle="Who can manage this band"
                  href={{ pathname: '/band-admin/[id]/admins', params: { id: band.id } }}
                />,
              ]
            : []),
          <ListRow key="v" icon="eye-outline" title="View public page" href={{ pathname: '/bands/[slug]', params: { slug: band.slug } }} />,
        ]}
      </MenuGroup>

      <Txt variant="h2" style={{ marginTop: space.md }}>Announcements</Txt>
      <Button
        label="New announcement"
        icon="megaphone-outline"
        href={{ pathname: '/band-admin/[id]/announcement', params: { id: band.id } }}
      />
      {loading && !data ? (
        <Loading />
      ) : data && data.announcements.length === 0 ? (
        <EmptyState icon="megaphone-outline" title="No announcements yet" body="Share meeting notes and weekly updates with your band." />
      ) : (
        data?.announcements.map((a) => (
          <Card key={a.id}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <Badge label={humanize(a.type)} tone={a.type === 'meeting' ? 'gold' : 'navy'} />
              <Txt variant="small" color={colors.textMuted}>
                {timeAgo(a.published_at)}
              </Txt>
            </View>
            <Txt variant="h3" style={{ marginTop: 8 }}>
              {a.title}
            </Txt>
            <Txt variant="small" color={colors.textMuted} numberOfLines={3} style={{ marginTop: 4 }}>
              {a.content}
            </Txt>
            <ActionRow>
              <Button
                label="Delete"
                icon="trash-outline"
                variant="danger"
                small
                loading={busy === a.id}
                disabled={busy !== null}
                onPress={() => removeAnnouncement(a.id, a.title)}
              />
            </ActionRow>
          </Card>
        ))
      )}

      <Txt variant="h2" style={{ marginTop: space.md }}>Upcoming events</Txt>
      <Button
        label="New band event"
        icon="add"
        variant="secondary"
        href={{ pathname: '/admin/event-edit', params: { committee: band.id } }}
      />
      {data && data.events.length === 0 ? (
        <EmptyState icon="calendar-outline" title="No upcoming events" />
      ) : (
        data?.events.map((ev) => (
          <Card key={ev.id} style={{ gap: space.xs }}>
            <Txt variant="h3">{ev.title}</Txt>
            <Txt variant="small" color={colors.textMuted}>
              {formatDateTime(ev.date)} · {ev.location}
            </Txt>
            <Txt variant="small">
              {ev.current_attendees}
              {ev.max_attendees ? ` / ${ev.max_attendees}` : ''} going
            </Txt>
            <ActionRow>
              <Button
                label="Edit"
                icon="create-outline"
                variant="secondary"
                small
                disabled={busy !== null}
                onPress={() => router.push({ pathname: '/admin/event-edit', params: { id: ev.id, committee: band.id } })}
              />
              <Button
                label="Delete"
                icon="trash-outline"
                variant="danger"
                small
                loading={busy === ev.id}
                disabled={busy !== null}
                onPress={() => removeEvent(ev.id, ev.title)}
              />
            </ActionRow>
          </Card>
        ))
      )}
    </Screen>
  );
}

export default function BandAdminDashboard() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <BandGate bandId={id}>{(band) => <Dashboard band={band} />}</BandGate>;
}
