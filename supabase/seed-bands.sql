-- Seed the five ministry bands (run after 002_bands_extension.sql)

INSERT INTO public.committees (
  name, slug, description, focus_area, meeting_time, meeting_location,
  mission, responsibilities, how_to_join, important_info,
  leader_name, leader_position, leader_tenure,
  leader_email, leader_phone, leader_image_url,
  is_band, sort_order, activities
) VALUES
(
  'Bible Study Band', 'bible-study-band',
  'The Bible Study Band leads weekly Scripture studies, discipleship groups, and topical studies.',
  'Biblical Education & Spiritual Growth', 'Wednesdays, 7:00 PM', 'Ministry Center – Room A',
  'To nurture a deep love for God''s Word and equip students to study Scripture faithfully.',
  'Plan and facilitate weekly studies, prepare discussion guides, and mentor new study leaders.',
  'Attend any Wednesday Bible study or speak with the band leader after Sabbath worship.',
  'Bring your Bible and a notebook. Study outlines are shared each week.',
  'Coordinator TBD', 'Bible Study Band Leader', 'Academic Year 2025–2026',
  'biblestudy@cbusda.org', '(909) 555-0101', '/placeholder-user.svg',
  true, 1,
  ARRAY['Weekly Bible studies', 'Topical series', 'Scripture memorization', 'Small group discipleship']
),
(
  'Publicity Committee', 'publicity-committee',
  'The Publicity Committee communicates ministry news across campus through digital and print media.',
  'Communications & Outreach', 'Thursdays, 5:30 PM', 'Media Room',
  'To proclaim Christ and our ministry events clearly, creatively, and consistently.',
  'Design promotional materials, manage social channels, and coordinate cross-promotion.',
  'Come to Thursday meetings with ideas or skills in design, writing, or photography.',
  'Submit event promo requests at least one week before your event date.',
  'Coordinator TBD', 'Publicity Committee Chair', 'Academic Year 2025–2026',
  'publicity@cbusda.org', '(909) 555-0102', '/placeholder-user.svg',
  true, 2,
  ARRAY['Social media', 'Flyers & posters', 'Photography', 'Website updates']
),
(
  'Welfare Band', 'welfare-band',
  'The Welfare Band cares for students'' practical and emotional needs through visitation and care packages.',
  'Pastoral Care & Student Support', 'Sundays, 1:00 PM', 'Fellowship Hall',
  'To reflect Christ''s compassion by meeting tangible needs and walking alongside students.',
  'Coordinate welfare visits, manage care fund requests, and organize care packages.',
  'Speak with the welfare leader after Sabbath service or email us.',
  'Welfare needs can be submitted confidentially through the prayer request page.',
  'Coordinator TBD', 'Welfare Band Leader', 'Academic Year 2025–2026',
  'welfare@cbusda.org', '(909) 555-0103', '/placeholder-user.svg',
  true, 3,
  ARRAY['Hospital visits', 'Care packages', 'Meal support', 'Crisis response']
),
(
  'Health Band', 'health-band',
  'The Health Band promotes wholistic health through seminars, lifestyle education, and wellness activities.',
  'Health Ministry & Wellness', 'Tuesdays, 6:00 PM', 'Wellness Room',
  'To teach biblical principles of health and empower students to honor God with their bodies.',
  'Plan health seminars, partner with professionals, and promote NEWSTART principles.',
  'Attend a Tuesday meeting or volunteer for our next health expo.',
  'Our annual Health Expo is held each spring—watch announcements for dates.',
  'Coordinator TBD', 'Health Band Leader', 'Academic Year 2025–2026',
  'health@cbusda.org', '(909) 555-0104', '/placeholder-user.svg',
  true, 4,
  ARRAY['Health expos', 'Cooking demos', 'Fitness walks', 'Mental health workshops']
),
(
  'Witnessing Band', 'witnessing-band',
  'The Witnessing Band equips students to share their faith on campus through outreach and literature.',
  'Evangelism & Soul Winning', 'Fridays, 6:00 PM', 'Ministry Center',
  'To fulfill the Great Commission by training every member to share Christ with love and clarity.',
  'Organize weekly outreach, train members, coordinate literature, and follow up with interested students.',
  'Join Friday outreach nights—training is provided every week.',
  'Outreach materials are provided. Wear comfortable shoes and bring a friend!',
  'Coordinator TBD', 'Witnessing Band Leader', 'Academic Year 2025–2026',
  'witnessing@cbusda.org', '(909) 555-0105', '/placeholder-user.svg',
  true, 5,
  ARRAY['Campus outreach', 'Literature evangelism', 'Bible mark studies', 'Mission trips']
)
ON CONFLICT (slug) DO NOTHING;
