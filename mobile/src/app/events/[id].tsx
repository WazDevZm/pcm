import { router, Stack, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Share, View } from 'react-native';

import { EVENT_CATEGORY_LABELS } from '@/components/content/EventCard';
import {
  Badge,
  Button,
  Card,
  EmptyState,
  IconTile,
  Loading,
  Notice,
  OfflineNotice,
  PhotoHeader,
  Row,
  Screen,
  Txt,
  type IconName,
} from '@/components/ui';
import { resolveImage } from '@/data/images';
import { useAsync } from '@/hooks/useAsync';
import { cancelEventRegistration, getEvent, isRegisteredForEvent, registerForEvent } from '@/lib/api';
import { errorMessage, formatLongDate, formatTime } from '@/lib/format';
import { useAuth } from '@/providers/AuthProvider';
import { colors, space } from '@/theme';

function InfoRow({ icon, label, value }: { icon: IconName; label: string; value: string }) {
  return (
    <Row gap={space.md}>
      <IconTile icon={icon} />
      <View style={{ flex: 1 }}>
        <Txt variant="small" color={colors.textMuted}>
          {label}
        </Txt>
        <Txt style={{ fontWeight: '600' }}>{value}</Txt>
      </View>
    </Row>
  );
}

export default function EventDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user } = useAuth();
  const [busy, setBusy] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  const state = useAsync(async () => {
    const event = await getEvent(String(id));
    const registered = event && user ? await isRegisteredForEvent(event.id, user.id) : false;
    // Decided at load time so render stays pure; pull to refresh re-evaluates
    const past = event ? new Date(event.end_date ?? event.date).getTime() < Date.now() : false;
    return { event, registered, past };
  }, [id, user?.id]);

  const event = state.data?.event ?? null;
  const registered = state.data?.registered ?? false;

  const share = async () => {
    if (!event) return;
    try {
      await Share.share({
        title: event.title,
        message: `${event.title}\n${formatLongDate(event.date)} · ${formatTime(event.date)}\n${event.location}\n\nSee you at The Haven!`,
      });
    } catch {
      // Share sheet dismissed or unavailable — nothing to do
    }
  };

  const toggleRsvp = async () => {
    if (!event) return;
    if (!user) {
      router.push('/login');
      return;
    }
    setActionError(null);
    setBusy(true);
    try {
      if (registered) {
        await cancelEventRegistration(event.id, user.id);
        state.setData({
          ...state.data!,
          event: { ...event, current_attendees: Math.max(0, event.current_attendees - 1) },
          registered: false,
        });
      } else {
        await registerForEvent(event.id, user.id);
        state.setData({ ...state.data!, event: { ...event, current_attendees: event.current_attendees + 1 }, registered: true });
      }
    } catch (e) {
      setActionError(errorMessage(e));
    } finally {
      setBusy(false);
    }
  };

  if (state.loading && !state.data) {
    return (
      <>
        <Stack.Screen options={{ title: 'Event' }} />
        <Loading label="Loading event" />
      </>
    );
  }

  if (!event) {
    return (
      <Screen>
        <Stack.Screen options={{ title: 'Event' }} />
        <OfflineNotice />
        {state.error ? (
          <Notice tone="error">{state.error}</Notice>
        ) : (
          <EmptyState
            icon="calendar-outline"
            title="Event not found"
            body="It may have been removed or rescheduled."
            action={<Button label="All events" variant="secondary" href="/events" />}
          />
        )}
      </Screen>
    );
  }

  const full = event.max_attendees != null && event.current_attendees >= event.max_attendees;
  const past = state.data?.past ?? false;
  const spotsLeft = event.max_attendees != null ? Math.max(0, event.max_attendees - event.current_attendees) : null;

  return (
    <Screen padded={false} refreshing={state.refreshing} onRefresh={state.refresh}>
      <Stack.Screen options={{ title: event.title }} />
      <PhotoHeader
        image={resolveImage(event.image_url, 0)}
        eyebrow={EVENT_CATEGORY_LABELS[event.category] ?? event.category}
        title={event.title}
        height={280}
      />
      <View style={{ paddingHorizontal: space.lg, gap: space.lg }}>
        <Card style={{ gap: space.lg }}>
          <InfoRow icon="calendar-outline" label="Date" value={formatLongDate(event.date)} />
          <InfoRow
            icon="time-outline"
            label="Time"
            value={event.end_date ? `${formatTime(event.date)} – ${formatTime(event.end_date)}` : formatTime(event.date)}
          />
          <InfoRow icon="location-outline" label="Location" value={event.location} />
          <InfoRow
            icon="people-outline"
            label="Attending"
            value={
              event.max_attendees != null
                ? `${event.current_attendees} of ${event.max_attendees}${spotsLeft ? ` · ${spotsLeft} spots left` : ''}`
                : `${event.current_attendees} going`
            }
          />
        </Card>

        {registered ? <Badge label="You're going" tone="success" /> : null}
        {actionError ? <Notice tone="error">{actionError}</Notice> : null}

        {past ? (
          <Notice>This event has already taken place.</Notice>
        ) : (
          <Button
            label={
              !user
                ? 'Sign in to RSVP'
                : registered
                  ? 'Cancel RSVP'
                  : full
                    ? 'Event is full'
                    : 'RSVP — I’m coming'
            }
            icon={registered ? 'close-circle-outline' : 'checkmark-circle-outline'}
            variant={registered ? 'danger' : 'primary'}
            onPress={toggleRsvp}
            loading={busy}
            disabled={Boolean(user) && !registered && full}
          />
        )}
        <Button label="Share event" icon="share-outline" variant="secondary" onPress={share} />

        {event.description ? (
          <View style={{ gap: space.sm }}>
            <Txt variant="h2">About this event</Txt>
            <Txt color={colors.textMuted}>{event.description}</Txt>
          </View>
        ) : null}
      </View>
    </Screen>
  );
}
