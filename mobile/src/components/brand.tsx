import { Image } from 'expo-image';
import { StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';

import { BRAND } from '@/lib/brand';
import { colors, fonts } from '@/theme';

const PCM_SHIELD = require('@/assets/images/pcm-shield.png');
const PCM_RATIO = 295 / 363;

/** The Haven symbol: an open Bible turned roof-wise (shelter), a gold light beneath, a ground line */
export function HavenSymbol({ size = 40, tone = 'navy' }: { size?: number; tone?: 'navy' | 'white' }) {
  const ink = tone === 'white' ? colors.white : colors.navy;
  return (
    <Svg width={size} height={size} viewBox="0 1.25 64 64" accessibilityLabel="The Haven">
      <Path d="M32 13C24 16.5 15.5 24 8.5 41" stroke={ink} strokeWidth={6} strokeLinecap="round" fill="none" />
      <Path d="M32 13C40 16.5 48.5 24 55.5 41" stroke={ink} strokeWidth={6} strokeLinecap="round" fill="none" />
      <Path d="M32 23C27 25.5 21.5 30.5 17 40" stroke={ink} strokeWidth={3.6} strokeLinecap="round" fill="none" />
      <Path d="M32 23C37 25.5 42.5 30.5 47 40" stroke={ink} strokeWidth={3.6} strokeLinecap="round" fill="none" />
      <Path d="M14 53.5h36" stroke={ink} strokeWidth={3.6} strokeLinecap="round" />
      <Circle cx={32} cy={44} r={6} fill={colors.gold} />
    </Svg>
  );
}

/** Text logo: gold italic "The" + bold serif "Haven" */
export function HavenWordmark({ size = 24, tone = 'navy' }: { size?: number; tone?: 'navy' | 'white' }) {
  return (
    <Text accessibilityRole="header" accessibilityLabel="The Haven" style={styles.row}>
      <Text style={[styles.the, { fontSize: size * 0.62 }]}>The </Text>
      <Text style={[styles.haven, { fontSize: size, color: tone === 'white' ? colors.white : colors.navy }]}>
        Haven
      </Text>
    </Text>
  );
}

/** Symbol + wordmark lockup */
export function HavenLockup({ size = 24, tone = 'navy' }: { size?: number; tone?: 'navy' | 'white' }) {
  return (
    <View style={styles.lockup}>
      <HavenSymbol size={size * 1.45} tone={tone} />
      <HavenWordmark size={size} tone={tone} />
    </View>
  );
}

/** The Copperbelt University Public Campus Ministries shield */
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

/** Shield above "A ministry of / CBU PCM", centred */
export function PcmEndorsement({ tone = 'navy', height = 44 }: { tone?: 'navy' | 'white'; height?: number }) {
  return (
    <View style={styles.endorse}>
      <PcmShield height={height} />
      <View style={{ alignItems: 'center' }}>
        <Text style={[styles.endorseLabel, { color: tone === 'white' ? 'rgba(255,255,255,0.6)' : colors.textMuted }]}>
          A MINISTRY OF
        </Text>
        <Text style={[styles.endorseName, { color: tone === 'white' ? colors.white : colors.navy }]}>{BRAND.ministryShort}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { includeFontPadding: false },
  the: { fontFamily: fonts.serifItalic, color: colors.gold },
  haven: { fontFamily: fonts.serifBold, letterSpacing: -0.3 },
  lockup: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  endorse: { alignItems: 'center', gap: 8 },
  endorseLabel: { fontSize: 10, fontWeight: '700', letterSpacing: 1.8 },
  endorseName: { fontSize: 14, fontWeight: '700', marginTop: 2, textAlign: 'center' },
});
