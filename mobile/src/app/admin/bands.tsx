import { Stack } from 'expo-router';

import { MenuGroup } from '@/components/admin/kit';
import { AuthGate } from '@/components/AuthGate';
import { Badge, EmptyState, ListRow, Loading, Notice, Screen, Txt } from '@/components/ui';
import { useAsync } from '@/hooks/useAsync';
import { getBandMemberCount, getBands, isLocalBand } from '@/lib/api';
import { useAuth } from '@/providers/AuthProvider';
import { colors } from '@/theme';

function Bands() {
  const { isAdmin } = useAuth();
  const { data, error, loading, refreshing, refresh } = useAsync(async () => {
    const bands = (await getBands()).filter((b) => !isLocalBand(b));
    const counts = await Promise.all(bands.map((b) => getBandMemberCount(b.id)));
    return bands.map((band, i) => ({ band, members: counts[i] }));
  });

  return (
    <Screen refreshing={refreshing} onRefresh={refresh}>
      <Stack.Screen options={{ title: 'Bands' }} />
      {error ? <Notice tone="error">{error}</Notice> : null}
      {loading && !data ? (
        <Loading />
      ) : data && data.length === 0 ? (
        <EmptyState
          icon="musical-notes-outline"
          title="No bands in the database"
          body="Run supabase/seed-bands.sql to add the Haven bands, then pull to refresh."
        />
      ) : data ? (
        <>
          <Txt variant="small" color={colors.textMuted}>
            {isAdmin ? 'Tap a band to manage it and assign band admins.' : 'Tap a band to open its page.'}
          </Txt>
          <MenuGroup>
            {data.map(({ band, members }) => (
              <ListRow
                key={band.id}
                icon="musical-notes-outline"
                title={band.name}
                subtitle={band.meeting_time || band.focus_area}
                href={
                  isAdmin
                    ? { pathname: '/band-admin/[id]', params: { id: band.id } }
                    : { pathname: '/bands/[slug]', params: { slug: band.slug } }
                }
                right={<Badge label={`${members} ${members === 1 ? 'member' : 'members'}`} tone="muted" />}
              />
            ))}
          </MenuGroup>
        </>
      ) : null}
    </Screen>
  );
}

export default function AdminBands() {
  return (
    <AuthGate role="leader">
      <Bands />
    </AuthGate>
  );
}
