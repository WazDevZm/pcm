import { Image } from 'expo-image';
import { router, Stack } from 'expo-router';
import { View } from 'react-native';

import { ActionRow, confirmAction, humanize, useBusy } from '@/components/admin/kit';
import { AuthGate } from '@/components/AuthGate';
import { Badge, Button, Card, EmptyState, Loading, Notice, Screen, Txt } from '@/components/ui';
import { useAsync } from '@/hooks/useAsync';
import { deletePost, getPosts } from '@/lib/api';
import { formatDay } from '@/lib/format';
import { colors, radius, space } from '@/theme';

function Posts() {
  const { data, error, loading, refreshing, refresh } = useAsync(() => getPosts(undefined, 200));
  const [busy, run] = useBusy();

  const remove = (id: string, title: string) =>
    confirmAction('Delete post?', `“${title}” will be removed for everyone.`, 'Delete', async () => {
      if (await run(id, () => deletePost(id))) refresh();
    });

  return (
    <Screen refreshing={refreshing} onRefresh={refresh}>
      <Stack.Screen options={{ title: 'Posts' }} />
      <Button label="New post" icon="add" href="/admin/post-edit" />
      {error ? <Notice tone="error">{error}</Notice> : null}
      {loading && !data ? (
        <Loading />
      ) : data && data.length === 0 ? (
        <EmptyState icon="newspaper-outline" title="No posts yet" body="Share news, testimonies and announcements." />
      ) : (
        data?.map((post) => (
          <Card key={post.id} onPress={() => router.push({ pathname: '/admin/post-edit', params: { id: post.id } })}>
            <View style={{ flexDirection: 'row', gap: space.md }}>
              {post.image_url ? (
                <Image source={{ uri: post.image_url }} style={{ width: 64, height: 64, borderRadius: radius.sm }} contentFit="cover" />
              ) : null}
              <View style={{ flex: 1, gap: 4 }}>
                <Badge label={humanize(post.category)} tone={post.category === 'testimony' ? 'gold' : 'navy'} />
                <Txt variant="h3" numberOfLines={2}>
                  {post.title}
                </Txt>
                <Txt variant="small" color={colors.textMuted}>
                  {formatDay(post.published_at)}
                  {post.author?.name ? ` · ${post.author.name}` : ''}
                </Txt>
              </View>
            </View>
            <ActionRow>
              <Button
                label="Edit"
                icon="create-outline"
                variant="secondary"
                small
                onPress={() => router.push({ pathname: '/admin/post-edit', params: { id: post.id } })}
              />
              <Button
                label="Delete"
                icon="trash-outline"
                variant="danger"
                small
                loading={busy === post.id}
                disabled={busy !== null}
                onPress={() => remove(post.id, post.title)}
              />
            </ActionRow>
          </Card>
        ))
      )}
    </Screen>
  );
}

export default function AdminPosts() {
  return (
    <AuthGate role="leader">
      <Posts />
    </AuthGate>
  );
}
