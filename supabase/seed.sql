-- The Haven — sample content for testing
-- Run after schema.sql, migrations/002, migrations/003 and seed-bands.sql.
-- Event dates are relative to "now" so the app always has upcoming events.
-- Review or delete this content before launch.

-- ───────── Other committees (not bands) ─────────
INSERT INTO public.committees (name, description, focus_area, meeting_time, meeting_location, activities, is_band, sort_order) VALUES
  ('Worship Committee', 'Leads praise and worship, coordinates music ministry and special music for Sabbath services.', 'Music Ministry & Worship', 'Fridays, 5:00 PM', 'Music Room', ARRAY['Sabbath worship', 'Choir & praise team', 'Special music'], false, 10),
  ('Prayer Ministry', 'Coordinates prayer meetings and the prayer team that intercedes for every request sent through the app.', 'Prayer & Spiritual Support', 'Mondays, 6:30 PM', 'Ministry Center', ARRAY['Prayer meetings', 'Intercessory prayer', 'Prayer walks'], false, 11)
ON CONFLICT DO NOTHING;

-- ───────── Events ─────────
INSERT INTO public.events (title, description, date, end_date, location, max_attendees, category, committee_id) VALUES
  ('Sabbath Worship', 'Our weekly Sabbath worship service with praise, prayer and a message from the Word. Everyone is welcome — bring a friend.',
    -- the next Saturday, 10:00–12:00 Zambia time (date_trunc('week') is Monday 00:00 UTC; +2 days keeps it in the future)
    date_trunc('week', now() + interval '2 days') + interval '5 days 8 hours', date_trunc('week', now() + interval '2 days') + interval '5 days 10 hours', 'Campus Chapel', 250, 'worship', NULL),
  ('Midweek Bible Study', 'Small-group study through the book of Daniel. Bring your Bible and a notebook — outlines are provided.',
    date_trunc('day', now()) + interval '2 days 19 hours', date_trunc('day', now()) + interval '2 days 20 hours 30 minutes', 'Ministry Center – Room A', 40, 'study',
    (SELECT id FROM public.committees WHERE slug = 'bible-study-band')),
  ('Campus Outreach Night', 'Training followed by outreach in the residences. Literature and refreshments provided.',
    date_trunc('day', now()) + interval '4 days 18 hours', date_trunc('day', now()) + interval '4 days 20 hours', 'Ministry Center', 30, 'outreach',
    (SELECT id FROM public.committees WHERE slug = 'witnessing-band')),
  ('Health Talk: Rest & Resilience', 'A practical session on sleep, stress and the Sabbath rest, ahead of exams.',
    date_trunc('day', now()) + interval '6 days 18 hours', date_trunc('day', now()) + interval '6 days 19 hours 30 minutes', 'Wellness Room', 60, 'special',
    (SELECT id FROM public.committees WHERE slug = 'health-band')),
  ('Haven Games Night', 'Board games, music and food — an easy way to meet people at The Haven.',
    date_trunc('day', now()) + interval '8 days 18 hours', date_trunc('day', now()) + interval '8 days 21 hours', 'Fellowship Hall', 80, 'fellowship', NULL);

-- ───────── Posts ─────────
INSERT INTO public.posts (title, content, excerpt, category, published_at) VALUES
  ('Welcome to The Haven app',
   'The Haven now has its own app. RSVP for events, join a ministry band, send a prayer request (anonymously if you prefer), request confidential counseling and order ministry merch — all in one place. Sign in with your Google account to get started.',
   'RSVP, join a band, send prayer requests and more — sign in with Google to get started.', 'announcement', now() - interval '1 day'),
  ('Bible Study is back on Wednesdays',
   'Midweek Bible Study meets every Wednesday at 7:00 PM in the Ministry Center, Room A. This term we are studying the book of Daniel. No experience needed — just come.',
   'Wednesdays at 7:00 PM in Ministry Center Room A — this term: the book of Daniel.', 'ministry', now() - interval '3 days'),
  ('Prayer requests: how they are handled',
   'Every prayer request sent through the app goes only to the prayer team. You can share your name or stay anonymous. The team meets weekly to pray over every request.',
   'Your requests go only to the prayer team — named or anonymous.', 'news', now() - interval '5 days');

-- ───────── Resources (links to public Adventist resources) ─────────
INSERT INTO public.resources (title, description, type, category, download_url, level, author, lessons) VALUES
  ('Sabbath School Bible Study Guide', 'This quarter''s adult Bible study guide with daily readings.', 'bible_study', 'Sabbath School', 'https://ssnet.org/lessons/', 'beginner', 'General Conference Sabbath School', 13),
  ('Fundamental Beliefs', 'The 28 fundamental beliefs of Seventh-day Adventists, with Bible references.', 'manual', 'Doctrine', 'https://www.adventist.org/beliefs/', 'intermediate', 'Seventh-day Adventist Church', 28),
  ('Ellen G. White Writings', 'Read Steps to Christ, The Desire of Ages and more online.', 'devotional', 'Devotional', 'https://egwwritings.org/', 'beginner', 'Ellen G. White Estate', NULL);

-- ───────── Promote your first admin ─────────
-- After signing in to the app once, run (with your email):
--   UPDATE public.users SET role = 'admin' WHERE email = 'you@example.com';
