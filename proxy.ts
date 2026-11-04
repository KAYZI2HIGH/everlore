import NextAuth from "next-auth";
import { NextResponse } from "next/server";
import { authConfig } from "@/auth.config";

// Next 16 "proxy" (formerly middleware). Uses only the edge-safe config; authoritative role checks happen again
// server-side (lib/session.ts) for every admin page and action.
const { auth } = NextAuth(authConfig);

const PROTECTED = ["/academy/cart", "/academy/learning", "/academy/wishlist", "/profile", "/admin"];

export default auth((req) => {
  const { pathname, search } = req.nextUrl;
  const session = req.auth;

  if (session && (pathname.startsWith("/sign-in") || pathname.startsWith("/sign-up"))) {
    return NextResponse.redirect(new URL("/academy", req.url));
  }

  if (!session && PROTECTED.some((p) => pathname.startsWith(p))) {
    const url = new URL("/sign-in", req.url);
    url.searchParams.set("callbackUrl", pathname + search);
    return NextResponse.redirect(url);
  }

  if (pathname.startsWith("/admin") && session?.user?.role !== "admin") {
    return NextResponse.redirect(new URL("/academy", req.url));
  }
});

export const config = {
  matcher: ["/sign-in", "/sign-up", "/academy/:path*", "/profile/:path*", "/admin/:path*"],
};
