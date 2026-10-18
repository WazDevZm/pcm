import { Image } from 'expo-image';
import { Stack, router } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, StyleSheet, View } from 'react-native';

import { QuantityStepper } from '@/components/shop/QuantityStepper';
import { Button, Card, EmptyState, Field, Ionicons, Notice, OfflineNotice, Screen, SectionHeader, SuccessPanel, Txt } from '@/components/ui';
import { formatZmw, getProductBySlug } from '@/data/merch';
import { usePrefilled } from '@/hooks/usePrefilled';
import { placeOrder } from '@/lib/api';
import { errorMessage, isValidEmail } from '@/lib/format';
import type { OrderItem } from '@/lib/types';
import { useAuth } from '@/providers/AuthProvider';
import { useCart } from '@/providers/CartProvider';
import { colors, radius, space } from '@/theme';

export default function CartScreen() {
  const { user, profile } = useAuth();
  const { lines, itemCount, subtotalZmw, setQuantity, remove, clear } = useCart();

  const [name, setName] = usePrefilled(profile?.name);
  const [email, setEmail] = usePrefilled(user?.email);
  const [phone, setPhone] = usePrefilled(profile?.phone);
  const [note, setNote] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reference, setReference] = useState<string | null>(null);


  const submit = async () => {
    setError(null);
    if (!user) return router.push('/login');
    if (!lines.length) return setError('Your cart is empty.');
    if (!name.trim()) return setError('Enter your name.');
    if (!isValidEmail(email)) return setError('Enter a valid email address.');
    if (phone.replace(/\D/g, '').length < 9) return setError('Enter a phone number we can reach you on.');

    const items: OrderItem[] = lines.flatMap((l) => {
      const p = getProductBySlug(l.productSlug);
      if (!p) return [];
      return [
        {
          product_slug: p.slug,
          name: p.name,
          size: l.size ?? null,
          color: l.color?.name ?? null,
          quantity: l.quantity,
          unit_price_zmw: p.priceZmw,
        },
      ];
    });

    setBusy(true);
    try {
      const order = await placeOrder({
        user_id: user.id,
        customer_name: name.trim(),
        customer_email: email.trim(),
        customer_phone: phone.trim(),
        pickup_note: note.trim() || null,
        items,
        total_zmw: subtotalZmw,
      });
      clear();
      setReference(order.reference);
    } catch (e) {
      setError(errorMessage(e));
    } finally {
      setBusy(false);
    }
  };

  if (reference) {
    return (
      <Screen>
        <Stack.Screen options={{ title: 'Order placed' }} />
        <SuccessPanel
          title="Order received"
          body="Pay on collection at The Haven merch table — a leader will confirm your order.">
          <Card style={{ alignSelf: 'stretch', alignItems: 'center', gap: 4 }}>
            <Txt variant="label" color={colors.navy}>
              Order reference
            </Txt>
            <Txt variant="h2" selectable>
              {reference}
            </Txt>
          </Card>
          <Button label="View my orders" icon="receipt-outline" onPress={() => router.replace('/orders')} style={{ alignSelf: 'stretch' }} />
          <Button
            label="Keep shopping"
            variant="ghost"
            onPress={() => (router.canGoBack() ? router.back() : router.replace('/merch'))}
          />
        </SuccessPanel>
      </Screen>
    );
  }

  if (!lines.length) {
    return (
      <Screen>
        <Stack.Screen options={{ title: 'Your cart' }} />
        <EmptyState
          icon="bag-outline"
          title="Your cart is empty"
          body="Browse Haven apparel, drinkware and gifts."
          action={
            <Button
              label="Go to the store"
              onPress={() => (router.canGoBack() ? router.back() : router.replace('/merch'))}
            />
          }
        />
      </Screen>
    );
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <Screen>
        <Stack.Screen options={{ title: 'Your cart' }} />

        <View style={{ gap: space.md }}>
          {lines.map((l) => {
            const p = getProductBySlug(l.productSlug);
            if (!p) return null;
            const variant = [l.size, l.color?.name].filter(Boolean).join(' · ');
            return (
              <Card key={l.lineId} style={{ flexDirection: 'row', gap: space.md }}>
                <Pressable onPress={() => router.push(`/merch/${p.slug}`)} accessibilityLabel={p.name}>
                  <Image source={p.image} style={styles.thumb} contentFit="cover" />
                </Pressable>
                <View style={{ flex: 1, gap: 4 }}>
                  <View style={{ flexDirection: 'row', gap: space.sm }}>
                    <Txt style={{ flex: 1, fontWeight: '700' }} numberOfLines={2}>
                      {p.name}
                    </Txt>
                    <Pressable
                      onPress={() => remove(l.lineId)}
                      hitSlop={8}
                      accessibilityRole="button"
                      accessibilityLabel={`Remove ${p.name}`}>
                      <Ionicons name="trash-outline" size={18} color={colors.textMuted} />
                    </Pressable>
                  </View>
                  {variant ? (
                    <Txt variant="small" color={colors.textMuted}>
                      {variant}
                    </Txt>
                  ) : null}
                  <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 4 }}>
                    <QuantityStepper small value={l.quantity} onChange={(q) => setQuantity(l.lineId, q)} />
                    <Txt style={{ fontWeight: '800' }}>{formatZmw(p.priceZmw * l.quantity)}</Txt>
                  </View>
                </View>
              </Card>
            );
          })}
        </View>

        <Card style={{ gap: space.sm }}>
          <View style={styles.totalRow}>
            <Txt color={colors.textMuted}>
              Subtotal ({itemCount} item{itemCount === 1 ? '' : 's'})
            </Txt>
            <Txt variant="h3">{formatZmw(subtotalZmw)}</Txt>
          </View>
          <Txt variant="small" color={colors.textMuted}>
            Collect and pay at The Haven merch table. No delivery fees.
          </Txt>
        </Card>

        <SectionHeader eyebrow="Checkout" title="Your details" />
        <OfflineNotice />

        {!user ? (
          <Card style={{ gap: space.md }}>
            <Txt color={colors.textMuted}>Sign in to place your order so a leader can confirm it and you can track it.</Txt>
            <Button label="Sign in to check out" icon="log-in-outline" href="/login" />
          </Card>
        ) : (
          <View style={{ gap: space.lg }}>
            <Field label="Full name" value={name} onChangeText={setName} autoComplete="name" placeholder="Your name" />
            <Field
              label="Email"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              autoComplete="email"
              keyboardType="email-address"
              placeholder="you@example.com"
            />
            <Field
              label="Phone"
              value={phone}
              onChangeText={setPhone}
              autoComplete="tel"
              keyboardType="phone-pad"
              placeholder="e.g. 097 000 0000"
              hint="Required — we'll contact you when your order is ready."
            />
            <Field
              label="Pickup note (optional)"
              value={note}
              onChangeText={setNote}
              multiline
              placeholder="Anything we should know about collecting your order?"
            />
            {error ? <Notice tone="error">{error}</Notice> : null}
            <Button label={`Place order · ${formatZmw(subtotalZmw)}`} icon="checkmark-circle-outline" onPress={submit} loading={busy} />
            <Txt variant="small" color={colors.textMuted} center>
              No payment is taken in the app. Pay on collection at The Haven merch table.
            </Txt>
          </View>
        )}
      </Screen>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  thumb: { width: 76, height: 76, borderRadius: radius.md, backgroundColor: colors.navySoft },
  totalRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
});
