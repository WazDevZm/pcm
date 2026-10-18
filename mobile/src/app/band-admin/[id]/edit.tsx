import { router, Stack, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';

import { BandGate } from '@/components/admin/BandGate';
import { FormScreen, ImageField } from '@/components/admin/kit';
import { Button, Field, Notice, Txt } from '@/components/ui';
import { updateBand } from '@/lib/api';
import { errorMessage, isValidEmail } from '@/lib/format';
import type { Band } from '@/lib/types';
import { space } from '@/theme';

const TEXT_FIELDS = [
  'description',
  'focus_area',
  'meeting_time',
  'meeting_location',
  'mission',
  'responsibilities',
  'how_to_join',
  'important_info',
  'leader_name',
  'leader_position',
  'leader_tenure',
  'leader_email',
  'leader_phone',
] as const;

type TextKey = (typeof TEXT_FIELDS)[number];

/** NOT NULL in the committees table — saved as '' rather than null */
const REQUIRED: readonly TextKey[] = ['description', 'focus_area', 'meeting_time', 'meeting_location'];

function EditBand({ band, onSaved }: { band: Band; onSaved: () => void }) {
  const [form, setForm] = useState<Record<TextKey, string>>(
    () => Object.fromEntries(TEXT_FIELDS.map((k) => [k, band[k] ?? ''])) as Record<TextKey, string>
  );
  const [heroImage, setHeroImage] = useState<string | null>(band.hero_image_url ?? null);
  const [leaderImage, setLeaderImage] = useState<string | null>(band.leader_image_url ?? null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const field = (key: TextKey) => ({ value: form[key], onChangeText: (v: string) => setForm((f) => ({ ...f, [key]: v })) });

  const save = async () => {
    setError(null);
    if (!form.description.trim()) return setError('Add a short description.');
    if (form.leader_email.trim() && !isValidEmail(form.leader_email)) return setError('Check the leader’s email address.');
    const text = Object.fromEntries(
      TEXT_FIELDS.map((k) => [k, form[k].trim() || (REQUIRED.includes(k) ? '' : null)])
    ) as Partial<Band>;
    const updates: Partial<Band> = { ...text, hero_image_url: heroImage, leader_image_url: leaderImage };
    setSaving(true);
    try {
      await updateBand(band.id, updates);
      onSaved();
      router.back();
    } catch (e) {
      setError(errorMessage(e));
    } finally {
      setSaving(false);
    }
  };

  const heading = (label: string) => (
    <Txt variant="h3" style={{ marginTop: space.md }}>
      {label}
    </Txt>
  );

  return (
    <FormScreen>
      <Stack.Screen options={{ title: 'Edit band page' }} />
      {error ? <Notice tone="error">{error}</Notice> : null}

      {heading('About')}
      <Field label="Short description" multiline {...field('description')} />
      <Field label="Focus area" placeholder="e.g. Worship & music" {...field('focus_area')} />
      <Field label="Meeting time" placeholder="e.g. Thursdays, 17:30" {...field('meeting_time')} />
      <Field label="Meeting place" placeholder="e.g. Main Hall" {...field('meeting_location')} />
      <ImageField label="Cover photo" value={heroImage} onChange={setHeroImage} folder="bands" disabled={saving} />

      {heading('Details')}
      <Field label="Mission" multiline {...field('mission')} />
      <Field label="Responsibilities" multiline {...field('responsibilities')} />
      <Field label="How to join" multiline {...field('how_to_join')} />
      <Field label="Important info" multiline {...field('important_info')} />

      {heading('Leader')}
      <Field label="Name" {...field('leader_name')} />
      <Field label="Position" placeholder="e.g. Band leader" {...field('leader_position')} />
      <Field label="Tenure" placeholder="e.g. 2026 – 2027" {...field('leader_tenure')} />
      <Field label="Email" autoCapitalize="none" keyboardType="email-address" {...field('leader_email')} />
      <Field label="Phone" keyboardType="phone-pad" {...field('leader_phone')} />
      <ImageField label="Leader photo" value={leaderImage} onChange={setLeaderImage} folder="bands" disabled={saving} />

      <Button label="Save changes" icon="checkmark" onPress={save} loading={saving} />
    </FormScreen>
  );
}

export default function BandEdit() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <BandGate bandId={id}>{(band, reload) => <EditBand band={band} onSaved={reload} />}</BandGate>;
}
