import 'expo-sqlite/localStorage/install';
import { createClient } from '@supabase/supabase-js';
import { AppState, Platform } from 'react-native';

const url = process.env.EXPO_PUBLIC_SUPABASE_URL ?? '';
const key =
  process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? '';

/** False until .env is filled in — screens fall back to built-in content and show a notice */
export const isSupabaseConfigured = Boolean(url && key && !url.includes('your-project'));

export const supabase = createClient(
  isSupabaseConfigured ? url : 'https://placeholder.supabase.co',
  isSupabaseConfigured ? key : 'placeholder-key',
  {
    auth: {
      storage: localStorage,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
      flowType: 'pkce',
    },
  }
);

if (Platform.OS !== 'web') {
  AppState.addEventListener('change', (state) => {
    if (state === 'active') supabase.auth.startAutoRefresh();
    else supabase.auth.stopAutoRefresh();
  });
}

export const MEDIA_BUCKET = 'media';
