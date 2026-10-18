import { Stack } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, View } from 'react-native';

import { Button, Card, Field, IconTile, Notice, OfflineNotice, Screen, SectionHeader, SuccessPanel, Txt } from '@/components/ui';
import { usePrefilled } from '@/hooks/usePrefilled';
import { submitContact } from '@/lib/api';
import { BRAND } from '@/lib/brand';
import { errorMessage, isValidEmail } from '@/lib/format';
import { useAuth } from '@/providers/AuthProvider';
import { colors, space } from '@/theme';

export default function ContactScreen() {
  const { user, profile } = useAuth();
  const [name, setName] = usePrefilled(profile?.name);
  const [email, setEmail] = usePrefilled(user?.email);
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);


  const submit = async () => {
    setError(null);
    if (!name.trim()) return setError('Enter your name.');
    if (!isValidEmail(email)) return setError('Enter a valid email address.');
    if (message.trim().length < 5) return setError('Write a short message.');
    setBusy(true);
    try {
      await submitContact({ name: name.trim(), email: email.trim(), subject: subject.trim(), message: message.trim() });
      setSubject('');
      setMessage('');
      setSent(true);
    } catch (e) {
      setError(errorMessage(e));
    } finally {
      setBusy(false);
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <Stack.Screen options={{ title: 'Contact us' }} />
      <Screen>
        <SectionHeader eyebrow="Get in touch" title="We'd love to hear from you" />
        <Card style={{ flexDirection: 'row', alignItems: 'center', gap: space.md }}>
          <IconTile icon="location-outline" />
          <View style={{ flex: 1 }}>
            <Txt style={{ fontWeight: '700' }}>{BRAND.name}</Txt>
            <Txt variant="small" color={colors.navy}>
              {BRAND.ministryShort}
            </Txt>
            <Txt variant="small" color={colors.textMuted}>
              {BRAND.location}
            </Txt>
          </View>
        </Card>
        <OfflineNotice />

        {sent ? (
          <SuccessPanel title="Message sent" body="Thanks for reaching out. A member of The Haven team will reply by email.">
            <Button label="Send another message" variant="secondary" onPress={() => setSent(false)} />
          </SuccessPanel>
        ) : (
          <View style={{ gap: space.lg }}>
            <Field label="Name" value={name} onChangeText={setName} autoComplete="name" placeholder="Your name" />
            <Field
              label="Email"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              autoComplete="email"
              keyboardType="email-address"
              placeholder="you@example.com"
            />
            <Field label="Subject (optional)" value={subject} onChangeText={setSubject} placeholder="What's this about?" />
            <Field
              label="Message"
              value={message}
              onChangeText={setMessage}
              multiline
              maxLength={4000}
              placeholder="How can we help?"
            />
            {error ? <Notice tone="error">{error}</Notice> : null}
            <Button label="Send message" icon="send-outline" onPress={submit} loading={busy} />
          </View>
        )}
      </Screen>
    </KeyboardAvoidingView>
  );
}
