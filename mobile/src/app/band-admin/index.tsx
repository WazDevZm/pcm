import { Redirect, Stack } from 'expo-router';

import { MenuGroup } from '@/components/admin/kit';
import { AuthGate } from '@/components/AuthGate';
import { EmptyState, ListRow, Loading, Notice, Screen, Txt } from '@/components/ui';
import { useAsync } from '@/hooks/useAsync';
import { getManagedBands } from '@/lib/api';
import type { Profile } from '@/lib/types';
import { useAuth } from '@/providers/AuthProvider';
import { colors } from '@/theme';

function MyBands({ profile }: { profile: Profile }) {
  const { data, error, loading, refreshing, refresh } = useAsync(() => getManagedBands(profile), [profile.id, profile.role]);

  if (loading && !data) return <Loading />;
  // Most band admins run a single band — take them straight to it
  if (data?.length === 1 && profile.role !== 'admin') {
    return <Redirect href={{ pathname: '/band-admin/[id]', params: { id: data[0].id } }} />;
  }

  return (
    <Screen refreshing={refreshing} onRefresh={refresh}>
      {error ? <Notice tone="error">{error}</Notice> : null}
      {data && data.length === 0 ? (
        <EmptyState
          icon="people-circle-outline"
          title="No bands to manage"
          body="When a Haven admin makes you a band admin, your band appears here."
        />
      ) : data ? (
        <>
          <Txt variant="small" color={colors.textMuted}>
            Choose a band to post announcements, schedule events and see members.
          </Txt>
          <MenuGroup>
            {data.map((b) => (
              <ListRow
                key={b.id}
                icon="musical-notes-outline"
                title={b.name}
                subtitle={b.meeting_time || b.focus_area}
                href={{ pathname: '/band-admin/[id]', params: { id: b.id } }}
              />
            ))}
          </MenuGroup>
        </>
      ) : null}
    </Screen>
  );
}

export default function BandAdminIndex() {
  const { profile } = useAuth();
  return (
    <>
      <Stack.Screen options={{ title: 'Band admin' }} />
      <AuthGate reason="Sign in to manage your band.">{profile ? <MyBands profile={profile} /> : <Loading />}</AuthGate>
    </>
  );
}
