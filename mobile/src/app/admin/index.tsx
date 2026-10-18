import { router, Stack, type Href } from 'expo-router';
import { View } from 'react-native';

import { MenuGroup, StatTile, TileGrid } from '@/components/admin/kit';
import { AuthGate } from '@/components/AuthGate';
import { ListRow, Loading, Notice, Screen, Txt, type IconName } from '@/components/ui';
import { useAsync } from '@/hooks/useAsync';
import { getDashboardStats } from '@/lib/api';
import { BRAND } from '@/lib/brand';
import { useAuth } from '@/providers/AuthProvider';
import { colors } from '@/theme';

type Stats = Awaited<ReturnType<typeof getDashboardStats>>;

const TILES: { key: keyof Stats; label: string; icon: IconName; href: Href; urgent?: boolean; adminOnly?: boolean }[] = [
  { key: 'users', label: 'Members', icon: 'people-outline', href: '/admin/users', adminOnly: true },
  { key: 'upcomingEvents', label: 'Upcoming events', icon: 'calendar-outline', href: '/admin/events' },
  { key: 'posts', label: 'Posts', icon: 'newspaper-outline', href: '/admin/posts' },
  { key: 'activePrayers', label: 'Active prayers', icon: 'heart-outline', href: '/admin/prayers' },
  { key: 'pendingCounseling', label: 'Pending counseling', icon: 'chatbubbles-outline', href: '/admin/counseling', urgent: true },
  { key: 'pendingVolunteers', label: 'Pending volunteers', icon: 'hand-left-outline', href: '/admin/volunteers', urgent: true },
  { key: 'pendingOrders', label: 'Pending orders', icon: 'bag-handle-outline', href: '/admin/orders', urgent: true },
  { key: 'messages', label: 'Messages', icon: 'mail-outline', href: '/admin/messages' },
];

function Dashboard() {
  const { profile, isAdmin } = useAuth();
  const { data, error, loading, refreshing, refresh } = useAsync(getDashboardStats);

  return (
    <Screen refreshing={refreshing} onRefresh={refresh}>
      <Stack.Screen options={{ title: 'Admin' }} />
      <View style={{ gap: 4 }}>
        <Txt variant="label" color={colors.navy}>
          {BRAND.name} leadership
        </Txt>
        <Txt variant="h1">Welcome, {profile?.name?.split(' ')[0] ?? 'leader'}</Txt>
      </View>

      {error ? <Notice tone="error">{error}</Notice> : null}
      {loading && !data ? (
        <Loading label="Loading overview…" />
      ) : data ? (
        <TileGrid>
          {TILES.map((t) => (
            <StatTile
              key={t.key}
              icon={t.icon}
              label={t.label}
              value={data[t.key]}
              highlight={t.urgent && data[t.key] > 0}
              onPress={t.adminOnly && !isAdmin ? undefined : () => router.push(t.href)}
            />
          ))}
        </TileGrid>
      ) : null}

      <MenuGroup title="Content">
        {[
          <ListRow key="p" icon="newspaper-outline" title="Posts" subtitle="News, testimonies, announcements" href="/admin/posts" />,
          <ListRow key="e" icon="calendar-outline" title="Events" subtitle="Schedule and RSVPs" href="/admin/events" />,
          <ListRow key="g" icon="images-outline" title="Gallery" subtitle="Photos from ministry life" href="/admin/gallery" />,
          <ListRow key="r" icon="book-outline" title="Resources" subtitle="Studies, sermons, devotionals" href="/admin/resources" />,
        ]}
      </MenuGroup>

      <MenuGroup title="Care">
        {[
          <ListRow key="p" icon="heart-outline" title="Prayer requests" href="/admin/prayers" />,
          <ListRow key="c" icon="chatbubbles-outline" title="Counseling" subtitle="Schedule and follow up" href="/admin/counseling" />,
          <ListRow key="v" icon="hand-left-outline" title="Volunteers" subtitle="Review applications" href="/admin/volunteers" />,
          <ListRow key="m" icon="mail-outline" title="Messages" subtitle="Contact form submissions" href="/admin/messages" />,
        ]}
      </MenuGroup>

      <MenuGroup title="Ministry">
        {[
          <ListRow key="o" icon="bag-handle-outline" title="Merch orders" href="/admin/orders" />,
          <ListRow key="b" icon="musical-notes-outline" title="Bands" subtitle={isAdmin ? 'Bands and band admins' : 'All bands'} href="/admin/bands" />,
          <ListRow key="ba" icon="people-circle-outline" title="Band admin" subtitle="Manage your band" href="/band-admin" />,
          ...(isAdmin
            ? [<ListRow key="u" icon="shield-checkmark-outline" title="Users & roles" subtitle="Admins only" href="/admin/users" />]
            : []),
        ]}
      </MenuGroup>
    </Screen>
  );
}

export default function AdminIndex() {
  return (
    <AuthGate role="leader">
      <Dashboard />
    </AuthGate>
  );
}
