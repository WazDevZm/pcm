import { Image } from 'expo-image';
import { router } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';

import { Ionicons, Txt } from '@/components/ui';
import { formatZmw, type MerchProduct } from '@/data/merch';
import { useCart } from '@/providers/CartProvider';
import { colors, radius, shadow, space } from '@/theme';

/** Grid tile for a merch product: image, badge/sold-out tag, wishlist heart, name and price */
export function ProductCard({ product, width }: { product: MerchProduct; width: number }) {
  const { wishlist, toggleWishlist } = useCart();
  const wished = wishlist.includes(product.slug);

  return (
    <Pressable
      onPress={() => router.push(`/merch/${product.slug}`)}
      accessibilityRole="button"
      accessibilityLabel={`${product.name}, ${formatZmw(product.priceZmw)}${product.inStock ? '' : ', sold out'}`}
      style={({ pressed }) => [styles.card, { width }, pressed && { opacity: 0.85 }]}>
      <View style={{ width: '100%', aspectRatio: 1, backgroundColor: colors.navySoft }}>
        <Image
          source={product.image}
          style={[StyleSheet.absoluteFill, !product.inStock && { opacity: 0.55 }]}
          contentFit="cover"
          transition={200}
        />
        {!product.inStock ? (
          <View style={[styles.tag, { backgroundColor: 'rgba(11,15,18,0.82)' }]}>
            <Txt style={[styles.tagLabel, { color: colors.white }]}>Sold out</Txt>
          </View>
        ) : product.badge ? (
          <View style={[styles.tag, { backgroundColor: colors.gold }]}>
            <Txt style={[styles.tagLabel, { color: colors.dark }]}>{product.badge}</Txt>
          </View>
        ) : null}
        <Pressable
          onPress={() => toggleWishlist(product.slug)}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel={wished ? 'Remove from wishlist' : 'Add to wishlist'}
          style={styles.heart}>
          <Ionicons name={wished ? 'heart' : 'heart-outline'} size={18} color={wished ? colors.danger : colors.textMuted} />
        </Pressable>
      </View>
      <View style={{ padding: space.md, gap: 4 }}>
        <Txt style={{ fontWeight: '700' }} numberOfLines={1}>
          {product.name}
        </Txt>
        <Txt variant="small" color={colors.textMuted} numberOfLines={2}>
          {product.description}
        </Txt>
        <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 6, marginTop: 2 }}>
          <Txt style={{ fontWeight: '800' }}>{formatZmw(product.priceZmw)}</Txt>
          {product.compareAtPriceZmw ? (
            <Txt variant="small" color={colors.textFaint} style={{ textDecorationLine: 'line-through' }}>
              {formatZmw(product.compareAtPriceZmw)}
            </Txt>
          ) : null}
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    overflow: 'hidden',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
    ...shadow,
  },
  tag: {
    position: 'absolute',
    top: space.sm,
    left: space.sm,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radius.pill,
  },
  tagLabel: { fontSize: 10, fontWeight: '800', letterSpacing: 0.8, textTransform: 'uppercase' },
  heart: {
    position: 'absolute',
    top: space.sm,
    right: space.sm,
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(255,255,255,0.92)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
