import { Stack } from 'expo-router';
import { useState } from 'react';
import { Linking, View } from 'react-native';

import { ActionRow, ContactLink, humanize, options, useBusy } from '@/components/admin/kit';
import { AuthGate } from '@/components/AuthGate';
import { Badge, Button, Card, Chips, EmptyState, Field, Loading, Notice, Screen, Txt } from '@/components/ui';
import { useAsync } from '@/hooks/useAsync';
import { getCounselingRequests, updateCounselingRequest } from '@/lib/api';
import { formatDateTime, formatDay, parseLocalDateTime, toLocalDateTimeInput } from '@/lib/format';
import type { CounselingRequest, CounselingStatus } from '@/lib/types';
import { colors, space } from '@/theme';

const STATUSES = options<CounselingStatus>(['pending', 'scheduled', 'completed']);

function RequestCard({
  r,
  busy,
  run,
  onChanged,
}: {
  r: CounselingRequest;
  busy: string | null;
  run: (key: string, fn: () => Promise<unknown>) => Promise<boolean>;
  onChanged: () => void;
}) {
  const [scheduling, setScheduling] = useState(false);
  const [when, setWhen] = useState(toLocalDateTimeInput(r.appointment_date));
  const [fieldError, setFieldError] = useState<string | null>(null);

  const schedule = async () => {
    const iso = parseLocalDateTime(when);
    if (!iso) return setFieldError('Use the format 2026-10-24 14:00.');
    setFieldError(null);
    if (await run(r.id, () => updateCounselingRequest(r.id, { status: 'scheduled', appointment_date: iso }))) {
      setScheduling(false);
      onChanged();
    }
  };

  const complete = async () => {
    if (await run(r.id, () => updateCounselingRequest(r.id, { status: 'completed' }))) onChanged();
  };

  return (
    <Card>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <Badge label={humanize(r.service_type)} tone={r.service_type === 'crisis' ? 'danger' : 'navy'} />
        <Txt variant="small" color={colors.textMuted}>
          {formatDay(r.created_at)}
        </Txt>
      </View>
      <Txt variant="h3" style={{ marginTop: 8 }}>
        {r.name}
      </Txt>
      <View style={{ gap: 6, marginTop: 6 }}>
        <ContactLink icon="mail-outline" label={r.email} onPress={() => Linking.openURL(`mailto:${r.email}`)} />
        {r.phone ? <ContactLink icon="call-outline" label={r.phone} onPress={() => Linking.openURL(`tel:${r.phone}`)} /> : null}
      </View>
      {r.preferred_counselor ? (
        <Txt variant="small" color={colors.textMuted} style={{ marginTop: 6 }}>
          Prefers: {r.preferred_counselor}
        </Txt>
      ) : null}
      <Txt style={{ marginTop: space.sm }}>{r.message}</Txt>
      {r.appointment_date ? (
        <Notice tone="success">Appointment: {formatDateTime(r.appointment_date)}</Notice>
      ) : null}

      {scheduling ? (
        <View style={{ gap: space.sm, marginTop: space.md }}>
          <Field
            label="Appointment"
            value={when}
            onChangeText={setWhen}
            placeholder="YYYY-MM-DD HH:MM"
            autoCapitalize="none"
            keyboardType="numbers-and-punctuation"
            error={fieldError}
          />
          <ActionRow>
            <Button label="Save" icon="checkmark" small loading={busy === r.id} disabled={busy !== null} onPress={schedule} />
            <Button label="Cancel" variant="ghost" small onPress={() => setScheduling(false)} />
          </ActionRow>
        </View>
      ) : r.status !== 'completed' ? (
        <ActionRow>
          <Button
            label={r.status === 'scheduled' ? 'Reschedule' : 'Schedule'}
            icon="calendar-outline"
            small
            variant={r.status === 'scheduled' ? 'secondary' : 'primary'}
            disabled={busy !== null}
            onPress={() => setScheduling(true)}
          />
          <Button
            label="Mark completed"
            icon="checkmark-done-outline"
            variant="secondary"
            small
            loading={busy === r.id}
            disabled={busy !== null}
            onPress={complete}
          />
        </ActionRow>
      ) : null}
    </Card>
  );
}

function Counseling() {
  const [status, setStatus] = useState<CounselingStatus>('pending');
  const { data, error, loading, refreshing, refresh } = useAsync(() => getCounselingRequests(status), [status]);
  const [busy, run] = useBusy();

  return (
    <Screen refreshing={refreshing} onRefresh={refresh}>
      <Stack.Screen options={{ title: 'Counseling' }} />
      <Chips options={STATUSES} value={status} onChange={setStatus} />
      {error ? <Notice tone="error">{error}</Notice> : null}
      {loading && !data ? (
        <Loading />
      ) : data && data.length === 0 ? (
        <EmptyState icon="chatbubbles-outline" title={`No ${status} requests`} />
      ) : (
        data?.map((r) => <RequestCard key={r.id} r={r} busy={busy} run={run} onChanged={refresh} />)
      )}
    </Screen>
  );
}

export default function AdminCounseling() {
  return (
    <AuthGate role="leader">
      <Counseling />
    </AuthGate>
  );
}
