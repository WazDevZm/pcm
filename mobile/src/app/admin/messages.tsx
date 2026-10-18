import { Stack } from 'expo-router';
import { Linking, View } from 'react-native';

import { ActionRow, confirmAction, useBusy } from '@/components/admin/kit';
import { AuthGate } from '@/components/AuthGate';
import { Button, Card, EmptyState, Loading, Notice, Screen, Txt } from '@/components/ui';
import { useAsync } from '@/hooks/useAsync';
import { deleteContactSubmission, getContactSubmissions } from '@/lib/api';
import { timeAgo } from '@/lib/format';
import { useAuth } from '@/providers/AuthProvider';
import { colors, space } from '@/theme';

function Messages() {
  const { isAdmin } = useAuth();
  const { data, error, loading, refreshing, refresh } = useAsync(getContactSubmissions);
  const [busy, run] = useBusy();

  const remove = (id: string, name: string) =>
    confirmAction('Delete message?', `The message from ${name} will be permanently deleted.`, 'Delete', async () => {
      if (await run(id, () => deleteContactSubmission(id))) refresh();
    });

  return (
    <Screen refreshing={refreshing} onRefresh={refresh}>
      <Stack.Screen options={{ title: 'Messages' }} />
      {error ? <Notice tone="error">{error}</Notice> : null}
      {loading && !data ? (
        <Loading />
      ) : data && data.length === 0 ? (
        <EmptyState icon="mail-outline" title="Inbox is empty" body="Messages from the contact form show up here." />
      ) : (
        data?.map((m) => (
          <Card key={m.id}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: space.sm }}>
              <Txt variant="h3" style={{ flex: 1 }}>
                {m.name}
              </Txt>
              <Txt variant="small" color={colors.textMuted}>
                {timeAgo(m.created_at)}
              </Txt>
            </View>
            <Txt variant="small" color={colors.textMuted}>
              {m.email}
            </Txt>
            {m.subject ? (
              <Txt style={{ fontWeight: '700', marginTop: space.sm }}>{m.subject}</Txt>
            ) : null}
            <Txt style={{ marginTop: 4 }}>{m.message}</Txt>
            <ActionRow>
              <Button
                label="Reply"
                icon="arrow-undo-outline"
                small
                onPress={() =>
                  Linking.openURL(`mailto:${m.email}?subject=${encodeURIComponent(`Re: ${m.subject || 'Your message to The Haven'}`)}`)
                }
              />
              {isAdmin ? (
                <Button
                  label="Delete"
                  icon="trash-outline"
                  variant="danger"
                  small
                  loading={busy === m.id}
                  disabled={busy !== null}
                  onPress={() => remove(m.id, m.name)}
                />
              ) : null}
            </ActionRow>
          </Card>
        ))
      )}
    </Screen>
  );
}

export default function AdminMessages() {
  return (
    <AuthGate role="leader">
      <Messages />
    </AuthGate>
  );
}
