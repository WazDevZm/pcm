import { Image } from 'expo-image';
import { Stack, useLocalSearchParams } from 'expo-router';
import { Share, StyleSheet, View } from 'react-native';

import { Badge, Button, EmptyState, Loading, Notice, OfflineNotice, Screen, Txt } from '@/components/ui';
import { resolveImage } from '@/data/images';
import { useAsync } from '@/hooks/useAsync';
import { getPost } from '@/lib/api';
import { formatLongDate } from '@/lib/format';
import { colors, radius, space } from '@/theme';

export default function PostScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const state = useAsync(() => getPost(String(id)), [id]);
  const post = state.data;

  const share = async () => {
    if (!post) return;
    try {
      await Share.share({
        title: post.title,
        message: `${post.title}\n\n${post.excerpt || post.content.slice(0, 280)}\n\n— The Haven`,
      });
    } catch {
      // Share sheet dismissed or unavailable
    }
  };

  if (state.loading && !post) {
    return (
      <>
        <Stack.Screen options={{ title: 'Story' }} />
        <Loading />
      </>
    );
  }

  if (!post) {
    return (
      <Screen>
        <Stack.Screen options={{ title: 'Story' }} />
        <OfflineNotice />
        {state.error ? (
          <Notice tone="error">{state.error}</Notice>
        ) : (
          <EmptyState
            icon="newspaper-outline"
            title="Story not found"
            body="It may have been removed."
            action={<Button label="All stories" variant="secondary" href="/news" />}
          />
        )}
      </Screen>
    );
  }

  return (
    <Screen padded={false} refreshing={state.refreshing} onRefresh={state.refresh}>
      <Stack.Screen options={{ title: '' }} />
      {post.image_url ? (
        <Image
          source={resolveImage(post.image_url)}
          style={styles.image}
          contentFit="cover"
          transition={200}
          accessibilityLabel={post.title}
        />
      ) : null}
      <View style={{ paddingHorizontal: space.lg, gap: space.md, paddingTop: post.image_url ? 0 : space.lg }}>
        <Badge label={post.category} tone={post.category === 'testimony' ? 'gold' : 'navy'} />
        <Txt variant="h1">{post.title}</Txt>
        <Txt variant="small" color={colors.textMuted}>
          {post.author?.name ?? 'The Haven team'} · {formatLongDate(post.published_at)}
        </Txt>
        <View style={styles.rule} />
        <Txt style={{ fontSize: 16, lineHeight: 26 }}>{post.content}</Txt>
        <Button label="Share" icon="share-outline" variant="secondary" onPress={share} style={{ marginTop: space.md }} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  image: { width: '100%', height: 260, borderBottomLeftRadius: radius.lg, borderBottomRightRadius: radius.lg },
  rule: { height: StyleSheet.hairlineWidth, backgroundColor: colors.border },
});
