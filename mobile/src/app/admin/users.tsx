import { Stack } from 'expo-router';
import { ActivityIndicator, Alert, StyleSheet, View } from 'react-native';

import { MenuGroup, useBusy } from '@/components/admin/kit';
import { useUserSearch } from '@/components/admin/useUserSearch';
import { AuthGate } from '@/components/AuthGate';
import { Badge, EmptyState, Field, ListRow, Loading, Notice, Screen, Txt } from '@/components/ui';
import { setUserRole } from '@/lib/api';
import type { Profile, Role } from '@/lib/types';
import { useAuth } from '@/providers/AuthProvider';
import { colors } from '@/theme';

const ROLES: Role[] = ['student', 'leader', 'admin'];
const roleTone = (r: Role) => (r === 'admin' ? 'gold' : r === 'leader' ? 'navy' : 'muted');

function Users() {
  const { user } = useAuth();
  const { search, setSearch, users, error, loading, reload } = useUserSearch();
  const [busy, run] = useBusy();

  const changeRole = (p: Profile) => {
    if (p.id === user?.id) {
      Alert.alert('That’s you', 'You can’t change your own role. Ask another admin.');
      return;
    }
    Alert.alert(`Role for ${p.name || p.email}`, `Currently ${p.role}.`, [
      ...ROLES.filter((r) => r !== p.role).map((r) => ({
        text: `Make ${r}`,
        onPress: async () => {
          if (await run(p.id, () => setUserRole(p.id, r))) reload();
        },
      })),
      { text: 'Cancel', style: 'cancel' as const },
    ]);
  };

  return (
    <Screen>
      <Stack.Screen options={{ title: 'Users & roles' }} />
      <Field
        label="Search"
        value={search}
        onChangeText={setSearch}
        placeholder="Name or email"
        autoCapitalize="none"
        autoCorrect={false}
        clearButtonMode="while-editing"
      />
      {error ? <Notice tone="error">{error}</Notice> : null}
      {loading && !users ? (
        <Loading />
      ) : users && users.length === 0 ? (
        <EmptyState icon="people-outline" title="No matching members" />
      ) : users ? (
        <>
          <Txt variant="small" color={colors.textMuted}>
            {users.length} {users.length === 1 ? 'member' : 'members'}
            {users.length >= 200 ? ' (showing the newest 200 — refine your search)' : ''}
          </Txt>
          <MenuGroup>
            {users.map((p) => (
              <ListRow
                key={p.id}
                icon={p.role === 'student' ? 'person-outline' : 'shield-checkmark-outline'}
                title={p.name || p.email}
                subtitle={p.id === user?.id ? `${p.email} · you` : p.email}
                onPress={() => changeRole(p)}
                right={
                  <View style={styles.right}>
                    {busy === p.id ? <ActivityIndicator color={colors.navy} /> : <Badge label={p.role} tone={roleTone(p.role)} />}
                  </View>
                }
              />
            ))}
          </MenuGroup>
        </>
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({ right: { minWidth: 60, alignItems: 'flex-end' } });

export default function AdminUsers() {
  return (
    <AuthGate role="admin">
      <Users />
    </AuthGate>
  );
}
