import { Stack } from 'expo-router';
import { useState } from 'react';
import { Linking, View } from 'react-native';

import { ActionRow, ContactLink, options, useBusy } from '@/components/admin/kit';
import { AuthGate } from '@/components/AuthGate';
import { Badge, Button, Card, Chips, EmptyState, Loading, Notice, Screen, Txt } from '@/components/ui';
import { useAsync } from '@/hooks/useAsync';
import { getVolunteers, setVolunteerStatus } from '@/lib/api';
import { formatDay } from '@/lib/format';
import type { ApplicationStatus } from '@/lib/types';
import { colors } from '@/theme';

const STATUSES = options<ApplicationStatus>(['pending', 'active', 'inactive']);

function Volunteers() {
  const [status, setStatus] = useState<ApplicationStatus>('pending');
  const { data, error, loading, refreshing, refresh } = useAsync(() => getVolunteers(status), [status]);
  const [busy, run] = useBusy();

  const move = async (id: string, next: ApplicationStatus) => {
    if (await run(id, () => setVolunteerStatus(id, next))) refresh();
  };

  return (
    <Screen refreshing={refreshing} onRefresh={refresh}>
      <Stack.Screen options={{ title: 'Volunteers' }} />
      <Chips options={STATUSES} value={status} onChange={setStatus} />
      {error ? <Notice tone="error">{error}</Notice> : null}
      {loading && !data ? (
        <Loading />
      ) : data && data.length === 0 ? (
        <EmptyState icon="hand-left-outline" title={`No ${status} volunteers`} />
      ) : (
        data?.map((v) => (
          <Card key={v.id}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <Badge label={v.committee?.name ?? 'General'} />
              <Txt variant="small" color={colors.textMuted}>
                {formatDay(v.created_at)}
              </Txt>
            </View>
            <Txt variant="h3" style={{ marginTop: 8 }}>
              {v.user?.name ?? 'Unknown member'}
            </Txt>
            {v.user?.email ? (
              <View style={{ marginTop: 4 }}>
                <ContactLink icon="mail-outline" label={v.user.email} onPress={() => Linking.openURL(`mailto:${v.user!.email}`)} />
              </View>
            ) : null}
            <View style={{ gap: 2, marginTop: 8 }}>
              <Txt variant="small">
                <Txt variant="small" style={{ fontWeight: '700' }}>Role: </Txt>
                {v.role}
              </Txt>
              {v.skills?.length ? (
                <Txt variant="small">
                  <Txt variant="small" style={{ fontWeight: '700' }}>Skills: </Txt>
                  {v.skills.join(', ')}
                </Txt>
              ) : null}
              <Txt variant="small">
                <Txt variant="small" style={{ fontWeight: '700' }}>Availability: </Txt>
                {v.availability} · {v.commitment_hours} h/week
              </Txt>
            </View>
            <ActionRow>
              {v.status !== 'active' ? (
                <Button
                  label={v.status === 'pending' ? 'Approve' : 'Reactivate'}
                  icon="checkmark"
                  small
                  loading={busy === v.id}
                  disabled={busy !== null}
                  onPress={() => move(v.id, 'active')}
                />
              ) : null}
              {v.status !== 'inactive' ? (
                <Button
                  label={v.status === 'pending' ? 'Decline' : 'Deactivate'}
                  icon="close"
                  variant="danger"
                  small
                  disabled={busy !== null}
                  onPress={() => move(v.id, 'inactive')}
                />
              ) : null}
            </ActionRow>
          </Card>
        ))
      )}
    </Screen>
  );
}

export default function AdminVolunteers() {
  return (
    <AuthGate role="leader">
      <Volunteers />
    </AuthGate>
  );
}
