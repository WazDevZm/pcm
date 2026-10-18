import { router, Stack } from 'expo-router';
import { View } from 'react-native';

import { ActionRow, confirmAction, humanize, useBusy } from '@/components/admin/kit';
import { AuthGate } from '@/components/AuthGate';
import { Badge, Button, Card, EmptyState, Loading, Notice, Screen, Txt } from '@/components/ui';
import { useAsync } from '@/hooks/useAsync';
import { deleteResource, getResources } from '@/lib/api';
import { colors } from '@/theme';

function Resources() {
  const { data, error, loading, refreshing, refresh } = useAsync(() => getResources());
  const [busy, run] = useBusy();

  const remove = (id: string, title: string) =>
    confirmAction('Delete resource?', `“${title}” will be removed.`, 'Delete', async () => {
      if (await run(id, () => deleteResource(id))) refresh();
    });

  const edit = (id: string) => router.push({ pathname: '/admin/resource-edit', params: { id } });

  return (
    <Screen refreshing={refreshing} onRefresh={refresh}>
      <Stack.Screen options={{ title: 'Resources' }} />
      <Button label="New resource" icon="add" href="/admin/resource-edit" />
      {error ? <Notice tone="error">{error}</Notice> : null}
      {loading && !data ? (
        <Loading />
      ) : data && data.length === 0 ? (
        <EmptyState icon="book-outline" title="No resources yet" body="Add Bible studies, sermons and devotionals." />
      ) : (
        data?.map((r) => (
          <Card key={r.id} onPress={() => edit(r.id)}>
            <View style={{ flexDirection: 'row', gap: 6 }}>
              <Badge label={humanize(r.type)} />
              <Badge label={r.level} tone="muted" />
            </View>
            <Txt variant="h3" style={{ marginTop: 8 }}>
              {r.title}
            </Txt>
            <Txt variant="small" color={colors.textMuted}>
              {[r.author, r.category, r.lessons ? `${r.lessons} lessons` : null, r.duration].filter(Boolean).join(' · ')}
            </Txt>
            <ActionRow>
              <Button label="Edit" icon="create-outline" variant="secondary" small onPress={() => edit(r.id)} />
              <Button
                label="Delete"
                icon="trash-outline"
                variant="danger"
                small
                loading={busy === r.id}
                disabled={busy !== null}
                onPress={() => remove(r.id, r.title)}
              />
            </ActionRow>
          </Card>
        ))
      )}
    </Screen>
  );
}

export default function AdminResources() {
  return (
    <AuthGate role="leader">
      <Resources />
    </AuthGate>
  );
}
