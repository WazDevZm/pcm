import { Image } from 'expo-image';
import { Stack } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { confirmAction, FormScreen, ImageField, options, useBusy } from '@/components/admin/kit';
import { AuthGate } from '@/components/AuthGate';
import { Button, Card, Chips, EmptyState, Ionicons, Loading, Notice, Screen, Txt, Field } from '@/components/ui';
import { useAsync } from '@/hooks/useAsync';
import { createGalleryItem, deleteGalleryItem, getGalleryItems } from '@/lib/api';
import { errorMessage, formatDay } from '@/lib/format';
import type { GalleryCategory, GalleryItem } from '@/lib/types';
import { useAuth } from '@/providers/AuthProvider';
import { colors, radius, space } from '@/theme';

const CATEGORIES = options<GalleryCategory>(['worship', 'events', 'outreach', 'fellowship', 'baptisms']);
const today = () => new Date().toISOString().slice(0, 10);

function AddPhoto({ onDone, onCancel }: { onDone: () => void; onCancel: () => void }) {
  const { user } = useAuth();
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<GalleryCategory>('fellowship');
  const [location, setLocation] = useState('');
  const [eventDate, setEventDate] = useState(today());
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const save = async () => {
    setError(null);
    if (!imageUrl) return setError('Choose a photo first.');
    if (!title.trim()) return setError('Add a title.');
    if (!/^\d{4}-\d{2}-\d{2}$/.test(eventDate.trim()) || Number.isNaN(Date.parse(eventDate.trim())))
      return setError('Event date must look like 2026-10-24.');
    setSaving(true);
    try {
      await createGalleryItem({
        title: title.trim(),
        description: description.trim() || null,
        image_url: imageUrl,
        category,
        location: location.trim(),
        event_date: eventDate.trim(),
        uploaded_by: user!.id,
        attendees: null,
      });
      onDone();
    } catch (e) {
      setError(errorMessage(e));
    } finally {
      setSaving(false);
    }
  };

  return (
    <FormScreen>
      <Stack.Screen options={{ title: 'Add photo' }} />
      {error ? <Notice tone="error">{error}</Notice> : null}
      <ImageField label="Photo" value={imageUrl} onChange={setImageUrl} folder="gallery" disabled={saving} />
      <Field label="Title" value={title} onChangeText={setTitle} placeholder="Sunday worship night" />
      <Field label="Description (optional)" value={description} onChangeText={setDescription} multiline />
      <Txt variant="small" style={{ fontWeight: '600' }}>
        Category
      </Txt>
      <Chips options={CATEGORIES} value={category} onChange={setCategory} />
      <Field label="Location" value={location} onChangeText={setLocation} placeholder="e.g. Main Hall" />
      <Field
        label="Event date"
        value={eventDate}
        onChangeText={setEventDate}
        placeholder="YYYY-MM-DD"
        autoCapitalize="none"
        keyboardType="numbers-and-punctuation"
      />
      <Button label="Add to gallery" icon="checkmark" onPress={save} loading={saving} />
      <Button label="Cancel" variant="ghost" onPress={onCancel} disabled={saving} />
    </FormScreen>
  );
}

function Gallery() {
  const [adding, setAdding] = useState(false);
  const { data, error, loading, refreshing, refresh } = useAsync(() => getGalleryItems());
  const [busy, run] = useBusy();

  const remove = (item: GalleryItem) =>
    confirmAction('Delete photo?', `“${item.title}” will be removed from the gallery.`, 'Delete', async () => {
      if (await run(item.id, () => deleteGalleryItem(item.id))) refresh();
    });

  if (adding) {
    return (
      <AddPhoto
        onCancel={() => setAdding(false)}
        onDone={() => {
          setAdding(false);
          refresh();
        }}
      />
    );
  }

  return (
    <Screen refreshing={refreshing} onRefresh={refresh}>
      <Stack.Screen options={{ title: 'Gallery' }} />
      <Button label="Add photo" icon="add" onPress={() => setAdding(true)} />
      {error ? <Notice tone="error">{error}</Notice> : null}
      {loading && !data ? (
        <Loading />
      ) : data && data.length === 0 ? (
        <EmptyState icon="images-outline" title="No photos yet" body="Add photos from worship nights, outreach and more." />
      ) : (
        <>
          <Txt variant="small" color={colors.textMuted}>
            Long-press a photo to delete it.
          </Txt>
          <View style={styles.grid}>
            {data?.map((item) => (
              <Card key={item.id} style={styles.cell}>
                <Pressable onLongPress={() => remove(item)} delayLongPress={350}>
                  <Image source={{ uri: item.image_url }} style={styles.image} contentFit="cover" transition={150} />
                </Pressable>
                <View style={{ padding: space.sm, gap: 2 }}>
                  <Txt variant="small" style={{ fontWeight: '700' }} numberOfLines={1}>
                    {item.title}
                  </Txt>
                  <Txt variant="small" color={colors.textMuted} numberOfLines={1}>
                    {item.category} · {formatDay(item.event_date)}
                  </Txt>
                </View>
                <Pressable
                  onPress={() => remove(item)}
                  disabled={busy !== null}
                  accessibilityLabel={`Delete ${item.title}`}
                  hitSlop={6}
                  style={styles.delete}>
                  <Ionicons name={busy === item.id ? 'hourglass-outline' : 'trash-outline'} size={16} color={colors.danger} />
                </Pressable>
              </Card>
            ))}
          </View>
        </>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: space.md },
  cell: { flexBasis: '47%', flexGrow: 1, padding: 0, overflow: 'hidden' },
  image: { width: '100%', aspectRatio: 1, backgroundColor: colors.navySoft },
  delete: {
    position: 'absolute',
    top: space.sm,
    right: space.sm,
    width: 30,
    height: 30,
    borderRadius: radius.pill,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default function AdminGallery() {
  return (
    <AuthGate role="leader">
      <Gallery />
    </AuthGate>
  );
}
