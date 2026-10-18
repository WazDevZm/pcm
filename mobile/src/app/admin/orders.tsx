import { Stack } from 'expo-router';
import { useState } from 'react';
import { Linking, View } from 'react-native';

import { ActionRow, confirmAction, ContactLink, options, useBusy } from '@/components/admin/kit';
import { AuthGate } from '@/components/AuthGate';
import { Badge, Button, Card, Chips, EmptyState, Loading, Notice, Screen, Txt } from '@/components/ui';
import { formatZmw } from '@/data/merch';
import { useAsync } from '@/hooks/useAsync';
import { getOrders, setOrderStatus } from '@/lib/api';
import { formatDateTime } from '@/lib/format';
import type { OrderStatus } from '@/lib/types';
import { colors, space } from '@/theme';

const STATUSES = options<OrderStatus>(['pending', 'confirmed', 'ready', 'collected', 'cancelled']);
const NEXT: Partial<Record<OrderStatus, { status: OrderStatus; label: string }>> = {
  pending: { status: 'confirmed', label: 'Confirm' },
  confirmed: { status: 'ready', label: 'Mark ready' },
  ready: { status: 'collected', label: 'Mark collected' },
};

function Orders() {
  const [status, setStatus] = useState<OrderStatus>('pending');
  const { data, error, loading, refreshing, refresh } = useAsync(() => getOrders(status), [status]);
  const [busy, run] = useBusy();

  const move = async (id: string, next: OrderStatus) => {
    if (await run(id, () => setOrderStatus(id, next))) refresh();
  };

  return (
    <Screen refreshing={refreshing} onRefresh={refresh}>
      <Stack.Screen options={{ title: 'Merch orders' }} />
      <Chips options={STATUSES} value={status} onChange={setStatus} />
      {error ? <Notice tone="error">{error}</Notice> : null}
      {loading && !data ? (
        <Loading />
      ) : data && data.length === 0 ? (
        <EmptyState icon="bag-handle-outline" title={`No ${status} orders`} />
      ) : (
        data?.map((o) => {
          const next = NEXT[o.status];
          return (
            <Card key={o.id}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <Txt variant="label" color={colors.navy}>
                  {o.reference}
                </Txt>
                <Badge label={o.status} tone={o.status === 'cancelled' ? 'danger' : o.status === 'collected' ? 'success' : 'gold'} />
              </View>
              <Txt variant="small" color={colors.textMuted} style={{ marginTop: 4 }}>
                {formatDateTime(o.created_at)}
              </Txt>
              <Txt variant="h3" style={{ marginTop: space.sm }}>
                {o.customer_name}
              </Txt>
              <View style={{ gap: 6, marginTop: 6 }}>
                <ContactLink icon="call-outline" label={o.customer_phone} onPress={() => Linking.openURL(`tel:${o.customer_phone}`)} />
                <ContactLink icon="mail-outline" label={o.customer_email} onPress={() => Linking.openURL(`mailto:${o.customer_email}`)} />
              </View>
              <View style={{ gap: 4, marginTop: space.md }}>
                {o.items.map((item, i) => (
                  <View key={i} style={{ flexDirection: 'row', justifyContent: 'space-between', gap: space.sm }}>
                    <Txt variant="small" style={{ flex: 1 }}>
                      {item.quantity} × {item.name}
                      {[item.size, item.color].filter(Boolean).length ? ` (${[item.size, item.color].filter(Boolean).join(', ')})` : ''}
                    </Txt>
                    <Txt variant="small">{formatZmw(item.unit_price_zmw * item.quantity)}</Txt>
                  </View>
                ))}
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 4 }}>
                  <Txt style={{ fontWeight: '700' }}>Total</Txt>
                  <Txt style={{ fontWeight: '700' }}>{formatZmw(Number(o.total_zmw))}</Txt>
                </View>
              </View>
              {o.pickup_note ? <Notice>{o.pickup_note}</Notice> : null}
              {next || o.status !== 'cancelled' ? (
                <ActionRow>
                  {next ? (
                    <Button
                      label={next.label}
                      icon="arrow-forward"
                      small
                      loading={busy === o.id}
                      disabled={busy !== null}
                      onPress={() => move(o.id, next.status)}
                    />
                  ) : null}
                  {o.status !== 'cancelled' && o.status !== 'collected' ? (
                    <Button
                      label="Cancel order"
                      icon="close"
                      variant="danger"
                      small
                      disabled={busy !== null}
                      onPress={() =>
                        confirmAction('Cancel order?', `${o.reference} for ${o.customer_name} will be cancelled.`, 'Cancel order', () =>
                          move(o.id, 'cancelled')
                        )
                      }
                    />
                  ) : null}
                </ActionRow>
              ) : null}
            </Card>
          );
        })
      )}
    </Screen>
  );
}

export default function AdminOrders() {
  return (
    <AuthGate role="leader">
      <Orders />
    </AuthGate>
  );
}
