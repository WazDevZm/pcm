import { Stack, useLocalSearchParams } from 'expo-router';
import { ActivityIndicator, Linking } from 'react-native';

import { BandGate } from '@/components/admin/BandGate';
import { confirmAction, MenuGroup, useBusy } from '@/components/admin/kit';
import { Badge, EmptyState, ListRow, Loading, Notice, Screen, Txt } from '@/components/ui';
import { useAsync } from '@/hooks/useAsync';
import { getBandMembers, removeBandMember } from '@/lib/api';
import { formatDay } from '@/lib/format';
import type { Band } from '@/lib/types';
import { colors } from '@/theme';

type Member = Awaited<ReturnType<typeof getBandMembers>>[number];

function Members({ band }: { band: Band }) {
  const { data, error, loading, refreshing, refresh } = useAsync(() => getBandMembers(band.id), [band.id]);
  const [busy, run] = useBusy();

  const open = (m: Member) => {
    const name = m.user?.name || m.user?.email || 'This member';
    confirmAction(name, `Joined ${formatDay(m.joined_at)}. Remove them from ${band.name}?`, 'Remove', async () => {
      if (m.user && (await run(m.id, () => removeBandMember(band.id, m.user!.id)))) refresh();
    });
  };

  return (
    <Screen refreshing={refreshing} onRefresh={refresh}>
      <Stack.Screen options={{ title: 'Members' }} />
      {error ? <Notice tone="error">{error}</Notice> : null}
      {loading && !data ? (
        <Loading />
      ) : data && data.length === 0 ? (
        <EmptyState icon="people-outline" title="No members yet" body="Members appear here when they join from the band page." />
      ) : data ? (
        <>
          <Txt variant="small" color={colors.textMuted}>
            {data.length} {data.length === 1 ? 'member' : 'members'} · tap a member to remove them
          </Txt>
          <MenuGroup>
            {data.map((m) => (
              <ListRow
                key={m.id}
                icon="person-outline"
                title={m.user?.name || m.user?.email || 'Member'}
                subtitle={m.user?.email ? `${m.user.email} · joined ${formatDay(m.joined_at)}` : `Joined ${formatDay(m.joined_at)}`}
                onPress={() => open(m)}
                right={busy === m.id ? <ActivityIndicator color={colors.navy} /> : m.role !== 'member' ? <Badge label={m.role} tone="gold" /> : undefined}
              />
            ))}
          </MenuGroup>
          {data.some((m) => m.user?.email) ? (
            <Notice>
              Need to reach everyone? Email {band.name} members from{' '}
              <Txt
                variant="small"
                color={colors.navy}
                style={{ fontWeight: '700' }}
                onPress={() =>
                  Linking.openURL(`mailto:?bcc=${data.map((m) => m.user?.email).filter(Boolean).join(',')}&subject=${encodeURIComponent(band.name)}`)
                }>
                your mail app
              </Txt>
              .
            </Notice>
          ) : null}
        </>
      ) : null}
    </Screen>
  );
}

export default function BandMembers() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <BandGate bandId={id}>{(band) => <Members band={band} />}</BandGate>;
}
