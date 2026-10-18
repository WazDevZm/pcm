import { Image } from 'expo-image';
import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { Badge, Card, Ionicons, Row, Txt } from '@/components/ui';
import { resolveImage } from '@/data/images';
import { formatDateTime } from '@/lib/format';
import type { HavenEvent } from '@/lib/types';
import { colors, radius, space } from '@/theme';

export const EVENT_CATEGORY_LABELS: Record<HavenEvent['category'], string> = {
  worship: 'Worship',
  outreach: 'Outreach',
  study: 'Study',
  fellowship: 'Fellowship',
  special: 'Special',
};

/** Event summary card with photo, date and location; taps through to the detail screen */
export function EventCard({ event, index = 0, compact }: { event: HavenEvent; index?: number; compact?: boolean }) {
  const full = event.max_attendees != null && event.current_attendees >= event.max_attendees;
  return (
    <Card onPress={() => router.push(`/events/${event.id}`)} style={{ padding: 0, overflow: 'hidden' }}>
      {!compact ? (
        <Image
          source={resolveImage(event.image_url, index)}
          style={styles.image}
          contentFit="cover"
          transition={200}
          accessibilityLabel={event.title}
        />
      ) : null}
      <View style={{ padding: space.lg, gap: 6 }}>
        <Row>
          <Badge label={EVENT_CATEGORY_LABELS[event.category] ?? event.category} />
          {full ? <Badge label="Full" tone="danger" /> : null}
        </Row>
        <Txt variant="h3">{event.title}</Txt>
        <Row gap={6}>
          <Ionicons name="time-outline" size={15} color={colors.navy} />
          <Txt variant="small" color={colors.navy} style={{ fontWeight: '700' }}>
            {formatDateTime(event.date)}
          </Txt>
        </Row>
        <Row gap={6}>
          <Ionicons name="location-outline" size={15} color={colors.textMuted} />
          <Txt variant="small" color={colors.textMuted} style={{ flex: 1 }} numberOfLines={1}>
            {event.location}
          </Txt>
        </Row>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  image: { width: '100%', height: 150, borderTopLeftRadius: radius.lg, borderTopRightRadius: radius.lg },
});
