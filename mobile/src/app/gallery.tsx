import { Image, type ImageSource } from 'expo-image';
import { Stack } from 'expo-router';
import { useState } from 'react';
import { Dimensions, Modal, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Chips, EmptyState, Ionicons, Loading, Notice, OfflineNotice, Row, Screen, Txt } from '@/components/ui';
import { ministryImage, resolveImage } from '@/data/images';
import { useAsync } from '@/hooks/useAsync';
import { getGalleryItems } from '@/lib/api';
import { formatLongDate } from '@/lib/format';
import type { GalleryCategory } from '@/lib/types';
import { colors, radius, space } from '@/theme';

type Filter = 'all' | GalleryCategory;

const FILTERS: { value: Filter; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'worship', label: 'Worship' },
  { value: 'events', label: 'Events' },
  { value: 'outreach', label: 'Outreach' },
  { value: 'fellowship', label: 'Fellowship' },
  { value: 'baptisms', label: 'Baptisms' },
];

type ViewerItem = {
  key: string;
  image: ImageSource | number;
  title: string;
  description?: string | null;
  location?: string | null;
  date?: string | null;
};

const ARCHIVE: ViewerItem[] = [0, 1, 2, 3, 4, 5].map((i) => ({
  key: `archive-${i}`,
  image: ministryImage(i),
  title: 'From our archive',
}));

const { width: SCREEN_W } = Dimensions.get('window');
const TILE = (SCREEN_W - space.lg * 2 - space.sm) / 2;

function Grid({ items, onOpen }: { items: ViewerItem[]; onOpen: (item: ViewerItem) => void }) {
  return (
    <View style={styles.grid}>
      {items.map((item) => (
        <Pressable
          key={item.key}
          onPress={() => onOpen(item)}
          accessibilityRole="imagebutton"
          accessibilityLabel={`Open photo: ${item.title}`}
          style={({ pressed }) => [styles.tile, pressed && { opacity: 0.85 }]}>
          <Image source={item.image} style={StyleSheet.absoluteFill} contentFit="cover" transition={200} />
        </Pressable>
      ))}
    </View>
  );
}

function Viewer({ item, onClose }: { item: ViewerItem | null; onClose: () => void }) {
  const insets = useSafeAreaInsets();
  return (
    <Modal visible={Boolean(item)} animationType="fade" onRequestClose={onClose} statusBarTranslucent>
      <View style={styles.viewer}>
        {item ? (
          <>
            <Image source={item.image} style={{ flex: 1 }} contentFit="contain" accessibilityLabel={item.title} />
            <ScrollView
              style={{ maxHeight: '35%' }}
              contentContainerStyle={{ padding: space.lg, paddingBottom: insets.bottom + space.lg, gap: space.sm }}>
              <Txt variant="h2" color={colors.white}>
                {item.title}
              </Txt>
              {item.description ? <Txt color="rgba(255,255,255,0.8)">{item.description}</Txt> : null}
              {item.location ? (
                <Row gap={6}>
                  <Ionicons name="location-outline" size={15} color={colors.gold} />
                  <Txt variant="small" color="rgba(255,255,255,0.7)">
                    {item.location}
                  </Txt>
                </Row>
              ) : null}
              {item.date ? (
                <Row gap={6}>
                  <Ionicons name="calendar-outline" size={15} color={colors.gold} />
                  <Txt variant="small" color="rgba(255,255,255,0.7)">
                    {formatLongDate(item.date)}
                  </Txt>
                </Row>
              ) : null}
            </ScrollView>
          </>
        ) : null}
        <Pressable
          onPress={onClose}
          accessibilityRole="button"
          accessibilityLabel="Close photo"
          hitSlop={12}
          style={[styles.close, { top: insets.top + space.sm }]}>
          <Ionicons name="close" size={24} color={colors.white} />
        </Pressable>
      </View>
    </Modal>
  );
}

export default function GalleryScreen() {
  const [filter, setFilter] = useState<Filter>('all');
  const [open, setOpen] = useState<ViewerItem | null>(null);
  const gallery = useAsync(() => getGalleryItems(filter === 'all' ? undefined : filter), [filter]);

  const items: ViewerItem[] = (gallery.data ?? []).map((g, i) => ({
    key: g.id,
    image: resolveImage(g.image_url, i),
    title: g.title,
    description: g.description,
    location: g.location,
    date: g.event_date,
  }));

  return (
    <Screen refreshing={gallery.refreshing} onRefresh={gallery.refresh}>
      <Stack.Screen options={{ title: 'Gallery' }} />
      <OfflineNotice />
      <Chips options={FILTERS} value={filter} onChange={setFilter} />
      {gallery.error ? <Notice tone="error">{gallery.error}</Notice> : null}
      {gallery.loading && !gallery.data ? (
        <Loading label="Loading photos" />
      ) : items.length ? (
        <Grid items={items} onOpen={setOpen} />
      ) : (
        <>
          {!gallery.error ? (
            <EmptyState
              icon="images-outline"
              title="No photos here yet"
              body="Photos from worship, outreach and fellowship will be posted after each gathering."
            />
          ) : null}
          <Txt variant="label" color={colors.navy}>
            From our archive
          </Txt>
          <Grid items={ARCHIVE} onOpen={setOpen} />
        </>
      )}
      <Viewer item={open} onClose={() => setOpen(null)} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: space.sm },
  tile: { width: TILE, height: TILE, borderRadius: radius.md, overflow: 'hidden', backgroundColor: colors.navySoft },
  viewer: { flex: 1, backgroundColor: colors.dark },
  close: {
    position: 'absolute',
    right: space.lg,
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
});
