import { useFocusEffect } from 'expo-router';
import { useCallback, useLayoutEffect, useRef, useState } from 'react';

import { errorMessage } from '@/lib/format';

/**
 * Load data when the screen gains focus; exposes pull-to-refresh state.
 * `deps` (primitives — ids, filters) re-trigger the load.
 */
export function useAsync<T>(load: () => Promise<T>, deps: (string | number | boolean | null | undefined)[] = []) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const loadRef = useRef(load);
  useLayoutEffect(() => {
    loadRef.current = load;
  });

  const depsKey = JSON.stringify(deps);
  // Key of the newest request; results for an older filter are dropped
  const activeKey = useRef(depsKey);

  const run = useCallback(async (mode: 'initial' | 'refresh', key: string) => {
    if (mode === 'refresh') setRefreshing(true);
    try {
      const result = await loadRef.current();
      if (key !== activeKey.current) return;
      setData(result);
      setError(null);
    } catch (e) {
      if (key === activeKey.current) setError(errorMessage(e));
    } finally {
      if (key === activeKey.current) {
        setLoading(false);
        setRefreshing(false);
      }
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      activeKey.current = depsKey;
      run('initial', depsKey);
    }, [run, depsKey])
  );

  return { data, error, loading, refreshing, refresh: () => run('refresh', activeKey.current), setData };
}
