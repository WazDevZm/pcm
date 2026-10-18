import { useEffect, useState } from 'react';

import { listUsers } from '@/lib/api';
import { errorMessage } from '@/lib/format';
import type { Profile } from '@/lib/types';

/** Debounced member search over listUsers; `reload` re-runs the current query */
export function useUserSearch(enabled = true) {
  const [search, setSearch] = useState('');
  const [users, setUsers] = useState<Profile[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [nonce, setNonce] = useState(0);

  useEffect(() => {
    if (!enabled) return;
    let cancelled = false;
    const t = setTimeout(async () => {
      setLoading(true);
      try {
        const rows = await listUsers(search);
        if (!cancelled) {
          setUsers(rows);
          setError(null);
        }
      } catch (e) {
        if (!cancelled) setError(errorMessage(e));
      } finally {
        if (!cancelled) setLoading(false);
      }
    }, search ? 300 : 0);
    return () => {
      cancelled = true;
      clearTimeout(t);
    };
  }, [search, enabled, nonce]);

  return { search, setSearch, users, error, loading, reload: () => setNonce((n) => n + 1) };
}
