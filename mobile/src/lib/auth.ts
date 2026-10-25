import * as Linking from 'expo-linking';
import * as WebBrowser from 'expo-web-browser';

import { isSupabaseConfigured, supabase } from '@/lib/supabase';

WebBrowser.maybeCompleteAuthSession();

/**
 * Deep link Supabase sends the user back to after Google sign-in.
 * Expo Go: exp://<host>/--/auth/callback · builds: thehaven://auth/callback
 * Both must be listed under Supabase → Authentication → URL Configuration → Redirect URLs.
 */
export const authRedirectUrl = Linking.createURL('auth/callback');

const exchanged = new Set<string>();

/** Exchange a PKCE ?code= from a redirect URL for a session (idempotent per code) */
export async function completeAuthFromUrl(url: string) {
  const { queryParams } = Linking.parse(url);
  const errorDescription = queryParams?.error_description ?? queryParams?.error;
  if (errorDescription) throw new Error(String(errorDescription));

  const code = queryParams?.code;
  if (typeof code !== 'string' || exchanged.has(code)) return;
  exchanged.add(code);

  const { error } = await supabase.auth.exchangeCodeForSession(code);
  if (error) throw new Error(error.message);
}

/** Opens Google sign-in in a secure browser sheet. Returns false if the user cancelled. */
export async function signInWithGoogle(): Promise<boolean> {
  if (!isSupabaseConfigured) {
    throw new Error('Sign-in needs Supabase. Add your project URL and key to .env, then restart Expo.');
  }

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: authRedirectUrl,
      skipBrowserRedirect: true,
      queryParams: { prompt: 'select_account' },
    },
  });
  if (error) throw new Error(error.message);

  const result = await WebBrowser.openAuthSessionAsync(data.url, authRedirectUrl);
  if (result.type !== 'success') return false;

  await completeAuthFromUrl(result.url);
  return true;
}

export async function signInWithEmail(email: string, password: string) {
  if (!isSupabaseConfigured) throw new Error('Sign-in needs Supabase configured in .env.');
  // Pasted logins often carry a stray space or line break; issued passwords never contain spaces
  const { error } = await supabase.auth.signInWithPassword({ email: email.trim().toLowerCase(), password: password.replace(/\s+/g, '') });
  if (error) throw new Error(error.message);
}

export async function sendPasswordReset(email: string) {
  if (!isSupabaseConfigured) throw new Error('Password reset needs Supabase configured in .env.');
  const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), { redirectTo: authRedirectUrl });
  if (error) throw new Error(error.message);
}

export async function signOut() {
  await supabase.auth.signOut();
}
