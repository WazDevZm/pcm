import { Stack, useLocalSearchParams } from 'expo-router';
import { ActivityIndicator } from 'react-native';

import { confirmAction, MenuGroup, useBusy } from '@/components/admin/kit';
import { useUserSearch } from '@/components/admin/useUserSearch';
import { AuthGate } from '@/components/AuthGate';
import { Badge, EmptyState, Field, Ionicons, ListRow, Loading, Notice, Screen, Txt } from '@/components/ui';
import { useAsync } from '@/hooks/useAsync';
import { addBandAdmin, getBandAdmins, getBands, removeBandAdmin } from '@/lib/api';
import { colors, space } from '@/theme';

function Admins({ bandId }: { bandId: string }) {
  const { data, error, loading, refresh } = useAsync(
    async () => {
      const [admins, bands] = await Promise.all([getBandAdmins(bandId), getBands()]);
      return { admins, band: bands.find((b) => b.id === bandId) ?? null };
    },
    [bandId]
  );
  const { search, setSearch, users, error: searchError, loading: searching } = useUserSearch(data !== null);
  const [busy, run] = useBusy();

  const adminIds = new Set(data?.admins.map((a) => a.user?.id));
  const bandName = data?.band?.name ?? 'this band';

  const add = (userId: string, name: string) =>
    confirmAction(`Make ${name} a band admin?`, `They’ll be able to post announcements, run events and manage members for ${bandName}.`, 'Add', async () => {
      if (await run(userId, () => addBandAdmin(bandId, userId))) {
        setSearch('');
        refresh();
      }
    });

  const remove = (userId: string, name: string) =>
    confirmAction(`Remove ${name}?`, `They’ll no longer manage ${bandName}.`, 'Remove', async () => {
      if (await run(userId, () => removeBandAdmin(bandId, userId))) refresh();
    });

  if (loading && !data) return <Loading />;

  return (
    <Screen>
      <Stack.Screen options={{ title: 'Band admins' }} />
      {error ? <Notice tone="error">{error}</Notice> : null}
      {data?.band?.leader_id ? <Notice>The band’s leader account can always manage it, in addition to the admins below.</Notice> : null}

      {data && data.admins.length === 0 ? (
        <EmptyState icon="shield-outline" title="No band admins yet" body="Search below to add someone." />
      ) : (
        <MenuGroup title="Current admins">
          {(data?.admins ?? []).map((a) => {
            const name = a.user?.name || a.user?.email || 'Member';
            return (
              <ListRow
                key={a.id}
                icon="shield-checkmark-outline"
                title={name}
                subtitle={a.user?.email}
                onPress={() => a.user && remove(a.user.id, name)}
                right={busy === a.user?.id ? <ActivityIndicator color={colors.navy} /> : <Ionicons name="close-circle-outline" size={20} color={colors.danger} />}
              />
            );
          })}
        </MenuGroup>
      )}

      <Txt variant="h3" style={{ marginTop: space.md }}>
        Add an admin
      </Txt>
      <Field
        label="Search members"
        value={search}
        onChangeText={setSearch}
        placeholder="Name or email"
        autoCapitalize="none"
        autoCorrect={false}
        clearButtonMode="while-editing"
      />
      {searchError ? <Notice tone="error">{searchError}</Notice> : null}
      {search.trim() ? (
        searching && !users ? (
          <Loading />
        ) : users && users.length === 0 ? (
          <Txt variant="small" color={colors.textMuted}>
            No matching members.
          </Txt>
        ) : (
          <MenuGroup>
            {(users ?? []).slice(0, 20).map((p) => {
              const name = p.name || p.email;
              const already = adminIds.has(p.id);
              return (
                <ListRow
                  key={p.id}
                  icon="person-add-outline"
                  title={name}
                  subtitle={p.email}
                  onPress={already ? undefined : () => add(p.id, name)}
                  right={
                    busy === p.id ? (
                      <ActivityIndicator color={colors.navy} />
                    ) : already ? (
                      <Badge label="Admin" tone="gold" />
                    ) : (
                      <Ionicons name="add-circle-outline" size={20} color={colors.navy} />
                    )
                  }
                />
              );
            })}
          </MenuGroup>
        )
      ) : null}
    </Screen>
  );
}

export default function BandAdmins() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return (
    <AuthGate role="admin">
      <Admins bandId={id} />
    </AuthGate>
  );
}
