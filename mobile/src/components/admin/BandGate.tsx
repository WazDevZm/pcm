import type { ReactNode } from 'react';

import { AuthGate } from '@/components/AuthGate';
import { EmptyState, Loading, Notice, Screen } from '@/components/ui';
import { useAsync } from '@/hooks/useAsync';
import { getManagedBands } from '@/lib/api';
import type { Band, Profile } from '@/lib/types';
import { useAuth } from '@/providers/AuthProvider';

type Render = (band: Band, reload: () => void) => ReactNode;

function Gate({ profile, bandId, children }: { profile: Profile; bandId: string; children: Render }) {
  const { data, error, loading, refresh } = useAsync(() => getManagedBands(profile), [profile.id, profile.role]);

  if (loading && !data) return <Loading />;
  const band = data?.find((b) => b.id === bandId);
  if (!band) {
    return (
      <Screen>
        {error ? <Notice tone="error">{error}</Notice> : null}
        <EmptyState icon="shield-outline" title="No access" body="You can only manage bands you administer." />
      </Screen>
    );
  }
  return <>{children(band, refresh)}</>;
}

/** Renders children only for admins, the band's leader, or its assigned band admins */
export function BandGate({ bandId, children }: { bandId: string; children: Render }) {
  const { profile } = useAuth();
  return (
    <AuthGate reason="Sign in to manage your band.">
      {profile ? (
        <Gate profile={profile} bandId={bandId}>
          {children}
        </Gate>
      ) : (
        <Loading />
      )}
    </AuthGate>
  );
}
