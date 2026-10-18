import * as Linking from 'expo-linking';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { View } from 'react-native';

import { Button, EmptyState, Loading } from '@/components/ui';
import { completeAuthFromUrl } from '@/lib/auth';
import { errorMessage } from '@/lib/format';
import { colors } from '@/theme';

/** Deep-link landing for OAuth / email confirmation redirects (thehaven://auth/callback?code=…) */
export default function AuthCallback() {
  const url = Linking.useLinkingURL();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!url) return;
    completeAuthFromUrl(url)
      .then(() => (router.canDismiss() ? router.dismissAll() : router.replace('/')))
      .catch((e) => setError(errorMessage(e)));
  }, [url]);

  return (
    <View style={{ flex: 1, justifyContent: 'center', backgroundColor: colors.light }}>
      {error ? (
        <EmptyState
          icon="alert-circle-outline"
          title="Sign-in didn't finish"
          body={error}
          action={<Button label="Try again" href="/login" />}
        />
      ) : (
        <Loading label="Signing you in…" />
      )}
    </View>
  );
}
