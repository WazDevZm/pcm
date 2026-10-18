import { router, Stack } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';

import { ActionRow, confirmAction, humanize, useBusy } from '@/components/admin/kit';
import { AuthGate } from '@/components/AuthGate';
import { Badge, Button, Card, Chips, EmptyState, Ionicons, Loading, Notice, Screen, Txt } from '@/components/ui';
import { useAsync } from '@/hooks/useAsync';
import { deleteEvent, getEvents } from '@/lib/api';
import { formatDateTime } from '@/lib/format';
import { colors, space } from '@/theme';

type Filter = 'upcoming' | 'all';

function Events() {
  const [filter, setFilter] = useState<Filter>('upcoming');
  const { data, error, loading, refreshing, refresh } = useAsync(
    async () => {
      const rows = await getEvents({ upcoming: filter === 'upcoming' });
      return filter === 'all' ? [...rows].reverse() : rows;
    },
    [filter]
  );
  const [busy, run] = useBusy();

  const remove = (id: string, title: string) =>
    confirmAction('Delete event?', `“${title}” and its RSVPs will be removed.`, 'Delete', async () => {
      if (await run(id, () => deleteEvent(id))) refresh();
    });

  const edit = (id: string) => router.push({ pathname: '/admin/event-edit', params: { id } });

  return (
    <Screen refreshing={refreshing} onRefresh={refresh}>
      <Stack.Screen options={{ title: 'Events' }} />
      <Button label="New event" icon="add" href="/admin/event-edit" />
      <Chips
        options={[
          { value: 'upcoming', label: 'Upcoming' },
          { value: 'all', label: 'All (newest first)' },
        ]}
        value={filter}
        onChange={setFilter}
      />
      {error ? <Notice tone="error">{error}</Notice> : null}
      {loading && !data ? (
        <Loading />
      ) : data && data.length === 0 ? (
        <EmptyState icon="calendar-outline" title="No events" body="Create one to start taking RSVPs." />
      ) : (
        data?.map((ev) => (
          <Card key={ev.id} onPress={() => edit(ev.id)}>
            <View style={{ gap: 4 }}>
              <Badge label={humanize(ev.category)} />
              <Txt variant="h3">{ev.title}</Txt>
              <Txt variant="small" color={colors.textMuted}>
                {formatDateTime(ev.date)} · {ev.location}
              </Txt>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: space.xs }}>
                <Ionicons name="people-outline" size={15} color={colors.navy} />
                <Txt variant="small" style={{ fontWeight: '600' }}>
                  {ev.current_attendees ?? 0}
                  {ev.max_attendees ? ` / ${ev.max_attendees}` : ''} attending
                </Txt>
              </View>
            </View>
            <ActionRow>
              <Button label="Edit" icon="create-outline" variant="secondary" small onPress={() => edit(ev.id)} />
              <Button
                label="Delete"
                icon="trash-outline"
                variant="danger"
                small
                loading={busy === ev.id}
                disabled={busy !== null}
                onPress={() => remove(ev.id, ev.title)}
              />
            </ActionRow>
          </Card>
        ))
      )}
    </Screen>
  );
}

export default function AdminEvents() {
  return (
    <AuthGate role="leader">
      <Events />
    </AuthGate>
  );
}
