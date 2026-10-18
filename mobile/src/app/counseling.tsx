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
  Txt,
  type IconName,
} from '@/components/ui';
import { photo } from '@/data/images';
import { useAsync } from '@/hooks/useAsync';
import { usePrefilled } from '@/hooks/usePrefilled';
import { getMyCounselingRequests, submitCounselingRequest } from '@/lib/api';
import { errorMessage, formatDateTime, isValidEmail, timeAgo } from '@/lib/format';
import type { CounselingService } from '@/lib/types';
import { useAuth } from '@/providers/AuthProvider';
import { colors, space } from '@/theme';

const CRISIS_NOTE = 'If you are in immediate danger, contact campus security or emergency services right away.';

const SERVICES: { value: CounselingService; icon: IconName; title: string; body: string; length: string; approach: string }[] = [
  {
    value: 'personal',
    icon: 'person-outline',
    title: 'Personal counseling',
    body: 'One-on-one sessions for personal struggles, anxiety, low mood and life transitions.',
    length: 'About 50 minutes',
    approach: 'Biblical counseling with professional care',
  },
  {
    value: 'relationship',
    icon: 'heart-outline',
    title: 'Relationship counseling',
    body: 'Guidance for dating relationships, friendships and family conflicts from a Christian perspective.',
    length: 'About 60 minutes',
    approach: 'Scripture-based relationship principles',
  },
  {
    value: 'academic',
    icon: 'school-outline',
    title: 'Academic stress support',
    body: 'Help managing academic pressure, study habits, and balancing faith with your studies.',
    length: 'About 45 minutes',
    approach: 'Practical strategies with a spiritual foundation',
  },
  {
    value: 'crisis',
    icon: 'alert-circle-outline',
    title: 'Crisis support',
    body: 'Prompt pastoral support and follow-up for students going through a crisis.',
    length: 'As needed',
    approach: 'Immediate care with follow-up support',
  },
];

const SERVICE_LABEL = Object.fromEntries(SERVICES.map((s) => [s.value, s.title])) as Record<CounselingService, string>;

const GROUPS = [
  { name: 'Anxiety & depression support', body: 'Peer support for students dealing with anxiety and depression.' },
  { name: 'Grief & loss support', body: 'Support for students processing the loss of loved ones or major life changes.' },
  { name: 'Addiction recovery', body: 'Christ-centred recovery support for addictions and dependencies.' },
  { name: 'Academic stress management', body: 'Strategies for handling academic pressure and caring for your mental health.' },
];

function MyRequests({ userId, version }: { userId: string; version: number }) {
  const mine = useAsync(() => getMyCounselingRequests(userId), [userId, version]);
  if (!mine.loading && !mine.error && !(mine.data ?? []).length) return null;
  return (
    <View style={{ gap: space.md }}>
      <SectionHeader eyebrow="Your history" title="Your requests" />
      {mine.error ? <Notice tone="error">{mine.error}</Notice> : null}
      {mine.loading ? (
        <Loading />
      ) : (
        (mine.data ?? []).map((r) => (
          <Card key={r.id} style={{ gap: space.sm }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: space.sm }}>
              <Txt style={{ flex: 1, fontWeight: '700' }}>{SERVICE_LABEL[r.service_type] ?? r.service_type}</Txt>
              <StatusBadge status={r.status} />
            </View>
            <Txt variant="small" color={colors.textMuted}>
              Requested {timeAgo(r.created_at)}
              {r.appointment_date ? ` · Appointment ${formatDateTime(r.appointment_date)}` : ''}
            </Txt>
            <Txt numberOfLines={3}>{r.message}</Txt>
          </Card>
        ))
      )}
    </View>
  );
}

export default function CounselingScreen() {
  const { user, profile } = useAuth();
  const [name, setName] = usePrefilled(profile?.name);
  const [email, setEmail] = usePrefilled(user?.email);
  const [phone, setPhone] = usePrefilled(profile?.phone);
  const [service, setService] = useState<CounselingService>('personal');
  const [counselor, setCounselor] = useState('');
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [version, setVersion] = useState(0);


  const submit = async () => {
    setError(null);
    if (!name.trim()) return setError('Enter your name.');
    if (!isValidEmail(email)) return setError('Enter a valid email address so we can reach you.');
    if (message.trim().length < 10) return setError('Tell us a little about what you would like support with.');
    setBusy(true);
    try {
      await submitCounselingRequest({
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim() || null,
        service_type: service,
        preferred_counselor: counselor.trim() || null,
        message: message.trim(),
        user_id: user?.id ?? null,
      });
      setMessage('');
      setCounselor('');
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
      <Stack.Screen options={{ title: 'Counseling' }} />
      <Screen padded={false}>
        <PhotoHeader
          image={photo('kcm_0681')}
          eyebrow="Pastoral care"
          title="You don't have to carry it alone"
          subtitle="Confidential counseling and spiritual guidance for students seeking support, healing and growth."
          height={280}
        />
        <View style={{ paddingHorizontal: space.lg, gap: space.lg }}>
          <Notice tone="error">{CRISIS_NOTE}</Notice>

          <SectionHeader eyebrow="Our services" title="How we can help" />
          {SERVICES.map((s) => (
            <Card key={s.value} style={{ gap: space.sm }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: space.md }}>
                <IconTile icon={s.icon} />
                <Txt variant="h3" style={{ flex: 1 }}>
                  {s.title}
                </Txt>
              </View>
              <Txt color={colors.textMuted}>{s.body}</Txt>
              <Txt variant="small">
                <Txt variant="small" style={{ fontWeight: '700' }}>
                  Session:{' '}
                </Txt>
                {s.length}
              </Txt>
              <Txt variant="small">
                <Txt variant="small" style={{ fontWeight: '700' }}>
                  Approach:{' '}
                </Txt>
                {s.approach}
              </Txt>
            </Card>
          ))}

          <SectionHeader eyebrow="Community" title="Support groups" />
          <Txt color={colors.textMuted}>
            Connect with others facing similar challenges in a supportive, faith-based setting. Mention a group in your
            request below and we&apos;ll share meeting details.
          </Txt>
          {GROUPS.map((g) => (
            <Card key={g.name} style={{ gap: 4 }}>
              <Txt variant="h3">{g.name}</Txt>
              <Txt color={colors.textMuted}>{g.body}</Txt>
            </Card>
          ))}

          <Card dark style={{ gap: space.sm }}>
            <IconTile icon="shield-checkmark-outline" dark />
            <Txt variant="h3" color={colors.white}>
              Confidential, faith-integrated care
            </Txt>
            <Txt color="rgba(255,255,255,0.8)">
              All sessions are confidential. We integrate biblical principles with sound, caring practice for mind, body
              and spirit.
            </Txt>
          </Card>

          <SectionHeader eyebrow="Get help today" title="Request a session" />
          <OfflineNotice />
          {submitted ? (
            <SuccessPanel
              title="Request sent"
              body="Thank you for reaching out. A member of our pastoral team will contact you privately to arrange a time.">
              <Txt variant="small" color={colors.textMuted} center>
                {CRISIS_NOTE}
              </Txt>
              <Button label="Send another request" variant="secondary" onPress={() => setSubmitted(false)} />
            </SuccessPanel>
          ) : (
            <View style={{ gap: space.lg }}>
              <Field label="Full name" value={name} onChangeText={setName} autoComplete="name" placeholder="Your name" />
              <Field
                label="Email"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                autoComplete="email"
                keyboardType="email-address"
                placeholder="you@example.com"
              />
              <Field
                label="Phone (optional)"
                value={phone}
                onChangeText={setPhone}
                autoComplete="tel"
                keyboardType="phone-pad"
                placeholder="Your phone number"
              />
              <View style={{ gap: space.sm }}>
                <Txt variant="small" style={{ fontWeight: '600' }}>
                  Type of support
                </Txt>
                <Chips
                  options={SERVICES.map((s) => ({
                    value: s.value,
                    label: s.value[0].toUpperCase() + s.value.slice(1),
                  }))}
                  value={service}
                  onChange={setService}
                />
              </View>
              <Field
                label="Preferred counselor (optional)"
                value={counselor}
                onChangeText={setCounselor}
                placeholder="Name, or e.g. “a female pastor”"
              />
              <Field
                label="How can we help?"
                value={message}
                onChangeText={setMessage}
                multiline
                maxLength={2000}
                placeholder="Share as much or as little as you're comfortable with, plus times that suit you."
              />
              {error ? <Notice tone="error">{error}</Notice> : null}
              <Button label="Send request" icon="send-outline" onPress={submit} loading={busy} />
              <Txt variant="small" color={colors.textMuted} center>
                Your request is only visible to The Haven pastoral team.
              </Txt>
            </View>
          )}

          {user ? <MyRequests userId={user.id} version={version} /> : null}
        </View>
      </Screen>
    </KeyboardAvoidingView>
  );
}
