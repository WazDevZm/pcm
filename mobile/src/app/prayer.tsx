import { Stack } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, View } from 'react-native';

import { StatusBadge } from '@/components/forms/StatusBadge';
import {
  Button,
  Card,
  Chips,
  Field,
  IconTile,
  Loading,
  Notice,
  OfflineNotice,
  PhotoHeader,
  Screen,
  SectionHeader,
  SuccessPanel,
  Toggle,
  Txt,
} from '@/components/ui';
import { photo } from '@/data/images';
import { useAsync } from '@/hooks/useAsync';
import { usePrefilled } from '@/hooks/usePrefilled';
import { getMyPrayerRequests, submitPrayerRequest } from '@/lib/api';
import { errorMessage, isValidEmail, timeAgo } from '@/lib/format';
import type { PrayerCategory } from '@/lib/types';
import { useAuth } from '@/providers/AuthProvider';
import { colors, space } from '@/theme';

const CATEGORIES: { value: PrayerCategory; label: string }[] = [
  { value: 'personal', label: 'Personal' },
  { value: 'family', label: 'Family' },
  { value: 'health', label: 'Health' },
  { value: 'academic', label: 'Academic' },
  { value: 'ministry', label: 'Ministry' },
];

const CATEGORY_LABEL = Object.fromEntries(CATEGORIES.map((c) => [c.value, c.label])) as Record<PrayerCategory, string>;

function MyRequests({ userId, version }: { userId: string; version: number }) {
  const mine = useAsync(() => getMyPrayerRequests(userId), [userId, version]);
  return (
    <View style={{ gap: space.md }}>
      <SectionHeader eyebrow="Your history" title="Your requests" />
      {mine.error ? <Notice tone="error">{mine.error}</Notice> : null}
      {mine.loading ? (
        <Loading />
      ) : !(mine.data ?? []).length ? (
        <Txt color={colors.textMuted}>Requests you submit while signed in (not anonymously) appear here.</Txt>
      ) : (
        (mine.data ?? []).map((r) => (
          <Card key={r.id} style={{ gap: space.sm }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: space.sm }}>
              <Txt variant="small" color={colors.navy} style={{ flex: 1, fontWeight: '700' }}>
                {CATEGORY_LABEL[r.category] ?? r.category} · {timeAgo(r.created_at)}
              </Txt>
              <StatusBadge status={r.status} />
            </View>
            <Txt numberOfLines={4}>{r.request}</Txt>
          </Card>
        ))
      )}
    </View>
  );
}

export default function PrayerScreen() {
  const { user, profile } = useAuth();
  const [category, setCategory] = useState<PrayerCategory>('personal');
  const [request, setRequest] = useState('');
  const [anonymous, setAnonymous] = useState(false);
  const [name, setName] = usePrefilled(profile?.name);
  const [email, setEmail] = usePrefilled(user?.email);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [version, setVersion] = useState(0);


  const submit = async () => {
    setError(null);
    if (request.trim().length < 5) return setError('Please share a little about what we can pray for.');
    if (!anonymous && email.trim() && !isValidEmail(email)) return setError('Enter a valid email address, or leave it blank.');
    setBusy(true);
    try {
      await submitPrayerRequest({
        request: request.trim(),
        category,
        is_anonymous: anonymous,
        requester_name: anonymous ? null : name.trim() || null,
        requester_email: anonymous ? null : email.trim() || null,
        user_id: anonymous ? null : user?.id ?? null,
      });
      setRequest('');
      setSubmitted(true);
      setVersion((v) => v + 1);
    } catch (e) {
      setError(errorMessage(e));
    } finally {
      setBusy(false);
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <Stack.Screen options={{ title: 'Prayer request' }} />
      <Screen padded={false}>
        <PhotoHeader
          image={photo('kcm_0729')}
          eyebrow="Prayer ministry"
          title="We'll pray with you"
          subtitle="Share your request and our prayer team will lift it up. Every request is kept confidential."
        />
        <View style={{ paddingHorizontal: space.lg, gap: space.lg }}>
          <OfflineNotice />
          {submitted ? (
            <SuccessPanel
              title="Request received"
              body="Thank you for trusting us. Our prayer team will be praying for you.">
              <Button label="Submit another request" variant="secondary" onPress={() => setSubmitted(false)} />
            </SuccessPanel>
          ) : (
            <View style={{ gap: space.lg }}>
              <View style={{ gap: space.sm }}>
                <Txt variant="small" style={{ fontWeight: '600' }}>
                  Category
                </Txt>
                <Chips options={CATEGORIES} value={category} onChange={setCategory} />
              </View>
              <Field
                label="Prayer request"
                value={request}
                onChangeText={setRequest}
                multiline
                placeholder="Please share your prayer request…"
                maxLength={2000}
              />
              <Toggle label="Submit this request anonymously" value={anonymous} onChange={setAnonymous} />
              {!anonymous ? (
                <>
                  <Field
                    label="Name (optional)"
                    value={name}
                    onChangeText={setName}
                    autoComplete="name"
                    placeholder="Your name"
                  />
                  <Field
                    label="Email (optional)"
                    value={email}
                    onChangeText={setEmail}
                    autoCapitalize="none"
                    autoComplete="email"
                    keyboardType="email-address"
                    placeholder="you@example.com"
                  />
                </>
              ) : (
                <Notice>Your name, email and account won&apos;t be attached to this request.</Notice>
              )}
              {error ? <Notice tone="error">{error}</Notice> : null}
              <Button label="Submit prayer request" icon="send-outline" onPress={submit} loading={busy} />
            </View>
          )}

          <Card style={{ gap: space.sm }}>
            <IconTile icon="book-outline" />
            <Txt variant="h3">Prayer promise</Txt>
            <Txt color={colors.textMuted} style={{ fontStyle: 'italic' }}>
              &ldquo;Therefore I tell you, whatever you ask for in prayer, believe that you have received it, and it will be
              yours.&rdquo; — Mark 11:24
            </Txt>
          </Card>
          <Card style={{ gap: space.sm }}>
            <IconTile icon="shield-checkmark-outline" />
            <Txt variant="h3">Confidentiality</Txt>
            <Txt color={colors.textMuted}>
              All prayer requests are kept strictly confidential and shared only with The Haven prayer team.
            </Txt>
          </Card>

          {user ? <MyRequests userId={user.id} version={version} /> : null}
        </View>
      </Screen>
    </KeyboardAvoidingView>
  );
}
