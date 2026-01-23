# Auth.js + Sanity Integration Setup Guide

## What's Been Configured

### ✅ Authentication

- **Auth.js (NextAuth v5)** - Server-side authentication with JWT sessions
- **Providers**: Google OAuth + Email/Password Credentials
- **Password Hashing**: bcryptjs for secure password storage
- **Session Strategy**: JWT with 30-day expiration

### ✅ Database

- **Sanity** - User profiles, enrollments, cart, wishlist
- **User Schema**: Created in `/schemaTypes/user.ts`

### ✅ Data Fetching

- **Server Actions** - Auth and Sanity mutations (no API routes needed)
- **React Query** - Client-side data fetching and caching
- **Custom Hooks** - `useCurrentUser()`, `useCart()`, `useWishlist()`, `useEnrollment()`

### ✅ UI Components Updated

- `components/sign-in.tsx` - Email/password + Google login
- `components/sign-up.tsx` - User registration with validation
- Error handling and loading states added
- All styling and design preserved

---

## Setup Steps

### 1. Generate NextAuth Secret

```bash
openssl rand -base64 32
```

Copy the output and add to `.env.local` as `NEXTAUTH_SECRET`

### 2. Setup Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create OAuth 2.0 credentials (Web application)
3. Add authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google`
   - `https://yourdomain.com/api/auth/callback/google` (production)
4. Copy Client ID and Secret to `.env.local`

### 3. Setup Sanity

1. Get your Sanity Project ID from your dashboard
2. Create an API token with these permissions:
   - `Read`
   - `Write`
   - `Deploy`
3. Update `.env.local` with:
   - `NEXT_PUBLIC_SANITY_PROJECT_ID`
   - `NEXT_PUBLIC_SANITY_DATASET`
   - `SANITY_API_TOKEN`

### 4. Update Sanity Schema

1. Go to your Sanity Studio
2. Add the user schema from `/schemaTypes/user.ts` to your schemas
3. Publish the schema

### 5. Environment Variables

Complete `.env.local`:

```
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-generated-secret
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
NEXT_PUBLIC_SANITY_PROJECT_ID=your-sanity-project-id
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2024-01-01
SANITY_API_TOKEN=your-sanity-api-token
```

### 6. Run the App

```bash
npm run dev
```

---

## File Structure

```
lib/
├── auth.ts                          # Auth.js config
├── actions/
│   ├── auth.actions.ts             # Sign in/up server actions
│   └── sanity.actions.ts           # Sanity mutations & queries
└── sanity.ts                        # Sanity client (existing)

hooks/
└── use-sanity.ts                   # React Query hooks for Sanity

providers/
└── query-provider.tsx              # React Query provider

app/
├── api/auth/[...nextauth]/
│   └── route.ts                    # NextAuth route handler
├── (auth)/
│   ├── sign-in/page.tsx           # Updated with server actions
│   └── sign-up/page.tsx           # Updated with server actions
└── layout.tsx                      # Updated with providers

schemaTypes/
└── user.ts                         # Sanity user schema

.env.local                          # Environment variables
```

---

## How It Works

### Sign Up Flow

1. User fills form → `sign-up` component
2. Form submits → `signUpAction()` (server action)
3. Server validates & hashes password
4. Creates user in Sanity
5. Auto-signs in with credentials provider
6. Redirects to `/academy/courses`

### Sign In Flow

1. User enters email/password → `sign-in` component
2. Form submits → `signInAction()` (server action)
3. Server validates against Sanity
4. Credentials provider authenticates
5. JWT session created
6. Redirects to `/academy/courses`

### Google OAuth Flow

1. User clicks "Continue with Google"
2. Redirected to Google consent screen
3. Google redirects back with auth code
4. Auth.js exchanges code for user info
5. `signIn` callback checks if user exists in Sanity
6. If not, creates user automatically
7. Session established and redirected

### Cart/Wishlist Operations

1. Component calls React Query mutation hook
2. Hook invokes server action (e.g., `addToCart()`)
3. Server action validates user and updates Sanity
4. React Query invalidates cache
5. `useCurrentUser()` refetches updated data
6. Component rerenders with new data

---

## Usage Examples

### Get Current User

```tsx
"use client";
import { useCurrentUser } from "@/hooks/use-sanity";

export function UserProfile() {
  const { data: user, isLoading } = useCurrentUser();

  return <div>{user?.name}</div>;
}
```

### Add to Cart

```tsx
"use client";
import { useCart } from "@/hooks/use-sanity";

export function AddToCartButton({ courseId }: { courseId: string }) {
  const { addToCart } = useCart();

  return (
    <button onClick={() => addToCart.mutate(courseId)}>
      {addToCart.isPending ? "Adding..." : "Add to Cart"}
    </button>
  );
}
```

### Add to Wishlist

```tsx
"use client";
import { useWishlist } from "@/hooks/use-sanity";

export function WishlistButton({ courseId }: { courseId: string }) {
  const { addToWishlist } = useWishlist();

  const handleClick = () => {
    addToWishlist.mutate(courseId, {
      onSuccess: () => {
        // Show success toast
      },
    });
  };

  return <button onClick={handleClick}>Add to Wishlist</button>;
}
```

---

## Protected Routes

### Protect an Academy Page

```tsx
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function ProtectedPage() {
  const session = await auth();

  if (!session) {
    redirect("/sign-in");
  }

  return <div>Protected content for {session.user.name}</div>;
}
```

---

## Key Features

✅ **Secure**: Password hashing, JWT tokens, CSRF protection  
✅ **Type-safe**: Full TypeScript support  
✅ **Scalable**: Server actions + React Query pattern  
✅ **Developer-friendly**: Zero-config OAuth  
✅ **Database-backed**: All user data in Sanity  
✅ **No API routes needed**: Clean server action architecture

---

## Next Steps

1. Deploy to production (Vercel recommended)
2. Setup password reset flow
3. Add email verification
4. Implement social links (LinkedIn, GitHub)
5. Add admin dashboard for user management

---

## Support

For Auth.js docs: https://authjs.dev  
For Sanity docs: https://www.sanity.io/docs  
For React Query docs: https://tanstack.com/query
