# The Haven — mobile app

Expo SDK 58 · Expo Router · Supabase. Setup, Google sign-in and the test checklist are in the [root README](../README.md).

```bash
cp .env.example .env   # add Supabase URL + publishable key
npm install
npx expo start
```

```text
src/app/          screens (file-based routes)
  (tabs)/         Home · Events · Bands · Merch · More
  admin/          leader & admin tools
  band-admin/     per-band management
src/components/   UI kit (ui.tsx), brand (symbol + wordmark)
src/lib/          Supabase client, auth (Google OAuth + PKCE), API, types
src/providers/    auth session + cart
src/data/         bundled content: bands fallback, merch catalogue, posters, photos
```
