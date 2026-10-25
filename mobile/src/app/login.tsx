import { router } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, StyleSheet, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

import { HavenMonogram, HavenWordmark, PcmEndorsement } from '@/components/brand';
import { Button, Field, Notice, Screen, Txt } from '@/components/ui';
import { sendPasswordReset, signInWithEmail, signInWithGoogle } from '@/lib/auth';
import { errorMessage, isValidEmail } from '@/lib/format';
import { isSupabaseConfigured } from '@/lib/supabase';
import { colors, radius, space } from '@/theme';

function GoogleG() {
  return (
    <Svg width={18} height={18} viewBox="0 0 48 48">
      <Path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9.1 3.6l6.8-6.8C35.8 2.4 30.3 0 24 0 14.6 0 6.6 5.4 2.7 13.3l7.9 6.1C12.5 13.7 17.8 9.5 24 9.5z" />
      <Path fill="#4285F4" d="M46.1 24.5c0-1.6-.1-3.1-.4-4.5H24v9h12.4c-.5 2.9-2.2 5.3-4.6 6.9l7.4 5.7c4.3-4 6.9-9.9 6.9-17.1z" />
      <Path fill="#FBBC05" d="M10.6 28.6c-.5-1.4-.8-3-.8-4.6s.3-3.2.8-4.6l-7.9-6.1C1 16.6 0 20.2 0 24s1 7.4 2.7 10.7l7.9-6.1z" />
      <Path fill="#34A853" d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-7.4-5.7c-2.1 1.4-4.8 2.3-8.5 2.3-6.2 0-11.5-4.2-13.4-9.9l-7.9 6.1C6.6 42.6 14.6 48 24 48z" />
    </Svg>
  );
}

/** Members use Google; email sign-in is for the credentials issued to leaders and committee heads */
type Mode = 'signin' | 'reset';

export default function LoginScreen() {
  const [mode, setMode] = useState<Mode>('signin');
  const [leaders, setLeaders] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState<'google' | 'email' | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  const done = () => (router.canGoBack() ? router.back() : router.replace('/'));

  const google = async () => {
    setError(null);
    setBusy('google');
    try {
      if (await signInWithGoogle()) done();
    } catch (e) {
      setError(errorMessage(e));
    } finally {
      setBusy(null);
    }
  };

  const submit = async () => {
    setError(null);
    setInfo(null);
    if (!isValidEmail(email)) return setError('Enter a valid email address.');
    if (mode !== 'reset' && password.length < 6) return setError('Password must be at least 6 characters.');
    setBusy('email');
    try {
      if (mode === 'signin') {
        await signInWithEmail(email, password);
        done();
      } else {
        await sendPasswordReset(email);
        setInfo('If that email has an account, a reset link is on its way.');
        setMode('signin');
      }
    } catch (e) {
      setError(errorMessage(e));
    } finally {
      setBusy(null);
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <Screen contentContainerStyle={{ gap: space.lg, paddingTop: space.xl }}>
        <View style={{ alignItems: 'center', gap: space.md }}>
          <View style={styles.mark}>
            <HavenMonogram size={40} />
          </View>
          <HavenWordmark size={34} />
          <PcmEndorsement height={36} />
          <Txt color={colors.textMuted} center>
            Sign in to RSVP, join bands and track your requests.
          </Txt>
        </View>

        {!isSupabaseConfigured ? (
          <Notice>Sign-in is off until Supabase keys are added to .env (see README).</Notice>
        ) : null}
        {error ? <Notice tone="error">{error}</Notice> : null}
        {info ? <Notice tone="success">{info}</Notice> : null}

        <Pressable
          onPress={google}
          disabled={busy !== null}
          accessibilityRole="button"
          style={({ pressed }) => [styles.google, pressed && { opacity: 0.85 }, busy && { opacity: 0.6 }]}>
          <GoogleG />
          <Txt style={{ fontWeight: '700', fontSize: 16 }}>{busy === 'google' ? 'Opening Google…' : 'Continue with Google'}</Txt>
        </Pressable>

        <Txt variant="small" color={colors.textMuted} center>
          New here? Continue with Google and your account is created for you.
        </Txt>

        <Pressable onPress={() => setLeaders((v) => !v)} accessibilityRole="button" style={styles.orRow}>
          <View style={styles.line} />
          <Txt variant="small" color={colors.navy} style={{ fontWeight: '700' }}>
            {leaders ? 'Hide leadership sign-in' : 'Leaders & committee heads'}
          </Txt>
          <View style={styles.line} />
        </Pressable>

        {leaders ? (
          <>
            <Field
              label="Email"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              autoComplete="email"
              keyboardType="email-address"
              placeholder="you@thehaven.test"
            />
            {mode !== 'reset' ? (
              <Field
                label="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                autoComplete="current-password"
                placeholder="Your issued password"
              />
            ) : null}
            <Button
              label={mode === 'signin' ? 'Sign in' : 'Send reset link'}
              onPress={submit}
              loading={busy === 'email'}
              disabled={busy === 'google'}
            />
            <View style={{ alignItems: 'center' }}>
              {mode === 'signin' ? (
                <Button label="Forgot password?" variant="ghost" small onPress={() => setMode('reset')} />
              ) : (
                <Button label="Back to sign in" variant="ghost" small onPress={() => setMode('signin')} />
              )}
            </View>
          </>
        ) : null}
      </Screen>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  mark: {
    width: 76,
    height: 76,
    borderRadius: 22,
    backgroundColor: colors.navy,
    alignItems: 'center',
    justifyContent: 'center',
  },
  google: {
    minHeight: 52,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.white,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: space.md,
  },
  orRow: { flexDirection: 'row', alignItems: 'center', gap: space.md },
  line: { flex: 1, height: StyleSheet.hairlineWidth, backgroundColor: colors.border },
});
