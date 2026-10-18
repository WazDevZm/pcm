import { Image } from 'expo-image';
import { Stack, router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Dimensions, Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { ProductCard } from '@/components/shop/ProductCard';
import { QuantityStepper } from '@/components/shop/QuantityStepper';
import { Badge, Button, Chips, EmptyState, Ionicons, Notice, Screen, SectionHeader, Txt } from '@/components/ui';
import { formatZmw, getProductBySlug, getRelatedProducts, type MerchColor, type MerchSize } from '@/data/merch';
import { useCart } from '@/providers/CartProvider';
import { colors, radius, space } from '@/theme';

const { width: SCREEN_W } = Dimensions.get('window');
const CARD_W = (SCREEN_W - space.lg * 2 - space.md) / 2;

export default function ProductScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const product = getProductBySlug(String(slug));
  const { add, wishlist, toggleWishlist, itemCount } = useCart();

  const [slide, setSlide] = useState(0);
  const [size, setSize] = useState<MerchSize | undefined>(product?.sizes?.length === 1 ? product.sizes[0] : undefined);
  const [color, setColor] = useState<MerchColor | undefined>(
    product?.colors?.length === 1 ? product.colors[0] : undefined
  );
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [added, setAdded] = useState(false);

  if (!product) {
    return (
      <Screen>
        <Stack.Screen options={{ title: 'Not found' }} />
        <EmptyState
          icon="bag-outline"
          title="Product not found"
          body="This item may no longer be available."
          action={<Button label="Back to store" variant="secondary" onPress={() => router.replace('/merch')} />}
        />
      </Screen>
    );
  }

  const images = product.images?.length ? product.images : [product.image];
  const wished = wishlist.includes(product.slug);
  const related = getRelatedProducts(product);

  const addToCart = () => {
    setError(null);
    if (product.sizes?.length && !size) return setError('Choose a size first.');
    if (product.colors?.length && !color) return setError('Choose a colour first.');
    add({ productSlug: product.slug, quantity, size, color });
    setAdded(true);
  };

  return (
    <Screen padded={false}>
      <Stack.Screen
        options={{
          title: product.name,
          headerRight: () => (
            <Pressable
              onPress={() => toggleWishlist(product.slug)}
              hitSlop={10}
              accessibilityRole="button"
              accessibilityLabel={wished ? 'Remove from wishlist' : 'Add to wishlist'}>
              <Ionicons name={wished ? 'heart' : 'heart-outline'} size={24} color={wished ? colors.danger : colors.navy} />
            </Pressable>
          ),
        }}
      />

      {/* Image carousel */}
      <View>
        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={(e) => setSlide(Math.round(e.nativeEvent.contentOffset.x / SCREEN_W))}>
          {images.map((src, i) => (
            <Image
              key={i}
              source={src}
              style={{ width: SCREEN_W, height: SCREEN_W, backgroundColor: colors.navySoft }}
              contentFit="cover"
              transition={200}
              accessibilityLabel={`${product.name} photo ${i + 1} of ${images.length}`}
            />
          ))}
        </ScrollView>
        {images.length > 1 ? (
          <View style={styles.dots}>
            {images.map((_, i) => (
              <View key={i} style={[styles.dot, i === slide && styles.dotActive]} />
            ))}
          </View>
        ) : null}
      </View>

      <View style={{ paddingHorizontal: space.lg, gap: space.lg }}>
        <View style={{ gap: space.sm }}>
          <View style={{ flexDirection: 'row', gap: space.sm }}>
            {product.badge && product.inStock ? <Badge label={product.badge} tone="gold" /> : null}
            {!product.inStock ? <Badge label="Sold out" tone="muted" /> : null}
          </View>
          <Txt variant="h1">{product.name}</Txt>
          <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: space.sm }}>
            <Txt variant="h2" color={colors.navy}>
              {formatZmw(product.priceZmw)}
            </Txt>
            {product.compareAtPriceZmw ? (
              <Txt color={colors.textFaint} style={{ textDecorationLine: 'line-through' }}>
                {formatZmw(product.compareAtPriceZmw)}
              </Txt>
            ) : null}
          </View>
          <Txt color={colors.textMuted}>{product.longDescription ?? product.description}</Txt>
        </View>

        {product.sizes?.length ? (
          <View style={{ gap: space.sm }}>
            <Txt variant="small" style={{ fontWeight: '600' }}>
              Size{size ? `: ${size}` : ''}
            </Txt>
            <Chips
              options={product.sizes.map((s) => ({ value: s, label: s }))}
              value={size ?? ('' as MerchSize)}
              onChange={(v) => {
                setSize(v);
                setError(null);
              }}
              scroll={false}
            />
          </View>
        ) : null}

        {product.colors?.length ? (
          <View style={{ gap: space.sm }}>
            <Txt variant="small" style={{ fontWeight: '600' }}>
              Colour{color ? `: ${color.name}` : ''}
            </Txt>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: space.md }}>
              {product.colors.map((c) => {
                const active = color?.id === c.id;
                return (
                  <Pressable
                    key={c.id}
                    onPress={() => {
                      setColor(c);
                      setError(null);
                    }}
                    accessibilityRole="button"
                    accessibilityLabel={c.name}
                    accessibilityState={{ selected: active }}
                    style={[styles.swatchRing, active && { borderColor: colors.navy }]}>
                    <View style={[styles.swatch, { backgroundColor: c.hex }]} />
                  </Pressable>
                );
              })}
            </View>
          </View>
        ) : null}

        {product.inStock ? (
          <>
            <View style={{ gap: space.sm }}>
              <Txt variant="small" style={{ fontWeight: '600' }}>
                Quantity
              </Txt>
              <QuantityStepper value={quantity} onChange={setQuantity} />
            </View>
            {error ? <Notice tone="error">{error}</Notice> : null}
            {added ? (
              <Notice tone="success">
                Added to your cart{itemCount ? ` — ${itemCount} item${itemCount === 1 ? '' : 's'} in total` : ''}.
              </Notice>
            ) : null}
            <Button label="Add to cart" icon="bag-add-outline" onPress={addToCart} />
            {added ? <Button label="View cart" variant="secondary" icon="bag-handle-outline" href="/cart" /> : null}
          </>
        ) : (
          <Notice>This item is sold out for now. Check back soon or ask at The Haven merch table.</Notice>
        )}

        <Notice>Pay on collection at The Haven merch table — no payment is taken in the app.</Notice>

        {related.length ? (
          <View style={{ gap: space.md, marginTop: space.md }}>
            <SectionHeader eyebrow="More like this" title="Related products" />
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: space.md }}>
              {related.map((p) => (
                <ProductCard key={p.id} product={p} width={CARD_W} />
              ))}
            </View>
          </View>
        ) : null}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  dots: {
    position: 'absolute',
    bottom: space.md,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
  },
  dot: { width: 7, height: 7, borderRadius: 4, backgroundColor: 'rgba(255,255,255,0.55)' },
  dotActive: { width: 18, backgroundColor: colors.white },
  swatchRing: {
    width: 40,
    height: 40,
    borderRadius: radius.pill,
    borderWidth: 2,
    borderColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  swatch: {
    width: 30,
    height: 30,
    borderRadius: radius.pill,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.textFaint,
  },
});
