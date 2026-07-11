import type { Band, BandAnnouncement } from './supabase'

/** Static fallback when Supabase is not configured — keeps band pages functional */
export const DEFAULT_BANDS: Band[] = [
  {
    id: 'band-bible-study',
    slug: 'bible-study-band',
    name: 'Bible Study Band',
    description:
      'The Bible Study Band leads weekly Scripture studies, discipleship groups, and topical studies that help students grow in biblical literacy and Christian living.',
    focus_area: 'Biblical Education & Spiritual Growth',
    meeting_time: 'Wednesdays, 7:00 PM',
    meeting_location: 'Ministry Center – Room A',
    leader_id: null,
    activities: ['Weekly Bible studies', 'Topical series', 'Scripture memorization', 'Small group discipleship'],
    mission:
      'To nurture a deep love for God\'s Word and equip students to study Scripture faithfully in their daily lives.',
    responsibilities:
      'Plan and facilitate weekly studies, prepare discussion guides, coordinate guest teachers, and mentor new study leaders.',
    how_to_join:
      'Attend any Wednesday Bible study or speak with the band leader after Sabbath worship. No prior experience required—just a willing heart to learn.',
    important_info:
      'Bring your Bible and a notebook. Study outlines are shared each week via the announcements section below.',
    hero_image_url: '/bands/bible-study.svg',
    leader_name: 'Coordinator TBD',
    leader_position: 'Bible Study Band Leader',
    leader_tenure: 'Academic Year 2025–2026',
    leader_image_url: '/placeholder-user.svg',
    leader_email: 'biblestudy@cbusda.org',
    leader_phone: '(909) 555-0101',
    is_band: true,
    sort_order: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'band-publicity',
    slug: 'publicity-committee',
    name: 'Publicity Committee',
    description:
      'The Publicity Committee communicates ministry news across campus through digital media, print materials, and creative campaigns.',
    focus_area: 'Communications & Outreach',
    meeting_time: 'Thursdays, 5:30 PM',
    meeting_location: 'Media Room',
    leader_id: null,
    activities: ['Social media', 'Flyers & posters', 'Photography', 'Website updates'],
    mission:
      'To proclaim Christ and our ministry events clearly, creatively, and consistently so every student can hear the gospel invitation.',
    responsibilities:
      'Design promotional materials, manage social channels, photograph events, and coordinate with all bands for cross-promotion.',
    how_to_join:
      'Come to Thursday meetings with ideas—or skills in design, writing, or photography. We train volunteers on our tools.',
    important_info:
      'Submit event promo requests at least one week before your event date.',
    hero_image_url: '/bands/publicity.svg',
    leader_name: 'Coordinator TBD',
    leader_position: 'Publicity Committee Chair',
    leader_tenure: 'Academic Year 2025–2026',
    leader_image_url: '/placeholder-user.svg',
    leader_email: 'publicity@cbusda.org',
    leader_phone: '(909) 555-0102',
    is_band: true,
    sort_order: 2,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'band-welfare',
    slug: 'welfare-band',
    name: 'Welfare Band',
    description:
      'The Welfare Band cares for students\' practical and emotional needs through visitation, care packages, and crisis support in Christ\'s name.',
    focus_area: 'Pastoral Care & Student Support',
    meeting_time: 'Sundays, 1:00 PM (after worship)',
    meeting_location: 'Fellowship Hall',
    leader_id: null,
    activities: ['Hospital visits', 'Care packages', 'Meal support', 'Crisis response'],
    mission:
      'To reflect Christ\'s compassion by meeting tangible needs and walking alongside students through difficult seasons.',
    responsibilities:
      'Coordinate welfare visits, manage care fund requests, organize care packages, and connect students with counseling when needed.',
    how_to_join:
      'Speak with the welfare leader after Sabbath service or email us. A caring heart and reliability matter more than experience.',
    important_info:
      'Welfare needs can be submitted confidentially through the prayer request page or directly to the band leader.',
    hero_image_url: '/bands/welfare.svg',
    leader_name: 'Coordinator TBD',
    leader_position: 'Welfare Band Leader',
    leader_tenure: 'Academic Year 2025–2026',
    leader_image_url: '/placeholder-user.svg',
    leader_email: 'welfare@cbusda.org',
    leader_phone: '(909) 555-0103',
    is_band: true,
    sort_order: 3,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'band-health',
    slug: 'health-band',
    name: 'Health Band',
    description:
      'The Health Band promotes wholistic health—physical, mental, and spiritual—through seminars, lifestyle education, and wellness activities.',
    focus_area: 'Health Ministry & Wellness',
    meeting_time: 'Tuesdays, 6:00 PM',
    meeting_location: 'Wellness Room',
    leader_id: null,
    activities: ['Health expos', 'Cooking demos', 'Fitness walks', 'Mental health workshops'],
    mission:
      'To teach biblical principles of health and empower students to honor God with their bodies, minds, and habits.',
    responsibilities:
      'Plan health seminars, partner with professionals for workshops, promote NEWSTART principles, and support campus wellness events.',
    how_to_join:
      'Attend a Tuesday meeting or volunteer for our next health expo. Health sciences students are especially welcome!',
    important_info:
      'Our annual Health Expo is held each spring—watch announcements for dates and volunteer sign-ups.',
    hero_image_url: '/bands/health.svg',
    leader_name: 'Coordinator TBD',
    leader_position: 'Health Band Leader',
    leader_tenure: 'Academic Year 2025–2026',
    leader_image_url: '/placeholder-user.svg',
    leader_email: 'health@cbusda.org',
    leader_phone: '(909) 555-0104',
    is_band: true,
    sort_order: 4,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'band-witnessing',
    slug: 'witnessing-band',
    name: 'Witnessing Band',
    description:
      'The Witnessing Band equips students to share their faith on campus through literature distribution, friendship evangelism, and outreach events.',
    focus_area: 'Evangelism & Soul Winning',
    meeting_time: 'Fridays, 6:00 PM',
    meeting_location: 'Ministry Center',
    leader_id: null,
    activities: ['Campus outreach', 'Literature evangelism', 'Bible mark studies', 'Mission trips'],
    mission:
      'To fulfill the Great Commission by training every member to confidently share Christ with love, clarity, and the Spirit\'s power.',
    responsibilities:
      'Organize weekly outreach, train members in witnessing methods, coordinate literature, and follow up with interested students.',
    how_to_join:
      'Join Friday outreach nights—training is provided every week. Come ready to pray, learn, and share hope.',
    important_info:
      'Outreach materials are provided. Wear comfortable shoes and bring a friend!',
    hero_image_url: '/bands/witnessing.svg',
    leader_name: 'Coordinator TBD',
    leader_position: 'Witnessing Band Leader',
    leader_tenure: 'Academic Year 2025–2026',
    leader_image_url: '/placeholder-user.svg',
    leader_email: 'witnessing@cbusda.org',
    leader_phone: '(909) 555-0105',
    is_band: true,
    sort_order: 5,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
]

export const DEFAULT_BAND_ANNOUNCEMENTS: Record<string, BandAnnouncement[]> = {
  'bible-study-band': [
    {
      id: 'ann-1',
      committee_id: 'band-bible-study',
      title: 'This Week: Study of Daniel 2',
      content: 'Join us as we explore Nebuchadnezzar\'s dream and God\'s sovereign plan through history. Bring your Bible and questions!',
      type: 'meeting',
      image_url: null,
      author_id: null,
      published_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ],
  'publicity-committee': [
    {
      id: 'ann-2',
      committee_id: 'band-publicity',
      title: 'Submit Event Graphics by Thursday',
      content: 'All bands: please send event details and photos to publicity@cbusda.org by Thursday noon for weekend promotion.',
      type: 'announcement',
      image_url: null,
      author_id: null,
      published_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ],
  'welfare-band': [
    {
      id: 'ann-3',
      committee_id: 'band-welfare',
      title: 'Care Package Drive This Month',
      content: 'We are collecting toiletries and snacks for students in need. Drop-off bin is in the Fellowship Hall.',
      type: 'announcement',
      image_url: null,
      author_id: null,
      published_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ],
  'health-band': [
    {
      id: 'ann-4',
      committee_id: 'band-health',
      title: 'Wellness Walk – Saturday Morning',
      content: 'Meet at the campus track at 7:00 AM for prayer, fellowship, and a group walk. All fitness levels welcome.',
      type: 'meeting',
      image_url: null,
      author_id: null,
      published_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ],
  'witnessing-band': [
    {
      id: 'ann-5',
      committee_id: 'band-witnessing',
      title: 'Friday Outreach – Main Quad',
      content: 'We will be on the main quad Friday at 6 PM with literature and friendship evangelism. Training at 5:30 PM.',
      type: 'meeting',
      image_url: null,
      author_id: null,
      published_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ],
}

export function getDefaultBandBySlug(slug: string): Band | undefined {
  return DEFAULT_BANDS.find((b) => b.slug === slug)
}
