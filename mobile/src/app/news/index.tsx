import { Image } from 'expo-image';
import { router, Stack } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { Badge, Card, Chips, EmptyState, Loading, Notice, OfflineNotice, Screen, Txt } from '@/components/ui';
import { resolveImage } from '@/data/images';
import { useAsync } from '@/hooks/useAsync';
import { getPosts } from '@/lib/api';
import { formatLongDate } from '@/lib/format';
import type { PostCategory } from '@/lib/types';
import { colors, radius, space } from '@/theme';

type Filter = 'all' | PostCategory;

const FILTERS: { value: Filter; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'news', label: 'News' },
  { value: 'testimony', label: 'Testimonies' },
  { value: 'announcement', label: 'Announcements' },
  { value: 'ministry', label: 'Ministry' },
];

export default function NewsScreen() {
  const [filter, setFilter] = useState<Filter>('all');
  const posts = useAsync(() => getPosts(filter === 'all' ? undefined : filter), [filter]);
  const list = posts.data ?? [];

  return (
    <Screen refreshing={posts.refreshing} onRefresh={posts.refresh}>
      <Stack.Screen options={{ title: 'News & testimonies' }} />
      <OfflineNotice />
      <Chips options={FILTERS} value={filter} onChange={setFilter} />
      {posts.error ? <Notice tone="error">{posts.error}</Notice> : null}
      {posts.loading && !posts.data ? (
        <Loading label="Loading stories" />
      ) : list.length ? (
        list.map((post) => (
          <Card
            key={post.id}
            onPress={() => router.push(`/news/${post.id}`)}
            style={{ padding: 0, overflow: 'hidden' }}>
            {post.image_url ? (
              <Image
                source={resolveImage(post.image_url)}
                style={styles.image}
                contentFit="cover"
                transition={200}
                accessibilityLabel={post.title}
              />
            ) : null}
            <View style={{ padding: space.lg, gap: 6 }}>
              <Badge label={post.category} tone={post.category === 'testimony' ? 'gold' : 'navy'} />
              <Txt variant="h3">{post.title}</Txt>
              {post.excerpt ? (
                <Txt color={colors.textMuted} numberOfLines={3}>
                  {post.excerpt}
                </Txt>
              ) : null}
              <Txt variant="small" color={colors.textFaint}>
                {post.author?.name ?? 'The Haven team'} · {formatLongDate(post.published_at)}
              </Txt>
            </View>
          </Card>
        ))
      ) : !posts.error ? (
        <EmptyState
          icon="newspaper-outline"
          title="No stories yet"
          body="News, testimonies and announcements from The Haven will appear here."
        />
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  image: { width: '100%', height: 170, borderTopLeftRadius: radius.lg, borderTopRightRadius: radius.lg },
});
