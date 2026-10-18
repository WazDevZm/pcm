import { StyleSheet } from 'react-native';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';

import { colors } from '@/theme';

/** Navy fade from transparent (top) to solid (bottom) for legible text over photos */
export function LinearGradientOverlay({ from = 0.15, to = 0.92 }: { from?: number; to?: number }) {
  return (
    <Svg width="100%" height="100%" style={StyleSheet.absoluteFill} preserveAspectRatio="none" pointerEvents="none">
      <Defs>
        <LinearGradient id="fade" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor={colors.navyDeep} stopOpacity={from} />
          <Stop offset="0.55" stopColor={colors.navyDeep} stopOpacity={(from + to) / 2} />
          <Stop offset="1" stopColor={colors.navyDeep} stopOpacity={to} />
        </LinearGradient>
      </Defs>
      <Rect width="100%" height="100%" fill="url(#fade)" />
    </Svg>
  );
}
