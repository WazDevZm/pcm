import { Image } from 'expo-image';
import { useEffect, useState } from 'react';
import { Animated, StyleSheet } from 'react-native';

import { colors } from '@/theme';

const SPLASH = require('@/assets/images/splash.png');

/** Matches the native splash (app.json), holds briefly, then fades into the app */
export function BrandSplash({ onDone }: { onDone: () => void }) {
  const [opacity] = useState(() => new Animated.Value(1));

  useEffect(() => {
    const anim = Animated.sequence([
      Animated.delay(900),
      Animated.timing(opacity, { toValue: 0, duration: 400, useNativeDriver: true }),
    ]);
    anim.start(({ finished }) => finished && onDone());
    return () => anim.stop();
  }, [opacity, onDone]);

  return (
    <Animated.View pointerEvents="none" style={[StyleSheet.absoluteFill, styles.root, { opacity }]}>
      <Image source={SPLASH} style={styles.image} contentFit="contain" accessibilityLabel="The Haven — CBU SDA PCM" />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  root: { backgroundColor: colors.navy, alignItems: 'center', justifyContent: 'center', zIndex: 1000 },
  image: { width: 240, height: 300 },
});
