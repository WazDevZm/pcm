import { router, Stack, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';

import { FormScreen, options } from '@/components/admin/kit';
import { AuthGate } from '@/components/AuthGate';
import { Button, Chips, Field, Loading, Notice, Txt } from '@/components/ui';
import { createResource, getResources, updateResource } from '@/lib/api';
import { errorMessage } from '@/lib/format';
import type { Resource, ResourceType } from '@/lib/types';

const TYPES = options<ResourceType>(['bible_study', 'sermon', 'devotional', 'manual']);
const LEVELS = options<Resource['level']>(['beginner', 'intermediate', 'advanced']);

function ResourceEditor() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<ResourceType>('bible_study');
  const [category, setCategory] = useState('');
  const [author, setAuthor] = useState('');
  const [level, setLevel] = useState<Resource['level']>('beginner');
  const [lessons, setLessons] = useState('');
  const [duration, setDuration] = useState('');
  const [link, setLink] = useState('');
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(Boolean(id));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    // There is no single-resource getter; the list is small, so find it there
    getResources()
      .then((rows) => {
        const r = rows.find((x) => x.id === id);
        if (!r) return setError('This resource no longer exists.');
        setTitle(r.title);
        setDescription(r.description ?? '');
        setType(r.type);
        setCategory(r.category ?? '');
        setAuthor(r.author ?? '');
        setLevel(r.level);
        setLessons(r.lessons ? String(r.lessons) : '');
        setDuration(r.duration ?? '');
        setLink(r.download_url ?? '');
        setFileUrl(r.file_url ?? null);
      })
      .catch((e) => setError(errorMessage(e)))
      .finally(() => setLoading(false));
  }, [id]);

  const save = async () => {
    setError(null);
    if (!title.trim()) return setError('Add a title.');
    if (!description.trim()) return setError('Add a short description.');
    if (!author.trim()) return setError('Add an author.');
    let lessonCount: number | null = null;
    if (lessons.trim()) {
      lessonCount = Number(lessons);
      if (!Number.isInteger(lessonCount) || lessonCount < 1) return setError('Lessons must be a whole number.');
    }
    if (link.trim() && !/^https?:\/\//i.test(link.trim())) return setError('Link must start with http:// or https://');
    const input = {
      title: title.trim(),
      description: description.trim(),
      type,
      category: category.trim() || 'General',
      author: author.trim(),
      level,
      lessons: lessonCount,
      duration: duration.trim() || null,
      download_url: link.trim() || null,
      file_url: fileUrl,
    };
    setSaving(true);
    try {
      if (id) await updateResource(id, input);
      else await createResource(input);
      router.back();
    } catch (e) {
      setError(errorMessage(e));
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loading />;

  return (
    <FormScreen>
      <Stack.Screen options={{ title: id ? 'Edit resource' : 'New resource' }} />
      {error ? <Notice tone="error">{error}</Notice> : null}
      <Field label="Title" value={title} onChangeText={setTitle} placeholder="Walking in the Spirit" />
      <Field label="Description" value={description} onChangeText={setDescription} multiline />
      <Txt variant="small" style={{ fontWeight: '600' }}>
        Type
      </Txt>
      <Chips options={TYPES} value={type} onChange={setType} />
      <Field label="Category" value={category} onChangeText={setCategory} placeholder="e.g. Discipleship" />
      <Field label="Author" value={author} onChangeText={setAuthor} placeholder="Speaker or writer" />
      <Txt variant="small" style={{ fontWeight: '600' }}>
        Level
      </Txt>
      <Chips options={LEVELS} value={level} onChange={setLevel} />
      <Field label="Lessons (optional)" value={lessons} onChangeText={setLessons} keyboardType="number-pad" />
      <Field label="Duration (optional)" value={duration} onChangeText={setDuration} placeholder="e.g. 6 weeks, 45 min" />
      <Field
        label="Link URL (optional)"
        value={link}
        onChangeText={setLink}
        placeholder="https://"
        autoCapitalize="none"
        keyboardType="url"
        autoCorrect={false}
      />
      <Button label={id ? 'Save changes' : 'Create resource'} icon="checkmark" onPress={save} loading={saving} />
    </FormScreen>
  );
}

export default function AdminResourceEdit() {
  return (
    <AuthGate role="leader">
      <ResourceEditor />
    </AuthGate>
  );
}
