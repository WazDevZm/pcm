import { router, Stack } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';

import { MenuGroup } from '@/components/admin/kit';
import { AuthGate } from '@/components/AuthGate';
import { StatusBadge } from '@/components/forms/StatusBadge';
import { Badge, Button, Card, Field, ListRow, Loading, Notice, Screen, Txt } from '@/components/ui';
import { useAsync } from '@/hooks/useAsync';
import {
  getBands,
  getMyBandIds,
  getMyCounselingRequests,
  getMyEvents,
  getMyPrayerRequests,
  getMyVolunteerApplications,
  updateProfile,
} from '@/lib/api';
import { errorMessage, formatDateTime, formatDay } from '@/lib/format';
import type { Profile } from '@/lib/types';
import { useAuth } from '@/providers/AuthProvider';
import { colors, space } from '@/theme';

function ProfileCard({ profile }: { profile: Profile }) {
  const { refreshProfile } = useAuth();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(profile.name);
  const [phone, setPhone] = useState(profile.phone ?? '');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const startEditing = () => {
    setName(profile.name);
    setPhone(profile.phone ?? '');
    setError(null);
    setEditing(true);
  };

  const save = async () => {
    if (!name.trim()) return setError('Add your name.');
    setSaving(true);
    setError(null);
    try {
      await updateProfile(profile.id, { name: name.trim(), phone: phone.trim() || null });
      await refreshProfile();
      setEditing(false);
    } catch (e) {
      setError(errorMessage(e));
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card style={{ gap: space.sm }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: space.sm }}>
        <Txt variant="h3" style={{ flex: 1 }}>
          {profile.name || 'Your profile'}
        </Txt>
        <Badge label={profile.role} tone={profile.role === 'student' ? 'muted' : 'gold'} />
      </View>
      <Txt variant="small" color={colors.textMuted}>
        {profile.email}
        {profile.phone ? ` · ${profile.phone}` : ''}
      </Txt>
      {editing ? (
        <>
          {error ? <Notice tone="error">{error}</Notice> : null}
          <Field label="Name" value={name} onChangeText={setName} autoComplete="name" />
          <Field label="Phone (optional)" value={phone} onChangeText={setPhone} keyboardType="phone-pad" autoComplete="tel" />
          <View style={{ flexDirection: 'row', gap: space.sm }}>
            <Button label="Save" icon="checkmark" small loading={saving} onPress={save} style={{ flex: 1 }} />
            <Button label="Cancel" variant="secondary" small disabled={saving} onPress={() => setEditing(false)} />
          </View>
        </>
      ) : (
        <Button label="Edit profile" icon="create-outline" variant="secondary" small onPress={startEditing} />
      )}
    </Card>
  );
}

function Dashboard({ profile }: { profile: Profile }) {
  const { signOut } = useAuth();
  const { data, error, loading, refreshing, refresh } = useAsync(
    async () => {
      const [events, bandIds, bands, prayers, counseling, volunteering] = await Promise.all([
        getMyEvents(profile.id),
        getMyBandIds(profile.id),
        getBands(),
        getMyPrayerRequests(profile.id),
        getMyCounselingRequests(profile.id),
        getMyVolunteerApplications(profile.id),
      ]);
      const upcoming = events.filter((e) => new Date(e.date).getTime() > Date.now() - 6 * 3600_000);
      return { upcoming, bands: bands.filter((b) => bandIds.includes(b.id)), prayers, counseling, volunteering };
    },
    [profile.id]
  );

  return (
    <Screen refreshing={refreshing} onRefresh={refresh}>
      <ProfileCard profile={profile} />
      {error ? <Notice tone="error">{error}</Notice> : null}

      {loading && !data ? (
        <Loading />
      ) : data ? (
        <>
          <MenuGroup title="My events">
            {data.upcoming.length
              ? data.upcoming.map((ev) => (
                  <ListRow
                    key={ev.id}
                    icon="calendar-outline"
                    title={ev.title}
                    subtitle={`${formatDateTime(ev.date)} · ${ev.location}`}
                    href={{ pathname: '/events/[id]', params: { id: ev.id } }}
                  />
                ))
              : [<ListRow key="none" icon="calendar-outline" title="No upcoming RSVPs" subtitle="Browse what’s on" href="/events" />]}
          </MenuGroup>

          <MenuGroup title="My bands">
            {data.bands.length
              ? data.bands.map((b) => (
                  <ListRow
                    key={b.id}
                    icon="musical-notes-outline"
                    title={b.name}
                    subtitle={b.meeting_time}
                    href={{ pathname: '/bands/[slug]', params: { slug: b.slug } }}
                  />
                ))
              : [<ListRow key="none" icon="musical-notes-outline" title="You haven’t joined a band" subtitle="Find your band" href="/bands" />]}
          </MenuGroup>

          {data.prayers.length ? (
            <MenuGroup title="Prayer requests">
              {data.prayers.slice(0, 5).map((p) => (
                <ListRow
                  key={p.id}
                  icon="heart-outline"
                  title={p.request}
                  subtitle={formatDay(p.created_at)}
                  href="/prayer"
                  right={<StatusBadge status={p.status} />}
                />
              ))}
            </MenuGroup>
          ) : null}

          {data.counseling.length ? (
            <MenuGroup title="Counseling">
              {data.counseling.map((c) => (
                <ListRow
                  key={c.id}
                  icon="chatbubbles-outline"
                  title={c.service_type.replace(/^\w/, (s) => s.toUpperCase())}
                  subtitle={c.appointment_date ? `Appointment ${formatDateTime(c.appointment_date)}` : `Requested ${formatDay(c.created_at)}`}
                  href="/counseling"
                  right={<StatusBadge status={c.status} />}
                />
              ))}
            </MenuGroup>
          ) : null}

          {data.volunteering.length ? (
            <MenuGroup title="Volunteering">
              {data.volunteering.map((v) => (
                <ListRow
                  key={v.id}
                  icon="hand-left-outline"
                  title={v.role}
                  subtitle={v.committee?.name ?? 'General'}
                  href="/get-involved"
                  right={<StatusBadge status={v.status} label={v.status === 'active' ? 'approved' : undefined} />}
                />
              ))}
            </MenuGroup>
          ) : null}

          <MenuGroup title="Store">
            {[<ListRow key="o" icon="receipt-outline" title="My orders" href="/orders" />]}
          </MenuGroup>
        </>
      ) : null}

      <Button
        label="Sign out"
        icon="log-out-outline"
        variant="danger"
        onPress={async () => {
          await signOut();
          router.back();
        }}
      />
    </Screen>
  );
}

export default function AccountScreen() {
  const { profile, refreshProfile, signOut } = useAuth();
  return (
    <>
      <Stack.Screen options={{ title: 'My dashboard' }} />
      <AuthGate reason="Sign in to see your events, bands and requests.">
        {profile ? (
          <Dashboard profile={profile} />
        ) : (
          <Screen>
            <Notice tone="error">We couldn’t load your profile. Check your connection and try again.</Notice>
            <Button label="Try again" icon="refresh" onPress={refreshProfile} />
            <Button label="Sign out" icon="log-out-outline" variant="danger" onPress={signOut} />
          </Screen>
        )}
      </AuthGate>
    </>
  );
}
