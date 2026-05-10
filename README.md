# ✦ happy birthday, mimiru ✦

A dreamy, mahou-shoujo + axolotl themed one-page birthday scrapbook for **mimiru**. Fans can pin a digital note (with emoji + colour) or upload a hand-drawn doodle / photo, sign their name or stay anonymous, and watch wishes appear on the corkboard in real time.

Stack: **Next.js 14** · **Supabase** (Postgres + Storage, free tier) · **Tailwind** · **Framer Motion** · deploys to **Vercel** (free tier).

---

## 1. Set up Supabase (free, ~5 min)

1. Go to [supabase.com](https://supabase.com) → **New project**. Pick any name (`mimiru-birthday`), set a database password, region close to your audience.
2. Once provisioned, open the project → **SQL Editor** → paste the contents of [`supabase/schema.sql`](./supabase/schema.sql) and run it. This creates the `notes` table, RLS policies, and a public `notes` storage bucket.
3. (If the storage bucket wasn't auto-created): go to **Storage** → **New bucket** → name `notes`, **Public bucket** ✓.
4. Open **Project Settings → API**. Copy:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` key → `SUPABASE_SERVICE_ROLE_KEY` (keep this secret — never ship to the browser)

The free tier gives you 500 MB DB + 1 GB storage, way more than enough for ~500 notes.

## 2. Run locally

```bash
cp .env.example .env.local   # then fill in the 3 keys above
npm install
npm run dev
```

Open <http://localhost:3000>. Pin a test note. Refresh — it should appear on the board.

## 3. Deploy to Vercel (free, ~3 min)

1. Push this folder to a GitHub repo (private is fine).
2. Go to [vercel.com/new](https://vercel.com/new) → **Import** the repo.
3. Framework preset auto-detects **Next.js**. Under **Environment Variables**, add the same 3 keys from your `.env.local`.
4. Click **Deploy**. Done — share the `*.vercel.app` URL.

You can later add a custom domain in Vercel → Project → Settings → Domains.

## File map

```
app/
  page.tsx               single page composition
  layout.tsx             fonts + metadata
  globals.css            palette, grain, tape, pin, sparkles
  api/notes/route.ts     GET (list) + POST (create note / upload image)
components/
  Hero.tsx               headline, axolotl mascots, primary CTA
  Highlights.tsx         total / digital / hand-drawn / anon counters
  NoteBoard.tsx          masonry corkboard
  NoteCard.tsx           polaroid-style note with washi tape + pin
  AddNoteDialog.tsx      modal: digital ⇄ image, color picker, emoji, anon
  Decorations.tsx        SVG axolotl, sparkles, stars, hearts, wand
lib/
  supabase.ts            public + admin clients, BUCKET, publicUrlFor
  types.ts               Note shape + colour palette
supabase/
  schema.sql             one-shot migration
```

## Notes

- All inserts go through `/api/notes` using the service-role key on the server, so the public anon key only ever reads.
- Image uploads are limited to 6 MB and `png/jpg/webp/gif`.
- The corkboard refetches after each successful submit.
- ~500 wishes ≈ a few MB of DB rows + however much storage your fans use for photos. Well inside free tier.
