# PCM Testing Guide

## Development Server
- **Frontend:** Running at http://localhost:3001
- **Backend:** Requires Supabase configuration

## Authentication Testing

### Current Status
The application is running with `FRONTEND_ONLY = false`, which means:
- Authentication is enabled
- Backend calls are active
- Requires Supabase credentials to work properly

### Dummy Login Credentials (For Testing)

Since this uses Supabase, you need to set up your Supabase project first:

1. **Create a Supabase Project:**
   - Go to https://supabase.com
   - Create a new project
   - Get your project URL and anon key

2. **Configure Environment Variables:**
   Create a `.env.local` file in the project root:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your-project-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```

3. **Run Database Migrations:**
   ```bash
   supabase db push
   ```

### Test Users (After Supabase Setup)

Once Supabase is configured, you can create test users:

**Member Account:**
- Email: `member@test.com`
- Password: `test123456`
- Role: Student

**Leader Account:**
- Email: `leader@test.com`
- Password: `test123456`
- Role: Leader

**Admin Account:**
- Email: `admin@test.com`
- Password: `test123456`
- Role: Admin

## Testing Authentication Flow

### Member Login
1. Go to http://localhost:3001/login
2. Click "Member Login" tab
3. Enter member credentials
4. Should redirect to `/member-dashboard`

### Leader Login
1. Go to http://localhost:3001/login
2. Click "Leader Login" tab
3. Enter leader credentials
4. Should redirect to `/band-admin`

### Sign Up (Member)
1. Go to http://localhost:3001/login
2. Click "Don't have an account? Sign up"
3. Enter name, email, password
4. Account created with student role
5. Redirects to member dashboard after verification

### Sign Up (Leader)
1. Go to http://localhost:3001/login
2. Click "Don't have an account? Sign up"
3. Enter name, email, password
4. Account created with leader role
5. Redirects to band admin dashboard after verification

## Dashboard Testing

### Member Dashboard (`/member-dashboard`)
- View upcoming events
- Join bands
- Bible study information
- Prayer requests
- Recent activity

### Leader Dashboard (`/band-admin`)
- Select band to manage
- Create announcements
- Create events
- Update band details
- Manage members

### Admin Dashboard (`/admin`)
- Full site statistics
- Quick actions
- System status
- Manage all content

## Known Issues

1. **Supabase Required:** Authentication requires Supabase credentials in `.env.local`
2. **Frontend-Only Mode:** Can be toggled in `lib/config.ts` if Supabase is not available
3. **Email Verification:** New users may need to verify email before accessing dashboard

## Next Steps

1. Configure Supabase credentials in `.env.local`
2. Run database migrations
3. Create test users in Supabase Auth
4. Test login flows
5. Test dashboard functionality
