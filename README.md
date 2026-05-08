# Shokher Bike Wala

Premium gaming-themed e-commerce site for bike accessories.
Built with **React + Vite + TailwindCSS + Framer Motion + Supabase**.

Live: https://www.shokherbikewala.com/

## Stack
- React 18 + TypeScript + Vite 5
- TailwindCSS with a custom gaming theme (Orbitron / Rajdhani)
- Framer Motion for animations
- Supabase for auth and persistence (with a localStorage fallback for demo mode)
- React Router 6, lucide-react icons

## Quick start

```bash
npm install
cp .env.example .env       # then fill in VITE_SUPABASE_ANON_KEY
npm run dev                # dev server at http://localhost:5173
npm run build              # production build
npm run lint               # eslint
```

## Supabase setup

This project is wired to the Supabase project
[`pfegrhsefyqqjzmbgurs`](https://supabase.com/dashboard/project/pfegrhsefyqqjzmbgurs).

1. Grab the **anon public** key from the dashboard:
   `Project Settings → API → Project API keys → anon public`.
2. Add it to your `.env` (or to your Vercel project's
   *Environment Variables*) as `VITE_SUPABASE_ANON_KEY`.
   `VITE_SUPABASE_URL` is optional — it defaults to the project above.
3. Run the migration in the Supabase SQL editor:
   [`supabase/migrations/0001_init.sql`](supabase/migrations/0001_init.sql).
   It creates the `products`, `categories`, `brand_settings`, `testimonials`
   and `inquiries` tables, plus row-level security policies that only allow
   admin emails to mutate data.

### Admin access

The following emails are recognised as admins (hard-coded in
[`src/context/AuthContext.tsx`](src/context/AuthContext.tsx) and mirrored
in the SQL migration's `is_admin()` helper):

- `hmsharif2002@gmail.com` ← primary
- `admin@shokherbikewala.com`

Sign up with one of these emails through `/auth`, confirm the email if
required, then visit `/admin/login` to enter the dashboard.

### Demo mode

If `VITE_SUPABASE_ANON_KEY` isn't set the app falls back to localStorage:

- Visit `/admin/login`, sign in as one of the admin emails above with
  password `admin` to enter the demo admin panel.
- Any non-admin email signs in as a regular shopper.

## Features
- Public storefront: hero, featured products, categories, testimonials, contact.
- Authenticated admin panel: products / categories / testimonials / hero / orders / brand settings.
- Real Supabase email-password and Google OAuth.
- Inquiry form persists locally and to Supabase, plus opens a pre-filled WhatsApp chat.
- Premium gaming UI: HUD overlay (corner brackets + scanlines), gaming
  cursor, glowing CTA buttons, animated RPM gauge in the hero, boot
  loader, racing stripes, neon borders, glitch text effect.

## Deployment
The repo includes [`vercel.json`](vercel.json) so client-side routes
resolve correctly. After connecting the repo to Vercel, set
`VITE_SUPABASE_ANON_KEY` in *Project Settings → Environment Variables*
and redeploy.

## Project structure
```
src/
  components/
    home/        # hero, featured products, categories, etc.
    layout/      # navbar, footer, floating WhatsApp, mobile nav
    ui/          # animations, particle bg, HUD overlay, RPM gauge, ...
  context/       # AuthContext, StoreContext
  lib/           # supabase client + db helpers
  pages/         # public pages
    admin/       # admin pages (gated by AdminGuard)
supabase/
  migrations/    # SQL migrations
```
