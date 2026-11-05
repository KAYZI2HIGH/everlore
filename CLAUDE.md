# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev               # Next.js dev server (http://localhost:3000)
npm run build             # production build
npm run start             # serve production build
npm run lint              # eslint (flat config, next/core-web-vitals + next/typescript)
npx tsc --noEmit          # typecheck — there is no `typecheck` script
npm run db:generate       # drizzle-kit: write a new SQL migration into drizzle/ after editing lib/db/schema.ts
npm run db:migrate        # apply drizzle/ migrations to the Neon DB in DATABASE_URL
npm run db:import-sanity  # one-off, idempotent: copy legacy Sanity `user` docs into Postgres
npx tsx scripts/seed-academy-courses.ts  # overwrites the Sanity course catalogue (fixed ids) — writes to the live dataset
```

No test framework is configured. Sanity Studio is served in-app at `/studio`. Env vars are listed in `.env.example`.

**Local database.** With no `DATABASE_URL`, `lib/db/index.ts` opens an embedded Postgres (PGlite) in `./.data/pglite` and auto-applies `drizzle/` migrations. PGlite is single-process: stop `npm run dev` before running `db:import-sanity` locally. In production `DATABASE_URL` is required (it throws otherwise).

## Architecture

Everlore is a Next.js 16 (App Router, React 19) course platform with two datastores:
- **Sanity**: content only (courses, blog posts, job postings). Read via `lib/content.ts` (server-only) using the token client `lib/sanity.ts`. Courses are referenced elsewhere by their Sanity `_id`.
- **Postgres (Drizzle; Neon in prod)**: everything belonging to a person or a transaction. That means users and roles, enrollments, cart, wishlist, payments and contact messages, plus `site_settings` (admin-editable site copy such as the homepage stats, via `lib/site-settings.ts`). Schema is in `lib/db/schema.ts`. Legacy `user` docs in Sanity are no longer read.

**Server actions, not API routes.** Client components call `"use server"` functions in `lib/actions/*`:
- `account.actions.ts`: cart, wishlist, enrollments, profile
- `checkout.actions.ts`: Paystack
- `contact.actions.ts`
- `admin.actions.ts`
- `auth.actions.ts`
- `sanity.actions.ts`: thin public content wrappers for client pages

Server components import `lib/content.ts`, `lib/admin.ts` and `lib/db/users.ts` directly. The only API route is NextAuth's. Every action that touches user data calls `requireUser()` / `requireAdmin()` from `lib/session.ts`, which re-reads the user row (and its role) from the DB. Never trust a client-supplied user id, email, price or course list.

**Paid content.** `lib/content.ts` deliberately omits `videoUrl` from course queries; only `fetchCourseVideoUrl()` returns it. Call that only after `isEnrolled()` (see `app/academy/courses/[slug]/page.tsx`).

**Routes**
- `app/page.tsx`: marketing home, composed from `components/home/*`. It shares `components/site/site-header.tsx` and `site-footer.tsx` with every public section.
- `app/(marketing)/`: about, services, contact, privacy, terms.
- `app/blog/` and `app/careers/` (Sanity posts and job postings, fetched through `lib/blog.ts`). `/hiring` redirects to `/careers`.
- `app/academy/`: `/academy` is the public catalog (`/academy/courses` redirects there). `/academy/courses/[slug]` is a public server-rendered course page. `cart`, `learning` and `wishlist` require sign-in.
- `app/admin/`: admin dashboard (overview, courses, students, payments, messages, site settings). The layout redirects non-admins. Read models live in `lib/admin.ts`.
- `app/(auth)/`: sign-in and sign-up. `app/studio/[[...tool]]/`: embedded Sanity Studio.

**Auth.** Auth.js v5 with JWT sessions, Google + Credentials (bcrypt against `users.password_hash`).
- `auth.config.ts` is the edge-safe shared config, used by `proxy.ts` (Next 16's renamed middleware). `auth.ts` is the full instance with providers and DB callbacks. `lib/auth.ts` only re-exports `@/auth`.
- The JWT carries our Postgres user id and `role`. Emails in `ADMIN_EMAILS` are promoted to admin on sign-in, and a role change needs a fresh sign-in to reach the token.
- `proxy.ts` guards `/academy/{cart,learning,wishlist}`, `/profile` and `/admin`, appending `?callbackUrl=`.
- `signInAction` / `signUpAction` return `{ redirectTo }` and the client does `window.location.assign`. A full reload is required so `SessionProvider` sees the new session; a server-side `redirect()` leaves the header showing "Sign in".

**Payments.**
- `startCheckout()` prices the user's cart server-side from Sanity and inserts a `pending` row in `payments` with our own reference.
- `hooks/usePaystack.ts` opens Paystack inline with exactly that reference and amount.
- `completeCheckout(reference)` verifies with Paystack. It checks status, amount ≥ expected, currency and ownership, then marks the payment successful, inserts enrollments and clears those cart items in one transaction. It's idempotent.
- Amounts are in kobo. Currency is `site.currency` (NGN) from `lib/config.ts`.
- There's no webhook yet, so a buyer who closes the tab mid-verify stays `pending`.

**Client data fetching.** React Query via `providers/root-providers.tsx` (ThemeProvider → SessionProvider → QueryProvider → Toaster). Query keys: `["cart"]` (`hooks/useCart.ts`), `["wishlist"]` (`hooks/useWishlist.ts`), `["account"]` (`hooks/useAccount.ts`) and `["learning"]`. `useCourseActions()` wraps cart/wishlist with sign-in redirects and toasts for course cards.

**UI.** shadcn/ui in `components/ui/`, Tailwind v4 tokens in `app/globals.css` (navy `primary`, `brand` blue, `gold` accent, `ink` dark sections, `.dark` overrides). Use semantic classes only so dark mode works. Use `text-gold-ink` for gold text on light backgrounds (`text-gold` only on dark bands). Utility: `container-page`. Fonts: Poppins (`font-display`, all headings) and Plus Jakarta Sans (body). Logo: `components/site/logo.tsx` (images in `public/brand/`). Course categories are defined once in `lib/config.ts` and mirrored in `sanity/schemaTypes/course.ts`. Photos are self-hosted in `public/images/` (Unsplash licence). Remote images are allowed only from `cdn.sanity.io` and `api.dicebear.com` (`next.config.ts`).

## Gotchas

- Sanity schemas: edit `sanity/schemaTypes/` (wired into `sanity.config.ts`). The `user` schema there is legacy.
- `sanity/lib/client.ts` and `sanity/lib/live.ts` are unused; use `@/lib/sanity`.
- `AUTH_IMPLEMENTATION.md` and `AUTH_SETUP.md` predate the Postgres move. Trust the code.
- Pre-existing lint errors remain in `sanity/schemaTypes/*`, `components/ui/{input,textarea}.tsx` and `types/paystack-inline.d.ts`.
- Local PGlite migrates only when the dev server starts: restart `npm run dev` after `db:generate`.
