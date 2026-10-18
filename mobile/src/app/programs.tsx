import { Stack, type Href } from 'expo-router';
import { View } from 'react-native';

import { Button, Card, IconTile, Ionicons, PhotoHeader, Row, Screen, Txt, type IconName } from '@/components/ui';
import { photo } from '@/data/images';
import { colors, space } from '@/theme';

const PROGRAMS: {
  title: string;
  description: string;
  schedule: string;
  location: string;
  icon: IconName;
  action: { label: string; href: Href };
}[] = [
  {
    title: 'Bible Study Groups',
    description: 'Weekly in-depth study of Scripture with fellow believers.',
    schedule: 'Wednesdays 7:00 PM',
    location: 'Campus Ministry Center',
    icon: 'book-outline',
    action: { label: 'Bible Study Band', href: '/bands/bible-study-band' },
  },
  {
    title: 'Youth Ministry',
    description: 'Dynamic programs designed for college-age students.',
    schedule: 'Fridays 6:30 PM',
    location: 'Student Union Building',
    icon: 'people-outline',
    action: { label: 'Find a band', href: '/bands' },
  },
  {
    title: 'Prayer & Worship',
    description: 'Weekly worship services and prayer meetings.',
    schedule: 'Saturdays 10:00 AM',
    location: 'Chapel',
    icon: 'heart-outline',
    action: { label: 'Send a prayer request', href: '/prayer' },
  },
  {
    title: 'Evangelism Training',
    description: 'Learn to share your faith effectively on campus.',
    schedule: 'Sundays 4:00 PM',
    location: 'Ministry Office',
    icon: 'megaphone-outline',
    action: { label: 'Upcoming events', href: '/events' },
  },
];

function Detail({ icon, text }: { icon: IconName; text: string }) {
  return (
    <Row gap={6}>
      <Ionicons name={icon} size={15} color={colors.textMuted} />
      <Txt variant="small" color={colors.textMuted} style={{ flex: 1 }}>
        {text}
      </Txt>
    </Row>
  );
}

export default function ProgramsScreen() {
  return (
    <Screen padded={false}>
      <Stack.Screen options={{ title: 'Programs' }} />
      <PhotoHeader
        image={photo('kcm_0729')}
        eyebrow="Grow with us"
        title="Our programs"
        subtitle="Strengthen your faith and build community with fellow believers."
      />
      <View style={{ paddingHorizontal: space.lg, gap: space.lg }}>
        <Txt color={colors.textMuted}>
          Discover opportunities to grow in faith, serve others, and build lasting relationships.
        </Txt>
        {PROGRAMS.map((p) => (
          <Card key={p.title} style={{ gap: space.md }}>
            <Row gap={space.md} style={{ alignItems: 'flex-start' }}>
              <IconTile icon={p.icon} />
              <View style={{ flex: 1, gap: 4 }}>
                <Txt variant="h3">{p.title}</Txt>
                <Txt color={colors.textMuted}>{p.description}</Txt>
              </View>
            </Row>
            <View style={{ gap: 4 }}>
              <Detail icon="time-outline" text={p.schedule} />
              <Detail icon="location-outline" text={p.location} />
            </View>
            <Button label={p.action.label} small variant="secondary" icon="arrow-forward" href={p.action.href} />
          </Card>
        ))}
        <Card style={{ gap: space.sm }}>
          <Txt variant="h3">Need someone to talk to?</Txt>
          <Txt color={colors.textMuted}>Our pastoral team offers confidential counseling for students.</Txt>
          <Button label="Counseling" small icon="chatbubbles-outline" href="/counseling" />
        </Card>
      </View>
    </Screen>
  );
}
