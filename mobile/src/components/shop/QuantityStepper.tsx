import { Pressable, StyleSheet, View } from 'react-native';

import { Ionicons, Txt } from '@/components/ui';
import { colors, radius } from '@/theme';

/** − qty + control; values are clamped to [min, max] */
export function QuantityStepper({
  value,
  onChange,
  min = 1,
  max = 20,
  small,
}: {
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
  small?: boolean;
}) {
  const size = small ? 32 : 40;
  return (
    <View style={styles.wrap}>
      <Pressable
        onPress={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
        accessibilityRole="button"
        accessibilityLabel="Decrease quantity"
        hitSlop={6}
        style={[styles.btn, { width: size, height: size }, value <= min && { opacity: 0.35 }]}>
        <Ionicons name="remove" size={small ? 16 : 18} color={colors.navy} />
      </Pressable>
      <Txt style={{ minWidth: 28, textAlign: 'center', fontWeight: '700' }} accessibilityLabel={`Quantity ${value}`}>
        {value}
      </Txt>
      <Pressable
        onPress={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        accessibilityRole="button"
        accessibilityLabel="Increase quantity"
        hitSlop={6}
        style={[styles.btn, { width: size, height: size }, value >= max && { opacity: 0.35 }]}>
        <Ionicons name="add" size={small ? 16 : 18} color={colors.navy} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.pill,
    backgroundColor: colors.white,
    padding: 2,
  },
  btn: { alignItems: 'center', justifyContent: 'center', borderRadius: radius.pill },
});
