import { router, Tabs } from 'expo-router';
import { useMemo, useState } from 'react';
import { Dimensions, Pressable, StyleSheet, View } from 'react-native';

import { ProductCard } from '@/components/shop/ProductCard';
import { Button, Chips, EmptyState, Field, Ionicons, Notice, PhotoHeader, Screen, Txt } from '@/components/ui';
import { MERCH_CATEGORIES, MERCH_HERO_IMAGE, MERCH_PRODUCTS, type MerchCategory } from '@/data/merch';
import { useCart } from '@/providers/CartProvider';
import { colors, space } from '@/theme';

const { width: SCREEN_W } = Dimensions.get('window');
const CARD_W = (SCREEN_W - space.lg * 2 - space.md) / 2;

type Filter = MerchCategory | 'all' | 'wishlist';

function CartButton() {
  const { itemCount } = useCart();
  return (
    <Pressable
      onPress={() => router.push('/cart')}
      hitSlop={10}
      accessibilityRole="button"
      accessibilityLabel={itemCount ? `Cart, ${itemCount} items` : 'Cart'}
      style={{ marginRight: space.lg }}>
      <Ionicons name="bag-handle-outline" size={24} color={colors.navy} />
      {itemCount > 0 ? (
        <View style={styles.count}>
          <Txt style={{ fontSize: 11, fontWeight: '800', color: colors.dark }}>{itemCount > 99 ? '99+' : itemCount}</Txt>
        </View>
      ) : null}
    </Pressable>
  );
}

export default function MerchScreen() {
  const { wishlist, itemCount } = useCart();
  const [category, setCategory] = useState<Filter>('all');
  const [query, setQuery] = useState('');

  const options = useMemo(
    () => [
      ...MERCH_CATEGORIES.map((c) => ({ value: c.id as Filter, label: c.label })),
      { value: 'wishlist' as Filter, label: `Wishlist${wishlist.length ? ` (${wishlist.length})` : ''}` },
    ],
    [wishlist.length]
  );

  const products = useMemo(() => {
    const q = query.trim().toLowerCase();
    return MERCH_PRODUCTS.filter((p) => {
      if (category === 'wishlist' && !wishlist.includes(p.slug)) return false;
      if (category !== 'all' && category !== 'wishlist' && p.category !== category) return false;
      if (q && !`${p.name} ${p.description}`.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [category, query, wishlist]);

  return (
    <Screen padded={false}>
      <Tabs.Screen options={{ headerRight: () => <CartButton /> }} />
      <PhotoHeader
        image={MERCH_HERO_IMAGE}
        eyebrow="The Haven store"
        title="Wear the light"
        subtitle="Ministry apparel and gifts. Order here, then pay and collect at The Haven merch table."
        height={260}
      />

      <View style={{ paddingHorizontal: space.lg, gap: space.lg }}>
        <Chips options={options} value={category} onChange={setCategory} />
        <Field
          label="Search"
          value={query}
          onChangeText={setQuery}
          placeholder="T-shirts, mugs, journals…"
          returnKeyType="search"
          autoCorrect={false}
          clearButtonMode="while-editing"
        />

        {itemCount > 0 ? (
          <Button
            label={`View cart (${itemCount})`}
            variant="secondary"
            icon="bag-handle-outline"
            href="/cart"
            small
          />
        ) : null}

        {products.length ? (
          <View style={styles.grid}>
            {products.map((p) => (
              <ProductCard key={p.id} product={p} width={CARD_W} />
            ))}
          </View>
        ) : (
          <EmptyState
            icon={category === 'wishlist' ? 'heart-outline' : 'search-outline'}
            title={category === 'wishlist' ? 'Your wishlist is empty' : 'No products found'}
            body={
              category === 'wishlist'
                ? 'Tap the heart on any product to save it here.'
                : 'Try another category or search term.'
            }
            action={
              <Button
                label="Show all products"
                variant="secondary"
                small
                onPress={() => {
                  setCategory('all');
                  setQuery('');
                }}
              />
            }
          />
        )}

        <Notice>Orders are paid on collection at The Haven merch table. A leader will confirm when yours is ready.</Notice>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: space.md },
  count: {
    position: 'absolute',
    top: -6,
    right: -10,
    minWidth: 18,
    height: 18,
    paddingHorizontal: 4,
    borderRadius: 9,
    backgroundColor: colors.gold,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
