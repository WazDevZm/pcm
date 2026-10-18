import type { ReactNode } from 'react';

import { Button, EmptyState, Loading, Screen } from '@/components/ui';
import { useAuth } from '@/providers/AuthProvider';

/** Renders children only for signed-in users (optionally leaders/admins); otherwise a sign-in prompt */
export function AuthGate({
  children,
  role,
  reason = 'Sign in to continue.',
}: {
  children: ReactNode;
  role?: 'leader' | 'admin';
  reason?: string;
}) {
  const { user, profile, loading, isLeader, isAdmin } = useAuth();

  if (loading) return <Loading />;

  if (!user) {
    return (
      <Screen>
        <EmptyState
          icon="lock-closed-outline"
          title="Sign in required"
          body={reason}
          action={<Button label="Sign in" icon="log-in-outline" href="/login" />}
        />
      </Screen>
    );
  }

  if (role && (!profile || (role === 'admin' ? !isAdmin : !isLeader))) {
    return (
      <Screen>
        <EmptyState
          icon="shield-outline"
          title={role === 'admin' ? 'Admins only' : 'Leaders only'}
          body="Your account doesn't have access to this area. Ask a Haven admin to update your role."
        />
      </Screen>
    );
  }

  return <>{children}</>;
}
