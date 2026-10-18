import { Image } from 'expo-image';
import { Stack } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import { StyleSheet, View } from 'react-native';

import { Badge, Button, Card, Ionicons, Notice, Row, Screen, Txt } from '@/components/ui';
import { ministryImage } from '@/data/images';
import { colors, radius, space } from '@/theme';

type Magazine = {
  title: string;
  description: string;
  topics: string[];
  /** Link to read the publication; issues without one show "Coming soon" */
  url?: string;
};

const MAGAZINES: Magazine[] = [
  {
    title: 'Adventist Review',
    description: 'The official magazine of the Seventh-day Adventist Church worldwide.',
    topics: ['Prophecy', 'Health', 'Mission Stories'],
  },
  {
    title: 'Ministry Magazine',
    description: 'Resources and insights for pastoral ministry and church leadership.',
    topics: ['Preaching', 'Leadership', 'Evangelism'],
  },
  {
    title: 'Signs of the Times',
    description: 'Sharing hope and biblical truth with the world.',
    topics: ['Bible Study', 'Prophecy', 'Christian Living'],
  },
  {
    title: 'Liberty Magazine',
    description: 'Defending religious freedom and human rights worldwide.',
    topics: ['Religious Freedom', 'Human Rights', 'Legal Issues'],
  },
  {
    title: 'Campus Ministry Quarterly',
    description: 'Resources specifically for college and university ministry.',
    topics: ['Student Life', 'Campus Evangelism', 'Youth Ministry'],
  },
  {
    title: 'Sabbath School Quarterly',
    description: 'Bible study guides for deeper spiritual growth.',
    topics: ['Bible Study', 'Spiritual Growth', 'Scripture'],
  },
];

export default function MagazinesScreen() {
  return (
    <Screen>
      <Stack.Screen options={{ title: 'Magazines' }} />
      <Txt color={colors.textMuted}>Spiritual publications and study materials for your faith journey.</Txt>
      <Notice>We&apos;re setting up in-app reading. Titles marked “Coming soon” will open here once available.</Notice>
      {MAGAZINES.map((m, i) => (
        <Card key={m.title} style={{ padding: 0, overflow: 'hidden' }}>
          <Image source={ministryImage(i + 2)} style={styles.cover} contentFit="cover" accessibilityLabel={m.title} />
          <View style={{ padding: space.lg, gap: space.sm }}>
            <Row>
              <Ionicons name="library-outline" size={18} color={colors.navy} />
              <Txt variant="h3" style={{ flex: 1 }}>
                {m.title}
              </Txt>
              {!m.url ? <Badge label="Coming soon" tone="muted" /> : null}
            </Row>
            <Txt color={colors.textMuted}>{m.description}</Txt>
            <Row style={{ flexWrap: 'wrap' }}>
              {m.topics.map((t) => (
                <Badge key={t} label={t} />
              ))}
            </Row>
            {m.url ? (
              <Button
                label="Read"
                small
                icon="eye-outline"
                onPress={() => WebBrowser.openBrowserAsync(m.url as string)}
                style={{ alignSelf: 'flex-start' }}
              />
            ) : null}
          </View>
        </Card>
      ))}
    </Screen>
  );
}

const styles = StyleSheet.create({
  cover: { width: '100%', height: 150, borderTopLeftRadius: radius.lg, borderTopRightRadius: radius.lg },
});
