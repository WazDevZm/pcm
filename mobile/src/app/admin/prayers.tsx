import { Stack } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';

import { ActionRow, humanize, options, useBusy } from '@/components/admin/kit';
import { AuthGate } from '@/components/AuthGate';
import { Badge, Button, Card, Chips, EmptyState, Loading, Notice, Screen, Txt } from '@/components/ui';
import { useAsync } from '@/hooks/useAsync';
import { getPrayerRequests, setPrayerStatus } from '@/lib/api';
import { formatDay } from '@/lib/format';
import type { PrayerStatus } from '@/lib/types';
import { colors } from '@/theme';

const STATUSES = options<PrayerStatus>(['active', 'answered', 'archived']);

function Prayers() {
  const [status, setStatus] = useState<PrayerStatus>('active');
  const { data, error, loading, refreshing, refresh } = useAsync(() => getPrayerRequests(status), [status]);
  const [busy, run] = useBusy();

  const move = async (id: string, next: PrayerStatus) => {
    if (await run(id, () => setPrayerStatus(id, next))) refresh();
  };

  return (
    <Screen refreshing={refreshing} onRefresh={refresh}>
      <Stack.Screen options={{ title: 'Prayer requests' }} />
      <Chips options={STATUSES} value={status} onChange={setStatus} />
      {error ? <Notice tone="error">{error}</Notice> : null}
      {loading && !data ? (
        <Loading />
      ) : data && data.length === 0 ? (
        <EmptyState icon="heart-outline" title={`No ${status} requests`} />
      ) : (
        data?.map((p) => (
          <Card key={p.id}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <Badge label={humanize(p.category)} />
              <Txt variant="small" color={colors.textMuted}>
                {formatDay(p.created_at)}
              </Txt>
            </View>
            <Txt style={{ marginTop: 8 }}>{p.request}</Txt>
            <Txt variant="small" color={colors.textMuted} style={{ marginTop: 8 }}>
              {p.is_anonymous
                ? 'Anonymous'
                : [p.requester_name, p.requester_email].filter(Boolean).join(' · ') || 'No name given'}
            </Txt>
            <ActionRow>
              {p.status !== 'answered' ? (
                <Button
                  label="Mark answered"
                  icon="checkmark-circle-outline"
                  small
                  loading={busy === p.id}
                  disabled={busy !== null}
                  onPress={() => move(p.id, 'answered')}
                />
              ) : null}
              {p.status !== 'archived' ? (
                <Button
                  label="Archive"
                  icon="archive-outline"
                  variant="secondary"
                  small
                  disabled={busy !== null}
                  onPress={() => move(p.id, 'archived')}
                />
              ) : null}
              {p.status !== 'active' ? (
                <Button
                  label="Reactivate"
                  icon="refresh-outline"
                  variant="secondary"
                  small
                  disabled={busy !== null}
                  onPress={() => move(p.id, 'active')}
                />
              ) : null}
            </ActionRow>
          </Card>
        ))
      )}
    </Screen>
  );
}

export default function AdminPrayers() {
  return (
    <AuthGate role="leader">
      <Prayers />
    </AuthGate>
  );
}
