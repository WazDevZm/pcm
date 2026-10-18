import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { useState, type ReactNode } from 'react';
import { Alert, KeyboardAvoidingView, Platform, Pressable, StyleSheet, View } from 'react-native';

import { Button, Ionicons, Notice, Screen, Txt, type IconName } from '@/components/ui';
import { uploadImage } from '@/lib/api';
import { errorMessage } from '@/lib/format';
import { colors, radius, shadow, space } from '@/theme';

/** Keyboard-aware scrolling form body */
export function FormScreen({ children }: { children: ReactNode }) {
  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <Screen>{children}</Screen>
    </KeyboardAvoidingView>
  );
}

/** Dashboard metric tile — tap to open its management screen */
export function StatTile({
  icon,
  label,
  value,
  onPress,
  highlight,
}: {
  icon: IconName;
  label: string;
  value: number | string;
  onPress?: () => void;
  highlight?: boolean;
}) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${label}: ${value}`}
      style={({ pressed }) => [styles.tile, highlight && styles.tileHighlight, pressed && { opacity: 0.85 }]}>
      <View style={[styles.tileIcon, highlight && { backgroundColor: colors.gold }]}>
        <Ionicons name={icon} size={18} color={highlight ? colors.dark : colors.navy} />
      </View>
      <Txt variant="h2">{value}</Txt>
      <Txt variant="small" color={colors.textMuted}>
        {label}
      </Txt>
    </Pressable>
  );
}

/** Two-column grid wrapper for StatTiles */
export function TileGrid({ children }: { children: ReactNode }) {
  return <View style={styles.grid}>{children}</View>;
}

/** Grouped list of ListRows with dividers, like the More tab */
export function MenuGroup({ title, children }: { title?: string; children: ReactNode[] }) {
  const items = children.filter(Boolean);
  return (
    <View style={{ gap: space.sm }}>
      {title ? (
        <Txt variant="label" color={colors.textMuted} style={{ paddingHorizontal: space.xs }}>
          {title}
        </Txt>
      ) : null}
      <View style={styles.group}>
        {items.map((child, i) => (
          <View key={i}>
            {i > 0 ? <View style={styles.divider} /> : null}
            {child}
          </View>
        ))}
      </View>
    </View>
  );
}

/** Ask before a destructive action */
export function confirmAction(title: string, message: string, confirmLabel: string, onConfirm: () => void) {
  Alert.alert(title, message, [
    { text: 'Cancel', style: 'cancel' },
    { text: confirmLabel, style: 'destructive', onPress: onConfirm },
  ]);
}

/**
 * Run a mutation with a busy flag keyed by item id; shows an alert on failure.
 * Returns [busyKey, run].
 */
export function useBusy() {
  const [busy, setBusy] = useState<string | null>(null);
  const run = async (key: string, fn: () => Promise<unknown>) => {
    setBusy(key);
    try {
      await fn();
      return true;
    } catch (e) {
      Alert.alert('Something went wrong', errorMessage(e));
      return false;
    } finally {
      setBusy(null);
    }
  };
  return [busy, run] as const;
}

/** Open the photo library; returns the picked asset or null */
export async function pickImage() {
  const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], quality: 0.8 });
  if (result.canceled || !result.assets?.length) return null;
  return result.assets[0];
}

/** Image preview + choose / remove; uploads to the media bucket as soon as a photo is picked */
export function ImageField({
  label = 'Image',
  value,
  onChange,
  folder,
  disabled,
}: {
  label?: string;
  value: string | null;
  onChange: (url: string | null) => void;
  folder: string;
  disabled?: boolean;
}) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const choose = async () => {
    setError(null);
    try {
      const asset = await pickImage();
      if (!asset) return;
      setUploading(true);
      onChange(await uploadImage(asset.uri, folder, asset.mimeType ?? 'image/jpeg'));
    } catch (e) {
      setError(errorMessage(e));
    } finally {
      setUploading(false);
    }
  };

  return (
    <View style={{ gap: 6 }}>
      <Txt variant="small" style={{ fontWeight: '600' }}>
        {label}
      </Txt>
      {value ? (
        <Image source={{ uri: value }} style={styles.preview} contentFit="cover" transition={150} />
      ) : (
        <View style={[styles.preview, styles.previewEmpty]}>
          <Ionicons name="image-outline" size={28} color={colors.textFaint} />
          <Txt variant="small" color={colors.textMuted}>
            No image
          </Txt>
        </View>
      )}
      {error ? <Notice tone="error">{error}</Notice> : null}
      <View style={{ flexDirection: 'row', gap: space.sm }}>
        <Button
          label={value ? 'Replace' : 'Choose photo'}
          icon="image-outline"
          variant="secondary"
          small
          loading={uploading}
          disabled={disabled}
          onPress={choose}
          style={{ flex: 1 }}
        />
        {value ? (
          <Button
            label="Remove"
            icon="trash-outline"
            variant="danger"
            small
            disabled={uploading || disabled}
            onPress={() => onChange(null)}
          />
        ) : null}
      </View>
    </View>
  );
}

/** Row of compact action buttons at the bottom of a card */
export function ActionRow({ children }: { children: ReactNode }) {
  return <View style={styles.actions}>{children}</View>;
}

/** Tappable contact line (mailto / tel) */
export function ContactLink({ icon, label, onPress }: { icon: IconName; label: string; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} hitSlop={6} style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
      <Ionicons name={icon} size={15} color={colors.navy} />
      <Txt variant="small" color={colors.navy} style={{ fontWeight: '600' }}>
        {label}
      </Txt>
    </Pressable>
  );
}

/** Capitalise and de-underscore an enum value for display */
export const humanize = (v: string) => v.replace(/_/g, ' ').replace(/^\w/, (c) => c.toUpperCase());

export const options = <T extends string>(values: readonly T[]) => values.map((value) => ({ value, label: humanize(value) }));

const styles = StyleSheet.create({
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: space.md },
  tile: {
    flexBasis: '47%',
    flexGrow: 1,
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    padding: space.lg,
    gap: 4,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
    ...shadow,
  },
  tileHighlight: { backgroundColor: colors.goldSoft, borderColor: colors.gold },
  tileIcon: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: colors.navySoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: space.xs,
  },
  group: {
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    overflow: 'hidden',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
  },
  divider: { height: StyleSheet.hairlineWidth, backgroundColor: colors.border, marginLeft: 68 },
  preview: { width: '100%', aspectRatio: 16 / 9, borderRadius: radius.md, backgroundColor: colors.navySoft },
  previewEmpty: { alignItems: 'center', justifyContent: 'center', gap: 4, borderWidth: 1, borderColor: colors.border, borderStyle: 'dashed' },
  actions: { flexDirection: 'row', flexWrap: 'wrap', gap: space.sm, marginTop: space.md },
});
