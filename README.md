# Restaurant Menu Template

Next.js App Router + Supabase + Cloudinary + Resend + next-intl (BG/EN).

## Setup

1. Copy `.env.example` → `.env.local` and fill values.
2. Run `supabase/schema.sql` in Supabase SQL Editor.
3. `npm install` && `npm run dev`

## Routes

| Path | Description |
|------|-------------|
| `/bg`, `/en` | Public menu + contact |
| `/admin/login` | Password gate (`PASSWORD` env) |
| `/admin/categories` | Category CRUD |
| `/admin/menu-items` | Menu item CRUD |

## Env

See `.env.example`. Public site uses anon key; admin uses `SUPABASE_SERVICE_ROLE_KEY`.
