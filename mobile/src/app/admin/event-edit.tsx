import { router, Stack, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';

import { FormScreen, ImageField, options } from '@/components/admin/kit';
import { AuthGate } from '@/components/AuthGate';
import { Button, Chips, EmptyState, Field, Loading, Notice, Screen, Txt } from '@/components/ui';
import { createEvent, getBands, getEvent, getManagedBands, isLocalBand, updateEvent } from '@/lib/api';
import { errorMessage, parseLocalDateTime, toLocalDateTimeInput } from '@/lib/format';
import type { Band, EventCategory } from '@/lib/types';
import { useAuth } from '@/providers/AuthProvider';

const CATEGORIES = options<EventCategory>(['worship', 'outreach', 'study', 'fellowship', 'special']);
const NO_BAND = 'none';

function EventEditor({ lockedBand }: { lockedBand?: string }) {
  const { id, committee } = useLocalSearchParams<{ id?: string; committee?: string }>();
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<EventCategory>('fellowship');
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [location, setLocation] = useState('');
  const [capacity, setCapacity] = useState('');
  const [bandId, setBandId] = useState<string>(committee || NO_BAND);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [bands, setBands] = useState<Band[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const [allBands, ev] = await Promise.all([getBands(), id ? getEvent(id) : Promise.resolve(null)]);
        setBands(allBands.filter((b) => !isLocalBand(b)));
        if (id && !ev) setError('This event no longer exists.');
        if (ev) {
          setTitle(ev.title);
          setDescription(ev.description ?? '');
          setCategory(ev.category);
          setStart(toLocalDateTimeInput(ev.date));
          setEnd(toLocalDateTimeInput(ev.end_date));
          setLocation(ev.location ?? '');
          setCapacity(ev.max_attendees ? String(ev.max_attendees) : '');
          setBandId(ev.committee_id ?? committee ?? NO_BAND);
          setImageUrl(ev.image_url ?? null);
        }
      } catch (e) {
        setError(errorMessage(e));
      } finally {
        setLoading(false);
      }
    })();
  }, [id, committee]);

  const save = async () => {
    setError(null);
    if (!title.trim()) return setError('Add a title.');
    const date = parseLocalDateTime(start);
    if (!date) return setError('Start must look like 2026-10-24 18:30.');
    let endDate: string | null = null;
    if (end.trim()) {
      endDate = parseLocalDateTime(end);
      if (!endDate) return setError('End must look like 2026-10-24 20:00, or leave it blank.');
      if (endDate <= date) return setError('End must be after the start.');
    }
    if (!location.trim()) return setError('Add a location.');
    let maxAttendees: number | null = null;
    if (capacity.trim()) {
      maxAttendees = Number(capacity);
      if (!Number.isInteger(maxAttendees) || maxAttendees < 1) return setError('Capacity must be a whole number above 0.');
    }
    const input = {
      title: title.trim(),
      description: description.trim(),
      category,
      date,
      end_date: endDate,
      location: location.trim(),
      max_attendees: maxAttendees,
      committee_id: lockedBand ?? (bandId === NO_BAND ? null : bandId),
      image_url: imageUrl,
    };
    setSaving(true);
    try {
      if (id) await updateEvent(id, input);
      else await createEvent(input, user!.id);
      router.back();
    } catch (e) {
      setError(errorMessage(e));
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loading />;

  const lockedName = lockedBand ? bands.find((b) => b.id === lockedBand)?.name : null;

  return (
    <FormScreen>
      <Stack.Screen options={{ title: id ? 'Edit event' : 'New event' }} />
      {error ? <Notice tone="error">{error}</Notice> : null}
      <Field label="Title" value={title} onChangeText={setTitle} placeholder="Friday Fellowship" />
      <Field label="Description" value={description} onChangeText={setDescription} multiline placeholder="What should people expect?" />
      <Txt variant="small" style={{ fontWeight: '600' }}>
        Category
      </Txt>
      <Chips options={CATEGORIES} value={category} onChange={setCategory} />
      <Field
        label="Starts"
        value={start}
        onChangeText={setStart}
        placeholder="YYYY-MM-DD HH:MM"
        autoCapitalize="none"
        keyboardType="numbers-and-punctuation"
        hint="Local time, e.g. 2026-10-24 18:30"
      />
      <Field
        label="Ends (optional)"
        value={end}
        onChangeText={setEnd}
        placeholder="YYYY-MM-DD HH:MM"
        autoCapitalize="none"
        keyboardType="numbers-and-punctuation"
      />
      <Field label="Location" value={location} onChangeText={setLocation} placeholder="e.g. Main Hall" />
      <Field
        label="Capacity (optional)"
        value={capacity}
        onChangeText={setCapacity}
        keyboardType="number-pad"
        placeholder="Leave blank for no limit"
      />
      {lockedBand ? (
        <Notice>This event belongs to {lockedName ?? 'your band'}.</Notice>
      ) : bands.length ? (
        <>
          <Txt variant="small" style={{ fontWeight: '600' }}>
            Band (optional)
          </Txt>
          <Chips
            options={[{ value: NO_BAND, label: 'None' }, ...bands.map((b) => ({ value: b.id, label: b.name }))]}
            value={bandId}
            onChange={setBandId}
          />
        </>
      ) : null}
      <ImageField label="Image (optional)" value={imageUrl} onChange={setImageUrl} folder="events" disabled={saving} />
      <Button label={id ? 'Save changes' : 'Create event'} icon="checkmark" onPress={save} loading={saving} />
    </FormScreen>
  );
}

/** Band admins (who may not be leaders) can manage their own band's events */
function BandScopedEditor({ bandId }: { bandId: string }) {
  const { profile, isLeader } = useAuth();
  const [allowed, setAllowed] = useState<boolean | null>(isLeader ? true : null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isLeader || !profile) return;
    getManagedBands(profile)
      .then((bands) => setAllowed(bands.some((b) => b.id === bandId)))
      .catch((e) => {
        setError(errorMessage(e));
        setAllowed(false);
      });
  }, [isLeader, profile, bandId]);

  if (allowed === null) return <Loading />;
  if (!allowed) {
    return (
      <Screen>
        {error ? <Notice tone="error">{error}</Notice> : null}
        <EmptyState icon="shield-outline" title="No access" body="You can only manage events for bands you administer." />
      </Screen>
    );
  }
  return <EventEditor lockedBand={isLeader ? undefined : bandId} />;
}

export default function AdminEventEdit() {
  const { committee } = useLocalSearchParams<{ committee?: string }>();
  if (committee) {
    return (
      <AuthGate>
        <BandScopedEditor bandId={committee} />
      </AuthGate>
    );
  }
  return (
    <AuthGate role="leader">
      <EventEditor />
    </AuthGate>
  );
}
