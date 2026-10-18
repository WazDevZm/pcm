import { router, Stack, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';

import { BandGate } from '@/components/admin/BandGate';
import { FormScreen, ImageField, options } from '@/components/admin/kit';
import { Button, Chips, Field, Notice, Txt } from '@/components/ui';
import { createBandAnnouncement } from '@/lib/api';
import { errorMessage } from '@/lib/format';
import type { Band, BandAnnouncement } from '@/lib/types';
import { useAuth } from '@/providers/AuthProvider';

const TYPES = options<BandAnnouncement['type']>(['announcement', 'meeting', 'update']);

function NewAnnouncement({ band }: { band: Band }) {
  const { user } = useAuth();
  const [type, setType] = useState<BandAnnouncement['type']>('announcement');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const save = async () => {
    setError(null);
    if (!title.trim()) return setError('Add a title.');
    if (!content.trim()) return setError('Write the announcement.');
    setSaving(true);
    try {
      await createBandAnnouncement(
        { committee_id: band.id, type, title: title.trim(), content: content.trim(), image_url: imageUrl },
        user!.id
      );
      router.back();
    } catch (e) {
      setError(errorMessage(e));
    } finally {
      setSaving(false);
    }
  };

  return (
    <FormScreen>
      <Stack.Screen options={{ title: 'New announcement' }} />
      <Notice>Posts to the {band.name} page straight away.</Notice>
      {error ? <Notice tone="error">{error}</Notice> : null}
      <Txt variant="small" style={{ fontWeight: '600' }}>
        Type
      </Txt>
      <Chips options={TYPES} value={type} onChange={setType} />
      <Field
        label="Title"
        value={title}
        onChangeText={setTitle}
        placeholder={type === 'meeting' ? 'Thursday rehearsal moved to 18:00' : 'Welcome, new members!'}
      />
      <Field label="Message" value={content} onChangeText={setContent} multiline placeholder="What does your band need to know?" />
      <ImageField label="Image (optional)" value={imageUrl} onChange={setImageUrl} folder="bands" disabled={saving} />
      <Button label="Post announcement" icon="send" onPress={save} loading={saving} />
    </FormScreen>
  );
}

export default function BandAnnouncementNew() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <BandGate bandId={id}>{(band) => <NewAnnouncement band={band} />}</BandGate>;
}
