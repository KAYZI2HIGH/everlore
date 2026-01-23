import { auth } from "@/auth";
import { NextResponse } from "next/server";

export const middleware = auth((req) => {
  const { pathname } = req.nextUrl;
  const isAuthenticated = !!req.auth;

  // Redirect authenticated users away from auth pages
  if (
    isAuthenticated &&
    (pathname.startsWith("/sign-in") || pathname.startsWith("/sign-up"))
  ) {
    return NextResponse.redirect(new URL("/academy/courses", req.url));
  }

  // Redirect unauthenticated users away from protected pages
  if (
    !isAuthenticated &&
    (pathname.startsWith("/academy") || pathname.startsWith("/profile"))
  ) {
    return NextResponse.redirect(new URL("/sign-in", req.url));
  }
});

export const config = {
  matcher: ["/sign-in", "/sign-up", "/academy/:path*", "/profile/:path*"],
};
