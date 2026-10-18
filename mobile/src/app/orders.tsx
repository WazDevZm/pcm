import { Stack } from 'expo-router';
import { View } from 'react-native';

import { AuthGate } from '@/components/AuthGate';
import { StatusBadge } from '@/components/forms/StatusBadge';
import { Button, Card, EmptyState, Loading, Notice, OfflineNotice, Screen, Txt } from '@/components/ui';
import { formatZmw } from '@/data/merch';
import { useAsync } from '@/hooks/useAsync';
import { getMyOrders } from '@/lib/api';
import { formatDateTime } from '@/lib/format';
import { useAuth } from '@/providers/AuthProvider';
import { colors, space } from '@/theme';

function OrderList({ userId }: { userId: string }) {
  const orders = useAsync(() => getMyOrders(userId), [userId]);

  return (
    <Screen refreshing={orders.refreshing} onRefresh={orders.refresh}>
      <OfflineNotice />
      {orders.error ? <Notice tone="error">{orders.error}</Notice> : null}
      {orders.loading ? (
        <Loading />
      ) : !(orders.data ?? []).length ? (
        <EmptyState
          icon="receipt-outline"
          title="No orders yet"
          body="Orders you place in the Haven store show up here."
          action={<Button label="Browse the store" href="/merch" />}
        />
      ) : (
        (orders.data ?? []).map((o) => {
          const count = o.items.reduce((n, i) => n + i.quantity, 0);
          return (
            <Card key={o.id} style={{ gap: space.sm }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: space.sm }}>
                <Txt variant="h3" style={{ flex: 1 }} selectable>
                  {o.reference}
                </Txt>
                <StatusBadge status={o.status} />
              </View>
              <Txt variant="small" color={colors.textMuted}>
                {formatDateTime(o.created_at)}
              </Txt>
              <View style={{ gap: 2 }}>
                {o.items.map((i, idx) => (
                  <Txt key={`${i.product_slug}-${idx}`} variant="small">
                    {i.quantity} × {i.name}
                    {[i.size, i.color].filter(Boolean).length ? ` (${[i.size, i.color].filter(Boolean).join(', ')})` : ''}
                  </Txt>
                ))}
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 4 }}>
                <Txt color={colors.textMuted}>
                  {count} item{count === 1 ? '' : 's'}
                </Txt>
                <Txt style={{ fontWeight: '800' }}>{formatZmw(o.total_zmw)}</Txt>
              </View>
            </Card>
          );
        })
      )}
      {(orders.data ?? []).length ? (
        <Notice>Pay on collection at The Haven merch table. A leader will update the status as your order is prepared.</Notice>
      ) : null}
    </Screen>
  );
}

export default function OrdersScreen() {
  const { user } = useAuth();
  return (
    <>
      <Stack.Screen options={{ title: 'My orders' }} />
      <AuthGate reason="Sign in to see your merch orders.">{user ? <OrderList userId={user.id} /> : null}</AuthGate>
    </>
  );
}
