"use client";

import { useId, useState, useTransition } from "react";
import Link from "next/link";
import { AlertCircle, Eye, EyeOff, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signInAction, signInWithGoogle } from "@/lib/actions/auth.actions";
import { cn } from "@/lib/utils";

/* ---------- Shared auth building blocks (also used by sign-up) ---------- */

export const authInputClass =
  "h-12 rounded-xl border-border bg-card px-4 text-[15px] shadow-none focus-visible:ring-offset-0";

export function GoogleIcon() {
  return (
    <svg aria-hidden className="size-5" viewBox="0 0 48 48">
      <path
        fill="#FFC107"
        d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"
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
        d="M43.611 20.083H42V20H24v8h11.303c-.792 2.237-2.231 4.166-4.087 5.571l6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z"
      />
    </svg>
  );
}

export function PasswordInput({
  className,
  ...props
}: Omit<React.ComponentProps<typeof Input>, "type">) {
  const [visible, setVisible] = useState(false);
  return (
    <div className="relative">
      <Input {...props} type={visible ? "text" : "password"} className={cn(authInputClass, "pr-12", className)} />
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        aria-label={visible ? "Hide password" : "Show password"}
        aria-pressed={visible}
        className="absolute inset-y-0 right-1.5 my-auto grid size-9 place-items-center rounded-full text-muted-foreground transition hover:bg-muted hover:text-foreground"
      >
        {visible ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
      </button>
    </div>
  );
}

export function AuthError({ message }: { message: string | null }) {
  if (!message) return null;
  return (
    <div
      role="alert"
      className="flex items-start gap-2.5 rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive"
    >
      <AlertCircle className="mt-0.5 size-4 shrink-0" />
      <span>{message}</span>
    </div>
  );
}

export function AuthDivider({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-4 text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
      <span className="h-px flex-1 bg-border" />
      {label}
      <span className="h-px flex-1 bg-border" />
    </div>
  );
}

export function GoogleButton({
  callbackUrl,
  label,
  disabled,
  onError,
}: {
  callbackUrl?: string;
  label: string;
  disabled?: boolean;
  onError: (message: string) => void;
}) {
  const [pending, startTransition] = useTransition();
  return (
    <Button
      type="button"
      variant="outline"
      disabled={disabled || pending}
      onClick={() =>
        startTransition(async () => {
          try {
            await signInWithGoogle(callbackUrl);
          } catch (e) {
            // Redirect errors are handled by Next; anything else is a real failure.
            if (e instanceof Error && e.message.includes("NEXT_REDIRECT")) throw e;
            onError("Could not connect to Google. Please try again.");
          }
        })
      }
      className="h-12 w-full gap-3 rounded-full bg-card text-[15px] font-semibold"
    >
      {pending ? <Loader2 className="size-5 animate-spin" /> : <GoogleIcon />}
      {label}
    </Button>
  );
}

export function withCallback(href: string, callbackUrl?: string) {
  return callbackUrl ? `${href}?callbackUrl=${encodeURIComponent(callbackUrl)}` : href;
}

/* ---------- Sign in ---------- */

export function SignIn({ callbackUrl }: { callbackUrl?: string }) {
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const id = useId();

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    setError(null);
    startTransition(async () => {
      // On success the action redirects; it only resolves with a value on failure.
      const result = await signInAction(formData);
      if (result.error) setError(result.error);
      else if (result.redirectTo) window.location.assign(result.redirectTo);
    });
  };

  return (
    <div>
      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gold-ink">Welcome back</p>
      <h1 className="mt-3 text-4xl font-extrabold leading-tight sm:text-[2.75rem]">
        Sign in to <span className="text-brand">keep learning.</span>
      </h1>
      <p className="mt-3 text-muted-foreground">
        Pick up where you left off with your courses, live classes and mentors.
      </p>

      <div className="mt-8 space-y-6">
        <GoogleButton
          callbackUrl={callbackUrl}
          label="Continue with Google"
          disabled={pending}
          onError={setError}
        />
        <AuthDivider label="or with email" />

        <form onSubmit={onSubmit} className="space-y-5" noValidate>
          {callbackUrl && <input type="hidden" name="callbackUrl" value={callbackUrl} />}

          <div className="space-y-2">
            <Label htmlFor={`${id}-email`}>Email address</Label>
            <Input
              id={`${id}-email`}
              name="email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              required
              className={authInputClass}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor={`${id}-password`}>Password</Label>
            <PasswordInput
              id={`${id}-password`}
              name="password"
              autoComplete="current-password"
              placeholder="Enter your password"
              required
            />
          </div>

          <AuthError message={error} />

          <Button
            type="submit"
            size="lg"
            disabled={pending}
            className="h-12 w-full rounded-full text-[15px] font-semibold"
          >
            {pending ? (
              <>
                <Loader2 className="animate-spin" /> Signing in…
              </>
            ) : (
              "Sign in"
            )}
          </Button>
        </form>

        <p className="text-center text-sm text-muted-foreground">
          New to Everlore?{" "}
          <Link
            href={withCallback("/sign-up", callbackUrl)}
            className="font-semibold text-brand hover:underline"
          >
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}
