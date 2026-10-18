import Ionicons from '@expo/vector-icons/Ionicons';
import { Image, type ImageSource } from 'expo-image';
import { LinearGradientOverlay } from '@/components/overlay';
import { router, type Href } from 'expo-router';
import type { ComponentProps, ReactNode } from 'react';
import {
  ActivityIndicator,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  type ScrollViewProps,
  type StyleProp,
  type TextInputProps,
  type TextProps,
  type TextStyle,
  type ViewStyle,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { isSupabaseConfigured } from '@/lib/supabase';
import { colors, radius, shadow, space, type } from '@/theme';

export type IconName = ComponentProps<typeof Ionicons>['name'];
export { Ionicons };

// ───────────────────────── Text ─────────────────────────

type Variant = keyof typeof type;

export function Txt({
  variant = 'body',
  color,
  center,
  style,
  ...props
}: TextProps & { variant?: Variant; color?: string; center?: boolean }) {
  return (
    <Text
      {...props}
      style={[type[variant], { color: color ?? colors.text }, center && { textAlign: 'center' }, style]}
    />
  );
}

/** Small uppercase eyebrow + serif title, optional action link on the right */
export function SectionHeader({
  eyebrow,
  title,
  action,
  dark,
}: {
  eyebrow?: string;
  title: string;
  action?: { label: string; href: Href };
  dark?: boolean;
}) {
  return (
    <View style={styles.sectionHeader}>
      <View style={{ flex: 1 }}>
        {eyebrow ? (
          <Txt variant="label" color={dark ? colors.gold : colors.navy} style={{ marginBottom: 6 }}>
            {eyebrow}
          </Txt>
        ) : null}
        <Txt variant="h1" color={dark ? colors.white : colors.text}>
          {title}
        </Txt>
      </View>
      {action ? (
        <Pressable onPress={() => router.push(action.href)} hitSlop={8} accessibilityRole="link">
          <Txt variant="small" color={dark ? colors.gold : colors.navy} style={{ fontWeight: '700' }}>
            {action.label} →
          </Txt>
        </Pressable>
      ) : null}
    </View>
  );
}

// ───────────────────────── Layout ─────────────────────────

/** Scrollable screen body with consistent padding, pull-to-refresh and bottom inset */
export function Screen({
  children,
  refreshing,
  onRefresh,
  padded = true,
  style,
  contentContainerStyle,
  ...props
}: ScrollViewProps & { refreshing?: boolean; onRefresh?: () => void; padded?: boolean }) {
  const insets = useSafeAreaInsets();
  return (
    <ScrollView
      {...props}
      style={[{ flex: 1, backgroundColor: colors.light }, style]}
      contentContainerStyle={[
        padded && { padding: space.lg },
        { paddingBottom: insets.bottom + space.xxxl, gap: space.lg },
        contentContainerStyle,
      ]}
      keyboardShouldPersistTaps="handled"
      refreshControl={
        onRefresh ? (
          <RefreshControl refreshing={Boolean(refreshing)} onRefresh={onRefresh} tintColor={colors.navy} />
        ) : undefined
      }>
      {children}
    </ScrollView>
  );
}

export function Card({
  children,
  style,
  onPress,
  dark,
}: {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
  dark?: boolean;
}) {
  const body = [styles.card, dark && styles.cardDark, style];
  if (!onPress) return <View style={body}>{children}</View>;
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [body, pressed && { opacity: 0.85 }]}>
      {children}
    </Pressable>
  );
}

export function Row({ children, gap = space.sm, style }: { children: ReactNode; gap?: number; style?: StyleProp<ViewStyle> }) {
  return <View style={[{ flexDirection: 'row', alignItems: 'center', gap }, style]}>{children}</View>;
}

/** Full-bleed photo header with navy gradient and serif title */
export function PhotoHeader({
  image,
  eyebrow,
  title,
  subtitle,
  height = 240,
  children,
}: {
  image: ImageSource | number;
  eyebrow?: string;
  title: string;
  subtitle?: string;
  height?: number;
  children?: ReactNode;
}) {
  return (
    <View style={{ height, backgroundColor: colors.navyDeep }}>
      <Image source={image} style={StyleSheet.absoluteFill} contentFit="cover" transition={200} />
      <LinearGradientOverlay />
      <View style={styles.photoHeaderBody}>
        {eyebrow ? (
          <Txt variant="label" color={colors.gold} style={{ marginBottom: 6 }}>
            {eyebrow}
          </Txt>
        ) : null}
        <Txt variant="h1" color={colors.white}>
          {title}
        </Txt>
        {subtitle ? (
          <Txt color="rgba(255,255,255,0.8)" style={{ marginTop: 6 }}>
            {subtitle}
          </Txt>
        ) : null}
        {children}
      </View>
    </View>
  );
}

// ───────────────────────── Controls ─────────────────────────

type ButtonVariant = 'primary' | 'secondary' | 'gold' | 'ghost' | 'danger' | 'light';

export function Button({
  label,
  onPress,
  href,
  variant = 'primary',
  icon,
  loading,
  disabled,
  small,
  style,
}: {
  label: string;
  onPress?: () => void;
  href?: Href;
  variant?: ButtonVariant;
  icon?: IconName;
  loading?: boolean;
  disabled?: boolean;
  small?: boolean;
  style?: StyleProp<ViewStyle>;
}) {
  const v = buttonVariants[variant];
  const isDisabled = disabled || loading;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      disabled={isDisabled}
      onPress={href ? () => router.push(href) : onPress}
      style={({ pressed }) => [
        styles.button,
        small && styles.buttonSmall,
        { backgroundColor: v.bg, borderColor: v.border },
        pressed && { opacity: 0.85 },
        isDisabled && { opacity: 0.5 },
        style,
      ]}>
      {loading ? (
        <ActivityIndicator color={v.fg} />
      ) : (
        <>
          {icon ? <Ionicons name={icon} size={small ? 16 : 18} color={v.fg} /> : null}
          <Text style={[styles.buttonLabel, small && { fontSize: 14 }, { color: v.fg }]}>{label}</Text>
        </>
      )}
    </Pressable>
  );
}

const buttonVariants: Record<ButtonVariant, { bg: string; fg: string; border: string }> = {
  primary: { bg: colors.navy, fg: colors.white, border: colors.navy },
  secondary: { bg: colors.white, fg: colors.navy, border: colors.border },
  gold: { bg: colors.gold, fg: colors.dark, border: colors.gold },
  ghost: { bg: 'transparent', fg: colors.navy, border: 'transparent' },
  danger: { bg: colors.dangerSoft, fg: colors.danger, border: colors.dangerSoft },
  light: { bg: 'rgba(255,255,255,0.12)', fg: colors.white, border: 'rgba(255,255,255,0.25)' },
};

export function Field({
  label,
  error,
  hint,
  style,
  multiline,
  ...props
}: TextInputProps & { label: string; error?: string | null; hint?: string }) {
  return (
    <View style={{ gap: 6 }}>
      <Txt variant="small" style={{ fontWeight: '600' }}>
        {label}
      </Txt>
      <TextInput
        placeholderTextColor={colors.textFaint}
        multiline={multiline}
        {...props}
        style={[
          styles.input,
          multiline && { minHeight: 110, textAlignVertical: 'top', paddingTop: 12 },
          error ? { borderColor: colors.danger } : null,
          style as StyleProp<TextStyle>,
        ]}
      />
      {error ? (
        <Txt variant="small" color={colors.danger}>
          {error}
        </Txt>
      ) : hint ? (
        <Txt variant="small" color={colors.textMuted}>
          {hint}
        </Txt>
      ) : null}
    </View>
  );
}

/** Horizontal pill selector for filters and enums */
export function Chips<T extends string>({
  options,
  value,
  onChange,
  scroll = true,
}: {
  options: { value: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
  scroll?: boolean;
}) {
  const chips = options.map((o) => {
    const active = o.value === value;
    return (
      <Pressable
        key={o.value}
        onPress={() => onChange(o.value)}
        accessibilityRole="button"
        accessibilityState={{ selected: active }}
        style={[styles.chip, active && styles.chipActive]}>
        <Text style={[styles.chipLabel, active && { color: colors.white }]}>{o.label}</Text>
      </Pressable>
    );
  });
  if (!scroll) return <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: space.sm }}>{chips}</View>;
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: space.sm }}>
      {chips}
    </ScrollView>
  );
}

export function Toggle({ label, value, onChange }: { label: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <Pressable
      onPress={() => onChange(!value)}
      accessibilityRole="checkbox"
      accessibilityState={{ checked: value }}
      style={{ flexDirection: 'row', alignItems: 'center', gap: space.sm }}>
      <View style={[styles.checkbox, value && { backgroundColor: colors.navy, borderColor: colors.navy }]}>
        {value ? <Ionicons name="checkmark" size={14} color={colors.white} /> : null}
      </View>
      <Txt style={{ flex: 1 }}>{label}</Txt>
    </Pressable>
  );
}

export function Badge({ label, tone = 'navy' }: { label: string; tone?: 'navy' | 'gold' | 'success' | 'danger' | 'muted' }) {
  const t = {
    navy: [colors.navySoft, colors.navy],
    gold: [colors.goldSoft, '#8a5d0b'],
    success: [colors.successSoft, colors.success],
    danger: [colors.dangerSoft, colors.danger],
    muted: ['#f0f2f5', colors.textMuted],
  }[tone];
  return (
    <View style={[styles.badge, { backgroundColor: t[0] }]}>
      <Text style={[styles.badgeLabel, { color: t[1] }]}>{label}</Text>
    </View>
  );
}

/** Tappable menu row: icon tile, title, subtitle, chevron */
export function ListRow({
  icon,
  title,
  subtitle,
  href,
  onPress,
  right,
}: {
  icon?: IconName;
  title: string;
  subtitle?: string;
  href?: Href;
  onPress?: () => void;
  right?: ReactNode;
}) {
  return (
    <Pressable
      onPress={href ? () => router.push(href) : onPress}
      accessibilityRole="button"
      style={({ pressed }) => [styles.listRow, pressed && { backgroundColor: '#f3f5f8' }]}>
      {icon ? (
        <View style={styles.iconTile}>
          <Ionicons name={icon} size={20} color={colors.navy} />
        </View>
      ) : null}
      <View style={{ flex: 1 }}>
        <Txt style={{ fontWeight: '600' }}>{title}</Txt>
        {subtitle ? (
          <Txt variant="small" color={colors.textMuted}>
            {subtitle}
          </Txt>
        ) : null}
      </View>
      {right ?? <Ionicons name="chevron-forward" size={18} color={colors.textFaint} />}
    </Pressable>
  );
}

export function IconTile({ icon, dark }: { icon: IconName; dark?: boolean }) {
  return (
    <View style={[styles.iconTile, dark && { backgroundColor: 'rgba(255,255,255,0.1)' }]}>
      <Ionicons name={icon} size={20} color={dark ? colors.gold : colors.navy} />
    </View>
  );
}

// ───────────────────────── States ─────────────────────────

export function Loading({ label }: { label?: string }) {
  return (
    <View style={{ paddingVertical: space.xxxl, alignItems: 'center', gap: space.md }}>
      <ActivityIndicator color={colors.navy} />
      {label ? <Txt color={colors.textMuted}>{label}</Txt> : null}
    </View>
  );
}

export function EmptyState({
  icon = 'leaf-outline',
  title,
  body,
  action,
}: {
  icon?: IconName;
  title: string;
  body?: string;
  action?: ReactNode;
}) {
  return (
    <View style={styles.empty}>
      <View style={[styles.iconTile, { width: 52, height: 52, borderRadius: 16 }]}>
        <Ionicons name={icon} size={24} color={colors.navy} />
      </View>
      <Txt variant="h3" center>
        {title}
      </Txt>
      {body ? (
        <Txt color={colors.textMuted} center>
          {body}
        </Txt>
      ) : null}
      {action}
    </View>
  );
}

export function Notice({ tone = 'info', children }: { tone?: 'info' | 'error' | 'success'; children: ReactNode }) {
  const t = {
    info: [colors.goldSoft, '#8a5d0b', 'information-circle-outline'],
    error: [colors.dangerSoft, colors.danger, 'alert-circle-outline'],
    success: [colors.successSoft, colors.success, 'checkmark-circle-outline'],
  }[tone] as [string, string, IconName];
  return (
    <View style={[styles.notice, { backgroundColor: t[0] }]}>
      <Ionicons name={t[2]} size={18} color={t[1]} />
      <Txt variant="small" color={t[1]} style={{ flex: 1 }}>
        {children}
      </Txt>
    </View>
  );
}

/** Shown on data screens while .env has no Supabase keys */
export function OfflineNotice() {
  if (isSupabaseConfigured) return null;
  return <Notice>Showing built-in content. Connect Supabase in .env to load live data.</Notice>;
}

/** Full-screen success confirmation used after form submissions */
export function SuccessPanel({ title, body, children }: { title: string; body: string; children?: ReactNode }) {
  return (
    <View style={[styles.empty, { paddingVertical: space.xxxl }]}>
      <View style={[styles.iconTile, { width: 64, height: 64, borderRadius: 20, backgroundColor: colors.successSoft }]}>
        <Ionicons name="checkmark" size={32} color={colors.success} />
      </View>
      <Txt variant="h2" center>
        {title}
      </Txt>
      <Txt color={colors.textMuted} center>
        {body}
      </Txt>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  sectionHeader: { flexDirection: 'row', alignItems: 'flex-end', gap: space.md },
  card: {
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    padding: space.lg,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
    ...shadow,
  },
  cardDark: { backgroundColor: colors.darkElevated, borderColor: 'rgba(255,255,255,0.08)' },
  photoHeaderBody: { flex: 1, justifyContent: 'flex-end', padding: space.lg, paddingBottom: space.xl },
  button: {
    minHeight: 50,
    borderRadius: radius.pill,
    paddingHorizontal: space.xl,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: space.sm,
    borderWidth: 1,
  },
  buttonSmall: { minHeight: 38, paddingHorizontal: space.lg },
  buttonLabel: { fontSize: 16, fontWeight: '700' },
  input: {
    minHeight: 50,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: space.lg,
    backgroundColor: colors.white,
    fontSize: 16,
    color: colors.text,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: radius.pill,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
  },
  chipActive: { backgroundColor: colors.navy, borderColor: colors.navy },
  chipLabel: { fontSize: 14, fontWeight: '600', color: colors.text },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: colors.textFaint,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: { alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 4, borderRadius: radius.pill },
  badgeLabel: { fontSize: 12, fontWeight: '700', textTransform: 'capitalize' },
  listRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.md,
    paddingVertical: space.md,
    paddingHorizontal: space.lg,
    backgroundColor: colors.white,
  },
  iconTile: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: colors.navySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  empty: { alignItems: 'center', gap: space.md, paddingVertical: space.xxl, paddingHorizontal: space.lg },
  notice: { flexDirection: 'row', gap: space.sm, padding: space.md, borderRadius: radius.md, alignItems: 'flex-start' },
});
