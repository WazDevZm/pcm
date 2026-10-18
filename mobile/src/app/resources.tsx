import { Stack } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import { useState } from 'react';
import { View } from 'react-native';

import {
  Badge,
  Button,
  Card,
  Chips,
  EmptyState,
  IconTile,
  Ionicons,
  Loading,
  Notice,
  OfflineNotice,
  Row,
  Screen,
  Txt,
  type IconName,
} from '@/components/ui';
import { useAsync } from '@/hooks/useAsync';
import { getResources } from '@/lib/api';
import { errorMessage } from '@/lib/format';
import type { ResourceType } from '@/lib/types';
import { colors, space } from '@/theme';

const TYPES: { value: ResourceType; label: string; icon: IconName }[] = [
  { value: 'bible_study', label: 'Bible studies', icon: 'book-outline' },
  { value: 'sermon', label: 'Sermons', icon: 'mic-outline' },
  { value: 'devotional', label: 'Devotionals', icon: 'sunny-outline' },
  { value: 'manual', label: 'Manuals', icon: 'document-text-outline' },
];

const LEVEL_TONE = { beginner: 'success', intermediate: 'gold', advanced: 'navy' } as const;

export default function ResourcesScreen() {
  const [type, setType] = useState<ResourceType>('bible_study');
  const [openError, setOpenError] = useState<string | null>(null);
  const resources = useAsync(() => getResources(type), [type]);
  const list = resources.data ?? [];
  const meta = TYPES.find((t) => t.value === type) ?? TYPES[0];

  const open = async (url: string) => {
    setOpenError(null);
    try {
      await WebBrowser.openBrowserAsync(url);
    } catch (e) {
      setOpenError(errorMessage(e));
    }
  };

  return (
    <Screen refreshing={resources.refreshing} onRefresh={resources.refresh}>
      <Stack.Screen options={{ title: 'Resources' }} />
      <Txt color={colors.textMuted}>Bible studies, sermons, devotionals and manuals for your walk with God.</Txt>
      <OfflineNotice />
      <Chips options={TYPES.map(({ value, label }) => ({ value, label }))} value={type} onChange={setType} />
      {resources.error ? <Notice tone="error">{resources.error}</Notice> : null}
      {openError ? <Notice tone="error">{openError}</Notice> : null}
      {resources.loading && !resources.data ? (
        <Loading label="Loading resources" />
      ) : list.length ? (
        list.map((r) => {
          const url = r.download_url || r.file_url;
          const extras = [
            r.lessons ? `${r.lessons} ${r.lessons === 1 ? 'lesson' : 'lessons'}` : null,
            r.duration || null,
          ].filter(Boolean);
          return (
            <Card key={r.id} style={{ gap: space.sm }}>
              <Row gap={space.md} style={{ alignItems: 'flex-start' }}>
                <IconTile icon={meta.icon} />
                <View style={{ flex: 1, gap: 2 }}>
                  <Txt variant="h3">{r.title}</Txt>
                  <Txt variant="small" color={colors.textMuted}>
                    {r.author}
                  </Txt>
                </View>
              </Row>
              {r.description ? <Txt color={colors.textMuted}>{r.description}</Txt> : null}
              <Row style={{ flexWrap: 'wrap' }}>
                <Badge label={r.level} tone={LEVEL_TONE[r.level] ?? 'muted'} />
                {r.category ? <Badge label={r.category} tone="muted" /> : null}
                {extras.length ? (
                  <Row gap={4}>
                    <Ionicons name="time-outline" size={14} color={colors.textMuted} />
                    <Txt variant="small" color={colors.textMuted}>
                      {extras.join(' · ')}
                    </Txt>
                  </Row>
                ) : null}
              </Row>
              {url ? (
                <Button label="Open" small icon="open-outline" onPress={() => open(url)} style={{ alignSelf: 'flex-start' }} />
              ) : null}
            </Card>
          );
        })
      ) : !resources.error ? (
        <EmptyState
          icon={meta.icon}
          title={`No ${meta.label.toLowerCase()} yet`}
          body="Leaders add new study material regularly. Pull down to refresh, or check another category."
        />
      ) : null}
    </Screen>
  );
}
