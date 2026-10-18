import { useState } from 'react';

import { EventCard } from '@/components/content/EventCard';
import { Chips, EmptyState, Loading, Notice, OfflineNotice, Screen, Txt } from '@/components/ui';
import { useAsync } from '@/hooks/useAsync';
import { getEvents } from '@/lib/api';
import type { EventCategory } from '@/lib/types';
import { colors } from '@/theme';

type Filter = 'all' | EventCategory;

const FILTERS: { value: Filter; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'worship', label: 'Worship' },
  { value: 'outreach', label: 'Outreach' },
  { value: 'study', label: 'Study' },
  { value: 'fellowship', label: 'Fellowship' },
  { value: 'special', label: 'Special' },
];

export default function EventsScreen() {
  const [filter, setFilter] = useState<Filter>('all');
  const events = useAsync(
    () => getEvents({ upcoming: true, category: filter === 'all' ? undefined : filter }),
    [filter]
  );
  const list = events.data ?? [];

  return (
    <Screen refreshing={events.refreshing} onRefresh={events.refresh}>
      <Txt color={colors.textMuted}>Worship, study, outreach and fellowship — RSVP to save your seat.</Txt>
      <OfflineNotice />
      <Chips options={FILTERS} value={filter} onChange={setFilter} />
      {events.error ? <Notice tone="error">{events.error}</Notice> : null}
      {events.loading && !events.data ? (
        <Loading label="Loading events" />
      ) : list.length ? (
        list.map((e, i) => <EventCard key={e.id} event={e} index={i} />)
      ) : !events.error ? (
        <EmptyState
          icon="calendar-outline"
          title={filter === 'all' ? 'No upcoming events' : 'Nothing in this category yet'}
          body="New events are posted every week. Pull down to refresh, or check back soon."
        />
      ) : null}
    </Screen>
  );
}
