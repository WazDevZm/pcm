import { Stack } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, View } from 'react-native';

import {
  Button,
  Card,
  Chips,
  Field,
  IconTile,
  Loading,
  Notice,
  OfflineNotice,
  PhotoHeader,
  Screen,
  SectionHeader,
  SuccessPanel,
  Toggle,
  Txt,
  type IconName,
} from '@/components/ui';
import { photo } from '@/data/images';
import { useAsync } from '@/hooks/useAsync';
import { applyToVolunteer, getBands, isLocalBand, submitPledge } from '@/lib/api';
import { errorMessage } from '@/lib/format';
import { useAuth } from '@/providers/AuthProvider';
import { colors, space } from '@/theme';

type PledgeType = 'one_time' | 'monthly' | 'event_sponsorship' | 'student_support';

const STEPS = [
  { step: '01', title: 'Attend a service', body: 'Join us for worship and experience our community first-hand.' },
  { step: '02', title: 'Meet the team', body: 'Connect with ministry leaders and learn about opportunities.' },
  { step: '03', title: 'Find your fit', body: 'Discover where your gifts and passions meet our mission.' },
  { step: '04', title: 'Start serving', body: 'Make a difference in the lives of students and the community.' },
];

const AREAS: { icon: IconName; title: string; body: string; skills: string }[] = [
  { icon: 'musical-notes-outline', title: 'Worship team', body: 'Vocalists, instrumentalists and sound technicians.', skills: 'Musical ability, a heart for worship' },
  { icon: 'book-outline', title: 'Bible study leader', body: 'Lead small-group studies and mentor new believers.', skills: 'Biblical knowledge, teaching ability' },
  { icon: 'megaphone-outline', title: 'Campus outreach', body: 'Share the gospel through campus events and personal evangelism.', skills: 'People skills, an evangelistic heart' },
  { icon: 'videocam-outline', title: 'Media ministry', body: 'Live streaming, social media and digital content.', skills: 'Technical skills, creativity' },
];

const PLEDGE_TYPES: { value: PledgeType; label: string; body: string }[] = [
  { value: 'one_time', label: 'One-time', body: 'A single gift towards the ministry.' },
  { value: 'monthly', label: 'Monthly', body: 'Become a regular supporter of campus ministry programmes.' },
  { value: 'event_sponsorship', label: 'Event sponsor', body: 'Sponsor evangelistic series, retreats or community service projects.' },
  { value: 'student_support', label: 'Student support', body: 'Help students attend conferences, retreats or mission trips.' },
];

const NO_PAYMENT = 'No payment is taken in the app. Our treasurer will contact you with giving details.';

function VolunteerForm() {
  const { user } = useAuth();
  const bands = useAsync(getBands);
  const [bandId, setBandId] = useState('general');
  const [role, setRole] = useState('');
  const [skills, setSkills] = useState('');
  const [availability, setAvailability] = useState('');
  const [hours, setHours] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  if (!user) {
    return (
      <Card style={{ gap: space.md }}>
        <Txt color={colors.textMuted}>Sign in to apply so leaders can follow up and you can track your application.</Txt>
        <Button label="Sign in to apply" icon="log-in-outline" href="/login" />
      </Card>
    );
  }

  if (done) {
    return (
      <SuccessPanel title="Application sent" body="Thank you for offering to serve. A leader will be in touch about next steps.">
        <Button label="View in my account" variant="secondary" href="/account" />
      </SuccessPanel>
    );
  }

  const options = [
    { value: 'general', label: 'Anywhere' },
    ...(bands.data ?? []).map((b) => ({ value: b.id, label: b.name })),
  ];

  const submit = async () => {
    setError(null);
    const hoursNum = Number(hours);
    if (!role.trim()) return setError('Tell us the role you would like to serve in.');
    if (!availability.trim()) return setError('Let us know when you are available.');
    if (!Number.isFinite(hoursNum) || hoursNum <= 0 || hoursNum > 40) return setError('Enter hours per week between 1 and 40.');
    const band = (bands.data ?? []).find((b) => b.id === bandId);
    setBusy(true);
    try {
      await applyToVolunteer({
        user_id: user.id,
        committee_id: band && !isLocalBand(band) ? band.id : null,
        // Keep the band name when it isn't a database committee yet
        role: band && isLocalBand(band) ? `${role.trim()} (${band.name})` : role.trim(),
        skills: skills
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean),
        availability: availability.trim(),
        commitment_hours: Math.round(hoursNum),
      });
      setDone(true);
    } catch (e) {
      setError(errorMessage(e));
    } finally {
      setBusy(false);
    }
  };

  return (
    <View style={{ gap: space.lg }}>
      <View style={{ gap: space.sm }}>
        <Txt variant="small" style={{ fontWeight: '600' }}>
          Band or committee
        </Txt>
        {bands.loading ? <Loading /> : <Chips options={options} value={bandId} onChange={setBandId} />}
      </View>
      <Field label="Role" value={role} onChangeText={setRole} placeholder="e.g. Vocalist, Bible study leader" />
      <Field
        label="Skills (optional)"
        value={skills}
        onChangeText={setSkills}
        placeholder="e.g. Guitar, design, public speaking"
        hint="Separate skills with commas."
      />
      <Field label="Availability" value={availability} onChangeText={setAvailability} placeholder="e.g. Weekday evenings, Sabbath afternoons" />
      <Field label="Hours per week" value={hours} onChangeText={setHours} keyboardType="number-pad" placeholder="e.g. 3" maxLength={2} />
      {error ? <Notice tone="error">{error}</Notice> : null}
      <Button label="Apply to volunteer" icon="hand-left-outline" onPress={submit} loading={busy} />
    </View>
  );
}

function PledgeForm() {
  const { user, profile } = useAuth();
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<PledgeType>('one_time');
  const [purpose, setPurpose] = useState('');
  const [anonymous, setAnonymous] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  if (done) {
    return (
      <SuccessPanel title="Thank you for your pledge" body={NO_PAYMENT}>
        <Button label="Make another pledge" variant="secondary" onPress={() => setDone(false)} />
      </SuccessPanel>
    );
  }

  const submit = async () => {
    setError(null);
    const value = Number(amount.replace(/[^\d.]/g, ''));
    if (!Number.isFinite(value) || value <= 0) return setError('Enter a pledge amount in kwacha.');
    if (!purpose.trim()) return setError('Tell us what you would like your gift to support.');
    setBusy(true);
    try {
      await submitPledge({
        amount: Math.round(value * 100) / 100,
        type,
        purpose: purpose.trim(),
        is_anonymous: anonymous,
        donor_name: anonymous ? null : profile?.name ?? null,
        donor_email: anonymous ? null : user?.email ?? null,
        user_id: user?.id ?? null,
      });
      setAmount('');
      setPurpose('');
      setDone(true);
    } catch (e) {
      setError(errorMessage(e));
    } finally {
      setBusy(false);
    }
  };

  return (
    <View style={{ gap: space.lg }}>
      <Notice>{NO_PAYMENT}</Notice>
      <View style={{ gap: space.sm }}>
        <Txt variant="small" style={{ fontWeight: '600' }}>
          Type of gift
        </Txt>
        <Chips options={PLEDGE_TYPES} value={type} onChange={setType} />
        <Txt variant="small" color={colors.textMuted}>
          {PLEDGE_TYPES.find((t) => t.value === type)?.body}
        </Txt>
      </View>
      <Field label="Amount (ZMW)" value={amount} onChangeText={setAmount} keyboardType="decimal-pad" placeholder="e.g. 200" />
      <Field label="Purpose" value={purpose} onChangeText={setPurpose} placeholder="e.g. Easter retreat, Bible study materials" />
      <Toggle label="Keep my pledge anonymous" value={anonymous} onChange={setAnonymous} />
      {!user && !anonymous ? (
        <Notice>You&apos;re not signed in, so we won&apos;t have your contact details. Sign in so the treasurer can reach you.</Notice>
      ) : null}
      {error ? <Notice tone="error">{error}</Notice> : null}
      <Button label="Submit pledge" icon="gift-outline" variant="gold" onPress={submit} loading={busy} />
    </View>
  );
}

export default function GetInvolvedScreen() {
  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <Stack.Screen options={{ title: 'Get involved' }} />
      <Screen padded={false}>
        <PhotoHeader
          image={photo('kcm_0741')}
          eyebrow="Serve & give"
          title="Get involved"
          subtitle="Join us in sharing God's love on campus through volunteering, giving and prayer."
        />
        <View style={{ paddingHorizontal: space.lg, gap: space.lg }}>
          <OfflineNotice />

          <SectionHeader eyebrow="Your path" title="How to get involved" />
          {STEPS.map((s) => (
            <Card key={s.step} style={{ flexDirection: 'row', gap: space.lg, alignItems: 'center' }}>
              <Txt style={{ fontSize: 28, fontWeight: '800', color: colors.navySoft, width: 44 }}>{s.step}</Txt>
              <View style={{ flex: 1 }}>
                <Txt variant="h3">{s.title}</Txt>
                <Txt variant="small" color={colors.textMuted}>
                  {s.body}
                </Txt>
              </View>
            </Card>
          ))}

          <SectionHeader eyebrow="Volunteer" title="Use your gifts" />
          {AREAS.map((a) => (
            <Card key={a.title} style={{ flexDirection: 'row', gap: space.md }}>
              <IconTile icon={a.icon} />
              <View style={{ flex: 1, gap: 2 }}>
                <Txt variant="h3">{a.title}</Txt>
                <Txt variant="small" color={colors.textMuted}>
                  {a.body}
                </Txt>
                <Txt variant="small">
                  <Txt variant="small" style={{ fontWeight: '700' }}>
                    Skills:{' '}
                  </Txt>
                  {a.skills}
                </Txt>
              </View>
            </Card>
          ))}
          <VolunteerForm />

          <SectionHeader eyebrow="Give" title="Pledge your support" />
          <Txt color={colors.textMuted}>
            Your financial partnership helps us reach more students and grow the ministry on campus.
          </Txt>
          <PledgeForm />

          <Card dark style={{ gap: space.sm, marginTop: space.md }}>
            <IconTile icon="heart-outline" dark />
            <Txt variant="h3" color={colors.white}>
              Prayer support
            </Txt>
            <Txt color="rgba(255,255,255,0.8)">
              Prayer is the foundation of our ministry. Intercede for students, ministry activities and the spread of the
              gospel on campus.
            </Txt>
            <Button label="Submit a prayer request" variant="light" icon="send-outline" href="/prayer" />
          </Card>
          <Button label="Contact the ministry team" variant="secondary" icon="mail-outline" href="/contact" />
        </View>
      </Screen>
    </KeyboardAvoidingView>
  );
}
