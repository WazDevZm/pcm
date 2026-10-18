import { Badge } from '@/components/ui';

type Tone = 'navy' | 'gold' | 'success' | 'danger' | 'muted';

const TONES: Record<string, Tone> = {
  pending: 'gold',
  confirmed: 'navy',
  scheduled: 'navy',
  active: 'navy',
  ready: 'success',
  collected: 'success',
  completed: 'success',
  answered: 'success',
  cancelled: 'danger',
  archived: 'muted',
  inactive: 'muted',
};

/** Status pill for orders, prayer, counseling and volunteer records */
export function StatusBadge({ status, label }: { status: string; label?: string }) {
  return <Badge label={label ?? status.replace(/_/g, ' ')} tone={TONES[status] ?? 'muted'} />;
}
