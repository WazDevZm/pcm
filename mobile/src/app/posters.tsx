import { Asset } from 'expo-asset';
import { Image } from 'expo-image';
import { Stack } from 'expo-router';
import * as Sharing from 'expo-sharing';
import { useState } from 'react';
import { Share, StyleSheet, View } from 'react-native';

import { Button, Card, Notice, Screen, Txt } from '@/components/ui';
import { POSTERS } from '@/data/posters';
import { errorMessage } from '@/lib/format';
import { colors, radius, space } from '@/theme';

type Poster = (typeof POSTERS)[number];

export default function PostersScreen() {
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const share = async (poster: Poster) => {
    setError(null);
    setBusy(poster.id);
    try {
      if (await Sharing.isAvailableAsync()) {
        const asset = await Asset.fromModule(poster.image).downloadAsync();
        if (asset.localUri) {
          await Sharing.shareAsync(asset.localUri, {
            mimeType: 'image/png',
            dialogTitle: poster.title,
            UTI: 'public.png',
          });
          return;
        }
      }
      await Share.share({ title: poster.title, message: `${poster.title}\n${poster.caption}\n\n— The Haven` });
    } catch (e) {
      setError(errorMessage(e));
    } finally {
      setBusy(null);
    }
  };

  return (
    <Screen>
      <Stack.Screen options={{ title: 'Posters' }} />
      <Txt color={colors.textMuted}>Share what&apos;s on at The Haven with friends, class groups and your status.</Txt>
      {error ? <Notice tone="error">{error}</Notice> : null}
      {POSTERS.map((p) => (
        <Card key={p.id} style={{ padding: 0, overflow: 'hidden' }}>
          <Image source={p.image} style={styles.poster} contentFit="cover" accessibilityLabel={p.title} />
          <View style={{ padding: space.lg, gap: space.sm }}>
            <Txt variant="h3">{p.title}</Txt>
            <Txt color={colors.textMuted}>{p.caption}</Txt>
            <Button
              label="Share"
              icon="share-social-outline"
              small
              onPress={() => share(p)}
              loading={busy === p.id}
              disabled={busy !== null && busy !== p.id}
              style={{ alignSelf: 'flex-start' }}
            />
          </View>
        </Card>
      ))}
    </Screen>
  );
}

const styles = StyleSheet.create({
  poster: { width: '100%', aspectRatio: 1080 / 1350, borderTopLeftRadius: radius.lg, borderTopRightRadius: radius.lg },
});
