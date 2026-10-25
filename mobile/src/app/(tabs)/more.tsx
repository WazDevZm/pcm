import * as WebBrowser from 'expo-web-browser';
import { StyleSheet, View } from 'react-native';

import { HavenMonogram, PcmEndorsement } from '@/components/brand';
import { Badge, Button, Card, ListRow, Screen, Txt, type IconName } from '@/components/ui';
import { useAsync } from '@/hooks/useAsync';
import { getManagedBands } from '@/lib/api';
import { BRAND, WEB_URL } from '@/lib/brand';
import { useAuth } from '@/providers/AuthProvider';
import { colors, radius, space } from '@/theme';

type Item = { icon: IconName; title: string; subtitle?: string; href?: Parameters<typeof ListRow>[0]['href']; onPress?: () => void };

function Group({ title, items }: { title: string; items: Item[] }) {
  return (
    <View style={{ gap: space.sm }}>
      <Txt variant="label" color={colors.textMuted} style={{ paddingHorizontal: space.xs }}>
        {title}
      </Txt>
      <View style={styles.group}>
        {items.map((item, i) => (
          <View key={item.title}>
            {i > 0 ? <View style={styles.divider} /> : null}
            <ListRow {...item} />
          </View>
        ))}
      </View>
    </View>
  );
}

export default function MoreScreen() {
  const { profile, user, isLeader, isAdmin } = useAuth();
  // Band admins can be students, so check for bands they manage rather than relying on role
  const managed = useAsync(
    async () => (profile && !isLeader ? (await getManagedBands(profile)).length : 0),
    [profile?.id, isLeader]
  );

  return (
    <Screen>
      <Card style={{ flexDirection: 'row', alignItems: 'center', gap: space.md }}>
        <View style={styles.avatar}>
          <HavenMonogram size={26} />
        </View>
        <View style={{ flex: 1, gap: 2 }}>
          {user ? (
            <>
              <Txt variant="h3">{profile?.name ?? user.email}</Txt>
              <Txt variant="small" color={colors.textMuted}>
                {user.email}
              </Txt>
              {profile ? <Badge label={profile.role} tone={profile.role === 'student' ? 'muted' : 'gold'} /> : null}
            </>
          ) : (
            <>
              <Txt variant="h3">Welcome to {BRAND.name}</Txt>
              <Txt variant="small" color={colors.textMuted}>
                Sign in to RSVP, join bands and track your requests.
              </Txt>
            </>
          )}
        </View>
      </Card>
      {user ? (
        <Button label="My dashboard" variant="secondary" icon="person-circle-outline" href="/account" />
      ) : (
        <Button label="Sign in" icon="log-in-outline" href="/login" />
      )}

      {isLeader ? (
        <Group
          title="Leadership"
          items={[
            { icon: 'speedometer-outline', title: 'Admin dashboard', subtitle: isAdmin ? 'Content, requests, people' : 'Content and requests', href: '/admin' },
            { icon: 'people-circle-outline', title: 'Band admin', subtitle: 'Manage your band', href: '/band-admin' },
          ]}
        />
      ) : managed.data ? (
        <Group
          title="Leadership"
          items={[{ icon: 'people-circle-outline', title: 'Band admin', subtitle: 'Manage your band', href: '/band-admin' }]}
        />
      ) : null}

      <Group
        title="Care"
        items={[
          { icon: 'heart-outline', title: 'Prayer request', subtitle: 'Named or anonymous', href: '/prayer' },
          { icon: 'chatbubbles-outline', title: 'Counseling', subtitle: 'Confidential pastoral care', href: '/counseling' },
          { icon: 'hand-left-outline', title: 'Get involved', subtitle: 'Volunteer & give', href: '/get-involved' },
        ]}
      />

      <Group
        title="Ministry"
        items={[
          { icon: 'sparkles-outline', title: 'Programs', href: '/programs' },
          { icon: 'git-network-outline', title: 'Committees', href: '/committees' },
          { icon: 'megaphone-outline', title: 'Posters', subtitle: 'Share what’s on', href: '/posters' },
        ]}
      />

      <Group
        title="Discover"
        items={[
          { icon: 'newspaper-outline', title: 'News & testimonies', href: '/news' },
          { icon: 'images-outline', title: 'Gallery', href: '/gallery' },
          { icon: 'book-outline', title: 'Resources', subtitle: 'Bible studies, sermons, devotionals', href: '/resources' },
          { icon: 'library-outline', title: 'Magazines', href: '/magazines' },
        ]}
      />

      <Group
        title="The Haven"
        items={[
          { icon: 'mail-outline', title: 'Contact us', href: '/contact' },
          { icon: 'receipt-outline', title: 'My orders', href: '/orders' },
          ...(WEB_URL
            ? [{ icon: 'globe-outline' as const, title: 'Website', subtitle: 'Same account on the web', onPress: () => WebBrowser.openBrowserAsync(WEB_URL!) }]
            : []),
        ]}
      />

      <View style={{ alignItems: 'center', gap: space.sm, marginTop: space.md }}>
        <PcmEndorsement />
        <Txt variant="small" color={colors.textFaint} center>
          {BRAND.name} · {BRAND.location}
        </Txt>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  group: {
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    overflow: 'hidden',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
  },
  divider: { height: StyleSheet.hairlineWidth, backgroundColor: colors.border, marginLeft: 68 },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: colors.navy,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
