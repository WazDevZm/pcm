import { useState } from 'react';

/** Text field state that shows `fallback` (e.g. the signed-in member's name) until the user edits it */
export function usePrefilled(fallback: string | null | undefined) {
  const [value, setValue] = useState<string | null>(null);
  return [value ?? fallback ?? '', setValue as (v: string) => void] as const;
}
