const DAY = new Intl.DateTimeFormat('en-ZM', { weekday: 'short', day: 'numeric', month: 'short' });
const TIME = new Intl.DateTimeFormat('en-ZM', { hour: 'numeric', minute: '2-digit' });
const LONG = new Intl.DateTimeFormat('en-ZM', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

export const formatDay = (iso: string) => DAY.format(new Date(iso));
export const formatTime = (iso: string) => TIME.format(new Date(iso));
export const formatLongDate = (iso: string) => LONG.format(new Date(iso));
export const formatDateTime = (iso: string) => `${formatDay(iso)} · ${formatTime(iso)}`;

/** "3 days ago", "just now" */
export function timeAgo(iso: string) {
  const s = Math.round((Date.now() - new Date(iso).getTime()) / 1000);
  if (s < 60) return 'just now';
  const units: [number, string][] = [[60, 'minute'], [3600, 'hour'], [86400, 'day'], [604800, 'week'], [2592000, 'month'], [31536000, 'year']];
  let label = 'minute';
  let value = 1;
  for (const [secs, name] of units) {
    if (s >= secs) {
      label = name;
      value = Math.floor(s / secs);
    }
  }
  return `${value} ${label}${value === 1 ? '' : 's'} ago`;
}

export const isValidEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());

export const errorMessage = (e: unknown) => (e instanceof Error ? e.message : 'Something went wrong. Please try again.');

/** Parse "2026-10-24 18:30" (local) → ISO, or null */
export function parseLocalDateTime(input: string): string | null {
  const m = input.trim().match(/^(\d{4})-(\d{2})-(\d{2})(?:[ T](\d{1,2}):(\d{2}))?$/);
  if (!m) return null;
  const d = new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]), Number(m[4] ?? 0), Number(m[5] ?? 0));
  return Number.isNaN(d.getTime()) ? null : d.toISOString();
}

/** ISO → "2026-10-24 18:30" in local time, for editable fields */
export function toLocalDateTimeInput(iso?: string | null) {
  if (!iso) return '';
  const d = new Date(iso);
  const p = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}`;
}
