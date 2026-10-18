import type { Session, User } from '@supabase/supabase-js';
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

import { getProfile } from '@/lib/api';
import { signOut as authSignOut } from '@/lib/auth';
import { isSupabaseConfigured, supabase } from '@/lib/supabase';
import type { Profile } from '@/lib/types';

type AuthState = {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  /** True until the stored session has been restored */
  loading: boolean;
  isLeader: boolean;
  isAdmin: boolean;
  refreshProfile: () => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(isSupabaseConfigured);

  const loadProfile = useCallback(async (userId: string | undefined) => {
    if (!userId) {
      setProfile(null);
      return;
    }
    try {
      // The profile row is created by a database trigger; retry briefly right after first sign-up
      for (let attempt = 0; attempt < 3; attempt++) {
        const p = await getProfile(userId);
        if (p) {
          setProfile(p);
          return;
        }
        await new Promise((r) => setTimeout(r, 600));
      }
      setProfile(null);
    } catch {
      setProfile(null);
    }
  }, []);

  useEffect(() => {
    if (!isSupabaseConfigured) return;

    supabase.auth.getSession().then(async ({ data }) => {
      setSession(data.session);
      await loadProfile(data.session?.user.id);
      setLoading(false);
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_event, next) => {
      setSession(next);
      // Defer Supabase calls out of the auth callback to avoid a client deadlock
      setTimeout(() => loadProfile(next?.user.id), 0);
    });
    return () => sub.subscription.unsubscribe();
  }, [loadProfile]);

  const value = useMemo<AuthState>(
    () => ({
      session,
      user: session?.user ?? null,
      profile,
      loading,
      isLeader: profile?.role === 'leader' || profile?.role === 'admin',
      isAdmin: profile?.role === 'admin',
      refreshProfile: () => loadProfile(session?.user.id),
      signOut: async () => {
        await authSignOut();
        setProfile(null);
      },
    }),
    [session, profile, loading, loadProfile]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
