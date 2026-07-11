# PCM Backend Implementation Plan
## Complete Step-by-Step Guide to Make Backend Fully Functional

---

## Overview
This plan details every step required to make the PCM (CBU SDA Public Campus Ministries) backend fully functional. The backend uses **Supabase** for database, authentication, and storage.

---

## Phase 1: Supabase Project Setup

### Step 1.1: Create Supabase Account
1. Go to https://supabase.com
2. Click "Start your project"
3. Sign up with GitHub or email
4. Verify your email address

### Step 1.2: Create New Project
1. Click "New Project"
2. Choose organization (or create one)
3. Project name: `pcm-ministry` (or your preferred name)
4. Database password: **Save this securely** - you'll need it
5. Region: Choose closest to your users (e.g., South Africa for Zambia)
6. Pricing plan: Free tier is sufficient for development
7. Click "Create new project"
8. Wait 1-2 minutes for project to be provisioned

### Step 1.3: Get Project Credentials
1. Once project is ready, go to **Project Settings** → **API**
2. Copy these credentials:
   - **Project URL** (looks like: `https://xxxxxxxxxxxx.supabase.co`)
   - **anon public key** (looks like: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`)
3. **Important:** Never share the `service_role` key - it bypasses RLS

---

## Phase 2: Environment Configuration

### Step 2.1: Create Environment Variables File
1. Create file: `/Users/lbs/Documents/Projects/pcm/.env.local`
2. Add the following content:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your-project-url-here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here

# Optional: For development
# NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

### Step 2.2: Verify Configuration
1. Check that `lib/config.ts` has `FRONTEND_ONLY = false`
2. Restart the development server to load environment variables:
   ```bash
   # Stop current server (Ctrl+C)
   npm run dev
   ```

---

## Phase 3: Database Schema Setup

### Step 3.1: Understand Required Tables
The application needs these tables:
- `users` - User profiles and roles
- `bands` - Ministry bands/committees
- `band_announcements` - Band announcements
- `band_events` - Band-specific events
- `posts` - Blog posts/news
- `events` - General events
- `prayer_requests` - Prayer requests
- `gallery_items` - Gallery photos/videos
- `resources` - Ministry resources
- `volunteers` - Volunteer applications
- `counseling_requests` - Counseling requests
- `donations` - Donation records
- `committees` - Committee memberships

### Step 3.2: Create Database Schema
You have two options:

**Option A: Use Supabase SQL Editor (Recommended for beginners)**
1. Go to Supabase Dashboard → **SQL Editor**
2. Create a new query
3. Paste the schema SQL (see Appendix A at end of document)
4. Click "Run"

**Option B: Use Supabase CLI (Recommended for production)**
1. Install Supabase CLI:
   ```bash
   npm install -g supabase
   ```
2. Login:
   ```bash
   supabase login
   ```
3. Initialize:
   ```bash
   cd /Users/lbs/Documents/Projects/pcm
   supabase init
   ```
4. Link to project:
   ```bash
   supabase link --project-ref your-project-id
   ```
5. Create migrations:
   ```bash
   supabase db diff --use-migra
   ```

### Step 3.3: Share Supabase Project Access (For Collaboration)

**Option A: Invite Team Members to Supabase Project**
1. Go to your Supabase project dashboard: https://supabase.com/dashboard
2. Click on your project
3. Go to **Settings** → **Team**
4. Click **Invite Member**
5. Enter their email and assign role:
   - **Owner**: Full access to everything
   - **Admin**: Can manage project settings and database
   - **Developer**: Can access database and API, but not billing
   - **Read-only**: Can view but not modify

**Option B: Provide Database Connection String**
For developers who need database access without full Supabase dashboard access:

1. Go to **Settings** → **Database**
2. Copy the **Connection string** (URI format)
3. Share this connection string with your developer
4. They can use it to:
   - Connect via SQL clients (TablePlus, DBeaver, pgAdmin)
   - Run migration scripts
   - Access database directly

**Connection String Format:**
```
postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
```

**Option C: Share SQL Scripts for Manual Setup**
If you want someone to set up tables via the Supabase dashboard:

1. Provide them with the SQL schema from Appendix A
2. Have them go to **SQL Editor** in Supabase dashboard
3. They can paste and run the SQL scripts to:
   - Create tables
   - Set up RLS policies
   - Create storage buckets
   - Insert seed data

**Option D: Use Supabase CLI with Project Reference**
For automated setup:

1. Share your **Project Reference ID** (found in project settings)
2. Developer runs:
   ```bash
   supabase link --project-ref [PROJECT-REF]
   ```
3. They can then push migrations:
   ```bash
   supabase db push
   ```

**Security Notes:**
- **Never share** your `service_role` key - it has full bypass of RLS
- Only share `anon` key for frontend use
- Use environment variables for all credentials
- Rotate keys if they're accidentally exposed

### Step 3.4: Enable Row Level Security (RLS)
After creating tables, enable RLS in SQL Editor:
```sql
-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE bands ENABLE ROW LEVEL SECURITY;
ALTER TABLE band_announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE band_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE prayer_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE volunteers ENABLE ROW LEVEL SECURITY;
ALTER TABLE counseling_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE donations ENABLE ROW LEVEL SECURITY;
ALTER TABLE committees ENABLE ROW LEVEL SECURITY;
```

---

## Phase 4: Authentication Configuration

### Step 4.1: Configure Supabase Auth
1. Go to **Authentication** → **Providers**
2. Enable **Email** provider (should be enabled by default)
3. Configure email settings:
   - **Confirm email:** Enable for production, disable for testing
   - **Secure email change:** Enable
   - **Double opt-in:** Enable for production

### Step 4.2: Set Up Email Templates
1. Go to **Authentication** → **Email Templates**
2. Customize these templates:
   - **Confirm signup** - Email verification
   - **Reset password** - Password recovery
   - **Email change** - Email change confirmation

### Step 4.3: Create RLS Policies for Authentication
Run in SQL Editor:

```sql
-- Allow public to read profiles (for public pages)
CREATE POLICY "Public profiles are viewable by everyone"
  ON users FOR SELECT
  TO public
  USING (true);

-- Allow users to update their own profile
CREATE POLICY "Users can update own profile"
  ON users FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- Allow users to insert their own profile
CREATE POLICY "Users can insert own profile"
  ON users FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);
```

---

## Phase 5: Storage Configuration

### Step 5.1: Create Storage Buckets
1. Go to **Storage** → **Buckets**
2. Create these buckets:
   - `band-images` - For band hero images
   - `event-images` - For event images
   - `gallery-images` - For gallery photos
   - `profile-images` - For user avatars
   - `documents` - For PDFs and other documents

### Step 5.2: Configure Bucket Policies
For each bucket, create policies:

```sql
-- Allow public read access to band images
CREATE POLICY "Public band images are viewable"
  ON storage.objects FOR SELECT
  TO public
  USING (bucket_id = 'band-images');

-- Allow authenticated users to upload to band images
CREATE POLICY "Authenticated users can upload band images"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'band-images');

-- Allow authenticated users to update their own uploads
CREATE POLICY "Users can update own uploads"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (auth.uid()::text = (storage.foldername(name))[1]);
```

---

## Phase 6: RLS Policies for Data Tables

### Step 6.1: Bands Table Policies
```sql
-- Public can read bands
CREATE POLICY "Bands are viewable by everyone"
  ON bands FOR SELECT
  TO public
  USING (true);

-- Band leaders can update their band
CREATE POLICY "Band leaders can update their band"
  ON bands FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM band_leaders
      WHERE band_id = bands.id AND user_id = auth.uid()
    )
  );
```

### Step 6.2: Posts Table Policies
```sql
-- Public can read published posts
CREATE POLICY "Published posts are viewable by everyone"
  ON posts FOR SELECT
  TO public
  USING (published_at <= NOW());

-- Authors can update their own posts
CREATE POLICY "Authors can update own posts"
  ON posts FOR UPDATE
  TO authenticated
  USING (author_id = auth.uid());

-- Authors can create posts
CREATE POLICY "Authors can create posts"
  ON posts FOR INSERT
  TO authenticated
  WITH CHECK (author_id = auth.uid());
```

### Step 6.3: Events Table Policies
```sql
-- Public can read events
CREATE POLICY "Events are viewable by everyone"
  ON events FOR SELECT
  TO public
  USING (true);

-- Event creators can update their events
CREATE POLICY "Event creators can update events"
  ON events FOR UPDATE
  TO authenticated
  USING (created_by = auth.uid());

-- Event creators can create events
CREATE POLICY "Event creators can create events"
  ON events FOR INSERT
  TO authenticated
  WITH CHECK (created_by = auth.uid());
```

### Step 6.4: Prayer Requests Policies
```sql
-- Public can submit prayer requests
CREATE POLICY "Anyone can submit prayer requests"
  ON prayer_requests FOR INSERT
  TO public
  WITH CHECK (true);

-- Admins can read all requests
CREATE POLICY "Admins can read all prayer requests"
  ON prayer_requests FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );
```

---

## Phase 7: Backend API Testing

### Step 7.1: Test Database Connection
Create test file: `lib/test-connection.ts`:

```typescript
import { supabase } from './supabase'

export async function testConnection() {
  try {
    const { data, error } = await supabase.from('bands').select('*').limit(1)
    if (error) throw error
    console.log('Database connection successful:', data)
    return true
  } catch (error) {
    console.error('Database connection failed:', error)
    return false
  }
}
```

### Step 7.2: Test API Endpoints
Use these curl commands or Postman:

**Test Bands API:**
```bash
curl http://localhost:3001/api/bands
```

**Test Posts API:**
```bash
curl http://localhost:3001/api/posts
```

**Test Events API:**
```bash
curl http://localhost:3001/api/events
```

### Step 7.3: Test Authentication Endpoints
**Test Login:**
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123"}'
```

**Test Register:**
```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"new@example.com","password":"test123","name":"Test User","role":"student"}'
```

---

## Phase 8: Frontend Integration

### Step 8.1: Verify Supabase Client
Check `lib/supabase.ts`:

```typescript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

### Step 8.2: Test Auth Provider
1. Go to http://localhost:3001/login
2. Try to register a new account
3. Check if email verification is sent (if enabled)
4. Verify email if required
5. Try to login
6. Check if you're redirected to the correct dashboard

### Step 8.3: Test Dashboard Access
1. Login as member → should go to `/member-dashboard`
2. Login as leader → should go to `/band-admin`
3. Check if data loads correctly

---

## Phase 9: Data Seeding

### Step 9.1: Create Seed Data Script
Create `lib/seed-data.ts`:

```typescript
import { supabase } from './supabase'

export async function seedDatabase() {
  // Create bands
  const bands = [
    {
      name: 'Bible Study Band',
      slug: 'bible-study-band',
      description: 'Weekly Bible study and discussion groups',
      meeting_time: 'Wednesdays 7:00 PM',
      meeting_location: 'Room 201'
    },
    // Add more bands...
  ]

  for (const band of bands) {
    await supabase.from('bands').insert(band)
  }

  console.log('Database seeded successfully')
}
```

### Step 9.2: Run Seed Script
Create a Next.js API route `app/api/seed/route.ts`:

```typescript
import { NextResponse } from 'next/server'
import { seedDatabase } from '@/lib/seed-data'

export async function GET() {
  await seedDatabase()
  return NextResponse.json({ success: true })
}
```

Visit: `http://localhost:3001/api/seed`

---

## Phase 10: Production Deployment

### Step 10.1: Environment Variables for Production
Add these to your hosting platform (Vercel, Netlify, etc.):
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### Step 10.2: Database Backups
1. Go to **Database** → **Backups**
2. Enable automated backups
3. Set retention period (7 days for free tier)

### Step 10.3: Monitoring
1. Enable **Logs** in Supabase
2. Set up **Alerts** for:
   - High CPU usage
   - Failed requests
   - Database connection errors

---

## Appendix A: Complete Database Schema

```sql
-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  role TEXT DEFAULT 'student' CHECK (role IN ('student', 'leader', 'admin')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Bands table
CREATE TABLE bands (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  mission TEXT,
  responsibilities TEXT,
  how_to_join TEXT,
  important_info TEXT,
  meeting_time TEXT,
  meeting_location TEXT,
  leader_name TEXT,
  leader_position TEXT,
  leader_tenure TEXT,
  leader_email TEXT,
  leader_phone TEXT,
  leader_image_url TEXT,
  hero_image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Band announcements
CREATE TABLE band_announcements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  committee_id UUID REFERENCES bands(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  type TEXT DEFAULT 'announcement' CHECK (type IN ('announcement', 'meeting', 'update')),
  image_url TEXT,
  author_id UUID REFERENCES users(id) ON DELETE SET NULL,
  published_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Band events
CREATE TABLE band_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  committee_id UUID REFERENCES bands(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  date TIMESTAMPTZ NOT NULL,
  end_date TIMESTAMPTZ,
  location TEXT,
  category TEXT,
  created_by UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Posts
CREATE TABLE posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,
  category TEXT CHECK (category: IN ('testimony', 'news', 'announcement', 'ministry')),
  image_url TEXT,
  author_id UUID REFERENCES users(id) ON DELETE SET NULL,
  published_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Events
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  date TIMESTAMPTZ NOT NULL,
  end_date TIMESTAMPTZ,
  location TEXT,
  max_attendees INTEGER,
  category TEXT CHECK (category IN ('worship', 'outreach', 'study', 'fellowship', 'special')),
  image_url TEXT,
  committee_id UUID REFERENCES bands(id) ON DELETE SET NULL,
  created_by UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Prayer requests
CREATE TABLE prayer_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  request TEXT NOT NULL,
  is_private BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Gallery items
CREATE TABLE gallery_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT NOT NULL,
  category TEXT CHECK (category IN ('worship', 'events', 'outreach', 'fellowship', 'baptisms')),
  event_date DATE,
  location TEXT,
  attendees INTEGER,
  uploaded_by UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Resources
CREATE TABLE resources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  type TEXT CHECK (type IN ('document', 'video', 'audio', 'link')),
  url TEXT NOT NULL,
  category TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Volunteers
CREATE TABLE volunteers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  committee_id UUID REFERENCES bands(id) ON DELETE SET NULL,
  role TEXT NOT NULL,
  skills TEXT[],
  availability TEXT,
  commitment_hours INTEGER,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Counseling requests
CREATE TABLE counseling_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  service_type TEXT CHECK (service_type IN ('personal', 'relationship', 'academic', 'crisis')),
  preferred_counselor TEXT,
  message TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'scheduled', 'completed', 'cancelled')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Donations
CREATE TABLE donations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  amount DECIMAL(10,2) NOT NULL,
  purpose TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Committees
CREATE TABLE committees (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  committee_id UUID REFERENCES bands(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'member' CHECK (role IN ('member', 'leader', 'coordinator')),
  joined_at TIMESTAMPTZ DEFAULT NOW()
);

-- Band leaders mapping
CREATE TABLE band_leaders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  band_id UUID REFERENCES bands(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'leader',
  assigned_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_bands_slug ON bands(slug);
CREATE INDEX idx_posts_category ON posts(category);
CREATE INDEX idx_posts_published ON posts(published_at DESC);
CREATE INDEX idx_events_date ON events(date);
CREATE INDEX idx_band_announcements_committee ON band_announcements(committee_id);
CREATE INDEX idx_band_events_committee ON band_events(committee_id);
```

---

## Appendix B: Common Issues & Solutions

### Issue 1: "Database connection failed"
**Solution:**
- Check `.env.local` file exists
- Verify environment variables are correct
- Restart development server
- Check Supabase project is active

### Issue 2: "RLS policy violation"
**Solution:**
- Check RLS policies are created
- Verify user is authenticated
- Check policy conditions match your data

### Issue 3: "Storage upload failed"
**Solution:**
- Verify bucket exists
- Check bucket policies allow uploads
- Ensure file size is within limits (50MB for free tier)

### Issue 4: "Email verification not sending"
**Solution:**
- Check email templates are configured
- Verify SMTP settings in Supabase
- Check spam folder
- Disable email verification for testing

---

## Appendix C: Testing Checklist

- [ ] Supabase project created
- [ ] Environment variables configured
- [ ] Database schema created
- [ ] RLS policies enabled
- [ ] Storage buckets created
- [ ] Authentication configured
- [ ] Test user registration works
- [ ] Test user login works
- [ ] Test member dashboard loads
- [ ] Test leader dashboard loads
- [ ] Test API endpoints respond
- [ ] Test file uploads work
- [ ] Test data persistence

---

## Summary Timeline

**Phase 1-2:** Setup (30 minutes)
- Create Supabase account
- Create project
- Configure environment variables

**Phase 3-4:** Database & Auth (1 hour)
- Create database schema
- Enable RLS
- Configure authentication

**Phase 5-6:** Storage & Policies (45 minutes)
- Create storage buckets
- Set up RLS policies

**Phase 7-8:** Testing (1 hour)
- Test API endpoints
- Test authentication flow
- Verify frontend integration

**Phase 9:** Data Seeding (30 minutes)
- Create seed data
- Populate initial data

**Total Estimated Time:** 3.5 - 4 hours

---

## Next Steps After Implementation

1. **Monitor Usage:** Check Supabase dashboard for usage metrics
2. **Optimize Queries:** Add database indexes for frequently queried fields
3. **Set up Backups:** Enable automated database backups
4. **Configure Alerts:** Set up monitoring alerts for critical issues
5. **Scale Resources:** Upgrade to paid tier if needed for production

---

## Support Resources

- **Supabase Docs:** https://supabase.com/docs
- **Next.js Docs:** https://nextjs.org/docs
- **TypeScript Docs:** https://www.typescriptlang.org/docs
- **Project GitHub:** Check for issues and updates

---

**Last Updated:** July 11, 2026
