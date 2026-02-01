# Supabase Setup Guide for CBU SDA Ministry Website

## 🚀 Quick Setup Instructions

### 1. Create Supabase Project
1. Go to [supabase.com](https://supabase.com) and create a free account
2. Click "New Project"
3. Choose your organization and enter project details:
   - **Name**: `cbu-sda-ministry`
   - **Database Password**: Generate a strong password (save it!)
   - **Region**: Choose closest to your users
4. Wait for project to be created (2-3 minutes)

### 2. Get Your Project Credentials
1. In your Supabase dashboard, go to **Settings** → **API**
2. Copy these values:
   - **Project URL** (looks like: `https://xxxxx.supabase.co`)
   - **Anon public key** (starts with `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`)

### 3. Configure Environment Variables
1. Create `.env.local` file in your project root:
```bash
cp .env.local.example .env.local
```

2. Edit `.env.local` and add your credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

### 4. Set Up Database Schema
1. In Supabase dashboard, go to **SQL Editor**
2. Copy the contents of `supabase/schema.sql`
3. Paste into SQL Editor and click **Run**
4. Wait for all tables to be created

### 5. Add Sample Data (Optional)
1. In SQL Editor, copy contents of `supabase/seed.sql`
2. Paste and click **Run**
3. This adds sample posts, events, committees, etc.

### 6. Configure Authentication
1. Go to **Authentication** → **Settings**
2. Under **Site URL**, add: `http://localhost:3000` (for development)
3. Under **Redirect URLs**, add: `http://localhost:3000/auth/callback`
4. Enable **Email confirmations** if desired

### 7. Set Up Storage (For Images)
1. Go to **Storage** and create a new bucket called `ministry-images`
2. Make it public by going to bucket settings
3. Set up policies for image uploads

## 🗄️ Database Structure

### Core Tables Created:
- **users** - User profiles (extends Supabase auth)
- **posts** - News, testimonies, blog posts
- **events** - Ministry events and activities
- **committees** - Ministry committees/bands
- **prayer_requests** - Prayer request submissions
- **gallery_items** - Photos and videos
- **resources** - Bible studies, sermons, materials
- **volunteers** - Volunteer applications
- **counseling_requests** - Counseling appointments
- **donations** - Financial contributions

### Key Features:
- ✅ **Row Level Security (RLS)** enabled on all tables
- ✅ **Real-time subscriptions** for live updates
- ✅ **Automatic timestamps** with triggers
- ✅ **User roles** (student, leader, admin)
- ✅ **File storage** for images/documents

## 🔐 Security & Permissions

### User Roles:
- **Student**: Can view content, submit requests, join events
- **Leader**: Can manage committees, events, moderate content
- **Admin**: Full access to all data and settings

### RLS Policies:
- Public content (posts, events) readable by everyone
- Personal data (prayer requests, counseling) only accessible by user/leaders
- Administrative functions restricted to leaders/admins

## 📱 Using the Database in Your App

### Example Usage:
```typescript
import { getPosts, getEvents, createPrayerRequest } from '@/lib/database'

// Get latest news and testimonies
const posts = await getPosts('testimony', 5)

// Get upcoming events
const events = await getEvents(undefined, true)

// Submit prayer request
await createPrayerRequest({
  request: "Please pray for my exams",
  requester_name: "John Doe",
  category: "academic",
  is_anonymous: false
})
```

## 🚀 Deployment Setup

### For Production:
1. Update `.env.local` with production URLs
2. In Supabase dashboard, add your production domain to:
   - **Site URL**: `https://yourdomain.com`
   - **Redirect URLs**: `https://yourdomain.com/auth/callback`

### Vercel Deployment:
1. Add environment variables in Vercel dashboard
2. Deploy your Next.js app
3. Your database is ready to use!

## 📊 Admin Dashboard

### Managing Content:
- Use Supabase dashboard **Table Editor** to manage data
- **Authentication** tab to manage users
- **Storage** tab to manage uploaded files
- **Logs** tab to monitor activity

### Common Tasks:
- Approve volunteer applications
- Moderate prayer requests
- Manage event registrations
- Update committee information

## 🔧 Troubleshooting

### Common Issues:
1. **RLS Errors**: Make sure user is authenticated
2. **Permission Denied**: Check user role and RLS policies
3. **Connection Issues**: Verify environment variables
4. **Schema Errors**: Run schema.sql again if tables missing

### Getting Help:
- Check Supabase [documentation](https://supabase.com/docs)
- Join Supabase [Discord community](https://discord.supabase.com)
- Review error logs in Supabase dashboard

## 🎉 You're Ready!

Your ministry website now has:
- ✅ User authentication and profiles
- ✅ Dynamic content management
- ✅ Event registration system
- ✅ Prayer request submissions
- ✅ Volunteer applications
- ✅ Gallery management
- ✅ Resource library
- ✅ Counseling requests
- ✅ Donation tracking

Start your development server and test the functionality!

```bash
npm run dev
```

Visit `http://localhost:3000` and start building your ministry community! 🙏