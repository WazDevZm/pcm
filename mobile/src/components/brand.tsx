import { Image } from 'expo-image';
import { StyleSheet, Text, View } from 'react-native';

import { BRAND } from '@/lib/brand';
import { colors, fonts } from '@/theme';

const PCM_SHIELD = require('@/assets/images/pcm-shield.png');
const PCM_RATIO = 295 / 363;

/**
 * The Haven logo is text only (brand-kit/logo): gold italic "the", Fraunces Bold "Haven",
 * and a gold full stop — the light.
 */
export function HavenWordmark({ size = 24, tone = 'navy' }: { size?: number; tone?: 'navy' | 'white' }) {
  return (
    <Text accessibilityRole="header" accessibilityLabel={BRAND.name} style={styles.row}>
      <Text style={[styles.the, { fontSize: size * 0.58 }]}>the </Text>
      <Text style={[styles.haven, { fontSize: size, color: tone === 'white' ? colors.white : colors.navy }]}>
        Haven<Text style={{ color: colors.gold }}>.</Text>
      </Text>
    </Text>
  );
}

/** "H." monogram — same letters as the app icon */
export function HavenMonogram({ size = 40, tone = 'white' }: { size?: number; tone?: 'navy' | 'white' }) {
  return (
    <Text accessibilityLabel={BRAND.name} style={[styles.haven, { fontSize: size, lineHeight: size * 1.1, color: tone === 'white' ? colors.white : colors.navy }]}>
      H<Text style={{ color: colors.gold }}>.</Text>
    </Text>
  );
}

/** The Copperbelt University SDA Public Campus Ministries shield */
export function PcmShield({ height = 40 }: { height?: number }) {
  return (
    <Image
      source={PCM_SHIELD}
      style={{ height, width: height * PCM_RATIO }}
      contentFit="contain"
      accessibilityLabel={BRAND.ministry}
    />
  );
}

/** Shield above "CBU SDA PCM", centred */
export function PcmEndorsement({ tone = 'navy', height = 44 }: { tone?: 'navy' | 'white'; height?: number }) {
  return (
    <View style={styles.endorse}>
      <PcmShield height={height} />
      <Text style={[styles.endorseName, { color: tone === 'white' ? colors.white : colors.navy }]}>{BRAND.ministryShort}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { includeFontPadding: false },
  the: { fontFamily: fonts.serifItalic, color: colors.gold },
  haven: { fontFamily: fonts.serifBold, letterSpacing: -0.3 },
  endorse: { alignItems: 'center', gap: 8 },
  endorseName: { fontSize: 14, fontWeight: '700', letterSpacing: 1.2, textAlign: 'center' },
});
