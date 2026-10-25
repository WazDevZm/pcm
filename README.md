# The Haven

The mobile app and website for **The Haven**, a Christ-centred campus ministry of **The Copperbelt University SDA Public Campus Ministries (CBU SDA PCM)**.

**Live website:** https://pcm-pi.vercel.app (Vercel project `pcm`, deployed from this repo with `vercel deploy --prod`).

 The app is built with **Expo (React Native)** and the website with **Next.js**. Both use the **same Supabase project** for the database, storage and sign-in, so one account works in both places.

```text
mobile/      Expo app (iOS + Android)
app/ lib/    Next.js website (repo root)
supabase/    Database schema, migrations and seed data
brand-kit/   Text-only logo, monogram, app icon, splash, PCM shield, colours, fonts and posters
scripts/     admin/provision.mjs (database + test logins) and brand/build.mjs (all brand assets)
presentation/ Team intro deck (pre-redesign)
```

## What's in the app

| Area | Features |
|---|---|
| Home | Full-screen hero photo, quick links, posters, upcoming events, FAQ |
| Events | Upcoming events by category, details, RSVP/cancel (attendee count updates automatically), share |
| Bands | 5 ministry bands with mission, meeting times, leader, announcements, events; join or leave |
| Merch | Store with categories and search, product options, cart, checkout (pay on collection), order history |
| Care | Prayer requests (named or anonymous), confidential counseling intake, volunteer applications, giving pledges, contact form |
| Discover | News & testimonies, gallery, resources, magazines, programs, committees, shareable posters |
| Account | Sign in with Google or email; dashboard showing my events, bands, requests and orders; edit profile |
| Leaders | Admin dashboard with live counts; manage posts, events, prayer requests, counseling, volunteers, gallery uploads, resources, orders, messages, users and roles, band admins |
| Band admin | Announcements, events, band details and photo, real member list |

---

## 1. Set up Supabase (about 10 minutes)

1. Create a project at [supabase.com](https://supabase.com).
2. Open **SQL Editor → New query**, paste the whole of `supabase/setup.sql`, and click **Run**. It creates every table, security rule, trigger and the `media` storage bucket, and adds the nine bands and committees. It’s meant for a new, empty project.
   - `setup.sql` combines `schema.sql`, `migrations/002`–`004`, `seed-bands.sql` and `migrations/006`. If you’d rather run them one at a time, use that order.
   - Existing project (set up before 25 Oct 2026)? Run `supabase/migrations/006_leadership_and_publicity.sql` once, or `npm run provision`.
   - Optional: run `supabase/seed.sql` afterwards for sample posts and events to test with.
   - Ran `setup.sql` before 18 Oct 2026 and see *"infinite recursion detected in policy"*? Run `supabase/migrations/005_fix_policy_recursion.sql` once.
3. Go to **Project Settings → API** and copy the **Project URL** and the **publishable (anon) key**.

## 2. Turn on Google sign-in

1. In **Google Cloud Console → APIs & Services → Credentials**, create an **OAuth client ID** of type **Web application**.
   - Under **Authorized redirect URIs**, add `https://<your-project-ref>.supabase.co/auth/v1/callback`.
   - If asked, set up the OAuth consent screen first. Add yourself as a test user while the app is in "Testing".
2. In **Supabase → Authentication → Sign In / Providers → Google**, enable it and paste the **Client ID** and **Client Secret**.
3. In **Supabase → Authentication → URL Configuration → Redirect URLs**, add both of these:
   ```
   exp://**
   thehaven://**
   ```
   `exp://**` is for testing in Expo Go. `thehaven://**` is for installed builds. Also add your website, e.g. `http://localhost:3000/**` and `https://your-site.vercel.app/**`, and set **Site URL** to the website's address so email confirmation links open it. The website's password-reset page is `/auth/reset-password`, which the `/**` patterns already cover.

Sign-in opens Google in a secure browser sheet. The app then exchanges the returned code for a session using PKCE, so you don't need a native Google SDK and it works in Expo Go. Every new user gets a profile with the **student** role automatically.

## 3. Run the app

```bash
cd mobile
cp .env.example .env        # then paste your Supabase URL + key
npm install
npx expo start
```

Scan the QR code with **Expo Go** ([iOS](https://apps.apple.com/app/expo-go/id982107779) / [Android](https://play.google.com/store/apps/details?id=host.exp.exponent)). Your phone and computer need to be on the same Wi-Fi, or run `npx expo start --tunnel`.

**iOS Simulator:** install **Xcode** from the Mac App Store, open it once to finish setup, then press `i` in the `npx expo start` terminal (or run `npx expo start --ios`). Expo installs Expo Go in the simulator automatically. **Android emulator:** install Android Studio, create a device under *Device Manager*, then press `a`.

If there's no `.env`, the app still runs on built-in content (bands, merch, posters) and shows a notice wherever live data is needed.

## 4. Run the website

```bash
# in the repo root
cat > .env.local <<'ENV'
NEXT_PUBLIC_SUPABASE_URL=https://<your-project-ref>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<the same publishable key as the app>
ENV
npm install
npm run dev        # http://localhost:3000
```

When you deploy it (for example on Vercel), add the same two variables in the host's settings. Then put the site's address in `mobile/.env` as `EXPO_PUBLIC_WEB_URL` so **More → Website** appears in the app.

Never put the **secret** key (`sb_secret_…`) in either app. It bypasses all security rules.

## 5. Make yourself an admin

Sign in once in the app, then run this in the Supabase SQL Editor:

```sql
UPDATE public.users SET role = 'admin' WHERE email = 'you@example.com';
```

Pull to refresh or reopen the app. **More → Leadership → Admin dashboard** will appear. From there, admins can promote other users to **leader** or **admin** under *Users*. Only admins can change roles, and the database enforces this.

## 6. Roles, dashboards and test logins

| Who | How they're set up | Website dashboard |
|---|---|---|
| **Developer** | `role = admin`, `office = developer` | `/admin` plus **Developer** (system checks) |
| **PCM Chairperson / Vice Chairperson** | `role = admin`, `office = chairperson` / `vice_chairperson` | `/admin`: every queue, plus oversight of all bands and their heads |
| **Leaders** | `role = leader` | `/admin` (content, care queues, orders) |
| **Band / committee heads** | a `band_admins` row (assign under *Admin → Bands & committees*) | `/band-admin/<band>`: announcements, events, details, members |
| **Publicity Committee heads** | head of `publicity-committee` | also `/admin` with **website content only**: posts, events, gallery, resources (what the landing page and app show) |

To apply migration `006` and create pre-confirmed test logins for all of these (Welfare, Witnessing, Stu-MM, Creativity & Arts, Education, Catering and Publicity heads, plus Developer, Chairperson and Vice Chairperson), put a Supabase personal access token in `.env.admin.local` (git-ignored) and run:

```bash
npm run provision -- --site https://pcm-pi.vercel.app
```

It writes the emails and passwords to `CREDENTIALS.local.md` (git-ignored). Running it again issues new passwords. If `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` are also in `.env.admin.local`, it turns on Google sign-in and sets the redirect URLs too.

---

## Test checklist

- [ ] Sign in with Google, then sign out and back in. The session persists after closing the app.
- [ ] Sign up with email and password, then confirm the email.
- [ ] RSVP to an event: the count goes up. Cancel: it goes back down.
- [ ] Join a band, see it under *My dashboard*, then leave the band.
- [ ] Send an anonymous prayer request and a named one. As an admin, mark one answered.
- [ ] Submit a counseling request. As an admin, schedule it, then mark it completed.
- [ ] Apply to volunteer. As an admin, approve the application.
- [ ] Add merch to the cart and place an order. As an admin, move it through confirmed → ready → collected.
- [ ] As an admin, create a post with a photo. It shows in News.
- [ ] As an admin, create an event for a band. It shows on the band page.
- [ ] As an admin, upload a gallery photo.
- [ ] Assign a band admin. That user can post announcements from **Band admin**.
- [ ] Share a poster from **More → Posters**.

## Building installable test apps

```bash
cd mobile
npx eas-cli@latest build --profile preview --platform android   # APK you can sideload
npx eas-cli@latest build --profile preview --platform ios        # needs an Apple developer account
```

The first time you run this, EAS asks to link an Expo project. Build profiles are in `mobile/eas.json`. `.env` isn't uploaded to EAS, so add `EXPO_PUBLIC_SUPABASE_URL` and `EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY` as EAS environment variables (`npx eas-cli@latest env:create`) before building.

## Security model (row-level security)

- Students can read public content and manage only their own RSVPs, band memberships, requests and orders.
- Prayer and counseling requests are visible only to the person who sent them and to leaders.
- Leaders and admins manage content. Only admins change roles or delete messages.
- Publicity Committee heads manage posts, events, gallery and resources; band heads manage only their own band.
- Uploads go to the public `media` bucket. Leaders, Publicity heads and band heads can upload.

## Brand

See [`brand-kit/README.md`](brand-kit/README.md) for the text-only logo, colours (Haven Navy `#0f2d6e`, Lamp Gold `#d9a441`), typography (Fraunces) and posters. Regenerate every brand asset (kit, favicon, app icon, splash, posters for web and app) with `npm run brand`.
