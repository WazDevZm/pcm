import { router, Stack, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';

import { FormScreen, ImageField, options } from '@/components/admin/kit';
import { AuthGate } from '@/components/AuthGate';
import { Button, Chips, Field, Loading, Notice, Txt } from '@/components/ui';
import { createPost, getPost, updatePost } from '@/lib/api';
import { errorMessage } from '@/lib/format';
import type { PostCategory } from '@/lib/types';
import { useAuth } from '@/providers/AuthProvider';

const CATEGORIES = options<PostCategory>(['news', 'testimony', 'announcement', 'ministry']);

function PostEditor() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<PostCategory>('news');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(Boolean(id));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    getPost(id)
      .then((p) => {
        if (!p) return setError('This post no longer exists.');
        setTitle(p.title);
        setCategory(p.category);
        setExcerpt(p.excerpt ?? '');
        setContent(p.content ?? '');
        setImageUrl(p.image_url ?? null);
      })
      .catch((e) => setError(errorMessage(e)))
      .finally(() => setLoading(false));
  }, [id]);

  const save = async () => {
    setError(null);
    if (!title.trim()) return setError('Add a title.');
    if (!content.trim()) return setError('Write the post content.');
    const input = {
      title: title.trim(),
      category,
      excerpt: excerpt.trim() || content.trim().slice(0, 160),
      content: content.trim(),
      image_url: imageUrl,
    };
    setSaving(true);
    try {
      if (id) await updatePost(id, input);
      else await createPost(input, user!.id);
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
      <Stack.Screen options={{ title: id ? 'Edit post' : 'New post' }} />
      {error ? <Notice tone="error">{error}</Notice> : null}
      <Field label="Title" value={title} onChangeText={setTitle} placeholder="Headline" />
      <Txt variant="small" style={{ fontWeight: '600' }}>
        Category
      </Txt>
      <Chips options={CATEGORIES} value={category} onChange={setCategory} />
      <Field
        label="Excerpt"
        value={excerpt}
        onChangeText={setExcerpt}
        placeholder="One or two sentences for the list view"
        hint="Leave blank to use the start of the content."
      />
      <Field label="Content" value={content} onChangeText={setContent} multiline placeholder="Write the post…" style={{ minHeight: 200 }} />
      <ImageField label="Image (optional)" value={imageUrl} onChange={setImageUrl} folder="posts" disabled={saving} />
      <Button label={id ? 'Save changes' : 'Publish post'} icon="checkmark" onPress={save} loading={saving} />
    </FormScreen>
  );
}

export default function AdminPostEdit() {
  return (
    <AuthGate role="leader">
      <PostEditor />
    </AuthGate>
  );
}
