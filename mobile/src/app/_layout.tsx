import { Fraunces_400Regular_Italic, Fraunces_700Bold, useFonts } from '@expo-google-fonts/fraunces';
import { DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useCallback, useEffect, useState } from 'react';

import { BrandSplash } from '@/components/BrandSplash';
import { AuthProvider } from '@/providers/AuthProvider';
import { CartProvider } from '@/providers/CartProvider';
import { colors, fonts } from '@/theme';

SplashScreen.preventAutoHideAsync();

const theme = {
  ...DefaultTheme,
  colors: { ...DefaultTheme.colors, primary: colors.navy, background: colors.light, card: colors.white, text: colors.text, border: colors.border },
};

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({ Fraunces_700Bold, Fraunces_400Regular_Italic });
  const [splashVisible, setSplashVisible] = useState(true);
  const hideSplash = useCallback(() => setSplashVisible(false), []);

  useEffect(() => {
    if (fontsLoaded || fontError) SplashScreen.hideAsync();
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) return null;

  return (
    <ThemeProvider value={theme}>
      <AuthProvider>
        <CartProvider>
          <StatusBar style="dark" />
          <Stack
            screenOptions={{
              headerTintColor: colors.navy,
              headerTitleStyle: { fontFamily: fonts.serifBold, color: colors.text },
              headerStyle: { backgroundColor: colors.light },
              headerShadowVisible: false,
              headerBackButtonDisplayMode: 'minimal',
              contentStyle: { backgroundColor: colors.light },
            }}>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="login" options={{ presentation: 'modal', title: 'Sign in' }} />
            <Stack.Screen name="cart" options={{ presentation: 'modal', title: 'Your cart' }} />
            <Stack.Screen name="auth/callback" options={{ headerShown: false }} />
          </Stack>
          {splashVisible ? <BrandSplash onDone={hideSplash} /> : null}
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
