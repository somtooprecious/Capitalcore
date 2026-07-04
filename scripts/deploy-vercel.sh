# Quick Vercel deploy (after `npx vercel login`)
npm run build
npx vercel link --yes
npx vercel env pull .env.vercel.local
npx vercel --prod --yes
