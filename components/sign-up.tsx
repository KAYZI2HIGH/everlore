"use client";

import { useId, useState, useTransition } from "react";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import {
  AuthDivider,
  AuthError,
  GoogleButton,
  PasswordInput,
  authInputClass,
  withCallback,
} from "@/components/sign-in";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signUpAction } from "@/lib/actions/auth.actions";

export function SignUp({ callbackUrl }: { callbackUrl?: string }) {
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const id = useId();

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    setError(null);
    startTransition(async () => {
      // On success the action signs the user in and redirects.
      const result = await signUpAction(formData);
      if (result.error) setError(result.error);
      else if (result.redirectTo) window.location.assign(result.redirectTo);
    });
  };

  return (
    <div>
      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gold">Get started</p>
      <h1 className="mt-3 text-4xl font-extrabold leading-tight sm:text-[2.75rem]">
        Create your <span className="text-serif-accent text-brand">free account.</span>
      </h1>
      <p className="mt-3 text-muted-foreground">
        Save courses, enrol in a few clicks and learn at your own pace.
      </p>

      <div className="mt-8 space-y-6">
        <GoogleButton
          callbackUrl={callbackUrl}
          label="Sign up with Google"
          disabled={pending}
          onError={setError}
        />
        <AuthDivider label="or with email" />

        <form onSubmit={onSubmit} className="space-y-5" noValidate>
          {callbackUrl && <input type="hidden" name="callbackUrl" value={callbackUrl} />}

          <div className="space-y-2">
            <Label htmlFor={`${id}-name`}>Full name</Label>
            <Input
              id={`${id}-name`}
              name="name"
              type="text"
              autoComplete="name"
              placeholder="Ada Okafor"
              required
              className={authInputClass}
            />
          </div>

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

          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor={`${id}-password`}>Password</Label>
              <PasswordInput
                id={`${id}-password`}
                name="password"
                autoComplete="new-password"
                placeholder="8+ characters"
                minLength={8}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor={`${id}-confirm`}>Confirm password</Label>
              <PasswordInput
                id={`${id}-confirm`}
                name="confirmPassword"
                autoComplete="new-password"
                placeholder="Repeat password"
                required
              />
            </div>
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
                <Loader2 className="animate-spin" /> Creating account…
              </>
            ) : (
              "Create account"
            )}
          </Button>

          <p className="text-center text-xs leading-relaxed text-muted-foreground">
            By creating an account you agree to our terms of service and privacy policy.
          </p>
        </form>

        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link
            href={withCallback("/sign-in", callbackUrl)}
            className="font-semibold text-brand hover:underline"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
