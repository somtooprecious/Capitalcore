# CapitalCore - Premium Trading & Investment Platform

Production-ready Next.js fintech starter with premium UI, authentication, trading widgets, payment integrations, and Prisma-backed data models.

## Stack

- Next.js App Router + TypeScript + Tailwind CSS
- Framer Motion animations
- NextAuth (Google, Facebook, credentials)
- PostgreSQL + Prisma
- Crypto deposits (BTC, USDT, ETH)
- Recharts dashboard charts
- Zustand global state

## Project Structure

- `app/` routes and API handlers
- `components/` reusable UI
- `features/` domain-specific modules
- `lib/` auth, prisma, utilities
- `hooks/`, `services/`, `store/`
- `prisma/` schema + seed data

## Environment Variables

Create `.env`:

```env
# From Supabase → Project Settings → Database
DATABASE_URL="postgresql://postgres.[ref]:[password]@....pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.[ref]:[password]@....pooler.supabase.com:5432/postgres"
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=replace-with-a-secure-secret
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
OWNER_EMAIL=owner@capitalcore.com
OWNER_PASSWORD=replace-with-secure-owner-password
CRYPTO_BTC_ADDRESS=your-btc-deposit-address
CRYPTO_USDT_ADDRESS=your-usdt-deposit-address
CRYPTO_ETH_ADDRESS=your-eth-deposit-address
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Run Locally

1. Create a free project at [supabase.com](https://supabase.com)
2. Copy **Connection strings** into `.env.local` (see `.env.example`)
3. `npm install`
4. `npm run db:push` (creates tables in Supabase)
5. `npm run db:seed`
6. `npm run dev`

After seeding, you can sign in with the demo account:

- Email: `demo@capitalcore.com`
- Password: `Password123!`

Owner admin (seed defaults):

- Email: `owner@capitalcore.com`
- Password: `OwnerPassword123!` (or set `OWNER_PASSWORD` in env before seeding)
- Admin panel: `/admin` (visible only to the owner account)

Auth routes: `/signin`, `/signup`. The protected dashboard lives at `/dashboard`.

### Google sign-in

1. Create OAuth credentials in [Google Cloud Console](https://console.cloud.google.com/apis/credentials).
2. Add redirect URI: `http://localhost:3000/api/auth/callback/google`
3. Set `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` in `.env.local`, then restart `npm run dev`.

## Deploy To Vercel

1. Push the repository to GitHub.
2. Import into [Vercel](https://vercel.com/).
3. Add all environment variables in project settings.
4. Set `DATABASE_URL` to your production Postgres instance.
5. Run migration after deploy: `npx prisma migrate deploy`.
