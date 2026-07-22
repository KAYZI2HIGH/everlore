# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Next.js dev server (http://localhost:3000)
npm run build    # production build
npm run start    # serve production build
npm run lint     # eslint (flat config, next/core-web-vitals + next/typescript)
npx tsc --noEmit # typecheck — there is no `typecheck` script
```

No test framework is configured. `npm run seed` is defined in package.json but `scripts/seed-courses.js` does not exist — the script is broken.

Sanity Studio is served in-app at `/studio` (no separate studio process). `npx sanity <cmd>` works from the repo root via `sanity.cli.ts`.

Required env vars in `.env.local` (see `AUTH_SETUP.md`): `NEXTAUTH_URL`, `NEXTAUTH_SECRET`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET`, `NEXT_PUBLIC_SANITY_API_VERSION`, `SANITY_API_TOKEN`. Payments additionally need `NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY` and `PAYSTACK_SECRET_KEY` (not yet in the local template).

## Architecture

Everlore is a Next.js 16 (App Router, React 19) course-selling platform. Sanity is the only datastore — it holds both the CMS content (courses, blog posts, job postings) *and* the user records (credentials, cart, wishlist, enrollments). There is no separate database.

**The central pattern: server actions, not API routes.** `lib/actions/sanity.actions.ts` is the single data layer for the entire app — every GROQ read and every Sanity mutation lives there as a `"use server"` function. Client components import those functions directly and call them from React Query hooks or `useEffect`. The only API route is the NextAuth catch-all (`app/api/auth/[...nextauth]/route.ts`). When adding a data operation, add it to `sanity.actions.ts` rather than creating a route handler.

Because that file uses `lib/sanity.ts` (the token-bearing write client), all reads/writes are server-side and privileged; authorization is enforced per-action by calling `auth()` and matching `session.user.email` to the Sanity user document.

**Route groups**
- `app/(auth)/` — sign-in / sign-up
- `app/academy/` — authed product area (courses, course detail, cart, wishlist, learning); own navbar/footer layout
- `app/blog/`, `app/hiring/`, `app/page.tsx` — public marketing, composed from top-level `components/*` sections
- `app/studio/[[...tool]]/` — embedded Sanity Studio

**Auth.** Auth.js v5 (`next-auth@5 beta`) with JWT sessions, Google OAuth + a Credentials provider that bcrypt-compares against `user.passwordHash` in Sanity. The Google `signIn` callback auto-creates a Sanity user on first login. `middleware.ts` guards `/academy/*` and `/profile/*` (redirect to `/sign-in`) and bounces authed users off `/sign-in` and `/sign-up`. Sign-up/sign-in server actions live in `lib/actions/auth.actions.ts` and `redirect("/academy/courses")` on success — note they `throw` on `NEXT_REDIRECT`, which is expected control flow, so don't "fix" that by swallowing it.

**Payments.** `hooks/usePaystack.ts` lazy-imports `@paystack/inline-js` client-side and opens the inline modal. On `onSuccess` it calls `verifyPaystackPayment()` (server-side call to the Paystack verify endpoint with the secret key) and only then `enrollUserInCourses()`, which appends to `enrolledCourses` and clears the cart in one Sanity patch. Never enroll from the client callback without the server verify step.

**Client data fetching.** React Query is wired through `providers/root-providers.tsx` (SessionProvider → QueryProvider → Toaster) in the root layout. `hooks/useCart.ts` and `hooks/useWishlist.ts` are the ones actually used by pages; they own the `["cart"]` / `["wishlist"]` query keys with optimistic updates. Match those key names when invalidating.

**UI.** shadcn/ui (new-york style, neutral base, lucide icons) in `components/ui/`, Tailwind v4 via `@tailwindcss/postcss` with theme tokens defined in `app/globals.css` (`@theme inline` + CSS variables, `.dark` variant). Feature components live flat in `components/`; loading states in `components/skeletons/`. Remote images are restricted to `cdn.sanity.io` and `api.dicebear.com` in `next.config.ts` — add a `remotePatterns` entry before using any other host.

## Known duplication — pick the right file

The repo has several parallel copies from an earlier refactor. Editing the wrong one silently does nothing:

- **Sanity schemas:** `sanity/schemaTypes/` is live (wired into `sanity.config.ts`). Root `schemaTypes/` is dead and out of date — its `course` schema is missing `videoUrl`, `learningPoints`, `highlights`, and more. Edit `sanity/schemaTypes/`.
- **Auth instance:** root `auth.ts` and `lib/auth.ts` both call `NextAuth(...)` with near-identical config. `middleware.ts`, the route handler, and `auth.actions.ts` import `@/auth`; `sanity.actions.ts` imports `@/lib/auth`. Config changes must be applied to both or sessions will diverge.
- **Sanity clients:** `lib/sanity.ts` (token, used by all actions) vs `sanity/lib/client.ts` (CDN, no token, used only by `sanity/lib/live.ts`, which is itself unused). Use `@/lib/sanity` for anything in `lib/actions/`.
- **Cart/wishlist hooks:** `hooks/use-sanity.ts` (keys `["user","current"]`) is legacy; pages use `hooks/useCart.ts` / `hooks/useWishlist.ts`.

`AUTH_IMPLEMENTATION.md` and `AUTH_SETUP.md` describe the auth design but reference the pre-refactor layout (e.g. `lib/auth.ts` as the single auth entry, `schemaTypes/user.ts`); trust the code over those docs.
