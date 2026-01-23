"use client";
import React, { useState } from "react";
import Image from "next/image";
import { Eye, EyeOff } from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Logo } from "./header";
import Link from "next/link";
import { signInAction, signInWithGoogle } from "@/lib/actions/auth.actions";
import { useRouter } from "next/navigation";

// --- HELPER COMPONENTS (ICONS) ---

const GoogleIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5"
    viewBox="0 0 48 48"
  >
    <path
      fill="#FFC107"
      d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s12-5.373 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-2.641-.21-5.236-.611-7.743z"
    />
    <path
      fill="#FF3D00"
      d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z"
    />
    <path
      fill="#4CAF50"
      d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.211 35.091 26.715 36 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"
    />
    <path
      fill="#1976D2"
      d="M43.611 20.083H42V20H24v8h11.303c-.792 2.237-2.231 4.166-4.087 5.571l6.19 5.238C42.022 35.026 44 30.038 44 24c0-2.641-.21-5.236-.611-7.743z"
    />
  </svg>
);

// --- TYPE DEFINITIONS ---

interface SignInPageProps {
  title?: React.ReactNode;
  description?: React.ReactNode;
  heroImageSrc?: string;
}

// --- SUB-COMPONENTS ---

const GlassInputWrapper = ({ children }: { children: React.ReactNode }) => (
  <div className="rounded-2xl border border-border bg-foreground/5 backdrop-blur-sm transition-colors focus-within:border-violet-400/70 focus-within:bg-violet-500/10">
    {children}
  </div>
);

// --- MAIN COMPONENT ---

export const SignIn: React.FC<SignInPageProps> = ({
  description = "Continue your learning journey and unlock access to expert-led courses, live mentorship, and unlimited resources",
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const formData = new FormData(e.currentTarget);
      const result = await signInAction(formData);

      console.log("Sign in result:", result);

      if (result && result.error) {
        setError(result.error);
        setIsLoading(false);
        return;
      }

      // If we get here without error, the redirect should happen
      // But just in case, wait a moment
      await new Promise((resolve) => setTimeout(resolve, 500));
    } catch (err: any) {
      console.log("Sign in error:", err);
      // Handle redirect errors (which are expected and should be ignored)
      if (err?.message?.includes("NEXT_REDIRECT")) {
        return; // This is expected, let the redirect happen
      }
      setError(err?.message || "An unexpected error occurred");
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      await signInWithGoogle();
    } catch (err) {
      setError("Failed to sign in with Google");
      setIsLoading(false);
    }
  };

  const handleResetPassword = () => {
    // TODO: Implement password reset
    alert("Password reset feature coming soon!");
  };

  return (
    <section className="flex-1 flex items-center justify-center p-8">
      <div className="w-full max-w-md">
        <div className="flex flex-col gap-6">
          <Link
            href={"/"}
            className="h-10 overflow-hidden flex items-center -ml-14"
          >
            <Logo />
          </Link>

          <p className="animate-element animate-delay-200 text-muted-foreground">
            {description}
          </p>

          {error && (
            <div className="animate-element animate-delay-200 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
              {error}
            </div>
          )}

          <form
            className="space-y-3"
            onSubmit={handleSignIn}
          >
            <div className="animate-element animate-delay-300">
              <label className="text-sm font-medium text-muted-foreground">
                Email Address
              </label>
              <GlassInputWrapper>
                <Input
                  name="email"
                  type="email"
                  placeholder="Enter your email address"
                />
              </GlassInputWrapper>
            </div>

            <div className="animate-element animate-delay-400">
              <label className="text-sm font-medium text-muted-foreground">
                Password
              </label>
              <GlassInputWrapper>
                <div className="relative">
                  <Input
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-3 flex items-center"
                  >
                    {showPassword ?
                      <EyeOff className="w-5 h-5 text-muted-foreground hover:text-foreground transition-colors" />
                    : <Eye className="w-5 h-5 text-muted-foreground hover:text-foreground transition-colors" />
                    }
                  </button>
                </div>
              </GlassInputWrapper>
            </div>

            <div className="animate-element animate-delay-500 flex items-center justify-between text-sm">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="rememberMe"
                  className="custom-checkbox"
                />
                <span className="text-foreground/90">Keep me signed in</span>
              </label>
              <button
                type="button"
                onClick={handleResetPassword}
                className="hover:underline text-violet-400 transition-colors"
              >
                Reset password
              </button>
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          <div className="animate-element animate-delay-700 relative flex items-center justify-center">
            <span className="w-full border-t border-border"></span>
            <span className="px-4 text-sm text-muted-foreground bg-background absolute">
              Or continue with
            </span>
          </div>

          <Button
            variant={"outline"}
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            className="gap-3"
          >
            <GoogleIcon />
            Continue with Google
          </Button>

          <p className="animate-element animate-delay-900 text-center text-sm text-muted-foreground">
            New to our platform?{" "}
            <a
              href="/sign-up"
              className="text-violet-400 hover:underline transition-colors"
            >
              Create Account
            </a>
          </p>
        </div>
      </div>
    </section>
  );
};
