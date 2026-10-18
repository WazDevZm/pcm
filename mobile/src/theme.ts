import { Platform } from 'react-native';

/** The Haven palette — navy, near-black, off-white, with a gold accent for light & emphasis */
export const colors = {
  navy: '#0f2d6e',
  navyDeep: '#0a1f4d',
  navySoft: '#e8edf7',
  dark: '#0B0F12',
  darkElevated: '#121820',
  light: '#fafbfc',
  white: '#ffffff',
  gold: '#d9a441',
  goldSoft: '#fbf3e2',
  text: '#0B0F12',
  textMuted: '#5b6472',
  textFaint: '#8a93a3',
  border: '#e4e7ec',
  danger: '#b42318',
  dangerSoft: '#fef3f2',
  success: '#067647',
  successSoft: '#ecfdf3',
} as const;

/** Loaded in the root layout via @expo-google-fonts/fraunces */
export const fonts = {
  serifBold: 'Fraunces_700Bold',
  serifItalic: 'Fraunces_400Regular_Italic',
} as const;

export const space = { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32, xxxl: 48 } as const;

export const radius = { sm: 8, md: 12, lg: 16, xl: 24, pill: 999 } as const;

export const type = {
  display: { fontSize: 34, lineHeight: 40, fontFamily: 'Fraunces_700Bold', letterSpacing: -0.6 },
  h1: { fontSize: 28, lineHeight: 34, fontFamily: 'Fraunces_700Bold', letterSpacing: -0.4 },
  h2: { fontSize: 22, lineHeight: 28, fontWeight: '700' as const, letterSpacing: -0.3 },
  h3: { fontSize: 17, lineHeight: 22, fontWeight: '700' as const },
  body: { fontSize: 15, lineHeight: 22, fontWeight: '400' as const },
  small: { fontSize: 13, lineHeight: 18, fontWeight: '400' as const },
  label: {
    fontSize: 11,
    lineHeight: 14,
    fontWeight: '700' as const,
    letterSpacing: 1.6,
    textTransform: 'uppercase' as const,
  },
};

export const shadow = Platform.select({
  ios: {
    shadowColor: '#0B0F12',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
  },
  default: { elevation: 2 },
});
